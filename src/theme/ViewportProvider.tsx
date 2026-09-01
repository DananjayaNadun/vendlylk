import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

type Size = { width: number; height: number };

const ViewportContext = createContext<Size | null>(null);

/**
 * The viewport both the static export and the first client render assume.
 *
 * Static rendering runs in Node, where react-native-web's Dimensions has no
 * DOM to measure and reports 0x0 — every `clamp()` collapses to its minimum
 * and the whole page is emitted in its mobile composition. Seeding from the
 * real window on the client then produced different markup than the server
 * had sent, which is React hydration error #418.
 *
 * Both sides now start from this fixed desktop size, so the HTML that ships
 * to crawlers is the desktop layout and the first client render matches it
 * exactly. The real size is adopted in a layout effect below, before the
 * browser paints, so there is no visible snap.
 */
const SSR_VIEWPORT: Size = { width: 1280, height: 800 };

/** `useLayoutEffect` warns when run during server rendering; there is no
    layout to read there anyway, so it degrades to `useEffect`. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Measures the app root and publishes its size.
 *
 * `onLayout` is the authority once it fires — it reports the real measured
 * size and behaves identically on iOS and Android. But it depends on a
 * ResizeObserver callback that isn't guaranteed to fire promptly (or at all,
 * on some hosts) after first paint, and the seed taken from
 * `useWindowDimensions()` at mount can itself be wrong for one frame during
 * hydration. Without a second path, a bad seed sticks forever: every
 * `clamp()` pins to its minimum and the whole app renders its mobile
 * composition regardless of actual width. The effect below re-syncs from the
 * live window size whenever it changes, so a resize (or a hook that only
 * settles a tick after mount) still corrects things even if onLayout never
 * runs. onLayout, when it does fire, still wins — it is strictly more
 * accurate than the window size for a component that may not fill it.
 */
export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const window = useWindowDimensions();
  const [size, setSize] = useState<Size>(SSR_VIEWPORT);

  useIsomorphicLayoutEffect(() => {
    if (window.width <= 0 || window.height <= 0) return;
    setSize((prev) =>
      Math.abs(prev.width - window.width) > 0.5 || Math.abs(prev.height - window.height) > 0.5
        ? { width: window.width, height: window.height }
        : prev,
    );
  }, [window.width, window.height]);

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width <= 0 || height <= 0) return;
        setSize((prev) =>
          Math.abs(prev.width - width) > 0.5 || Math.abs(prev.height - height) > 0.5
            ? { width, height }
            : prev,
        );
      }}
    >
      <ViewportContext.Provider value={size}>{children}</ViewportContext.Provider>
    </View>
  );
}

/** Falls back to the window size when rendered outside a provider, and to the
    shared SSR size when there is no DOM to measure at all. */
export function useViewportSize(): Size {
  const measured = useContext(ViewportContext);
  const window = useWindowDimensions();
  if (measured && measured.width > 0) return measured;
  if (window.width > 0) return { width: window.width, height: window.height };
  return SSR_VIEWPORT;
}
