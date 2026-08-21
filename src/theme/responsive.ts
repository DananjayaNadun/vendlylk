import { useMemo } from 'react';
import { layout } from './tokens';
import { useViewportSize } from './ViewportProvider';

/**
 * CSS `clamp(min, Nvw, max)` has no React Native equivalent — the whole type
 * scale and most spacing in this design is fluid, so it is computed here from
 * the live viewport width instead.
 *
 *   clamp(38px, 5.6vw, 78px)  ->  fluid(width, 38, 5.6, 78)
 */
export function fluid(width: number, min: number, vw: number, max: number): number {
  return Math.min(max, Math.max(min, (width * vw) / 100));
}

/** `clamp(min, Nvh, max)` — used for a couple of vertical rhythms. */
export function fluidV(height: number, min: number, vh: number, max: number): number {
  return Math.min(max, Math.max(min, (height * vh) / 100));
}

export type Viewport = {
  width: number;
  height: number;
  /** Below 940px the nav, hero and transformation sections swap composition. */
  isMobile: boolean;
  isDesktop: boolean;
  /** Horizontal page gutter: clamp(20px, 4vw, 40px) */
  gutter: number;
  /** Vertical section padding: clamp(72px, 11vw, 148px) */
  sectionY: number;
  /** Width available inside the 1320px container, after gutters. */
  contentWidth: number;
  /** Resolve a fluid value against the current width. */
  f: (min: number, vw: number, max: number) => number;
};

export function useViewport(): Viewport {
  const { width, height } = useViewportSize();

  return useMemo(() => {
    const gutter = fluid(width, 20, 4, 40);
    const sectionY = fluid(width, 72, 11, 148);
    const contentWidth = Math.min(layout.container, width - gutter * 2);

    return {
      width,
      height,
      isMobile: width <= layout.breakpoint,
      isDesktop: width > layout.breakpoint,
      gutter,
      sectionY,
      contentWidth,
      f: (min: number, vw: number, max: number) => fluid(width, min, vw, max),
    };
  }, [width, height]);
}

/**
 * Reproduces `grid-template-columns: repeat(auto-fit, minmax(min, 1fr))`.
 *
 * CSS fits as many `min`-wide tracks as will go, then distributes the leftover
 * space equally. Empty tracks collapse, which is what lets a `span 2` child sit
 * beside a single-track child at wide widths.
 */
export function autoFitColumns(
  available: number,
  minItemWidth: number,
  gap: number,
): number {
  if (available <= 0) return 1;
  return Math.max(1, Math.floor((available + gap) / (minItemWidth + gap)));
}

/** Width of one track in an auto-fit grid. */
export function trackWidth(available: number, columns: number, gap: number): number {
  return (available - gap * (columns - 1)) / columns;
}
