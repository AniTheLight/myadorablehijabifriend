// ─── products.js — single source of truth ──────────────────────────────────
// Import this with <script src="products.js"></script> before any page script.
// All pages (index, shop, product) read from window.MAHF_PRODUCTS.

window.MAHF_PRODUCTS = [
  {
    id: 'crochet-doll',
    name: 'My Hijabi Crochet Keychain',
    variant: 'Handmade crochet keychain',
    price: 9.99,
    colour: '#f5ddd8',
    accentColour: '#e8a0a0',
    stars: 5,
    reviews: 107,
    badge: null,
    image: 'images/crochetdolls/crochetdollsfront.jpg',
    thumbImages: [
      'images/crochetdolls/crochetdollsfront.jpg',
      'images/crochetdolls/darker-skin-single.png',
      null
    ],
    description: 'Bring a little handmade charm wherever you go with our adorable Mini Hijabi Crochet Keychain! Lovingly crafted from soft yarn, each tiny hijabi doll features a sweet design that celebrates modesty, creativity, and cultural identity. Perfect for children and adults alike, this lightweight crochet companion comes with a detachable keychain clip, making it easy to attach to keys, backpacks, handbags, pencil cases, or even display as a decorative keepsake.',
    details: 'Soft, detachable durable keychain doll approximately 8cm tall. Attached keyring clip. Suitable for ages 3+. Surface wipe clean only.',
    variations: [
      { id: 'crochet-doll-light', label: 'Light skin', colour: '#F5C9A0', price: 9.99, image: 'images/crochetdolls/crochetdollsfront.jpg', thumbImages: ['images/crochetdolls/crochetdollsfront.jpg', 'images/crochetdolls/darker-skin-single.png', null] },
      { id: 'crochet-doll-dark',  label: 'Dark skin',  colour: '#8B5E3C', price: 9.99, image: 'images/crochetdolls/darker-skin-single.png', thumbImages: ['images/crochetdolls/darker-skin-single.png', 'images/crochetdolls/crochetdollsfront.jpg', null] }
    ],
    related: ['key-chain-plush', 'princess-doll', 'rainbow-skirt']
  },
  {
    id: 'key-chain-plush',
    name: 'My Hijabi Plush Buddy Keychain',
    variant: 'Plush keychain doll',
    price: 12.99,
    colour: '#dceaf2',
    accentColour: '#adc2cf',
    stars: 5,
    reviews: 89,
    badge: null,
    image: 'images/keychain/greenbagfile.png',
    thumbImages: [
      'images/keychain/greenbagfile.png',
      'images/keychain/frontdollkey.png',
      'images/keychain/backdollkey.png'
    ],
    description: 'The Hijabi Plush Buddy is the perfect companion for your little one. Small enough to travel everywhere, meaningful enough to treasure always. These cuddly keychains are lightweight and easy to carry. The detachable keychain clip allows children to attach their plushie to backpacks, lunch bags, pencil cases, or keys, so their fluffy friend can join them wherever they go.',
    details: 'Soft, durable keychain doll approximately 8cm tall. Attached keyring clip. Suitable for ages 3+. Surface wipe clean only.',
    related: ['crochet-doll', 'princess-doll', 'rainbow-skirt']
  },
  {
    id: 'princess-doll',
    name: 'My Hijabi Princess Friend',
    variant: 'Princess keychain doll',
    price: 14.99,
    colour: '#fdf0e8',
    accentColour: '#EDC1BB',
    stars: 5,
    reviews: 62,
    badge: null,
    image: 'images/princessdoll/princessdollfront.jpg',
    thumbImages: [
      'images/princessdoll/princessdollfront.jpg',
      null,
      null
    ],
    description: 'Every child deserves to see themselves in the stories they imagine. Our beautiful Hijabi Princess Doll is designed to inspire confidence, creativity, and endless adventures through play. Dressed in a lovely hijab and wearing a sparkling crown, this soft and cuddly princess is ready to become a cherished companion.',
    details: 'Soft, durable. Attached keyring clip. Suitable for ages 3+. Surface wipe clean only.',
    related: ['crochet-doll', 'key-chain-plush', 'rainbow-skirt']
  },
  {
    id: 'rainbow-skirt',
    name: 'My Hijabi Sparkle Friend',
    variant: 'Sparkle keychain doll',
    price: 14.99,
    colour: '#ede8f5',
    accentColour: '#c8bde8',
    stars: 5,
    reviews: 74,
    badge: null,
    image: 'images/rainbowskirtdoll/rainbowskirtfrontimg.jpg',
    thumbImages: [
      'images/rainbowskirtdoll/rainbowskirtfrontimg.jpg',
      'images/rainbowskirtdoll/frontmainrainbow.jpg',
      null
    ],
    description: 'Meet My Hijabi Sparkle Friend — a magical companion full of colour, imagination, and sparkle! Dressed in a glittery pink top, a beautiful rainbow tutu, and a soft detachable hijab, she is ready to join children on every adventure, from magical tea parties to bedtime stories.',
    details: 'Soft, durable keychain doll approximately 8cm tall. Attached keyring clip. Suitable for ages 3+. Surface wipe clean only.',
    related: ['crochet-doll', 'key-chain-plush', 'princess-doll']
  },
  {
    id: 'gift-set',
    name: 'Hijabi Friend — Gift Set of 2',
    variant: '2 keychains included',
    price: 22.99,
    colour: '#f5f0f8',
    accentColour: '#EDC1BB',
    hijabColour: '#CD7250',
    stars: 5,
    reviews: 43,
    badge: 'Best value',
    badgeColour: '#E99075',
    image: null,
    thumbImages: [null, null, null],
    description: "Can't choose just one? This beautiful gift set includes two Hijabi Friend keychains — the perfect pair for sisters, best friends, or anyone who deserves a little extra love. Comes beautifully packaged and ready to gift.",
    details: 'Includes two keychain dolls, each approximately 8cm tall. Keyring clips attached. Suitable for ages 3+. Surface wipe clean only. Gift packaging included.',
    related: ['crochet-doll', 'key-chain-plush', 'princess-doll']
  }
];

// Helper: look up a product by id
window.MAHF_PRODUCT_MAP = {};
window.MAHF_PRODUCTS.forEach(function(p) {
  window.MAHF_PRODUCT_MAP[p.id] = p;
});
