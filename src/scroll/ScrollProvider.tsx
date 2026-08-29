import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { primeViewportTop, readViewportTop } from './measure';

type SectionId =
  | 'top'
  | 'reality'
  | 'transform'
  | 'keep-selling'
  | 'how-it-works'
  | 'storefront'
  | 'orders'
  | 'customers'
  | 'cod'
  | 'ai'
  | 'categories'
  | 'os'
  | 'outcomes'
  | 'pricing'
  | 'get-started'
  | 'resources';

type Listener = (y: number) => void;

type ScrollContextValue = {
  /** Latest scroll offset. Read from a listener, never during render. */
  offset: React.RefObject<number>;
  /** Height of the scroll viewport — the RN stand-in for `100vh`. */
  viewportHeight: React.RefObject<number>;
  subscribe: (listener: Listener) => () => void;
  /** Called by the page ScrollView on every scroll event. */
  publish: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Re-runs every listener at the current offset without a real scroll
      event — used right after the ScrollView reports its layout height, so
      Reveal doesn't stay stuck invisible on a page short enough that the
      user never has to scroll to see it. */
  notify: () => void;
  /** Sections hand over their node so their position can be read when needed. */
  registerSection: (id: SectionId, node: unknown) => void;
  scrollToSection: (id: SectionId) => void;
  scrollToTop: () => void;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useScroll(): ScrollContextValue {
  const value = useContext(ScrollContext);
  if (!value) throw new Error('useScroll must be used inside <ScrollProvider>');
  return value;
}

export type { SectionId };

/**
 * Scroll position is published straight from the ScrollView's `onScroll` to a
 * plain subscriber list.
 *
 * An earlier version routed this through `Animated.event` and derived every
 * scroll-linked style with `Animated.interpolate`. That added a layer between
 * the scroll event and the styles that was hard to reason about and did not
 * drive reliably on react-native-web. The prototype recomputed its scene
 * arithmetic on every scroll instead, so this does the same: listeners get the
 * raw offset and compute whatever they need from it.
 */
export function ScrollProvider({
  children,
  scrollRef,
}: {
  children: React.ReactNode;
  scrollRef: React.RefObject<ScrollView | null>;
}) {
  const offset = useRef(0);
  const viewportHeight = useRef(0);
  const sections = useRef<Partial<Record<SectionId, unknown>>>({});
  const listeners = useRef(new Set<Listener>());

  /**
   * `offset` updates synchronously on every raw scroll event — cheap, it's a
   * ref write. Notifying listeners is coalesced to one pass per animation
   * frame instead: there are ~25 of them (reveals, section registries, the
   * nav backdrop, the pinned scene), several doing a synchronous
   * `getBoundingClientRect()`. Raw scroll events can fire far more often than
   * once per frame — running every listener on every one of them is layout
   * thrashing, and it is what produced visible stutter and the nav backdrop
   * lagging behind the actual scroll position. rAF is a no-op while the tab
   * is hidden or backgrounded, which is correct there — nothing is being
   * painted, so nothing needs to update.
   */
  const frame = useRef<number | null>(null);

  const notify = useCallback(() => {
    if (frame.current != null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      listeners.current.forEach((listener) => listener(offset.current));
    });
  }, []);

  const publish = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      offset.current = event.nativeEvent.contentOffset.y;
      const layoutHeight = event.nativeEvent.layoutMeasurement?.height;
      if (layoutHeight) viewportHeight.current = layoutHeight;
      notify();
    },
    [notify],
  );

  const subscribe = useCallback((listener: Listener) => {
    listeners.current.add(listener);
    /* Fire once so a late subscriber matches the current position. */
    listener(offset.current);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  const registerSection = useCallback((id: SectionId, node: unknown) => {
    if (!node) return;
    sections.current[id] = node;
    primeViewportTop(node);
  }, []);

  const scrollToSection = useCallback(
    (id: SectionId) => {
      const node = sections.current[id];
      if (!node) return;
      /* Measured at click time rather than remembered from layout, so the jump
         is correct even after content above the section has changed height. */
      const top = readViewportTop(node);
      if (top == null) return;
      /* Offset by the fixed nav so section headings clear it. */
      scrollRef.current?.scrollTo({ y: Math.max(0, offset.current + top - 72), animated: true });
    },
    [scrollRef],
  );

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [scrollRef]);

  useEffect(
    () => () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const value = useMemo(
    () => ({
      offset,
      viewportHeight,
      subscribe,
      publish,
      notify,
      registerSection,
      scrollToSection,
      scrollToTop,
    }),
    [subscribe, publish, notify, registerSection, scrollToSection, scrollToTop],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

/** Subscribe to the scroll offset. Fires once on mount, then on every scroll. */
export function useScrollListener(handler: Listener) {
  const { subscribe } = useScroll();
  const callback = useRef(handler);
  callback.current = handler;

  useEffect(() => subscribe((y) => callback.current(y)), [subscribe]);
}
