/* Product data for the catalogue. Prices are USD placeholders.
   Add a product: drop a 900×900 transparent WebP in assets/img/ and add a row here. */
window.VIREX_PRODUCTS = [
  { id: 'pro-tee',       name: 'Virex Pro T-Shirt',        price: 34, cat: 'tops',        color: 'Black', img: 'prod-1',       desc: 'A breathable training tee with a heat-pressed V on the chest.' },
  { id: 'motion-top',    name: 'Virex Motion Top',         price: 32, cat: 'tops',        color: 'Mint',  img: 'prod-2',       desc: 'A light sports top with a smooth, stay-put fit for running and training.' },
  { id: 'flex-jacket',   name: 'Virex Flex Jacket',        price: 64, cat: 'outerwear',   color: 'Black', img: 'prod-3',       desc: 'A packable zip jacket with a stand collar and a stretch fabric.' },
  { id: 'training-shorts', name: 'Virex Training Shorts',  price: 39, cat: 'bottoms',     color: 'Black', img: 'prod-4',       desc: 'Quick-dry shorts with a reflective V on the leg.' },
  { id: 'fit-leggings',  name: 'Virex Fit Leggings',       price: 44, cat: 'bottoms',     color: 'Black', img: 'prod-5',       desc: 'High-waist leggings with four-way stretch and a flat waistband.' },
  { id: 'comfort-hoodie', name: 'Virex Comfort Hoodie',    price: 56, cat: 'outerwear',   color: 'Mint',  img: 'prod-6',       desc: 'A soft brushed-back hoodie for warm-ups and recovery days.' },
  { id: 'aero-bra',      name: 'Virex Aero Sports Bra',    price: 36, cat: 'tops',        color: 'Black', img: 'cat-bra',      desc: 'Medium-support racerback bra with a wide, flat band.' },
  { id: 'flow-tank',     name: 'Virex Flow Tank',          price: 30, cat: 'tops',        color: 'Mint',  img: 'cat-tank',     desc: 'An airy running tank that wicks moisture away.' },
  { id: 'core-joggers',  name: 'Virex Core Joggers',       price: 52, cat: 'bottoms',     color: 'Black', img: 'cat-joggers',  desc: 'Tapered joggers with a drawcord waist and zip pockets.' },
  { id: 'sprint-shorts', name: 'Virex Sprint Shorts',      price: 34, cat: 'bottoms',     color: 'Mint',  img: 'cat-mshorts',  desc: 'Split-hem running shorts with an inner liner.', badge: 'New' },
  { id: 'stride-cap',    name: 'Virex Stride Cap',         price: 24, cat: 'accessories', color: 'Navy',  img: 'cat-cap',      desc: 'A six-panel running cap with a sweat-wicking band.' },
  { id: 'lite-windbreaker', name: 'Virex Lite Windbreaker', price: 68, cat: 'outerwear',  color: 'Lime',  img: 'cat-wind',     desc: 'An ultralight windbreaker that folds into its own pocket.', badge: 'New' },
  { id: 'trail-backpack', name: 'Virex Trail Backpack',    price: 59, cat: 'accessories', color: 'Navy',  img: 'cat-pack',     desc: 'A 12-litre running pack with a chest harness and reflective trim.' },
  { id: 'pace-socks',    name: 'Virex Pace Socks (2-pack)', price: 16, cat: 'accessories', color: 'White', img: 'cat-socks',  desc: 'Cushioned crew socks with arch support.' },
  { id: 'seamless-tee',  name: 'Virex Seamless Tee',       price: 34, cat: 'tops',        color: 'White', img: 'cat-wtee',     desc: 'A seamless performance tee that moves with you.' },
  { id: 'thermal-half-zip', name: 'Virex Thermal Half-Zip', price: 48, cat: 'outerwear',  color: 'Navy',  img: 'cat-thermal',  desc: 'A warm mid-layer with a brushed interior and a high collar.' },
  { id: 'studio-leggings', name: 'Virex Studio Leggings',  price: 46, cat: 'bottoms',     color: 'Mint',  img: 'cat-mleg',     desc: 'Soft, squat-proof leggings for studio and gym.', badge: 'New' },
  { id: 'zip-hoodie',    name: 'Virex Zip Hoodie',         price: 62, cat: 'outerwear',   color: 'Navy',  img: 'cat-nhood',    desc: 'A full-zip hoodie with a roomy hood and two side pockets.' }
];
window.VIREX_CATS = [['all', 'All products'], ['tops', 'Tops'], ['bottoms', 'Bottoms'], ['outerwear', 'Outerwear'], ['accessories', 'Accessories']];
window.VIREX_COLORS = { Black: '#111a2b', Mint: '#bfe3b4', Navy: '#17294c', White: '#ffffff', Lime: '#c4f550' };
