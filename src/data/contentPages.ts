/**
 * Copy for every footer/legal destination that isn't an in-page section —
 * legal, resources, company, support and the per-category solution pages.
 * Kept in one place so the routes under app/legal, app/resources,
 * app/company, app/support and app/solutions stay thin.
 */

export type LegalSection = { heading: string; body: string[] };
export type LegalPage = { title: string; updated: string; intro: string; sections: LegalSection[] };

export const legalPages: Record<string, LegalPage> = {
  'terms-of-service': {
    title: 'Terms of Service',
    updated: '1 August 2026',
    intro:
      'These terms cover how you use Vendly.lk to run your storefront, orders, inventory and customer records. By creating an account or using any part of the product, you agree to them.',
    sections: [
      {
        heading: '1. Your account',
        body: [
          'You need a Vendly account to use the product. You are responsible for the accuracy of the business details you give us and for keeping your login credentials to yourself.',
          'One account can be shared across staff logins on the Growth plan. Whoever holds the account is responsible for what happens under it, including actions taken by staff you invite.',
        ],
      },
      {
        heading: '2. What Vendly is for',
        body: [
          'Vendly is built for businesses that take orders through Facebook, WhatsApp and a storefront link, and need one place to track those orders, customers, stock and payments.',
          'You agree not to use it to sell anything illegal in Sri Lanka, to run a storefront that misrepresents what you are selling, or to use the order and customer tools to collect data on people who have not actually ordered from you.',
        ],
      },
      {
        heading: '3. Orders, payments and COD',
        body: [
          'Vendly records orders and payment status — it is not a payment processor or a courier. Card and bank transfer payments are handled by the providers you connect; COD collection and delivery are handled by the courier you choose.',
          'The COD Reliability Score is a signal built from delivery outcomes you and other sellers record. It is a tool to help you decide which orders to fulfil carefully, not a guarantee about any individual customer.',
        ],
      },
      {
        heading: '4. Your data, your storefront',
        body: [
          'Your product catalogue, order history and customer records belong to you. You can export them at any time from your account, and we do not sell them to anyone.',
          'You are responsible for the content of your own storefront — product descriptions, prices and images — and for making sure it is accurate.',
        ],
      },
      {
        heading: '5. Plans, billing and cancellation',
        body: [
          'Starter and Growth are billed as described at signup. You can cancel at any time; your storefront and order history stay exportable for 30 days after cancellation, then are deleted.',
          'We may suspend an account that is used to break these terms, after trying to reach you about it first, except where the activity is causing active harm.',
        ],
      },
      {
        heading: '6. Changes to these terms',
        body: [
          'We will update this page when the terms change and, for anything material, tell active accounts by email before it takes effect.',
        ],
      },
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    updated: '1 August 2026',
    intro:
      'This explains what Vendly collects to run your storefront and orders, why, and what choices you have — for you as a seller, and for the customers who order through your storefront.',
    sections: [
      {
        heading: '1. What we collect',
        body: [
          'From sellers: your name, business name, contact details and billing information, plus the products, orders, customers and inventory records you create inside the product.',
          'From your customers, on your behalf: whatever they give you to complete an order — name, delivery address, phone number and order details. We store this so your order history and customer records work; we do not use it for our own marketing.',
        ],
      },
      {
        heading: '2. Why we collect it',
        body: [
          'To run the storefront, order queue, inventory and customer-history features you signed up for, to process payments and hand orders to your courier, and to keep your account secure.',
          'Aggregated, de-identified data (like how many orders move through the platform in a week) helps us improve features like the AI assistant and COD Reliability Score. This never includes anything that identifies a specific customer.',
        ],
      },
      {
        heading: '3. Who we share it with',
        body: [
          'Payment providers and couriers you connect receive what they need to process a payment or deliver a parcel — nothing more.',
          'We do not sell seller or customer data to third parties, including advertisers.',
        ],
      },
      {
        heading: '4. Where it is stored',
        body: [
          'Data is stored on infrastructure serving the South Asia region, with backups kept encrypted. Access is limited to the systems and staff that need it to keep the product running.',
        ],
      },
      {
        heading: '5. Your choices',
        body: [
          'Sellers can export or delete their data from account settings. If you are a customer who ordered through a Vendly storefront and want your record removed, contact the business you ordered from, or reach us directly and we will help route the request.',
        ],
      },
      {
        heading: '6. Contact',
        body: ['Questions about this policy can go to our privacy team through the contact page.'],
      },
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    updated: '1 August 2026',
    intro:
      'Vendly.lk uses a small number of cookies and local-storage entries to keep the marketing site and product working. This page lists what they do.',
    sections: [
      {
        heading: '1. Strictly necessary',
        body: [
          'Session cookies that keep you signed in to your Vendly account, and a cookie that remembers you have seen this notice. These cannot be switched off, since the product does not work without them.',
        ],
      },
      {
        heading: '2. Preferences',
        body: [
          'Local storage that remembers small choices — like which currency and locale you picked on this marketing site, or the last screen you had open in the product.',
        ],
      },
      {
        heading: '3. Analytics',
        body: [
          'Aggregated, anonymised analytics that tell us which pages and features get used, so we can prioritise what to build next. No individual visitor is identified from this data.',
        ],
      },
      {
        heading: '4. What we do not do',
        body: [
          'We do not run third-party advertising cookies or cross-site tracking pixels on Vendly.lk.',
        ],
      },
      {
        heading: '5. Managing cookies',
        body: [
          'You can block or delete cookies from your browser settings at any time. Blocking the strictly-necessary ones will sign you out and stop the product from working correctly.',
        ],
      },
    ],
  },
  'data-protection': {
    title: 'Data Protection',
    updated: '1 August 2026',
    intro:
      'How Vendly protects the seller and customer data that runs through storefronts, orders, inventory and customer records — the technical and organisational side of the Privacy Policy.',
    sections: [
      {
        heading: '1. Encryption',
        body: [
          'Data is encrypted in transit (TLS) between your device, the storefront and our servers, and encrypted at rest, including backups.',
        ],
      },
      {
        heading: '2. Access control',
        body: [
          'Staff access to production data is limited to what a role needs to do its job, logged, and reviewed regularly. Support staff see what they need to resolve a ticket, not your full order history by default.',
        ],
      },
      {
        heading: '3. Data retention',
        body: [
          'Order, customer and inventory records are kept for as long as your account is active, plus 30 days after cancellation to give you time to export, then deleted on a rolling schedule.',
        ],
      },
      {
        heading: '4. Breach response',
        body: [
          'If a security incident affects your data, we will tell affected accounts what happened, what data was involved, and what we are doing about it, as soon as we reasonably can.',
        ],
      },
      {
        heading: '5. Your rights',
        body: [
          'You can request a copy of your data, ask us to correct it, or ask us to delete it, subject to what we are required to keep for accounting and legal reasons. Reach us through the contact page to make a request.',
        ],
      },
    ],
  },
};

export type HelpTopic = { title: string; body: string; to: string };

export const helpTopics: HelpTopic[] = [
  {
    title: 'Getting started',
    body: 'Setting up your storefront, adding your first products and connecting Facebook or WhatsApp.',
    to: '/resources/guides',
  },
  {
    title: 'Orders & fulfilment',
    body: 'Turning a chat message into a tracked order, confirming, packing and handing off to a courier.',
    to: '/resources/documentation',
  },
  {
    title: 'Payments & COD',
    body: 'Card, bank transfer and cash on delivery — plus reading your COD Reliability Score.',
    to: '/resources/faq',
  },
  {
    title: 'Products & inventory',
    body: 'Variants, stock counts, low-stock alerts and keeping your catalogue accurate.',
    to: '/resources/documentation',
  },
  {
    title: 'Account & billing',
    body: 'Plans, staff logins, changing your details and cancelling if Vendly is not right for you.',
    to: '/support/contact-support',
  },
  {
    title: 'Something not working',
    body: "If a feature seems broken or an order looks wrong, this is the fastest way to reach a real person.",
    to: '/support/contact-support',
  },
];

export type DocSection = { title: string; body: string };

export const docSections: DocSection[] = [
  { title: 'Storefront', body: 'Building your catalogue, setting prices and variants, and what customers see on your order page.' },
  { title: 'Orders', body: 'How chat orders, storefront orders and manual entries all land in one queue, and how statuses work.' },
  { title: 'Customers', body: 'What gets saved to a customer record, and how order history and preferences build up over time.' },
  { title: 'Products & Inventory', body: 'Variants, stock levels, low-stock thresholds and how stock moves automatically with orders.' },
  { title: 'Payments', body: 'Accepting card, bank transfer and cash on delivery, and where each shows up in your records.' },
  { title: 'Courier & COD Reliability', body: 'Booking a courier from an order, printing labels, and how the reliability score is calculated.' },
  { title: 'AI Assistant', body: 'What the assistant can answer on your behalf, and how to teach it about your business.' },
  { title: 'Analytics', body: 'What sells, when, and where your orders come from — read weekly or drilled into by product.' },
];

export type Guide = { title: string; time: string; body: string };

export const guideList: Guide[] = [
  { title: 'Set up your storefront in 10 minutes', time: '10 min', body: 'From a blank account to a shareable order link — logo, first products, prices and delivery areas.' },
  { title: 'Turn a WhatsApp chat into a real order', time: '4 min', body: 'The exact steps to take a message like "Is the black one available?" and get it into your order queue.' },
  { title: 'Add your first product with variants', time: '5 min', body: 'Sizes, colours and prices, and how stock tracks each variant separately.' },
  { title: 'Understand your COD Reliability Score', time: '6 min', body: 'What moves the score, how to read it before you dispatch, and how to improve it over time.' },
  { title: 'Connect a courier and print your first label', time: '5 min', body: 'Booking a pickup straight from an order and getting a label ready without retyping the address.' },
  { title: 'Read your weekly analytics digest', time: '4 min', body: 'What sells, what does not, and which channel is actually bringing in orders.' },
];

export type Faq = { q: string; a: string };

export const faqList: Faq[] = [
  { q: 'Do I need a website to use Vendly?', a: 'No. Your storefront is a shareable link you can post in Facebook, WhatsApp or Instagram — most sellers never need a separate website.' },
  { q: 'Can I keep taking orders over WhatsApp and Messenger?', a: 'Yes — that is the point. Vendly sits alongside those chats and turns them into structured, trackable orders instead of replacing how you already talk to customers.' },
  { q: 'What is the COD Reliability Score?', a: 'A score built from delivery outcomes that flags which cash-on-delivery orders are more likely to be refused, so you can call to confirm before you dispatch.' },
  { q: 'How does stock update when I sell across three channels at once?', a: 'Every order — chat, storefront or manual — draws from the same inventory count, so a size that sells out in a WhatsApp chat also disappears from your storefront immediately.' },
  { q: 'Is my customer and order data private?', a: 'Yes. Your data is yours, encrypted in transit and at rest, and never sold. See the Privacy Policy and Data Protection pages for the details.' },
  { q: 'Can more than one person use the account?', a: 'On the Growth plan, yes — you can invite staff with their own logins so packing, dispatch and replies do not all fall on one person.' },
  { q: 'What happens if I cancel?', a: 'Your storefront and history stay exportable for 30 days after cancellation, so you can take your data with you before anything is deleted.' },
  { q: 'Which couriers does Vendly work with?', a: 'Vendly books and labels through the courier partners connected to your account rather than locking you to one provider — see the Partners page for how that works.' },
  { q: 'Do you offer support in Sinhala and Tamil?', a: 'Yes — support is available in Sinhala, Tamil and English. See Contact Support for hours and channels.' },
];

export type AboutContent = {
  mission: string;
  story: string[];
  values: { title: string; body: string }[];
};

export const aboutContent: AboutContent = {
  mission:
    'Vendly.lk exists for the seller running a real business out of a chat inbox — one storefront, one order queue and one set of customer records, instead of a notebook, a spreadsheet and a dozen open chats.',
  story: [
    "Most small businesses in Sri Lanka don't start with a website. They start with a Facebook page, a phone number, and a first customer who messages to ask if something is in stock.",
    'That works, until it costs you — a stockout you did not catch, a COD parcel that comes back, a regular customer treated like a stranger because there is no record of what they ordered last time.',
    'Vendly was built around that reality rather than against it: it keeps the chats and the storefront link sellers already use, and gives everything happening across them one home.',
  ],
  values: [
    { title: 'Built for chat-first sellers', body: 'Facebook and WhatsApp are not a workaround here — they are the starting point every feature is designed around.' },
    { title: 'Plain, not clever', body: 'A storefront, an order queue and a customer list, done well, beat a dashboard full of features nobody opens.' },
    { title: 'Sri Lanka first', body: 'COD, courier handoff and local payment rails are core to the product, not an afterthought bolted on for one market.' },
  ],
};

export type CareerRole = { title: string; type: string; body: string };

export const careersRoles: CareerRole[] = [
  { title: 'Customer Success (Sinhala / Tamil / English)', type: 'Colombo · Full-time', body: 'Helping sellers get their storefront live and their first orders moving, in the language they are most comfortable in.' },
  { title: 'Product Engineer', type: 'Colombo or remote', body: 'Working across the storefront, order queue and COD Reliability Score — the parts of Vendly that touch every seller every day.' },
];

export type PartnerCategory = { title: string; body: string };

export const partnerCategories: PartnerCategory[] = [
  { title: 'Courier & logistics', body: 'Partners who take a booked order from Vendly straight to pickup, with labels and tracking that write back to the order automatically.' },
  { title: 'Payments', body: 'Card and bank transfer providers that settle into your account without a seller needing to reconcile anything by hand.' },
  { title: 'Business tools', body: 'Accounting, analytics and marketing tools that read from the same order and customer data already inside Vendly.' },
];

export type SupportChannel = { title: string; meta: string; body: string };

export const contactChannels: SupportChannel[] = [
  { title: 'WhatsApp', meta: 'Fastest for most questions', body: 'Message us the same way your customers message you — we reply on business days within a few hours.' },
  { title: 'Email', meta: 'support@vendly.lk', body: 'Best for anything that needs detail or a screenshot, like a billing question or an order that looks wrong.' },
  { title: 'Office', meta: 'Colombo, Sri Lanka', body: 'By appointment — reach out first so the right person is around when you visit.' },
];

export const supportChannels: SupportChannel[] = [
  { title: 'WhatsApp support', meta: 'Mon–Sat, 9am–7pm (Sri Lanka time)', body: 'Include your business name and, if it is about an order, the order number — it gets you a faster, more specific answer.' },
  { title: 'Email support', meta: 'support@vendly.lk', body: 'For anything that needs a longer explanation or an attachment. We aim to reply within one business day.' },
];

export type SolutionCopy = { headline: string; bullets: string[] };

export const solutionsCopy: Record<string, SolutionCopy> = {
  'Food & Beverages': {
    headline: 'For kitchens taking orders faster than they can write them down.',
    bullets: [
      'Daily menu limits and prep-time windows, so you stop overselling a dish that is already sold out for the day.',
      'Same-day delivery cutoffs enforced automatically, instead of explained in every single chat.',
      'One queue for dine-in, delivery and pre-orders, so nothing gets started twice or missed entirely.',
    ],
  },
  'Fashion & Apparel': {
    headline: 'For sellers where "do you have my size?" is the first message, every time.',
    bullets: [
      'Stock tracked per size and colour, not just per product, so a sold-out XL disappears the moment it sells.',
      'Exchange history saved to the customer, so a return does not start the conversation from zero.',
      'A storefront that shows real availability, cutting down the back-and-forth before someone actually buys.',
    ],
  },
  'Beauty & Health': {
    headline: 'For products where the batch and the expiry date matter as much as the price.',
    bullets: [
      'Batch numbers and expiry dates tracked against stock, not remembered separately.',
      'Repeat-purchase reminders, since these are the products customers reorder on a schedule.',
      'A customer record that remembers what someone bought last time, which matters more for skin and health products than almost anything else you could sell.',
    ],
  },
  'Electronics': {
    headline: 'For higher-value orders where one refused COD parcel actually hurts.',
    bullets: [
      'Serial numbers and warranty periods recorded against every unit sold.',
      'The COD Reliability Score flags high-value orders worth a confirmation call before they ship.',
      'Warranty and support history kept on the customer record, not in a separate spreadsheet.',
    ],
  },
  'Home & Lifestyle': {
    headline: 'For bulky, fragile items that need more than a delivery address.',
    bullets: [
      'Courier handling notes attached to the order — fragile, oversized, needs two people — not left to a chat scrollback.',
      'Stock tracked by variant, like finish or size, so a storefront never shows something that is actually out.',
      'Order history that shows exactly what shipped and how, if something arrives damaged.',
    ],
  },
  'General Retail': {
    headline: 'For sellers moving bundles and bulk orders as often as single items.',
    bullets: [
      'Bundle and bulk pricing built into the product catalogue, not calculated by hand every time.',
      'One-tap reorder for regular customers, using their saved order history.',
      'A single stock count across every channel, so a bulk order does not accidentally oversell your storefront.',
    ],
  },
};
