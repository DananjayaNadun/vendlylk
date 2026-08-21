/**
 * Design tokens from "Handoff notes.md".
 *
 * The web build expressed these as CSS custom properties; React Native has no
 * cascade, so they live here and are imported explicitly.
 */

export const color = {
  /* Surfaces */
  ink: '#0B0D12',
  inkRaised: '#12151D',
  paper: '#F7F6F3',
  paper2: '#FFFFFF',
  paper3: '#FBFAF8',
  wash: '#F2F1EE',
  paperNote: '#FFFDF5',
  rowSelected: '#F8FAFF',
  phoneShell: '#1A1D26',

  /* Accent */
  accent: '#2B4CF2',
  accentHover: '#1B3AD8',
  accentWash: '#EEF1FF',
  accentLight: '#6E85FF',

  /* Text */
  text: '#0B0D12',
  textSoft: '#3C4150',
  textMuted: '#5C6273',
  textFaint: '#8A8F9E',
  textDim: '#A6A9B4',

  /* Hairlines */
  line: 'rgba(11,13,18,0.08)',
  lineSoft: 'rgba(11,13,18,0.055)',
  lineStrong: 'rgba(11,13,18,0.10)',
  lineInk: 'rgba(255,255,255,0.10)',

  /* Semantic */
  success: '#0B7A5A',
  successWash: '#E7F6EE',
  caution: '#8A5A12',
  cautionWash: '#FDF3E7',
  danger: '#B4451A',
  dangerWash: '#FBEAE3',
  live: '#12A97B',
  gold: '#C98A2B',
  goldLight: '#E4C77A',

  /* On-ink text ramp */
  white: '#FFFFFF',
  white86: 'rgba(255,255,255,0.86)',
  white82: 'rgba(255,255,255,0.82)',
  white80: 'rgba(255,255,255,0.80)',
  white74: 'rgba(255,255,255,0.74)',
  white72: 'rgba(255,255,255,0.72)',
  white70: 'rgba(255,255,255,0.70)',
  white62: 'rgba(255,255,255,0.62)',
  white60: 'rgba(255,255,255,0.60)',
  white55: 'rgba(255,255,255,0.55)',
  white50: 'rgba(255,255,255,0.50)',
  white45: 'rgba(255,255,255,0.45)',
  white42: 'rgba(255,255,255,0.42)',
  white40: 'rgba(255,255,255,0.40)',
  white38: 'rgba(255,255,255,0.38)',
  white36: 'rgba(255,255,255,0.36)',
  white35: 'rgba(255,255,255,0.35)',
  white34: 'rgba(255,255,255,0.34)',
  white20: 'rgba(255,255,255,0.20)',
  white16: 'rgba(255,255,255,0.16)',
  white14: 'rgba(255,255,255,0.14)',
  white12: 'rgba(255,255,255,0.12)',
  white09: 'rgba(255,255,255,0.09)',
  white08: 'rgba(255,255,255,0.08)',
  white07: 'rgba(255,255,255,0.07)',
  white06: 'rgba(255,255,255,0.06)',
  white05: 'rgba(255,255,255,0.05)',
  white04: 'rgba(255,255,255,0.04)',
} as const;

/**
 * React Native selects a face by family name, not by `font-weight`, so each
 * weight the design uses is loaded and named separately.
 */
export const font = {
  display: 'SchibstedGrotesk_400Regular',
  displayMedium: 'SchibstedGrotesk_500Medium',
  displaySemi: 'SchibstedGrotesk_600SemiBold',
  displayBold: 'SchibstedGrotesk_700Bold',
  displayExtra: 'SchibstedGrotesk_800ExtraBold',
  body: 'IBMPlexSans_400Regular',
  bodyMedium: 'IBMPlexSans_500Medium',
  bodySemi: 'IBMPlexSans_600SemiBold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
} as const;

/** Layout geometry. */
export const layout = {
  container: 1320,
  /** The one real breakpoint: below this the compositions genuinely differ. */
  breakpoint: 940,
  navHeight: 72,
} as const;

/** Radii, per the handoff's geometry scale. */
export const radius = {
  badge: 6,
  chip: 8,
  control: 12,
  card: 18,
  panel: 20,
  phone: 40,
  pill: 100,
} as const;

/**
 * Long, soft, low-opacity elevation — used only on floating product UI.
 * React Native cannot express a negative spread, so on native this degrades to
 * the closest equivalent; on web react-native-web emits the real box-shadow.
 */
export const shadow = {
  panel: {
    boxShadow: '0 40px 80px -50px rgba(11,13,18,0.5)',
    elevation: 12,
  },
  panelSoft: {
    boxShadow: '0 40px 80px -55px rgba(11,13,18,0.5)',
    elevation: 10,
  },
  chatPanel: {
    boxShadow: '0 40px 80px -50px rgba(11,13,18,0.45)',
    elevation: 10,
  },
  scrap: {
    boxShadow: '0 18px 36px -28px rgba(11,13,18,0.4)',
    elevation: 4,
  },
  chaos: {
    boxShadow: '0 24px 50px -26px rgba(0,0,0,0.7)',
    elevation: 8,
  },
  sceneWindow: {
    boxShadow: '0 60px 120px -40px rgba(0,0,0,0.85)',
    elevation: 18,
  },
  orderCard: {
    boxShadow: '0 40px 90px -40px rgba(0,0,0,0.9)',
    elevation: 14,
  },
  orderCardInner: {
    boxShadow: '0 20px 40px -24px rgba(0,0,0,0.6)',
    elevation: 6,
  },
  orderChat: {
    boxShadow: '0 24px 50px -20px rgba(0,0,0,0.55)',
    elevation: 8,
  },
  phone: {
    boxShadow: '0 60px 110px -40px rgba(0,0,0,0.9)',
    elevation: 18,
  },
  mega: {
    boxShadow: '0 40px 80px -30px rgba(0,0,0,0.8)',
    elevation: 16,
  },
  stackPanel: {
    boxShadow: '0 40px 70px -40px rgba(0,0,0,0.9)',
    elevation: 12,
  },
  ctaPrimary: {
    boxShadow: '0 18px 40px -18px rgba(43,76,242,0.95)',
    elevation: 8,
  },
  ctaPrimaryLarge: {
    boxShadow: '0 20px 44px -18px rgba(43,76,242,0.95)',
    elevation: 8,
  },
  navCta: {
    boxShadow: '0 8px 22px -10px rgba(43,76,242,0.9)',
    elevation: 6,
  },
} as const;

/** Motion, matching the prototype's easing and durations. */
export const motion = {
  /** cubic-bezier(0.22, 1, 0.36, 1) */
  easeOutQuint: (t: number) => 1 - Math.pow(1 - t, 3),
  revealDuration: 820,
  revealStagger: 80,
  revealDistance: 24,
} as const;
