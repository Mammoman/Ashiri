import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhbswazhnivmkxbersgz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYnN3YXpobml2bWt4YmVyc2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjE4NTAsImV4cCI6MjA5Nzk5Nzg1MH0.a2DbYpK24g0zDnM_np-inLOlWU0Bbr8ZF0t9-fT5HJ4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Testing with originalprice...");
  const { data: d1, error: e1 } = await supabase.from('products').insert([{ 
    name: 'Test', 
    price: 100, 
    originalprice: 150, 
    image: 'test.jpg' 
  }]).select();
  
  if (e1) console.error('Error with originalprice:', e1.message);
  else {
    console.log('Success with originalprice!', d1);
    await supabase.from('products').delete().eq('id', d1[0].id);
    return;
  }
}

testInsert();
