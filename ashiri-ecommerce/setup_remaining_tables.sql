-- Create Settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id integer PRIMARY KEY DEFAULT 1,
  store_name text NOT NULL DEFAULT 'ASHIRI',
  store_email text,
  store_phone text,
  currency text DEFAULT '₦'
);

-- Insert default row if empty
INSERT INTO public.settings (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM public.settings WHERE id = 1);

-- Create Gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  url text NOT NULL,
  folder text DEFAULT 'Uncategorized'
);

-- If you don't already have the products table exactly like this, here is the schema:
-- CREATE TABLE IF NOT EXISTS public.products (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
--   name text NOT NULL,
--   category text NOT NULL,
--   price numeric NOT NULL,
--   original_price numeric,
--   image_url text NOT NULL,
--   description text,
--   details text[] DEFAULT '{}',
--   sizes text[] DEFAULT '{}',
--   colors text[] DEFAULT '{}'
-- );
