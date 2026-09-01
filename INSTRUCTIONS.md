# Vendly.lk — working instructions

Read this fully before changing anything. It is written for an AI coding
assistant, but a human can follow it too.

---

## 0. The one rule that matters most

**Never state something on this site that is not true.**

This is a marketing site for a product that has **not launched**. There are no
published apps, no accounts, no support inbox, no analytics, no partnerships.
An earlier version of this site claimed all of those. That was fixed, and
undoing it would be a real harm — visitors act on what a site says.

Concretely, do not:

- link to a download or store listing that 404s,
- claim encryption, hosting regions, uptime, or data-retention periods,
- advertise job openings that do not exist,
- show "message sent" for a form that posts nowhere,
- invent statistics ("trusted by 45,000 businesses"),
- describe cookies the site does not set.

If a fact is not confirmed, it belongs in a config file behind a flag
(see section 5), not in page copy.

---

## 1. What this project is

A marketing website for **Vendly.lk**, an order-management product aimed at
Sri Lankan businesses that sell through Facebook and WhatsApp.

| | |
|---|---|
| Framework | Expo SDK 57 + Expo Router v57 |
| Language | TypeScript (strict mode) |
| UI library | React Native + `react-native-web` |
| Rendering | Static export — real HTML per route |
| 3D | `three` + `@react-three/fiber` (web only) |
| Verified on | Node v24.15.0, npm 11.12.1 |

**Expo 57 is recent and its API changed.** Read the versioned docs at
<https://docs.expo.dev/versions/v57.0.0/> before writing Expo code. Do not
copy patterns from older blog posts or tutorials.

### It is React Native, not HTML

This is the single biggest source of mistakes. Even though it ships as a
website, you write React Native components, not HTML.

```tsx
// CORRECT
import { View, Text } from 'react-native';

<View style={{ padding: 20 }}>
  <Text style={{ fontSize: 16 }}>Hello</Text>
</View>
```

```tsx
// WRONG — will not work in this project
<div style={{ padding: '20px' }}><p>Hello</p></div>
```

What follows from that:

- Every piece of text **must** sit inside a `<Text>`. A bare string inside a
  `<View>` throws.
- Styles are JavaScript objects using numbers, not CSS strings:
  `padding: 20`, never `padding: '20px'`.
- There is no cascade. Styles do not inherit — pass them explicitly.
- `flexDirection` defaults to `'column'`, not `'row'`.
- There is no CSS `:hover`. Use `onHoverIn` / `onHoverOut` with state.
- No `className`, no CSS files, no Tailwind.

---

## 2. Commands

```bash
npm install          # once
npm run web          # dev server with hot reload
npm run typecheck    # tsc --noEmit — must be clean before you finish
npm run build:web    # static export into dist/
node serve-dist.js   # serve dist/ on http://localhost:4174 like a real host
```

`serve-dist.js` exists because `python -m http.server` cannot map
`/legal/terms-of-service` to `legal/terms-of-service.html`, while real hosts
(Netlify, Vercel, CloudFront) can. Use it whenever you want to check a
production build rather than the dev server.

### Definition of done

A change is not finished until all four hold:

1. `npm run typecheck` reports zero errors.
2. `npm run build:web` completes.
3. The affected pages load with **no console errors**.
4. No claim was added to the site that is not true.

---

## 3. Layout of the code

```
app/                    ROUTES. The file path becomes the URL.
  _layout.tsx           loads fonts, wraps every page
  index.tsx             "/"          the long homepage
  get-app.tsx           "/get-app"   the 3D QR trees
  login.tsx signup.tsx
  legal/[slug].tsx      "/legal/terms-of-service", etc.
  resources/[slug].tsx
  company/[slug].tsx
  support/[slug].tsx
  solutions/[slug].tsx

src/
  config/company.ts     unconfirmed business facts   (see section 5)
  releases.ts           which downloads actually exist (see section 5)
  data.ts               homepage demo content
  data/contentPages.ts  all sub-page copy
  theme/tokens.ts       colours, fonts, radii, shadows
  theme/responsive.ts   useViewport(): isMobile, gutter, f()
  components/           reusable pieces
  sections/             homepage sections, in order top to bottom
  scroll/               scroll-position plumbing
```

`@/` is an alias for `src/`, so `import { color } from '@/theme/tokens'`.

### Adding a page

Create a file under `app/`. That is the entire routing step — the filename
becomes the URL. Then wrap the content in `ContentPage` so it inherits the
nav, footer, scroll animations and SEO tags:

```tsx
import { ContentPage } from '@/components/ContentPage';

export default function MyPage() {
  return (
    <ContentPage eyebrow="Company" title="My page" lede="One line underneath.">
      {/* your content */}
    </ContentPage>
  );
}
```

For a dynamic route (`[slug].tsx`) you must **also** export
`generateStaticParams` listing every slug, or the static build emits a single
literal `[slug].html` instead of real crawlable pages:

```tsx
export async function generateStaticParams(): Promise<Record<string, string>[]> {
  return ['first', 'second'].map((slug) => ({ slug }));
}
```

---

## 4. Conventions

**Use the design tokens.** Never hardcode a colour or a font name.

```tsx
import { color, font, radius, shadow } from '@/theme/tokens';

color.ink        // near-black surface
color.paper      // off-white page
color.accent     // brand blue
color.textMuted  // secondary text
font.displayBold // headings
font.body        // body copy
font.mono        // small uppercase labels
```

**Use `metrics()` for type.** It converts CSS-style ratios into the absolute
pixel values React Native requires:

```tsx
import { metrics } from '@/components/Type';

<Text style={[{ fontFamily: font.body, color: color.ink }, metrics(15, 1.6)]}>
// metrics(fontSize, lineHeightRatio, letterSpacingEm?)
```

**Responsive values** come from `useViewport()`, because React Native has no
CSS `clamp()`:

```tsx
const { isMobile, gutter, f } = useViewport();
f(20, 4, 40)   // equivalent to clamp(20px, 4vw, 40px)
```

**Scroll animation:** wrap a block in `<Reveal index={n}>`. `index` staggers
the entrance so items appear in sequence.

**Platform-specific files.** `Foo.web.tsx` is used on web; `Foo.tsx` on iOS and
Android. Anything touching `window`, `document` or WebGL needs this split, with
the native file exporting a harmless stand-in. TypeScript does not understand
the `.web` suffix, so **declare shared types in the plain `.tsx` file**, not the
`.web.tsx` one.

**Comments explain _why_, not _what_.** Match the density already in the files.
Do not narrate obvious code.

---

## 5. The two config files — read before touching any copy

### `src/config/company.ts`

Facts only the business owner can confirm. Each is wrapped in a `fact()`:

```ts
supportEmail: fact('support@vendly.lk'),   // confirmed: false by default
```

While `confirmed` is false, the UI **hides or softens** that claim on its own:
the contact channel is not listed, the contact form explains there is no inbox
yet, and the legal pages show a "Draft — pending legal review" banner.

To publish a fact, verify it is actually true, then pass `true`:

```ts
supportEmail: fact('support@vendly.lk', true),
```

`accountsLive` gates signup and sign-in. It is `false`, so those screens say so
plainly instead of silently discarding somebody's password.

### `src/releases.ts`

Which builds actually exist. All four are `available: false`, so the site shows
a "Soon" state rather than handing over a link that 404s.

```ts
windows: { available: false, url: '.../Vendly-Setup.exe' },
```

Flip one to `true` **only after** that target genuinely resolves. For the
desktop builds that means publishing a GitHub release whose asset is named
exactly `Vendly-Setup.exe` or `Vendly.dmg`. For iOS, first replace the
placeholder `id0000000000` with the real numeric App Store id Apple issues.

---

## 6. Traps that have already caused bugs here

**Hydration.** Static export renders in Node, where there is no `window`. Both
the server and the first client render start from `SSR_VIEWPORT` in
`src/theme/ViewportProvider.tsx`, then adopt the real size in a layout effect.
If you make render output depend on `window`, `Date.now()` or unseeded
randomness, you reintroduce React error #418. Randomness must be seeded — see
`makeRng` in `MagicTreeQR.web.tsx`.

**`body { overflow: hidden }`** is set by react-native-web. A page taller than
the viewport **will not scroll** unless its content sits in a `<ScrollView>`.
This silently hid every control on `/get-app`. Whenever you add tall content,
test it on a short window.

**QR contrast.** `MagicTreeQR.web.tsx` darkens the code modules as the tree
flattens so the result stays scannable (4.5:1 or better against the ground
plate). If you touch the palette, keep `scannable()` in the path — most of the
attractive colours land near 1.5:1, where the code silently stops working.

**Do not call a parent's `setState` from inside a `setState` updater.** It
raises "Cannot update a component while rendering a different component".
Compute the next value first, then call both setters.

**`Reveal` needs a viewport height.** A page must call `notify()` from its
ScrollView's `onLayout`, or short pages stay invisible until the user scrolls.

---

## 7. Voice of the copy

Plain, concrete, specific to Sri Lanka, never hypey. It names real things —
WhatsApp, COD, couriers, Nugegoda — and avoids startup vocabulary. Prices read
`Rs. 6,900`. The currency is LKR. Sri Lanka is UTC+05:30 all year. Sinhala and
Tamil are the official languages; English is the constitutional link language.

Write "Growth pricing is published before it is charged", not "affordable plans
for every business".

---

## 8. A good first task for a new assistant

Run `npm run typecheck`, then `npm run build:web`, then `node serve-dist.js`
and open <http://localhost:4174>. Click through `/get-app`, `/support/help` and
`/legal/terms-of-service`. That is the whole system in about five minutes.
