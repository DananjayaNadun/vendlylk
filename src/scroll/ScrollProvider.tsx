import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { Animated, ScrollView } from 'react-native';

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

type ScrollContextValue = {
  /** Live scroll offset of the page ScrollView. */
  scrollY: Animated.Value;
  /** Height of the scroll viewport — the RN stand-in for `100vh`. */
  viewportHeight: React.RefObject<number>;
  /** Sections report their content offset here so the nav can jump to them. */
  registerSection: (id: SectionId, y: number) => void;
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

export function ScrollProvider({
  children,
  scrollRef,
}: {
  children: React.ReactNode;
  scrollRef: React.RefObject<ScrollView | null>;
}) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const viewportHeight = useRef(0);
  const sections = useRef<Partial<Record<SectionId, number>>>({});

  const registerSection = useCallback((id: SectionId, y: number) => {
    sections.current[id] = y;
  }, []);

  const scrollToSection = useCallback(
    (id: SectionId) => {
      const y = sections.current[id];
      if (y == null) return;
      /* Offset by the fixed nav so section headings are not hidden under it. */
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 72), animated: true });
    },
    [scrollRef],
  );

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [scrollRef]);

  const value = useMemo(
    () => ({ scrollY, viewportHeight, registerSection, scrollToSection, scrollToTop }),
    [scrollY, registerSection, scrollToSection, scrollToTop],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

/**
 * Subscribe to the numeric scroll offset, coalesced to one callback per frame.
 * Used by the pinned transformation scene, which needs a real number rather
 * than an Animated node because its maths is not a linear interpolation.
 */
export function useScrollListener(handler: (y: number) => void) {
  const { scrollY } = useScroll();
  const frame = useRef<number | null>(null);
  const latest = useRef(0);
  const cb = useRef(handler);
  cb.current = handler;

  React.useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      latest.current = value;
      if (frame.current != null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        cb.current(latest.current);
      });
    });
    /* Fire once so first paint reflects the current position. */
    cb.current(latest.current);
    return () => {
      scrollY.removeListener(id);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [scrollY]);
}
