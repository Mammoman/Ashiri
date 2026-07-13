import redTank from '../assets/redtank5.jpg';
import greyTank from '../assets/greytank.jpg';
import purpleTank from '../assets/purpletank.jpg';
import whiteTank from '../assets/whitetank3.jpg';

export const products = [
  {
    id: 1,
    name: 'The Ashiri Red Tank',
    category: 'Female',
    price: 25000,
    /**originalPrice: 25000,**/
    image: redTank,
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
    image: purpleTank,
    /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],**/
    sizes: ['S', 'M', 'L'],

  },
  {
    id: 3,
    name: 'The Ashiri Grey Tank',
    category: 'Male',
    price: 25000,
    /**originalPrice: 25000,**/
    image: greyTank,
    /**description: 'A statement crochet tank top, meticulously hand-knitted. Features open-weave geometric patterns inspired by historical West African architecture and woven textiles.',
    details: [
      '80% Soft cotton, 20% Lurex metallic yarn',
      'Intricate handmade crochet construction',
      'Subtle metallic shimmer throughout',
      'Breathable, layered aesthetic',
      'Care: Hand wash only with gentle detergent'
    ],**/
    sizes: ['S', 'M', 'L'],

  },
  {
    id: 4,
    name: 'The Ashiri White Tank',
    category: 'Male',
    price: 20000,
    /**originalPrice: 25000,**/
    image: whiteTank,
    /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],**/
    sizes: ['S', 'M', 'L'],

  },
  {
    id: 5,
    name: 'The Sahara Gold Knit',
    category: 'Male',
    price: 25000,
    /**originalPrice: 25000,**/
    image: whiteTank,
    /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
     details: [
       '100% Organic long-staple cotton',
       'Thick ribbing that retains its structure',
       'Naturally dyed with sustainable earth pigments',
       'Handcrafted in Lagos, Nigeria',
       'Care: Machine wash cold, dry flat'
     ],**/

  },
  {
    id: 6,
    name: 'The Indigo Ribbed Tank',
    category: 'Male',
    price: 30000,
    /**originalPrice: 25000,**/
    image: redTank,
    /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],**/
    sizes: ['S', 'M', 'L'],

  },
  {
    id: 7,
    name: 'The Nomadic Halter',
    category: 'Female',
    price: 20000,
    /**originalPrice: 25000,**/
    image: purpleTank,
    /**description: 'A classic silhouette elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
     details: [
       '100% Organic long-staple cotton',
       'Thick ribbing that retains its structure',
       'Naturally dyed with sustainable earth pigments',
       'Handcrafted in Lagos, Nigeria',
       'Care: Machine wash cold, dry flat'
     ],**/
    sizes: ['S', 'M', 'L'],

  },
  {
    id: 8,
    name: 'The Asymmetrical Crepe Tank',
    category: 'Female',
    price: 30000,
    /**originalPrice: 25000,**/
    image: whiteTank,
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

export const categories = ['Male', 'Female'];

export const circularCategories = [
  { name: 'Male', image: greyTank },
  { name: 'Female', image: purpleTank }
];
