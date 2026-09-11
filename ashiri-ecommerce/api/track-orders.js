import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderIds } = req.body;

  if (!orderIds || !Array.isArray(orderIds)) {
    return res.status(400).json({ error: 'Missing or invalid orderIds array' });
  }

  if (orderIds.length === 0) {
    return res.status(200).json([]);
  }

  // Use the Service Role Key to bypass RLS securely on the server!
  // If not provided in Vercel, it falls back to the ANON key (which might fail due to RLS).
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY; 

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase credentials missing' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Only fetch id and status to prevent leaking PII like customer addresses
    const { data, error } = await supabase
      .from('orders')
      .select('id, status')
      .in('id', orderIds);

    if (error) {
      console.error('Supabase error fetching statuses:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
