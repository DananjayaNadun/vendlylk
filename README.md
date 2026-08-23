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
| SVG icons | `react-native-svg`. WhatsApp/YouTube paths copied verbatim; the X mark is the current bare glyph, replacing the circular twitter-era icon in the handoff |
| Hero background video | Platform-split: a real `<video>` (`muted`+`playsInline`+`autoplay`, `object-fit: cover`, CSS-keyframe Ken Burns) on web; `expo-video` on native |
| Element position for scroll maths | Read live from the node every scroll, never remembered from `onLayout` — see below |
| URL fragments (`#pricing`) | Sections register their offset; nav and footer call `scrollToSection` |
| `prefers-reduced-motion` | `useReducedMotion()` — media query on web, `AccessibilityInfo` on native |

The pinned scene's maths is a literal port. Every constant was diffed against
the prototype's `_tick()`, and the piecewise-linear `Animated` interpolation was
checked numerically against the original easing: **endpoints exact, opacity
within 0.0013, scale within 0.0016, translate within 0.55px** across a 430px
sweep.

## Verified

Measured in a real browser against the design spec, at 1440px and 390px:

- **Hero video** — playing, muted, looping, `object-fit: cover`, sized exactly to
  the hero (its visible overscale is the 1.04 Ken Burns, clipped by the section),
  with the 34s zoom running
- **The pinned transformation scene** — the stage pins at exactly `span × p` at
  every sample (0 / 630 / 1260 / 1890 / 2520 over a 2520px span), the rail
  tracks 0→100%, the OrderFlow window fades in across p 0.30–0.68 (0.89 at
  p = 0.5, matching the design's easing to two decimals), the chaos cards
  converge and blur (`blur(2.38px)` at p = 0.2 — exactly `blur(t*3)` under the
  same curve), and the last module chip lands at p = 1
- Type scale — h1 78px/0.98/−0.042em, h2 58px/1.02/−0.038em, and their fluid
  minimums (38px / 30px) at 390px
- Container 1320px, gutter 40px, section padding 148px
- Grid resolution — categories **428 / 874**, keep-selling **428 × 3**, matching
  the CSS build exactly
- Composition swap at 940px in both directions: nav menu vs. sheet, hero order
  card dropped, pinned scene vs. stacked
- Records tabs and the category picker, driven by real input
- Inventory meters at 18 / 72 / 3 / 88% in the design's gold, accent and danger
- Footer Support column is Help / Contact Support — no "Status" entry
- X icon is the single-path 24×24 glyph; the old circular version is gone
- All 10 font faces load and no others; 0 broken images
- No horizontal overflow at either width

## Two bugs worth knowing about

**`onLayout` is not a position.** react-native-web implements `onLayout` with a
`ResizeObserver`, which fires when an element's own size changes and *never*
when the element moves because content above it grew — a font swapping in, an
image sizing, a reveal expanding. Anything that remembered a `layout.y` offset
therefore drifted out of alignment, which is what made the pinned scene animate
against the wrong scroll origin. Section offsets and the scene's progress are
now read live from the node (`src/scroll/measure.ts` / `.web.ts`), exactly as
the design source read `getBoundingClientRect().top`.

**`Image.resolveAssetSource` does not exist on react-native-web.** It threw and
took the whole hero down with it. Bundled asset URLs come from `expo-asset` now.

## A follow-up round of fixes

A screen recording surfaced three problems the checks above didn't catch:

1. **Scroll stutter on the transformation section, and the headline text
   showing through the nav.** Both traced to one cause. Reintroducing
   `readViewportTop`-based measurement (see above) fixed correctness, but
   notifying all ~25 scroll listeners — several doing a synchronous
   `getBoundingClientRect()` — on every single raw scroll event is layout
   thrashing. Raw scroll events fire far more often than once per animation
   frame, so this hit two things: visible stutter, and the nav's backdrop
   opacity lagging behind the actual scroll position, letting the "Before" /
   "After" headline show through a not-yet-opaque nav. Fixed by coalescing
   listener notification to one pass per `requestAnimationFrame` in
   `ScrollProvider`, and — independently — giving the headline block enough
   top clearance to sit fully below the nav's 72px regardless of timing
   (`src/sections/Transformation.tsx`, `HEADS_TOP_CLEARANCE`).

   Verified with a burst of 200 raw scroll events dispatched synchronously: 56
   style mutations landed, not the ~5,000 that 25 listeners × 200 events would
   produce unthrottled — order-of-magnitude confirmation the coalescing works.
   The headline now measures 103px (kicker) / 134px (heading) from the top at
   the start of the section and 160px at the "After" state, both clear of the
   72px nav with margin.

2. **The outcomes list ("Less admin...") had one description out of line.**
   The description `Text` had `maxWidth: 380` and no flex-basis, so its box
   hugged its own content width — the title next to it (`flex: 1`) absorbed
   whatever space was left, which differed per row depending on how much text
   the description itself contained. Rows didn't share a column; they only
   looked aligned when the description texts happened to be similar lengths.
   Fixed with `flexBasis: 380, flexGrow: 0, flexShrink: 1` — a real fixed-width
   column, not a content-hugging one with a cap.

   Verified: all seven description strings now share the same `left` value.

## Category product preview

Clicking "Preview" in the Categories detail panel opens a centered overlay
showing that category's product image large, on a soft per-category tint
(`src/data.ts`, `previewTint` — a muted echo of the product's real-world
material colour, e.g. warm cream for the burger, cool blue-grey for the
headphones). A red circular "Go back" button floats over the card's bottom
corner to close it — matching a reference the user attached — and clicking
the dimmed backdrop or pressing Escape close it too.

Deliberately not full-bleed: the overlay is inset by exactly the nav's
72px height, so the nav stays fully visible and usable above it rather than
being covered — verified at both 1440px (560×560 panel) and 390px (shrinks
to 350×350, still fully on-screen, still clear of the nav).

Architecture note: the trigger lives deep inside the Categories section, but
the overlay has to render at the page level — sized against the real
viewport, stacked above the fixed nav, unaffected by the section's own
scroll position — so a small context (`src/preview/PreviewProvider.tsx`)
bridges the two, the same relationship `ScrollProvider` already has with
individual sections. The modal itself stays mounted a beat past the context
going back to `null` so its close animation has something to animate out;
unmounting immediately would just make it vanish with no transition.

Verified: the panel opens at exactly `top: 72` (nav height) with the correct
tint colour, closes via all three paths (backdrop tap, the red FAB, Escape),
and an initial "closing does nothing" reading turned out to be a broken test
assertion, not a real bug — it was checking for text that's also present in
the (still-visible-behind-the-backdrop) Categories panel, so it stayed true
whether or not the modal itself had actually closed. Confirmed via
`document.querySelector('[style*="z-index: 500"]')` returning null after
close instead, which is unambiguous.

## A branded scrollbar

There's no React Native style for this — scrollbar chrome is a browser-only
concept, reachable only through CSS (`::-webkit-scrollbar-*` for
Chromium/Safari, `scrollbar-color`/`scrollbar-width` for Firefox), so it's
web-only by nature. Injected as a `<style>` tag at startup
(`src/theme/globalScrollbar.web.ts`), the same pattern already used for the
hero video's Ken Burns keyframes; `globalScrollbar.ts` is a no-op on native,
where there's nothing to inject.

Design: a transparent track and a slim (10px, ~5px visible once inset) floating
pill thumb in the brand `accent` blue at partial opacity, darkening on hover
and further on active-drag. The track stays transparent rather than tokenised
to `paper`/`ink` because the page alternates between those two backgrounds as
you scroll and CSS can't react to which section is currently in view — accent
blue is a mid-saturation color that reads cleanly against both without needing
to know which one is current, and it doubles as a quiet, page-long echo of the
one accent color the design otherwise uses sparingly.

Getting it to render at all took one real fix: the main `ScrollView` (and the
two horizontal product/order tables) had `showsVerticalScrollIndicator={false}`
/ `showsHorizontalScrollIndicator={false}`, which react-native-web compiles to
`scrollbar-width: none` — hiding the scrollbar outright and silently
overriding the injected CSS. Flipped all three to `true`; the styling then
takes over the now-visible native scrollbar rather than fighting it.

Verified via DOM geometry rather than a screenshot (the test pane can't
render pixels): the page scroller's `offsetWidth − clientWidth` is exactly
10px, matching the configured width precisely — proof the scrollbar is
genuinely occupying rendered space, not just present in a stale computed
style. Same check on the Orders table at a narrow viewport (390px, where it
actually overflows: 902px of content in a 348px track) confirms the styling
reaches nested horizontal scrollers too, not just the page.

## The hero video was the wrong file, not a playback bug

The hero appeared to loop after only 5–6 seconds. It wasn't a playback
bug — the bundled `assets/video/hero-loop.mp4` genuinely was only 6.88s long.
Tracing it back: the very first HTML build copied
`uploads/video-1787280229481-dz69.mp4` from the Claude Design handoff bundle
— a short preview clip the design tool ships alongside the real asset — and
every later revision (including the React Native port) carried that same
file forward as if it were the intended hero background. It never was; the
actual marketing video (`Nested Sequence 01.mp4`, 1:39) lived in the user's
Resources folder the whole time and was never substituted in.

Swapped in the real file, but not raw: the source is 123MB at a 10.3 Mbps
average bitrate — an editor/camera export, not something any site would ship
to visitors as a decorative muted background loop (for comparison, the
placeholder clip it replaced, and most production hero videos, run
well under 1 Mbps). Transcoded with the `imageio-ffmpeg`-bundled ffmpeg:
H.264, CRF 26, audio stripped (the element is always muted, so the audio
track was pure dead weight), `+faststart` for progressive playback. Result:
**9.45MB for the full 99.25s loop, at 759 kb/s** — a ~13x reduction from the
raw source, with no visible quality loss given the design layers a saturation
filter and two dark gradient overlays on top of the video at all times.

Verified: `ffprobe` confirms `Duration: 00:01:39.25` on the shipped asset (not
6.88s), and a fresh page load followed by a 9-second wait showed the video's
`currentTime` advancing smoothly and continuously through — and well past —
the old 6.88s truncation point, with no restart.

## The bounce: root cause was React itself, not the measurement

A second recording, examined frame-by-frame (extracted at native ~29fps via
ffmpeg and cross-correlated to measure per-frame vertical shift), showed a
distinctive pattern at nearly every scroll: a burst of frames moving in the
scroll direction, then 1–3 frames moving noticeably *backward*, before
settling. That reversal never appeared in the page's ordinary (non-pinned)
sections in the same recording — only around the transformation scene —
which ruled out native scroll/OS momentum as the cause and pointed at
something specific to how the scene applied its own transform.

The mechanism: `readViewportTop` measures the true, current DOM position — no
staleness there — but the previous version stored the resulting progress in
React state (`setProgress`) and let JSX re-render every element from it. That
put React's render → commit → paint cycle on the critical path between "the
browser moved a pixel" and "the counter-transform reflects it." For a subtree
this size (6 chaos cards, 11 chips, the OrderFlow window, two headline
blocks), that cycle is reliably slower than a single scroll frame. Each tick,
the pinned stage would render at its *old* position for one frame — visible as
content sliding in the scroll direction, unpinning — then snap to correct once
React finally committed. That snap is the bounce.

Fixed by removing React state from the scroll path entirely. `PinnedScene` now
holds a ref per animated piece (the stage, the rail fill, both headline
blocks, each chaos card, the window, each chip) and writes styles straight to
the underlying node — `pose.web.ts` sets `node.style` directly (a
react-native-web `View` ref *is* the DOM node); `pose.ts` calls
`setNativeProps` for native. This is the standard "Direct Manipulation" escape
hatch documented for exactly this situation in the React Native docs: bypass
the reconciler for scroll-linked animation because reconciliation cannot keep
up with scroll. Since a render can still happen for unrelated reasons (a
window resize), the last-applied progress is kept in a ref and used as that
render's style baseline, with an effect that immediately re-syncs the DOM to
it — so an incidental re-render repaints the current position rather than
visibly resetting to the start.

Verified two ways:
- **The DOM updates with no extra settle time.** Dispatching one scroll event
  and checking the stage's transform after exactly one (mocked)
  `requestAnimationFrame` tick — no additional wait — already matches the
  exact expected value (`span × p`, e.g. 1512.39px at p=0.6 on a 2520px span).
  Previously this needed an indeterminate additional wait for React to commit.
- **React's own record of the style never changes.** Reading the stage node's
  React fiber props before and after a scroll shows `translateY(0px)`
  unchanged throughout, while the actual DOM `transform` moves to the correct
  value — direct proof the update bypasses React's reconciler completely, so
  there is no render/commit gap left for scroll to outrun.

## On testing scroll-linked behaviour in this environment

The browser pane used for testing runs hidden, where real
`requestAnimationFrame` never fires — a real constraint, not a workaround. The
fix above depends on rAF, so verifying it meant patching
`window.requestAnimationFrame` to a `setTimeout(fn, 0)` shim in the test script
itself (not in application code) before dispatching synthetic scroll events,
which is a valid test technique since the app looks up the global at call
time rather than capturing it at load. That is how the numbers above were
produced. Programmatic `scrollTo()` (used for nav/footer jump links) stayed
inert throughout — that one path is still unverified end-to-end, though the
destination it computes is correct.

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
- **The hero video is web-native, not `expo-video`.** `HeroVideo.web.tsx` uses a
  real `<video>`; `HeroVideo.tsx` keeps `expo-video` for iOS/Android. Same
  component name, resolved by platform.
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
