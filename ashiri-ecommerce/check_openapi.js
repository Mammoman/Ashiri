const url = 'https://qhbswazhnivmkxbersgz.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYnN3YXpobml2bWt4YmVyc2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MjE4NTAsImV4cCI6MjA5Nzk5Nzg1MH0.a2DbYpK24g0zDnM_np-inLOlWU0Bbr8ZF0t9-fT5HJ4';

async function getSchema() {
  const res = await fetch(url);
  const json = await res.json();
  console.log(Object.keys(json));
  if (json.components && json.components.schemas) {
     console.log(Object.keys(json.components.schemas));
     if (json.components.schemas.products) {
         console.log(json.components.schemas.products.properties);
     }
  }
}

getSchema();
