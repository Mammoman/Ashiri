import { supabaseAdmin } from '../server/lib.js';

// Public: returns only { id, status } for a small, explicit list of order ids
// that the browser already knows (from localStorage). No PII leaves this endpoint.

const MAX_IDS = 25;
const ID_PATTERN = /^ASH-ORD-[A-Z0-9]{1,16}$/i;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderIds } = req.body || {};
  if (!Array.isArray(orderIds)) return res.status(400).json({ error: 'Missing or invalid orderIds array' });

  const ids = [...new Set(orderIds.filter((id) => typeof id === 'string' && ID_PATTERN.test(id)))].slice(0, MAX_IDS);
  if (ids.length === 0) return res.status(200).json([]);

  try {
    const { data, error } = await supabaseAdmin().from('orders').select('id, status').in('id', ids);
    if (error) {
      console.error('Supabase error fetching statuses:', error);
      return res.status(500).json({ error: 'Could not fetch order status.' });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
