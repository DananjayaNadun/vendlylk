import React, { useRef } from 'react';
import { Animated, Easing, View, ViewStyle } from 'react-native';
import { useScroll, useScrollListener } from '@/scroll/ScrollProvider';
import { motion } from '@/theme/tokens';
import { useReducedMotion } from '@/theme/useReducedMotion';

/**
 * The web build used an IntersectionObserver with
 * `rootMargin: 0px 0px -10% 0px`. React Native has no such API, so the trigger
 * point is derived from the element's own position: it is measured once, then
 * compared against the live scroll offset. Rise 24px / fade over 820ms,
 * staggered 80ms by `index`, once.
 */
export function Reveal({
  index = 0,
  style,
  children,
}: {
  index?: number;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const { viewportHeight } = useScroll();
  const progress = useRef(new Animated.Value(reduced ? 1 : 0)).current;

  const ref = useRef<View | null>(null);
  /** Absolute y within the scroll content, resolved on first scroll tick. */
  const contentTop = useRef<number | null>(null);
  const measuring = useRef(false);
  const done = useRef(reduced);

  useScrollListener((y) => {
    if (done.current) return;

    if (contentTop.current == null) {
      if (measuring.current || !ref.current) return;
      measuring.current = true;
      ref.current.measureInWindow((_x, windowY) => {
        measuring.current = false;
        /* measureInWindow is viewport-relative; add the offset to get a stable
           content coordinate that stays valid as the page scrolls. */
        contentTop.current = windowY + y;
      });
      return;
    }

    const vh = viewportHeight.current || 0;
    if (vh === 0) return;

    /* The -10% bottom rootMargin: clear a tenth of the viewport to count. */
    if (contentTop.current > y + vh * 0.9) return;

    done.current = true;
    Animated.timing(progress, {
      toValue: 1,
      duration: motion.revealDuration,
      delay: index * motion.revealStagger,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  });

  if (reduced) return <View style={style}>{children}</View>;

  return (
    <Animated.View
      ref={ref as any}
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [motion.revealDistance, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
