# Vendly OrderFlow

The Vendly OrderFlow marketing page, built as an **Expo / React Native** app and
exported to a static web bundle for Vercel. Design source: `Vendly OrderFlow.dc.html`
from the Claude Design handoff, plus its `Site Nav` and `Site Footer` components.

The components are genuine React Native (`View` / `Text` / `StyleSheet` /
`Pressable` / `Animated`), so the same code can target iOS and Android — see
[Native status](#native-status).

## Commands

```bash
npm run web
```

| Script | What it does |
|---|---|
| `npm run web` | Dev server in the browser |
| `npm run build:web` | Static export to `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run ios` / `npm run android` | Native dev builds |

## Deploying to Vercel

`vercel.json` is set up — point Vercel at the repo and it will run
`npx expo export --platform web --output-dir dist` and serve `dist/`. No
dashboard configuration needed. It also adds immutable cache headers for
`/_expo/static` and `/assets`, and rewrites unknown paths to `/` because the
export is a single-page bundle.

## Structure

```
app/
  _layout.tsx           Font loading, root layout
  index.tsx             Page shell: ScrollView + the 16 sections + fixed nav
src/
  theme/tokens.ts       Every value from the handoff's token table
  theme/responsive.ts   fluid() — the clamp() replacement — and auto-fit maths
  theme/ViewportProvider.tsx  Measures the app root; the layout authority
  theme/useReducedMotion.ts
  scroll/ScrollProvider.tsx   Scroll offset, section registry, scroll-to-section
  components/           Layout primitives, Type, Button, UI, Reveal, Enter, icons
  sections/             One file per page section
  data.ts               Copy and table data
assets/                 Brand marks, icons, product shots, hero video
legacy-static/          The earlier HTML/CSS build, kept as the fidelity reference
_import/                Original handoff bundle — reference only, not deployed
```

## How the CSS design was translated

React Native has no cascade, no CSS grid, no `clamp()`, no `position: sticky`,
no pseudo-elements and no `:hover`. Each of those needed a real replacement:

| Design feature | React Native implementation |
|---|---|
| `clamp(min, Nvw, max)` type and spacing | `fluid(width, min, vw, max)` computed from the measured viewport |
| `grid-template-columns: repeat(auto-fit, minmax(N, 1fr))` | `<AutoGrid minItemWidth gap spans>` — fits tracks, then **collapses empty ones** like `auto-fit`, which is what gives the categories panel its 1 + 2 split |
| `grid-column: span 2` | `spans={[1, 2]}` on `AutoGrid` |
| `position: sticky` + 380vh scene | A 3.8×viewport section with an absolutely-positioned stage whose `translateY` tracks scroll |
| IntersectionObserver reveals | `<Reveal>` measures once, then compares against the live scroll offset |
| `::before` / CSS counters | Real `View`/`Text` elements; numbers come from the data |
| `:hover` + transition | `Pressable` `onHoverIn`/`onHoverOut` driving `Animated` (inert on touch) |
| `backdrop-filter` nav glass | An `Animated` opacity cross-fade over an ink panel |
| linear gradients | `expo-linear-gradient` |
| `radial-gradient` (hero vignette, CTA glow) | Approximated with the equivalent directional ramp — RN has no radial gradient |
| SVG icons | `react-native-svg`, path data copied verbatim |
| URL fragments (`#pricing`) | Sections register their offset; nav and footer call `scrollToSection` |
| `prefers-reduced-motion` | `useReducedMotion()` — media query on web, `AccessibilityInfo` on native |

The pinned scene's maths is a literal port. Every constant was diffed against
the prototype's `_tick()`, and the piecewise-linear `Animated` interpolation was
checked numerically against the original easing: **endpoints exact, opacity
within 0.0013, scale within 0.0016, translate within 0.55px** across a 430px
sweep.

## Verified

Measured in a real browser against the design spec, at 1440px and 390px:

- Type scale — h1 78px/0.98/−0.042em, h2 58px/1.02/−0.038em, and their fluid
  minimums (38px / 30px) at 390px
- Container 1320px, gutter 40px, section padding 148px
- Grid resolution — categories **428 / 874**, keep-selling **428 × 3**, matching
  the CSS build exactly
- Composition swap at 940px in both directions: nav menu vs. sheet, hero order
  card dropped, pinned scene vs. stacked
- Records tabs and the category picker, driven by real input
- Inventory meters at 18 / 72 / 3 / 88% in the design's gold, accent and danger
- All 10 font faces load and no others; 0 broken images; hero video plays
- No horizontal overflow at either width
- Accessibility surface: 17 buttons, 38 links, 27 headings, `tablist` with
  `aria-selected`, `aria-pressed` on the category picker

## Not verified here

**Scroll-linked animation was never exercised.** The pinned transformation
scene, the section reveals and the nav's glass backdrop are all driven by scroll
events, and react-native-web throttles `onScroll` with `requestAnimationFrame`.
The browser pane used for testing runs hidden (`document.hidden === true`), where
rAF is fully paused — 0 frames in 600ms. The geometry is confirmed correct (the
scene resolves to 3420px over a 900px viewport, span 2520 — the same numbers as
the CSS build) and the maths is confirmed faithful, but the motion itself needs a
look in a real browser: `npm run web`, then scroll through the dark section after
"The current reality".

## Tradeoffs of this stack

Worth knowing, since these follow from React Native Web rather than from the design:

- **No server-rendered HTML.** The export is a single-page bundle
  (`web.output: "single"`). Content is rendered client-side, so crawlers that
  don't execute JS see an empty shell. This was deliberate: the layout is
  entirely viewport-driven, and prerendering would bake in a wrong viewport and
  reflow on hydration. If SEO matters more than that, Next.js is the better host
  for this design.
- **1.4MB JS bundle** (before gzip) for a marketing page, versus ~85KB of CSS+JS
  in `legacy-static/`. That is the React Native Web runtime.
- **The radial gradients are approximations.** Two of them — the hero's left
  vignette and the CTA glow.
- `useWindowDimensions()` proved unreliable under react-native-web here: it
  reported a stale size and missed resizes, which pinned every fluid value to its
  minimum and flipped the desktop layout into its mobile composition. The app
  measures its own root instead (`ViewportProvider`) and treats the window size
  only as a first-paint seed.

## Native status

The components are platform-neutral and `npm run ios` / `npm run android`
will build, but **the native targets have not been run or laid out**. The scroll
scene, hover states and gradients all have native code paths; they need a device
pass before anyone ships them.

## Not built

Two sibling pages from the handoff were never in scope and do not exist:
`Vendly Storefront.dc.html` and `COD Reliability.dc.html`. In the web build
those links pointed at `storefront.html` / `cod-reliability.html`; here the nav,
footer and body links scroll to the matching on-page sections instead, so
nothing dead-ends.
