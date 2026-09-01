import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhbswazhnivmkxbersgz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYnN3YXpobml2bWt4YmVyc2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjE4NTAsImV4cCI6MjA5Nzk5Nzg1MH0.a2DbYpK24g0zDnM_np-inLOlWU0Bbr8ZF0t9-fT5HJ4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Columns found:', data.length > 0 ? Object.keys(data[0]) : 'Table is empty');
  }
}

checkSchema();
