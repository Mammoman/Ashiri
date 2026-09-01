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
    originalPrice: 30000,
    image: redTank,
    description: 'A bold, fiery statement piece crafted from ultra-soft, heavy-weight organic rib-knit cotton. The deep red tone is naturally dyed using sustainable earth pigments, giving each piece a unique, rich character.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Deep Crimson']
  },
  {
    id: 2,
    name: 'The Ashiri Purple Tank',
    category: 'Female',
    price: 20000,
    originalPrice: 25000,
    image: purpleTank,
    description: 'A regal silhouette in rich purple, elevated through superior craftsmanship. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Purple', 'Lavender']
  },
  {
    id: 3,
    name: 'The Ashiri Grey Tank',
    category: 'Male',
    price: 25000,
    originalPrice: 30000,
    image: greyTank,
    description: 'A modern, understated tank in cool grey tones. Features open-weave geometric patterns inspired by historical West African architecture and woven textiles.',
    details: [
      '80% Soft cotton, 20% Lurex metallic yarn',
      'Intricate handmade construction',
      'Subtle metallic shimmer throughout',
      'Breathable, layered aesthetic',
      'Care: Hand wash only with gentle detergent'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Charcoal', 'Ash Grey']
  },
  {
    id: 4,
    name: 'The Ashiri White Tank',
    category: 'Male',
    price: 20000,
    originalPrice: 25000,
    image: whiteTank,
    description: 'A timeless classic in pristine white. Crafted from ultra-soft, heavy-weight organic rib-knit cotton that hugs the body perfectly, offering effortless elegance for every occasion.',
    details: [
      '100% Organic long-staple cotton',
      'Thick ribbing that retains its structure',
      'Naturally dyed with sustainable earth pigments',
      'Handcrafted in Lagos, Nigeria',
      'Care: Machine wash cold, dry flat'
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Bone', 'Ivory']
  }
];

export const categories = ['Male', 'Female'];

export const circularCategories = [
  { name: 'Male', image: greyTank },
  { name: 'Female', image: purpleTank }
];
