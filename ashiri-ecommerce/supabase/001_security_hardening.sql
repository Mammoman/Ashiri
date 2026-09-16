-- ============================================================================
-- ASHIRI security hardening
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- It is idempotent: safe to run more than once.
--
-- AFTER running it, do two things in the dashboard that SQL cannot do:
--   1. Authentication -> Providers -> Email -> turn OFF "Allow new users to sign up"
--   2. Add your admin user(s):
--        INSERT INTO public.admins (user_id)
--        SELECT id FROM auth.users WHERE email = 'you@example.com';
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Admin role. "Logged in" is no longer the same as "admin".
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Users may only see their own admin row. Nobody can write to it except via
-- the SQL editor / service role.
DROP POLICY IF EXISTS "admins: read own row" ON public.admins;
CREATE POLICY "admins: read own row" ON public.admins
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Helper used by every policy below and by the client (supabase.rpc('is_admin')).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Schema fixes the app previously relied on the client for
-- ---------------------------------------------------------------------------
-- products.id: let the database generate ids instead of Math.random() in the browser.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'products_id_seq') THEN
    CREATE SEQUENCE public.products_id_seq;
  END IF;
  PERFORM setval('public.products_id_seq', COALESCE((SELECT MAX(id) FROM public.products), 0) + 1, false);
  ALTER TABLE public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq');
  ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
END $$;

-- orders: a payment reference may only ever create one order (replay protection),
-- and status is constrained to known values. NOT VALID = enforced for new/updated
-- rows only, so pre-existing data never blocks the migration.
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';
CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_reference_key
  ON public.orders (payment_reference)
  WHERE payment_reference IS NOT NULL AND payment_reference <> 'N/A';
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check') THEN
    ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
      CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) NOT VALID;
  END IF;
END $$;

-- reviews: new reviews are unverified + pending by default, regardless of what the client sends.
ALTER TABLE public.reviews ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE public.reviews ALTER COLUMN verified SET DEFAULT false;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reviews_rating_check') THEN
    ALTER TABLE public.reviews ADD CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reviews_length_check') THEN
    ALTER TABLE public.reviews ADD CONSTRAINT reviews_length_check
      CHECK (length(name) <= 80 AND length(title) <= 120 AND length(comment) <= 2000) NOT VALID;
  END IF;
END $$;

-- gallery: position column used by drag-and-drop ordering
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS position integer DEFAULT 0;

-- ---------------------------------------------------------------------------
-- 3. Row Level Security. Enable on every table and replace all policies.
-- ---------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop every existing policy on these tables so we start from a known state.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('products', 'orders', 'reviews', 'gallery', 'settings')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

-- products: everyone reads, only admins write.
CREATE POLICY "products: public read"  ON public.products FOR SELECT USING (true);
CREATE POLICY "products: admin write"  ON public.products FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- settings: everyone reads, only admins write.
CREATE POLICY "settings: public read"  ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings: admin write"  ON public.settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- orders: NO anonymous access at all. Orders are created by /api/create-order
-- with the service-role key after the payment has been verified server-side.
CREATE POLICY "orders: admin only" ON public.orders FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- reviews: public sees approved reviews; anyone may submit one, but only as
-- pending + unverified; admins do everything.
CREATE POLICY "reviews: public read approved" ON public.reviews FOR SELECT
  USING (status = 'approved' OR public.is_admin());
CREATE POLICY "reviews: public submit pending" ON public.reviews FOR INSERT
  WITH CHECK (status = 'pending' AND verified = false);
CREATE POLICY "reviews: admin write" ON public.reviews FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- gallery: public sees everything except pending community submissions; anyone
-- may submit a community fit, but only into the pending folder; admins do everything.
CREATE POLICY "gallery: public read" ON public.gallery FOR SELECT
  USING (folder IS DISTINCT FROM 'community_pending' OR public.is_admin());
CREATE POLICY "gallery: public submit pending" ON public.gallery FOR INSERT
  WITH CHECK (folder = 'community_pending');
CREATE POLICY "gallery: admin write" ON public.gallery FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. Storage: brand_assets bucket
-- ---------------------------------------------------------------------------
-- Hard limits enforced by Supabase Storage itself: 5 MB, images only.
UPDATE storage.buckets
SET file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'brand_assets';

DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (qual LIKE '%brand_assets%' OR with_check LIKE '%brand_assets%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

-- Public read (the bucket serves product/gallery images).
CREATE POLICY "brand_assets: public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'brand_assets');
-- Anonymous visitors may only upload into community/ (community fit submissions).
CREATE POLICY "brand_assets: public community upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'brand_assets' AND (storage.foldername(name))[1] = 'community');
-- Admins may upload / replace / delete anywhere in the bucket.
CREATE POLICY "brand_assets: admin write" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'brand_assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'brand_assets' AND public.is_admin());
