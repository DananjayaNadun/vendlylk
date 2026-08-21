import React, { useCallback, useRef } from 'react';
import { Animated, Easing, View, ViewStyle } from 'react-native';
import { useScroll, useScrollListener } from '@/scroll/ScrollProvider';
import { readViewportTop } from '@/scroll/measure';
import { motion } from '@/theme/tokens';
import { useReducedMotion } from '@/theme/useReducedMotion';

/**
 * The web build used an IntersectionObserver with
 * `rootMargin: 0px 0px -10% 0px`. React Native has no such API, so the same
 * trigger is derived from the element's live position: it counts as visible
 * once its top clears the bottom tenth of the viewport. Rise 24px / fade over
 * 820ms, staggered 80ms by `index`, once.
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
  const node = useRef<View | null>(null);
  const done = useRef(reduced);

  useScrollListener(
    useCallback(() => {
      if (done.current) return;

      const top = readViewportTop(node.current);
      if (top == null) return;

      const vh = viewportHeight.current || 0;
      if (vh === 0) return;

      /* The -10% bottom rootMargin. */
      if (top > vh * 0.9) return;

      done.current = true;
      Animated.timing(progress, {
        toValue: 1,
        duration: motion.revealDuration,
        delay: index * motion.revealStagger,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    }, [index, progress, viewportHeight]),
  );

  if (reduced) {
    return (
      <View ref={node} style={style}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View
      ref={node as any}
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
