import ribbedTank from '../assets/ribbed_tank.png';
import silkTank from '../assets/silk_tank.png';
import knitTank from '../assets/knit_tank.png';
import linenTank from '../assets/linen_tank.png';

export const products = [
  {
    id: 1,
    name: 'The Oba Ribbed Tank',
    category: 'Ribbed',
    price: 25000,
    originalPrice: 18000,
    image: ribbedTank,
    description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ochre', 'Charcoal', 'Bone']
  },
  {
    id: 2,
    name: 'The Adire Silk Cami',
    category: 'Silk & Crepe',
    price: 20000,
    originalPrice: 15000,
    image: silkTank,
    description: 'An exquisite luxury camisole crafted from fluid mulberry silk. Hand-dyed by Yoruba artisans using traditional indigo resist-dyeing (Adire) techniques, making each piece unique.',
    details: [
      '100% Pure Mulberry Silk Crepe de Chine',
      'Individually hand-dyed with natural indigo dye',
      'Adjustable spaghetti straps with brass details',
      'Relaxed, elegant drape',
      'Care: Dry clean recommended, or gentle hand wash'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Indigo/White', 'Noir/Gold']
  },
  {
    id: 3,
    name: 'The Heritage Knit Vest',
    category: 'Knitwear',
    price: 25000,
    originalPrice: 18000,
    image: knitTank,
    description: 'A statement crochet tank top, meticulously hand-knitted. Features open-weave geometric patterns inspired by historical West African architecture and woven textiles.',
    details: [
      '80% Soft cotton, 20% Lurex metallic yarn',
      'Intricate handmade crochet construction',
      'Subtle metallic shimmer throughout',
      'Breathable, layered aesthetic',
      'Care: Hand wash only with gentle detergent'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Bone/Gold', 'Terracotta/Gold']
  },
  {
    id: 4,
    name: 'The Safari Linen Tank',
    category: 'Linen',
    price: 40000,
    originalPrice: 25000,
    image: linenTank,
    description: 'The epitome of effortless summer sophistication. Tailored from premium, pre-washed Belgian linen that offers exceptional breathability and a beautiful textured drape.',
    details: [
      '100% Organic flax linen',
      'Garment-dyed for a soft, lived-in feel',
      'Slightly boxy, relaxed fit',
      'Side splits at the hem for ease of movement',
      'Care: Gentle machine wash, warm iron if desired'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Sand', 'Olive']
  },
  {
    id: 5,
    name: 'The Sahara Gold Knit',
    category: 'Knitwear',
    price: 25000,
    originalPrice: 20000,
    image: knitTank,
    description: 'A luxurious metallic knit vest designed to shimmer under the sun. Knit with premium golden-sand yarns and micro-lurex, it offers an eye-catching, refined finish.',
    details: [
      'Premium cotton-viscose blend with gold lurex',
      'Exquisite ribbed hem and collar detailing',
      'Semi-sheer weave perfect for upscale layering',
      'Care: Hand wash cold, lay flat to dry'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Sahara Gold', 'Bronze Spark']
  },
  {
    id: 6,
    name: 'The Indigo Ribbed Tank',
    category: 'Ribbed',
    price: 30000,
    originalPrice: 30000,
    image: silkTank,
    description: 'Our signature ribbed cotton tank dyed with natural botanical indigo extract. Deep, layered blue hues that develop a beautiful character with time and wear.',
    details: [
      '100% Organic rib-knit cotton',
      'Dyed with sustainable organic indigo',
      'Classic scoop neck front and back',
      'Durable flatlock stitching',
      'Care: Wash separately for first few washes'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Indigo', 'Faded Indigo']
  },
  {
    id: 7,
    name: 'The Nomadic Halter',
    category: 'Linen',
    price: 20000,
    originalPrice: 15000,
    image: ribbedTank,
    description: 'An elegant halter-neck design crafted from a soft cotton-linen blend. Features a rich terracotta tone and high-neck styling that elegantly showcases the shoulders.',
    details: [
      '55% Linen, 45% Organic Cotton blend',
      'Halter neck with adjustable button-loop closure at back',
      'Chic keyhole detail at the nape',
      'Flattering curved hemline',
      'Care: Machine wash gentle, tumble dry low'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Terracotta', 'Clay', 'Oatmeal']
  },
  {
    id: 8,
    name: 'The Asymmetrical Crepe Tank',
    category: 'Silk & Crepe',
    price: 30000,
    originalPrice: 22000,
    image: linenTank,
    description: 'A high-fashion asymmetrical tank top crafted from heavy premium crepe. One-shoulder silhouette that makes it the perfect transitional piece from daytime luxury to evening elegance.',
    details: [
      'Premium heavyweight satin-backed crepe',
      'Chic asymmetrical one-shoulder cut',
      'Drape detail at the shoulder',
      'Invisible side zipper closure',
      'Care: Dry clean only'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Noir', 'Ivory']
  }
];

export const categories = ['All', 'Ribbed', 'Silk & Crepe', 'Knitwear', 'Linen'];

export const circularCategories = [
  { name: 'Ribbed', image: ribbedTank },
  { name: 'Silk & Crepe', image: silkTank },
  { name: 'Knitwear', image: knitTank },
  { name: 'Linen', image: linenTank }
];
