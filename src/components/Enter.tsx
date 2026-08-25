<<<<<<< HEAD
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';
import { useReducedMotion } from '@/theme/useReducedMotion';

/**
 * The hero's staggered entrance. Replaces the prototype's `vRise` / `vFade`
 * CSS keyframes with `animation-delay`.
 */
export function Enter({
  delay = 0,
  duration = 900,
  distance = 26,
  style,
  children,
}: {
  delay?: number;
  duration?: number;
  /** 0 fades only, matching `vFade`. */
  distance?: number;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(reduced ? 1 : 0)).current;

  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, duration, progress, reduced]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: distance
            ? [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }]
            : undefined,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
=======
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';
import { useReducedMotion } from '@/theme/useReducedMotion';

/**
 * The hero's staggered entrance. Replaces the prototype's `vRise` / `vFade`
 * CSS keyframes with `animation-delay`.
 */
export function Enter({
  delay = 0,
  duration = 900,
  distance = 26,
  style,
  children,
}: {
  delay?: number;
  duration?: number;
  /** 0 fades only, matching `vFade`. */
  distance?: number;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(reduced ? 1 : 0)).current;

  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, duration, progress, reduced]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: distance
            ? [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }]
            : undefined,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
>>>>>>> c1decb5f08ffdabb7df20508d93878b536a73e30
