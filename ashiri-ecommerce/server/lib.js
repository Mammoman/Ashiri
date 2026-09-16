// Shared helpers for the Vercel serverless functions in /api.
// Nothing in here is reachable from the browser.
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Supabase client that bypasses RLS. Only ever use it server-side. */
export function supabaseAdmin() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured');
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Resolves the caller's Supabase user from the Authorization header and checks
 * they are in public.admins. Returns the user or null.
 */
export async function requireAdmin(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;

  const admin = supabaseAdmin();
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user) return null;

  const { data: row } = await admin.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  return row ? user : null;
}

/** Escape a value for safe interpolation into HTML (emails). */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Only allow http(s) URLs in <img src>; anything else becomes empty. */
export function safeUrl(value) {
  try {
    const u = new URL(String(value));
    return u.protocol === 'https:' || u.protocol === 'http:' ? esc(u.href) : '';
  } catch {
    return '';
  }
}

export function isValidEmail(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function formatNaira(n) {
  return '₦' + Number(n || 0).toLocaleString('en-NG');
}

export function resendClient() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM_ORDERS = process.env.RESEND_FROM_EMAIL || 'Ashiri Orders <orders@contact.ashiri.store>';
const FROM_UPDATES = process.env.RESEND_FROM_EMAIL || 'Ashiri Updates <orders@contact.ashiri.store>';
const MERCHANT_BCC = process.env.MERCHANT_EMAIL || 'ashirilifestyle.ng@gmail.com';

function shell(inner) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <style>
    :root { color-scheme: light only; }
    body { background-color: #FDFBF7 !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7;">
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; width: 100%; background-color: #FDFBF7;">
    <div style="background-color: #1a4731; padding: 24px; text-align: center;">
      <h1 style="color: #FDFBF7; margin: 0; font-size: 24px; letter-spacing: 2px;">ÀṢHÍRÍ</h1>
    </div>
    <div style="background-color: #FDFBF7; padding: 24px 16px; border: 1px solid #eaeaea; border-top: none;">
      ${inner}
    </div>
  </div>
</body>
</html>`;
}

/**
 * Order confirmation. `order` is the row we just inserted; every field is
 * escaped here, so callers never need to pre-sanitise.
 */
export async function sendOrderConfirmation(order) {
  const items = Array.isArray(order.cart_items) ? order.cart_items : [];
  const hasGift = items.some((i) => i.isGift);

  const itemsHtml = items.map((item) => {
    const lineTotal = (Number(item.price) + (item.isGift ? 2000 : 0)) * Number(item.quantity);
    const label = item.isGift
      ? `${item.name} (Size: ${item.selectedSize}) \u{1F381}${item.giftMessage ? ` — "${item.giftMessage}"` : ' Gift Packaged'}`
      : `${item.name} (Size: ${item.selectedSize})`;
    const img = safeUrl(item.image);
    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eaeaea;">
        <tr>
          <td width="70" valign="top">${img ? `<img src="${img}" alt="" width="60" style="border-radius: 6px; display: block;" />` : ''}</td>
          <td valign="top" style="padding-left: 16px;">
            <h4 style="margin: 0 0 6px 0; font-size: 15px; color: #1a4731; line-height: 1.4;">${esc(label)}</h4>
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #4b5563; line-height: 1.4;">Quantity: ${esc(item.quantity)}</p>
            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1a4731; line-height: 1.4;">${esc(formatNaira(lineTotal))}</p>
          </td>
        </tr>
      </table>`;
  }).join('');

  const html = shell(`
      <h2 style="margin: 0 0 20px 0; color: #1a4731; font-size: 22px;">Thank You for Your Order!</h2>
      <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
        Hello <strong>${esc(order.customer_name)}</strong>,<br><br>
        Your order <strong>${esc(order.id)}</strong> has been confirmed and is currently being prepared. We will send you tracking information as soon as it ships.
      </p>
      ${hasGift ? `
      <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; padding: 12px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0; color: #5b21b6; font-size: 14px; font-weight: 500;">\u{1F381} One or more items in this order include gift packaging.</p>
      </div>` : ''}
      <div style="margin: 32px 0;">
        <h3 style="color: #1a4731; font-size: 18px; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Order Summary</h3>
        ${itemsHtml}
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 2px solid #1a4731; padding-top: 16px; margin-top: 16px;">
          <tr>
            <td align="left"><strong style="color: #1a4731; font-size: 16px;">Order Total</strong></td>
            <td align="right"><strong style="color: #1a4731; font-size: 16px;">${esc(formatNaira(order.subtotal))}</strong></td>
          </tr>
        </table>
      </div>
      <div style="margin-top: 32px; padding: 16px; background-color: #f2f7f4; border-radius: 6px; border: 1px solid #d1e3d8;">
        <h3 style="color: #1a4731; font-size: 14px; margin-top: 0;">Delivery Details</h3>
        <p style="margin: 0 0 4px 0; color: #4b5563; font-size: 14px;"><strong>Address:</strong> ${esc(order.customer_address)}</p>
        <p style="margin: 0; color: #4b5563; font-size: 14px;"><strong>Phone:</strong> ${esc(order.customer_phone)}</p>
      </div>
      <p style="color: #6b7280; font-size: 13px; text-align: center; margin-top: 32px;">
        If you have any questions, reply to this email or contact us on WhatsApp.
      </p>`);

  return resendClient().emails.send({
    from: FROM_ORDERS,
    to: [order.customer_email],
    bcc: [MERCHANT_BCC],
    subject: `Order Confirmed ${order.id}!`,
    html,
  });
}

const STATUS_COPY = {
  shipped: {
    title: 'Your order is on the way!',
    message: (id) => `Great news! We are writing to let you know that your order <strong>${esc(id)}</strong> has been shipped and is on its way to you.`,
    footer: 'Our logistics partner will contact you shortly if they require further details. Thank you for shopping with Ashiri!',
    bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8',
  },
  delivered: {
    title: 'Your order has been delivered!',
    message: (id) => `Great news! We are writing to let you know that the status of your order <strong>${esc(id)}</strong> has been updated to <strong>delivered</strong>.`,
    footer: 'Thank you, and we hope you love Ashiri!',
    bg: '#f0fdf4', border: '#bbf7d0', text: '#166534',
  },
  cancelled: {
    title: 'Your order has been cancelled.',
    message: (id) => `We are writing to let you know that your order <strong>${esc(id)}</strong> has been cancelled.`,
    footer: 'If you have any questions or believe this was a mistake, please reply to this email or contact our support team.',
    bg: '#fef2f2', border: '#fecaca', text: '#b91c1c',
  },
};

/** Fulfillment update. Returns null (no email) for statuses without copy. */
export async function sendFulfillmentUpdate(order, status) {
  const copy = STATUS_COPY[status];
  if (!copy) return null;

  const html = shell(`
      <h2 style="margin: 0 0 20px 0; color: #1a4731; font-size: 22px;">Order Update</h2>
      <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">Hello <strong>${esc(order.customer_name)}</strong>,</p>
      <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">${copy.message(order.id)}</p>
      <div style="margin: 0 0 24px 0; padding: 16px; background-color: ${copy.bg}; border: 1px solid ${copy.border}; border-radius: 6px; text-align: center;">
        <strong style="color: ${copy.text}; font-size: 16px;">${copy.title}</strong>
      </div>
      <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">${copy.footer}</p>`);

  return resendClient().emails.send({
    from: FROM_UPDATES,
    to: [order.customer_email],
    subject: `Update on your Ashiri Order ${order.id}!`,
    html,
  });
}
