import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhbswazhnivmkxbersgz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYnN3YXpobml2bWt4YmVyc2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjE4NTAsImV4cCI6MjA5Nzk5Nzg1MH0.a2DbYpK24g0zDnM_np-inLOlWU0Bbr8ZF0t9-fT5HJ4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('orders').insert([{ id: 9999, customer_name: 'Test' }]).select();
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Inserted Row:', data[0]);
    console.log('Columns:', Object.keys(data[0]));
    await supabase.from('orders').delete().eq('id', data[0].id);
  }
}

checkSchema();
