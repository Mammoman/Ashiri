import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkProductImageUrls() {
  const { data, error } = await supabase.from('products').select('id, name, image');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Products in DB:');
    data.forEach(p => console.log(`- ${p.name}: ${p.image}`));
  }
}

checkProductImageUrls();
