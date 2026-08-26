/**
 * Every bundled asset in one place. Metro resolves `require` at build time, so
 * these cannot be built from template strings.
 */
export const brand = {
  ink: require('../assets/brand/vendly-mark-ink.png'),
  light: require('../assets/brand/vendly-mark-light.png'),
};

export const icons = {
  facebook: require('../assets/icons/facebook.webp'),
  instagram: require('../assets/icons/instagram.webp'),
};

export const products = {
  hoodie: require('../assets/products/hoodie.png'),
  headphones: require('../assets/products/headphones.png'),
  facialOil: require('../assets/products/facial-oil.png'),
  tableLamp: require('../assets/products/table-lamp.png'),
  burger: require('../assets/products/burger.png'),
  giftBag: require('../assets/products/gift-bag.png'),
};

export const media = {
  heroLoop: require('../assets/video/hero-loop.mp4'),
};
