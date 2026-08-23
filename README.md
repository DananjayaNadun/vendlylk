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
