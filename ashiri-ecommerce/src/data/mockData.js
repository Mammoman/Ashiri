import ribbedTank from '../assets/ribbed_tank.png';
import silkTank from '../assets/greytank.jpg';
import knitTank from '../assets/purpletank.jpg';
import linenTank from '../assets/redtank3.jpg';

export const products = [
  {
    id: 1,
    name: 'The Ashiri Red Tank',
    category: 'Female',
    price: 25000,
    /**originalPrice: 25000,**/
    image: ribbedTank,
    /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],**/
    sizes: ['S', 'M', 'L'],
    colors: ['Ochre', 'Charcoal', 'Bone']
  },
  {
    id: 2,
    name: 'The Ashiri Purple Tank',
    category: 'Female',
    price: 20000,
    /**originalPrice: 25000,**/
    image: silkTank,
    /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],**/
    sizes: ['S', 'M', 'L'],
    colors: ['Indigo/White', 'Noir/Gold']
  },
  {
    id: 3,
    name: 'The Ashiri Grey Tank',
    category: 'Unisex',
    price: 25000,
    /**originalPrice: 25000,**/
    image: knitTank,
    /**description: 'A statement crochet tank top, meticulously hand-knitted. Features open-weave geometric patterns inspired by historical West African architecture and woven textiles.',
    details: [
      '80% Soft cotton, 20% Lurex metallic yarn',
      'Intricate handmade crochet construction',
      'Subtle metallic shimmer throughout',
      'Breathable, layered aesthetic',
      'Care: Hand wash only with gentle detergent'
    ],**/
    sizes: ['S', 'M', 'L'],
    colors: ['Bone/Gold', 'Terracotta/Gold']
  },
  {
    id: 4,
    name: 'The Ashiri White Tank',
    category: 'Unisex',
    price: 20000,
    /**originalPrice: 25000,**/
    image: linenTank,
    /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],**/
    sizes: ['S', 'M', 'L'],
    colors: ['Charcoal', 'Sand', 'Olive']
  },
  {
    id: 5,
    name: 'The Sahara Gold Knit',
    category: 'Unisex',
    price: 25000,
     /**originalPrice: 25000,**/
    image: knitTank,
   /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],**/
    colors: ['Sahara Gold', 'Bronze Spark']
  },
  {
    id: 6,
    name: 'The Indigo Ribbed Tank',
    category: 'Unisex',
    price: 30000,
     /**originalPrice: 25000,**/
    image: silkTank,
    /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],**/
    sizes: ['S', 'M', 'L'],
    colors: ['Indigo', 'Faded Indigo']
  },
  {
    id: 7,
    name: 'The Nomadic Halter',
    category: 'Female',
    price: 20000,
     /**originalPrice: 25000,**/
    image: ribbedTank,
   /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],**/
    sizes: ['S', 'M', 'L'],
    colors: ['Terracotta', 'Clay', 'Oatmeal']
  },
  {
    id: 8,
    name: 'The Asymmetrical Crepe Tank',
    category: 'Female',
    price: 30000,
     /**originalPrice: 25000,**/
    image: linenTank,
  /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],**/
    sizes: ['S', 'M', 'L'],
    colors: ['Noir', 'Ivory']
  }
];

export const categories = ['All', 'Male', 'Female', 'Unisex'];

export const circularCategories = [
  { name: 'Male', image: knitTank },
  { name: 'Female', image: silkTank },
  { name: 'Unisex', image: ribbedTank }
];
