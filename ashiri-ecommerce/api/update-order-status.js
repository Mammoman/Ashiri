import { supabaseAdmin, requireAdmin, sendFulfillmentUpdate } from '../server/lib.js';

// Admin-only. Updates an order's status and, for shipped/delivered/cancelled,
// emails the customer. The recipient and name come from the order row, never
// from the request body.

const STATUSES = new Set(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let user;
  try {
    user = await requireAdmin(req);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server is not configured.' });
  }
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const orderId = typeof req.body?.orderId === 'string' ? req.body.orderId.trim().slice(0, 64) : '';
  const status = typeof req.body?.status === 'string' ? req.body.status.trim() : '';
  if (!orderId || !STATUSES.has(status)) return res.status(400).json({ error: 'Invalid orderId or status.' });

  const db = supabaseAdmin();
  const { data: order, error } = await db
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .maybeSingle();
  if (error) {
    console.error('Status update failed:', error);
    return res.status(500).json({ error: 'Could not update order.' });
  }
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  let emailSent = false;
  try {
    const result = await sendFulfillmentUpdate(order, status);
    emailSent = !!result && !result.error;
    if (result?.error) console.error('Fulfillment email failed:', result.error);
  } catch (err) {
    console.error('Fulfillment email failed:', err);
  }

  return res.status(200).json({ ok: true, status: order.status, emailSent });
}
