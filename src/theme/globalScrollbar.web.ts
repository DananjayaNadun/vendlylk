import { color } from './tokens';

/**
 * A branded scrollbar for the web build.
 *
 * There is no React Native style prop for this — scrollbars are a browser
 * chrome detail, reachable only through CSS pseudo-elements
 * (`::-webkit-scrollbar-*`) and the `scrollbar-color`/`scrollbar-width`
 * properties Firefox uses instead. Injected as a `<style>` tag at startup,
 * the same pattern `HeroVideo.web.tsx` already uses for the hero's Ken Burns
 * keyframes — idempotent, so Fast Refresh during development never
 * duplicates it.
 *
 * The track is transparent rather than tokenised to `paper`/`ink`: the page
 * alternates between those two backgrounds as you scroll, and CSS scrollbar
 * styling can't react to which section happens to be in view. The thumb uses
 * `accent` at partial opacity instead — a mid-saturation color reads cleanly
 * against both without needing to know which background is current, and it
 * doubles as a quiet, page-long reminder of the one accent the design
 * otherwise uses sparingly.
 */
const STYLE_ID = 'vendly-global-scrollbar';

function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function injectGlobalScrollbar(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const thumb = withAlpha(color.accent, 0.4);
  const thumbHover = withAlpha(color.accent, 0.65);
  const thumbActive = withAlpha(color.accentHover, 0.85);

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    * {
      scrollbar-width: thin;
      scrollbar-color: ${thumb} transparent;
    }
    *::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    *::-webkit-scrollbar-track {
      background: transparent;
    }
    *::-webkit-scrollbar-corner {
      background: transparent;
    }
    *::-webkit-scrollbar-thumb {
      background-color: ${thumb};
      border-radius: 100px;
      border: 2.5px solid transparent;
      background-clip: content-box;
      transition: background-color 160ms ease;
    }
    *::-webkit-scrollbar-thumb:hover {
      background-color: ${thumbHover};
    }
    *::-webkit-scrollbar-thumb:active {
      background-color: ${thumbActive};
    }
  `;
  document.head.appendChild(style);
}
