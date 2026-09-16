import { randomBytes } from 'node:crypto';
import { supabaseAdmin, sendOrderConfirmation, isValidEmail } from '../server/lib.js';

// Server-side checkout. The browser sends the payment reference plus the cart
// as product ids + quantities; we re-price everything from the products table,
// verify the payment with Flutterwave, and only then create the order.

const MAX_ITEMS = 30;
const MAX_QTY = 20;
const GIFT_WRAP_FEE = 2000;

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function newOrderId() {
  // 8 chars from a 32-symbol alphabet = 40 bits of entropy; unguessable, unlike Math.random().
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(8);
  let id = '';
  for (const b of bytes) id += alphabet[b % alphabet.length];
  return `ASH-ORD-${id}`;
}

async function verifyFlutterwave({ transactionId, txRef }) {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secret) throw new Error('FLUTTERWAVE_SECRET_KEY is not configured');

  const url = transactionId
    ? `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`
    : `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`;

  const res = await fetch(url, { headers: { Authorization: `Bearer ${secret}` } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status !== 'success' || !json.data) {
    return { ok: false, reason: json.message || `Flutterwave responded ${res.status}` };
  }
  const d = json.data;
  if (d.status !== 'successful') return { ok: false, reason: `Transaction status is '${d.status}'` };
  if (txRef && d.tx_ref !== txRef) return { ok: false, reason: 'tx_ref mismatch' };
  return { ok: true, amount: Number(d.amount), currency: d.currency, reference: String(d.id || d.tx_ref) };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const customer = {
    name: str(body.customerName, 120),
    email: str(body.customerEmail, 254),
    phone: str(body.customerPhone, 40),
    address: str(body.customerAddress, 500),
  };
  const transactionId = str(body.transactionId, 64);
  const txRef = str(body.txRef, 64);
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [];

  if (!customer.name || !customer.phone || !customer.address || !isValidEmail(customer.email)) {
    return res.status(400).json({ error: 'Missing or invalid delivery details.' });
  }
  if (!transactionId && !txRef) return res.status(400).json({ error: 'Missing payment reference.' });
  if (rawItems.length === 0) return res.status(400).json({ error: 'Cart is empty.' });

  let db;
  try {
    db = supabaseAdmin();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  // 1. Re-price the cart from the database. The client's prices are ignored.
  const ids = [...new Set(rawItems.map((i) => i.id).filter((id) => id !== undefined && id !== null))];
  const { data: products, error: prodErr } = await db.from('products').select('id, name, price, image, sizes').in('id', ids);
  if (prodErr) {
    console.error('Product lookup failed:', prodErr);
    return res.status(500).json({ error: 'Could not load products.' });
  }
  const byId = new Map((products || []).map((p) => [String(p.id), p]));

  const cartItems = [];
  for (const raw of rawItems) {
    const product = byId.get(String(raw.id));
    const quantity = Number.parseInt(raw.quantity, 10);
    if (!product) return res.status(400).json({ error: `Product ${raw.id} is no longer available.` });
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
      return res.status(400).json({ error: `Invalid quantity for ${product.name}.` });
    }
    const selectedSize = str(raw.selectedSize, 20);
    if (Array.isArray(product.sizes) && product.sizes.length > 0 && !product.sizes.includes(selectedSize)) {
      return res.status(400).json({ error: `Size '${selectedSize}' is not available for ${product.name}.` });
    }
    cartItems.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      selectedSize,
      selectedColor: str(raw.selectedColor, 40) || 'Standard',
      quantity,
      isGift: raw.isGift === true,
      giftMessage: raw.isGift === true ? str(raw.giftMessage, 200) : '',
    });
  }
  const subtotal = cartItems.reduce((sum, i) => sum + (i.price + (i.isGift ? GIFT_WRAP_FEE : 0)) * i.quantity, 0);

  // 2. Verify the payment with Flutterwave. Mock references are only honoured
  //    when explicitly enabled and never in production.
  const allowMock = process.env.ALLOW_MOCK_PAYMENTS === 'true' && process.env.VERCEL_ENV !== 'production';
  let reference;
  if (allowMock && txRef.startsWith('MOCK-')) {
    reference = txRef;
  } else {
    let verification;
    try {
      verification = await verifyFlutterwave({ transactionId, txRef });
    } catch (err) {
      console.error('Payment verification error:', err);
      return res.status(502).json({ error: 'Could not verify payment. Please contact support with your payment reference.' });
    }
    if (!verification.ok) {
      console.warn('Payment rejected:', verification.reason, { transactionId, txRef });
      return res.status(402).json({ error: 'Payment could not be verified.' });
    }
    if (verification.currency !== 'NGN' || verification.amount + 0.01 < subtotal) {
      console.warn('Payment amount mismatch', { paid: verification.amount, currency: verification.currency, expected: subtotal });
      return res.status(402).json({ error: 'Payment amount does not match the order total.' });
    }
    reference = verification.reference;
  }

  // 3. Create the order. payment_reference is unique, so a replayed reference
  //    returns the existing order instead of creating a second one.
  const order = {
    id: newOrderId(),
    customer_name: customer.name,
    customer_email: customer.email,
    customer_phone: customer.phone,
    customer_address: customer.address,
    subtotal,
    payment_method: 'flutterwave',
    payment_reference: reference,
    status: 'pending',
    cart_items: cartItems,
  };

  const { data: inserted, error: insErr } = await db.from('orders').insert([order]).select().single();
  if (insErr) {
    if (insErr.code === '23505') {
      const { data: existing } = await db.from('orders').select('*').eq('payment_reference', reference).maybeSingle();
      if (existing) return res.status(200).json({ order: publicOrder(existing), duplicate: true });
    }
    console.error('Order insert failed:', insErr);
    return res.status(500).json({ error: 'Payment received but the order could not be saved. Please contact support.' });
  }

  // 4. Confirmation email (non-blocking: the order exists regardless).
  let emailSent = false;
  try {
    const { error } = await sendOrderConfirmation(inserted);
    emailSent = !error;
    if (error) console.error('Confirmation email failed:', error);
  } catch (err) {
    console.error('Confirmation email failed:', err);
  }

  return res.status(200).json({ order: publicOrder(inserted), emailSent });
}

// Shape returned to the browser (and stored in localStorage for guest tracking).
function publicOrder(o) {
  return {
    id: o.id,
    createdAt: o.created_at,
    status: o.status,
    subtotal: Number(o.subtotal),
    cartItems: o.cart_items,
  };
}
