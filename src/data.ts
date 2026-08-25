<<<<<<< HEAD
import { products } from './assets';
import type { BadgeTone } from './components/UI';

export type Category = {
  name: string;
  tag: string;
  img: any;
  product: string;
  price: string;
  variant: string;
  note: string;
  stock: string;
  order: string;
  /** Full-bleed backdrop colour for the category preview panel — taken
      directly from the reference design's per-category screens, not a
      site-palette tint. */
  previewTint: string;
};

export const categories: Category[] = [
  {
    name: 'Food & Beverages',
    tag: 'FOOD',
    img: products.burger,
    product: 'Signature Cheeseburger',
    price: 'Rs. 1,450',
    variant: 'Regular · Large · Add cheese',
    note: 'Prep time, daily menu limits and same-day delivery windows.',
    stock: 'Kitchen limit · 40 / day',
    order: '2 × Cheeseburger · Colombo 05',
    previewTint: '#F2BD1E',
  },
  {
    name: 'Fashion & Apparel',
    tag: 'FASHION',
    img: products.hoodie,
    product: 'Heavyweight Hoodie',
    price: 'Rs. 6,900',
    variant: 'S · M · L · XL · XXL',
    note: 'Stock tracked per size and colour, with exchange history.',
    stock: 'XL · 4 left',
    order: '1 × Hoodie XL · Nugegoda',
    previewTint: '#858585',
  },
  {
    name: 'Beauty & Health',
    tag: 'BEAUTY',
    img: products.facialOil,
    product: 'Facial Oil 30ml',
    price: 'Rs. 4,250',
    variant: '30ml · 50ml · Refill',
    note: 'Batch numbers, expiry dates and repeat-purchase reminders.',
    stock: 'Batch B-24 · 18 left',
    order: '1 × Facial Oil · Dehiwala',
    previewTint: '#FF00D0',
  },
  {
    name: 'Electronics',
    tag: 'TECH',
    img: products.headphones,
    product: 'Studio Headphones',
    price: 'Rs. 18,900',
    variant: 'Black · Warranty 12 mo',
    note: 'Serial numbers, warranty records and high-value COD checks.',
    stock: 'In stock · 7',
    order: '1 × Headphones · Kandy',
    previewTint: '#00D2FF',
  },
  {
    name: 'Home & Lifestyle',
    tag: 'HOME',
    img: products.tableLamp,
    product: 'Oak Table Lamp',
    price: 'Rs. 9,400',
    variant: 'Oak · Walnut',
    note: 'Bulky and fragile parcels, with courier handling notes.',
    stock: 'Oak · 3 left',
    order: '1 × Table Lamp · Galle',
    previewTint: '#E9D9C3',
  },
  {
    name: 'General Retail',
    tag: 'RETAIL',
    img: products.giftBag,
    previewTint: '#938370',
    product: 'Gift Bag (Medium)',
    price: 'Rs. 780',
    variant: 'S · M · L · Bundle of 10',
    note: 'Bundles, bulk pricing and one-tap reorder for regulars.',
    stock: 'Medium · 120',
    order: '10 × Gift Bag · Wattala',
  },
];

export type OrderRow = {
  id: string;
  when: string;
  initials: string;
  accent?: boolean;
  name: string;
  where: string;
  img: any;
  item: string;
  total: string;
  payment: string;
  status: string;
  tone: BadgeTone;
  selected?: boolean;
};

export const orders: OrderRow[] = [
  {
    id: '#2418', when: 'Today 14:32', initials: 'NP', accent: true,
    name: 'Nimal P.', where: 'Nugegoda · WhatsApp', img: products.hoodie,
    item: 'Hoodie XL × 1', total: 'Rs. 6,900', payment: 'COD',
    status: 'New', tone: 'accent', selected: true,
  },
  {
    id: '#2417', when: 'Today 11:04', initials: 'SF',
    name: 'Sithara F.', where: 'Kandy · Storefront', img: products.headphones,
    item: 'Headphones × 1', total: 'Rs. 18,900', payment: 'Card · Paid',
    status: 'Packing', tone: 'caution',
  },
  {
    id: '#2416', when: 'Yesterday', initials: 'RD',
    name: 'Ruwan D.', where: 'Galle · Storefront', img: products.tableLamp,
    item: 'Table Lamp × 1', total: 'Rs. 9,400', payment: 'Bank transfer',
    status: 'With courier', tone: 'neutral',
  },
  {
    id: '#2415', when: 'Yesterday', initials: 'AM',
    name: 'Ayesha M.', where: 'Dehiwala · Messenger', img: products.facialOil,
    item: 'Facial Oil × 2', total: 'Rs. 8,500', payment: 'COD',
    status: 'Delivered', tone: 'success',
  },
  {
    id: '#2414', when: '2 days ago', initials: 'TK',
    name: 'Tharindu K.', where: 'Wattala · Manual entry', img: products.burger,
    item: 'Burger meal × 3', total: 'Rs. 4,350', payment: 'COD',
    status: 'Delivered', tone: 'success',
  },
];

export const productRows = [
  { img: products.hoodie, name: 'Heavyweight Hoodie', variants: 'S · M · L · XL · XXL', price: 'Rs. 6,900', status: 'On sale', tone: 'success' as BadgeTone },
  { img: products.headphones, name: 'Studio Headphones', variants: 'Black · Warranty 12 mo', price: 'Rs. 18,900', status: 'On sale', tone: 'success' as BadgeTone },
  { img: products.facialOil, name: 'Facial Oil 30ml', variants: '30ml · 50ml · Refill', price: 'Rs. 4,250', status: 'Low stock', tone: 'caution' as BadgeTone },
  { img: products.tableLamp, name: 'Oak Table Lamp', variants: 'Oak · Walnut', price: 'Rs. 9,400', status: 'Made to order', tone: 'neutral' as BadgeTone },
];

export const stockLevels = [
  { name: 'Hoodie · XL', count: '4 left', fraction: 0.18, level: 'low' as const },
  { name: 'Hoodie · L', count: '21 left', fraction: 0.72, level: 'ok' as const },
  { name: 'Facial Oil · 30ml', count: 'Out of stock', fraction: 0.03, level: 'out' as const },
  { name: 'Canvas Tote', count: '38 left', fraction: 0.88, level: 'ok' as const },
];

export const howItWorks = [
  { title: 'A customer messages you', body: 'On Facebook or WhatsApp — exactly like today.' },
  { title: 'You send one link', body: 'The order arrives structured — items, address, payment.' },
  { title: 'You confirm and pack', body: 'Stock updates itself. Receipt is ready to print.' },
  { title: 'Payment & courier', body: 'COD, card or bank transfer — courier booked from the order.' },
  { title: 'Delivered', body: 'Status tracked, history saved to the customer.' },
];

export const osModules = [
  { name: 'Storefront', body: 'Your catalogue and order page' },
  { name: 'Orders', body: 'One queue, every channel' },
  { name: 'Customers', body: 'History, preferences, reliability' },
  { name: 'Products', body: 'Variants, prices, categories' },
  { name: 'Inventory', body: 'Stock that moves with orders' },
  { name: 'Payments', body: 'Card, transfer, COD, invoices' },
  { name: 'Courier', body: 'Dispatch, labels, tracking' },
  { name: 'Analytics', body: 'What sells, where, and when' },
  { name: 'AI assistant', body: 'Repetitive conversations handled' },
  { name: 'COD Reliability', body: 'Fewer parcels coming back' },
];

export const outcomes = [
  { title: 'Save hours of typing and re-typing', body: 'Orders arrive complete. Invoices and receipts write themselves.' },
  { title: 'Reduce courier losses', body: 'COD Reliability shows you which parcels are risky before they leave.' },
  { title: 'Never lose an order in a chat again', body: 'One queue, one status per order, nothing forgotten at midnight.' },
  { title: 'Know your customers by name', body: 'Order history, preferences and reliability, on every order.' },
  { title: 'Look like a business, not a DM', body: 'A real storefront, proper invoices, receipts customers can keep.' },
  { title: 'Automate the repetitive replies', body: 'The assistant answers availability, price and delivery questions.' },
  { title: 'Run everything from one place', body: 'Phone in the morning, laptop at night. Same business, one system.' },
];

export const realityPoints = [
  { key: 'A', text: 'No professional storefront — your catalogue is a photo album.' },
  { key: 'B', text: 'Orders scattered across chats, screenshots and paper.' },
  { key: 'C', text: 'The same three questions, answered again and again.' },
  { key: 'D', text: 'No customer history — every buyer is a stranger.' },
  { key: 'E', text: 'Stock and reporting kept by memory and guesswork.' },
  { key: 'F', text: 'Refused COD parcels — you pay the courier both ways.' },
];

export const moduleChips = [
  'ORDERS', 'CUSTOMERS', 'PRODUCTS', 'INVENTORY', 'PAYMENTS', 'COURIER',
  'INVOICES', 'ANALYTICS', 'STOREFRONT', 'AI', 'COD RELIABILITY',
];

export const sceneOrders = [
  { id: '2418', who: 'Nimal P. · Nugegoda', total: 'Rs. 6,900', status: 'Confirmed', tone: 'accent' as BadgeTone },
  { id: '2417', who: 'Sithara F. · Kandy', total: 'Rs. 18,900', status: 'Delivered', tone: 'success' as BadgeTone },
  { id: '2416', who: 'Ruwan D. · Galle', total: 'Rs. 9,400', status: 'Packing', tone: 'caution' as BadgeTone },
];

export const sceneNav = [
  'Orders', 'Customers', 'Products', 'Inventory', 'Payments', 'Courier', 'Analytics',
];

/** Scatter positions for the six chaos cards, in design pixels. */
export const chaosCards = [
  { x: -430, y: -150, rot: -6, width: 230, offsetY: -46 },
  { x: 405, y: -185, rot: 5, width: 240, offsetY: -46 },
  { x: -460, y: 105, rot: -3, width: 220, offsetY: -40 },
  { x: 420, y: 120, rot: 4, width: 250, offsetY: -38 },
  { x: -215, y: 215, rot: -5, width: 210, offsetY: -36 },
  { x: 255, y: 235, rot: 7, width: 215, offsetY: -34 },
];

export const starterFeatures = [
  'Storefront and order page',
  'Manual order creation',
  'Customer records',
  'Products and inventory',
  'AI assistant',
];

export const growthFeatures = [
  'COD Reliability Score',
  'Courier workflow and labels',
  'Invoices and receipts',
  'Reports and advanced analytics',
  'Multiple staff users',
];

export const footerColumns = [
  { title: 'Product', links: ['Orders', 'Customers', 'Inventory', 'AI Assistant', 'COD Reliability', 'Storefront'] },
  { title: 'Solutions', links: ['Food & Beverages', 'Fashion & Apparel', 'Beauty & Health', 'Electronics', 'Home & Lifestyle', 'General Retail'] },
  { title: 'Resources', links: ['Help Centre', 'Documentation', 'Guides', 'FAQ'] },
  { title: 'Company', links: ['About', 'Contact', 'Careers', 'Partners'] },
  { title: 'Support', links: ['Help', 'Contact Support'] },
];
=======
import { products } from './assets';
import type { BadgeTone } from './components/UI';

export type Category = {
  name: string;
  tag: string;
  img: any;
  product: string;
  price: string;
  variant: string;
  note: string;
  stock: string;
  order: string;
};

export const categories: Category[] = [
  {
    name: 'Food & Beverages',
    tag: 'FOOD',
    img: products.burger,
    product: 'Signature Cheeseburger',
    price: 'Rs. 1,450',
    variant: 'Regular · Large · Add cheese',
    note: 'Prep time, daily menu limits and same-day delivery windows.',
    stock: 'Kitchen limit · 40 / day',
    order: '2 × Cheeseburger · Colombo 05',
  },
  {
    name: 'Fashion & Apparel',
    tag: 'FASHION',
    img: products.hoodie,
    product: 'Heavyweight Hoodie',
    price: 'Rs. 6,900',
    variant: 'S · M · L · XL · XXL',
    note: 'Stock tracked per size and colour, with exchange history.',
    stock: 'XL · 4 left',
    order: '1 × Hoodie XL · Nugegoda',
  },
  {
    name: 'Beauty & Health',
    tag: 'BEAUTY',
    img: products.facialOil,
    product: 'Facial Oil 30ml',
    price: 'Rs. 4,250',
    variant: '30ml · 50ml · Refill',
    note: 'Batch numbers, expiry dates and repeat-purchase reminders.',
    stock: 'Batch B-24 · 18 left',
    order: '1 × Facial Oil · Dehiwala',
  },
  {
    name: 'Electronics',
    tag: 'TECH',
    img: products.headphones,
    product: 'Studio Headphones',
    price: 'Rs. 18,900',
    variant: 'Black · Warranty 12 mo',
    note: 'Serial numbers, warranty records and high-value COD checks.',
    stock: 'In stock · 7',
    order: '1 × Headphones · Kandy',
  },
  {
    name: 'Home & Lifestyle',
    tag: 'HOME',
    img: products.tableLamp,
    product: 'Oak Table Lamp',
    price: 'Rs. 9,400',
    variant: 'Oak · Walnut',
    note: 'Bulky and fragile parcels, with courier handling notes.',
    stock: 'Oak · 3 left',
    order: '1 × Table Lamp · Galle',
  },
  {
    name: 'General Retail',
    tag: 'RETAIL',
    img: products.giftBag,
    product: 'Gift Bag (Medium)',
    price: 'Rs. 780',
    variant: 'S · M · L · Bundle of 10',
    note: 'Bundles, bulk pricing and one-tap reorder for regulars.',
    stock: 'Medium · 120',
    order: '10 × Gift Bag · Wattala',
  },
];

export type OrderRow = {
  id: string;
  when: string;
  initials: string;
  accent?: boolean;
  name: string;
  where: string;
  img: any;
  item: string;
  total: string;
  payment: string;
  status: string;
  tone: BadgeTone;
  selected?: boolean;
};

export const orders: OrderRow[] = [
  {
    id: '#2418', when: 'Today 14:32', initials: 'NP', accent: true,
    name: 'Nimal P.', where: 'Nugegoda · WhatsApp', img: products.hoodie,
    item: 'Hoodie XL × 1', total: 'Rs. 6,900', payment: 'COD',
    status: 'New', tone: 'accent', selected: true,
  },
  {
    id: '#2417', when: 'Today 11:04', initials: 'SF',
    name: 'Sithara F.', where: 'Kandy · Storefront', img: products.headphones,
    item: 'Headphones × 1', total: 'Rs. 18,900', payment: 'Card · Paid',
    status: 'Packing', tone: 'caution',
  },
  {
    id: '#2416', when: 'Yesterday', initials: 'RD',
    name: 'Ruwan D.', where: 'Galle · Storefront', img: products.tableLamp,
    item: 'Table Lamp × 1', total: 'Rs. 9,400', payment: 'Bank transfer',
    status: 'With courier', tone: 'neutral',
  },
  {
    id: '#2415', when: 'Yesterday', initials: 'AM',
    name: 'Ayesha M.', where: 'Dehiwala · Messenger', img: products.facialOil,
    item: 'Facial Oil × 2', total: 'Rs. 8,500', payment: 'COD',
    status: 'Delivered', tone: 'success',
  },
  {
    id: '#2414', when: '2 days ago', initials: 'TK',
    name: 'Tharindu K.', where: 'Wattala · Manual entry', img: products.burger,
    item: 'Burger meal × 3', total: 'Rs. 4,350', payment: 'COD',
    status: 'Delivered', tone: 'success',
  },
];

export const productRows = [
  { img: products.hoodie, name: 'Heavyweight Hoodie', variants: 'S · M · L · XL · XXL', price: 'Rs. 6,900', status: 'On sale', tone: 'success' as BadgeTone },
  { img: products.headphones, name: 'Studio Headphones', variants: 'Black · Warranty 12 mo', price: 'Rs. 18,900', status: 'On sale', tone: 'success' as BadgeTone },
  { img: products.facialOil, name: 'Facial Oil 30ml', variants: '30ml · 50ml · Refill', price: 'Rs. 4,250', status: 'Low stock', tone: 'caution' as BadgeTone },
  { img: products.tableLamp, name: 'Oak Table Lamp', variants: 'Oak · Walnut', price: 'Rs. 9,400', status: 'Made to order', tone: 'neutral' as BadgeTone },
];

export const stockLevels = [
  { name: 'Hoodie · XL', count: '4 left', fraction: 0.18, level: 'low' as const },
  { name: 'Hoodie · L', count: '21 left', fraction: 0.72, level: 'ok' as const },
  { name: 'Facial Oil · 30ml', count: 'Out of stock', fraction: 0.03, level: 'out' as const },
  { name: 'Canvas Tote', count: '38 left', fraction: 0.88, level: 'ok' as const },
];

export const howItWorks = [
  { title: 'Share your storefront', body: 'One link in your bio, posts and replies. Your full catalogue, always current.' },
  { title: 'Orders arrive structured', body: 'Product, quantity, address, phone, payment method. No screenshots to decipher.' },
  { title: 'Confirm, pack, dispatch', body: 'Stock moves by itself. Print the invoice, hand the parcel to your courier.' },
  { title: 'Get paid, keep the record', body: 'Receipt to the customer, payment recorded, sale in your reports and analytics.' },
];

export const osModules = [
  { name: 'Storefront', body: 'Your catalogue and order page' },
  { name: 'Orders', body: 'One queue, every channel' },
  { name: 'Customers', body: 'History, preferences, reliability' },
  { name: 'Products', body: 'Variants, prices, categories' },
  { name: 'Inventory', body: 'Stock that moves with orders' },
  { name: 'Payments', body: 'Card, transfer, COD, invoices' },
  { name: 'Courier', body: 'Dispatch, labels, tracking' },
  { name: 'Analytics', body: 'What sells, where, and when' },
  { name: 'AI assistant', body: 'Repetitive conversations handled' },
  { name: 'COD Reliability', body: 'Fewer parcels coming back' },
];

export const outcomes = [
  { title: 'Save hours of typing and re-typing', body: 'Orders arrive complete. Invoices and receipts write themselves.' },
  { title: 'Reduce courier losses', body: 'COD Reliability shows you which parcels are risky before they leave.' },
  { title: 'Never lose an order in a chat again', body: 'One queue, one status per order, nothing forgotten at midnight.' },
  { title: 'Know your customers by name', body: 'Order history, preferences and reliability, on every order.' },
  { title: 'Look like a business, not a DM', body: 'A real storefront, proper invoices, receipts customers can keep.' },
  { title: 'Automate the repetitive replies', body: 'The assistant answers availability, price and delivery questions.' },
  { title: 'Run everything from one place', body: 'Phone in the morning, laptop at night. Same business, one system.' },
];

export const realityPoints = [
  { key: 'A', text: 'No professional storefront — your catalogue is a photo album.' },
  { key: 'B', text: 'Orders scattered across chats, screenshots and paper.' },
  { key: 'C', text: 'The same three questions, answered again and again.' },
  { key: 'D', text: 'No customer history — every buyer is a stranger.' },
  { key: 'E', text: 'Stock and reporting kept by memory and guesswork.' },
  { key: 'F', text: 'Refused COD parcels — you pay the courier both ways.' },
];

export const moduleChips = [
  'ORDERS', 'CUSTOMERS', 'PRODUCTS', 'INVENTORY', 'PAYMENTS', 'COURIER',
  'INVOICES', 'ANALYTICS', 'STOREFRONT', 'AI', 'COD RELIABILITY',
];

export const sceneOrders = [
  { id: '2418', who: 'Nimal P. · Nugegoda', total: 'Rs. 6,900', status: 'Confirmed', tone: 'accent' as BadgeTone },
  { id: '2417', who: 'Sithara F. · Kandy', total: 'Rs. 18,900', status: 'Delivered', tone: 'success' as BadgeTone },
  { id: '2416', who: 'Ruwan D. · Galle', total: 'Rs. 9,400', status: 'Packing', tone: 'caution' as BadgeTone },
];

export const sceneNav = [
  'Orders', 'Customers', 'Products', 'Inventory', 'Payments', 'Courier', 'Analytics',
];

/** Scatter positions for the six chaos cards, in design pixels. */
export const chaosCards = [
  { x: -430, y: -150, rot: -6, width: 230, offsetY: -46 },
  { x: 405, y: -185, rot: 5, width: 240, offsetY: -46 },
  { x: -460, y: 105, rot: -3, width: 220, offsetY: -40 },
  { x: 420, y: 120, rot: 4, width: 250, offsetY: -38 },
  { x: -215, y: 215, rot: -5, width: 210, offsetY: -36 },
  { x: 255, y: 235, rot: 7, width: 215, offsetY: -34 },
];

export const starterFeatures = [
  'Storefront and order page',
  'Manual order creation',
  'Customer records',
  'Products and inventory',
  'AI assistant',
];

export const growthFeatures = [
  'COD Reliability Score',
  'Courier workflow and labels',
  'Invoices and receipts',
  'Reports and advanced analytics',
  'Multiple staff users',
];

export const footerColumns = [
  { title: 'Product', links: ['Orders', 'Customers', 'Inventory', 'AI Assistant', 'COD Reliability', 'Storefront'] },
  { title: 'Solutions', links: ['Food & Beverages', 'Fashion & Apparel', 'Beauty & Health', 'Electronics', 'Home & Lifestyle', 'General Retail'] },
  { title: 'Resources', links: ['Help Centre', 'Documentation', 'Guides', 'FAQ'] },
  { title: 'Company', links: ['About', 'Contact', 'Careers', 'Partners'] },
  { title: 'Support', links: ['Help', 'Contact Support'] },
];
>>>>>>> c1decb5f08ffdabb7df20508d93878b536a73e30
