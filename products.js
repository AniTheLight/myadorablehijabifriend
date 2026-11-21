// ─── products.js — single source of truth ──────────────────────────────────
// Import this with <script src="products.js"></script> before any page script.
// All pages (index, shop, product) read from window.MAHF_PRODUCTS.
// The checkout server code (api/) also reads this file, so the prices here are
// the prices customers are actually charged.

var MAHF_ROOT = typeof window !== 'undefined' ? window : {};

// Shipping rules — used by the checkout page and the payment server code.
MAHF_ROOT.MAHF_SHIPPING = { cost: 3.29, freeOver: 25 };

// Each product can have "variations" (options the customer picks, e.g. Yasmine /
// Fatima). Each option has its own id, price and photos. The FIRST option is
// selected by default. To change a photo, replace the file at that path (or
// change the path here).
MAHF_ROOT.MAHF_PRODUCTS = [
  {
    id: 'crochet-doll',
    name: 'Yasmine and Fatima Friends',
    variant: 'Crochet keychain dolls',
    price: 6.99,
    colour: '#f5ddd8',
    accentColour: '#e8a0a0',
    badge: null,
    image: 'images/crochetdolls/crochetdollsfront.jpg',
    thumbImages: [
      'images/crochetdolls/crochetdollsfront.jpg',
      'images/crochetdolls/yasmine.jpg',
      'images/crochetdolls/darker-skin-single.png'
    ],
    description: "Meet Yasmine and Fatima! They have been best friends forever. They went to school together, played in the park together and spent countless afternoons hanging out after school. As they grew older, Yasmine and Fatima became busy with adult life, but they never forgot to make time for each other. They stood by one another through many of life's hardships.<br><br>To celebrate their friendship, Yasmine got matching crochet dolls for herself and her best friend. Do you have a friend like Fatima or Yasmine who you'd love to surprise with a special gift?",
    details: '12cm crocheted doll with a keyring, available in two different colours. Each gift set also comes with three additional keychains. Suitable for ages 3+, making it a lovely gift for both children and adults alike.',
    variations: [
      // PLACEHOLDER photo: replace images/crochetdolls/yasmine.jpg with Yasmine's photo
      { id: 'crochet-doll-yasmine',  label: 'Yasmine',  colour: '#F5C9A0', price: 6.99, image: 'images/crochetdolls/yasmine.jpg',             thumbImages: ['images/crochetdolls/yasmine.jpg', 'images/crochetdolls/crochetdollsfront.jpg', null] },
      { id: 'crochet-doll-fatima',   label: 'Fatima',   colour: '#8B5E3C', price: 6.99, image: 'images/crochetdolls/darker-skin-single.png', thumbImages: ['images/crochetdolls/darker-skin-single.png', 'images/crochetdolls/crochetdollsfront.jpg', null] },
      { id: 'crochet-doll-set', label: 'Yasmine & Fatima set', colour: '#EDC1BB', price: 12.99, image: 'images/crochetdolls/crochetdollsfront.jpg',  thumbImages: ['images/crochetdolls/crochetdollsfront.jpg', 'images/crochetdolls/yasmine.jpg', 'images/crochetdolls/darker-skin-single.png'] }
    ],
    related: ['key-chain-plush', 'princess-doll', 'rainbow-skirt']
  },
  {
    id: 'key-chain-plush',
    name: 'Imène the Plushy',
    variant: 'Plush keychain doll',
    price: 12.99,
    colour: '#dceaf2',
    accentColour: '#adc2cf',
    badge: null,
    image: 'images/keychain/greenbagfile.png',
    thumbImages: [
      'images/keychain/greenbagfile.png',
      'images/keychain/frontdollkey.png',
      'images/keychain/backdollkey.png'
    ],
    description: "Imène is a bit cheeky. She loves playing with her friends and making good jokes, but she always makes sure they're doing well and helps them when their Imaan is low. Whenever her friends thank her, she says, ‘No problem! My name is Imène, after all!’ We all need a friend like Imène!",
    details: '15cm soft plush doll with a detachable keyring, available in two different colours. Suitable for ages 3+.',
    related: ['crochet-doll', 'princess-doll', 'rainbow-skirt']
  },
  {
    id: 'princess-doll',
    name: 'Princess Malaika Doll',
    variant: 'Soft doll',
    price: 15.50,
    colour: '#fdf0e8',
    accentColour: '#EDC1BB',
    badge: null,
    image: 'images/princessdoll/princessdollfront.jpg',
    thumbImages: [
      'images/princessdoll/princessdollfront.jpg',
      'images/princessdoll/princess-set.jpg',
      null
    ],
    description: 'Princess Malaika is the only princess of the kingdom. She has a lot of responsibilities as the princess. She does all her homework, Quran lessons and princess duties but sometimes she feels lonely and wants to have some tea parties and hang out with her friends. Will you be her friend?',
    details: '35cm soft doll. Suitable for ages 3+. Princess set comes with 2 additional keychains: one of Princess Malaika and one of her friend Captain Hauwa.',
    variations: [
      { id: 'princess-doll-single', label: 'Princess Malaika', colour: '#EDC1BB', price: 15.50, image: 'images/princessdoll/princessdollfront.jpg', thumbImages: ['images/princessdoll/princessdollfront.jpg', 'images/princessdoll/princess-set.jpg', null] },
      // PLACEHOLDER photo: replace images/princessdoll/princess-set.jpg
      { id: 'princess-doll-set',    label: 'Princess Set',     colour: '#E99075', price: 19.99, image: 'images/princessdoll/princess-set.jpg',     thumbImages: ['images/princessdoll/princess-set.jpg', 'images/princessdoll/princessdollfront.jpg', null] }
    ],
    related: ['crochet-doll', 'key-chain-plush', 'rainbow-skirt']
  },
  {
    id: 'rainbow-skirt',
    name: 'Captain Hauwa',
    variant: 'Soft doll',
    price: 16.60,
    colour: '#ede8f5',
    accentColour: '#c8bde8',
    badge: null,
    image: 'images/rainbowskirtdoll/rainbowskirtfrontimg.jpg',
    thumbImages: [
      'images/rainbowskirtdoll/rainbowskirtfrontimg.jpg',
      'images/rainbowskirtdoll/frontmainrainbow.jpg',
      'images/rainbowskirtdoll/pilot-set.jpg'
    ],
    description: "Hauwa is one of Princess Malaika's closest friends. She dreams of growing up to become a pilot, flying high through the sky and soaring over rainbows! She can't wait to be called Captain Hauwa one day. That's why she loves her rainbow tutu so much and wears it every chance she gets!",
    details: '35cm soft doll, with detachable hijab. Suitable for ages 3+. Pilot set comes with 2 additional keychains of Pilot Hauwa.',
    variations: [
      { id: 'rainbow-skirt-single',    label: 'Captain Hauwa', colour: '#c8bde8', price: 16.60, image: 'images/rainbowskirtdoll/rainbowskirtfrontimg.jpg', thumbImages: ['images/rainbowskirtdoll/rainbowskirtfrontimg.jpg', 'images/rainbowskirtdoll/frontmainrainbow.jpg', 'images/rainbowskirtdoll/pilot-set.jpg'] },
      // PLACEHOLDER photo: replace images/rainbowskirtdoll/pilot-set.jpg
      { id: 'rainbow-skirt-pilot-set', label: 'Pilot Set',     colour: '#7e98a8', price: 21.90, image: 'images/rainbowskirtdoll/pilot-set.jpg',         thumbImages: ['images/rainbowskirtdoll/pilot-set.jpg', 'images/rainbowskirtdoll/rainbowskirtfrontimg.jpg', null] }
    ],
    related: ['crochet-doll', 'key-chain-plush', 'princess-doll']
  },
  {
    id: 'keychain-set',
    name: 'Keychain Set',
    variant: 'Keychains · £2.50 each',
    price: 2.50,
    colour: '#fbeae6',
    accentColour: '#e891a1',
    badge: null,
    // PLACEHOLDER photos: replace the files in images/keychainset/
    image: 'images/keychainset/thumbnail.jpg',
    thumbImages: [
      'images/keychainset/thumbnail.jpg',
      'images/keychainset/full-set.jpg',
      null
    ],
    description: 'Collect them all! Six little keychain friends to clip onto bags, keys and pencil cases. Pick your favourite for £2.50 each, or get all six together in the full set for £12.99.',
    details: 'Keychain with keyring. £2.50 each, or £12.99 for the full set of 6. Suitable for ages 3+.',
    variations: [
      { id: 'keychain-set-1',    label: 'Keychain 1',    colour: '#F5C9A0', price: 2.50,  image: 'images/keychainset/keychain-1.jpg', thumbImages: ['images/keychainset/keychain-1.jpg', 'images/keychainset/full-set.jpg', null] },
      { id: 'keychain-set-2',    label: 'Keychain 2',    colour: '#8B5E3C', price: 2.50,  image: 'images/keychainset/keychain-2.jpg', thumbImages: ['images/keychainset/keychain-2.jpg', 'images/keychainset/full-set.jpg', null] },
      { id: 'keychain-set-3',    label: 'Keychain 3',    colour: '#e891a1', price: 2.50,  image: 'images/keychainset/keychain-3.jpg', thumbImages: ['images/keychainset/keychain-3.jpg', 'images/keychainset/full-set.jpg', null] },
      { id: 'keychain-set-4',    label: 'Keychain 4',    colour: '#c8bde8', price: 2.50,  image: 'images/keychainset/keychain-4.jpg', thumbImages: ['images/keychainset/keychain-4.jpg', 'images/keychainset/full-set.jpg', null] },
      { id: 'keychain-set-5',    label: 'Keychain 5',    colour: '#adc2cf', price: 2.50,  image: 'images/keychainset/keychain-5.jpg', thumbImages: ['images/keychainset/keychain-5.jpg', 'images/keychainset/full-set.jpg', null] },
      { id: 'keychain-set-6',    label: 'Keychain 6',    colour: '#E99075', price: 2.50,  image: 'images/keychainset/keychain-6.jpg', thumbImages: ['images/keychainset/keychain-6.jpg', 'images/keychainset/full-set.jpg', null] },
      { id: 'keychain-set-full', label: 'Full set of 6', colour: '#CD7250', price: 12.99, image: 'images/keychainset/full-set.jpg',   thumbImages: ['images/keychainset/full-set.jpg', 'images/keychainset/thumbnail.jpg', null] }
    ],
    related: ['crochet-doll', 'key-chain-plush', 'princess-doll']
  },
  {
    id: 'gift-set',
    name: 'Hijabi Friend — Gift Set of 2',
    variant: '2 keychains included',
    price: 35.00,
    colour: '#f5f0f8',
    accentColour: '#EDC1BB',
    hijabColour: '#CD7250',
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
MAHF_ROOT.MAHF_PRODUCT_MAP = {};
MAHF_ROOT.MAHF_PRODUCTS.forEach(function(p) {
  MAHF_ROOT.MAHF_PRODUCT_MAP[p.id] = p;
});

// Everything that can go in the basket, by id: each option of a product
// ("Yasmine and Fatima Friends — Yasmine"), or the product itself if it has
// no options. The checkout server charges these prices.
MAHF_ROOT.MAHF_ITEM_MAP = {};
MAHF_ROOT.MAHF_PRODUCTS.forEach(function(p) {
  if (p.variations && p.variations.length) {
    p.variations.forEach(function(v) {
      MAHF_ROOT.MAHF_ITEM_MAP[v.id] = { id: v.id, productId: p.id, name: p.name + ' — ' + v.label, price: v.price, image: v.image || p.image };
    });
  } else {
    MAHF_ROOT.MAHF_ITEM_MAP[p.id] = { id: p.id, productId: p.id, name: p.name, price: p.price, image: p.image };
  }
});

// The item a quick "Add to basket" button (shop / home page) adds:
// the product's first option, or the product itself.
MAHF_ROOT.MAHF_DEFAULT_ITEM = function(productId) {
  var p = MAHF_ROOT.MAHF_PRODUCT_MAP[productId];
  if (!p) return null;
  return MAHF_ROOT.MAHF_ITEM_MAP[p.variations && p.variations.length ? p.variations[0].id : p.id];
};

// Let the server code (Node.js) load this file with require().
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    products: MAHF_ROOT.MAHF_PRODUCTS,
    productMap: MAHF_ROOT.MAHF_PRODUCT_MAP,
    itemMap: MAHF_ROOT.MAHF_ITEM_MAP,
    shipping: MAHF_ROOT.MAHF_SHIPPING
  };
}
