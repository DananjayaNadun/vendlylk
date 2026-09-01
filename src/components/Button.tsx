import React, { useRef } from 'react';
import { Animated, Easing, Pressable, Text, View, ViewStyle } from 'react-native';
import { color, font, radius, shadow } from '@/theme/tokens';
import { metrics } from './Type';

type Variant = 'primary' | 'ghostInk' | 'quiet' | 'plain';
type Size = 'base' | 'sm' | 'lg';

/**
 * CSS `:hover` with a 200ms transition has no React Native equivalent —
 * Pressable's hover callbacks drive an Animated value instead. The callbacks
 * are inert on touch platforms, which is the correct behaviour there.
 */
function useHover(enabled = true) {
  const value = useRef(new Animated.Value(0)).current;
  const to = (toValue: number) =>
    Animated.timing(value, {
      toValue,
      duration: 200,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();

  return {
    value,
    handlers: enabled
      ? { onHoverIn: () => to(1), onHoverOut: () => to(0) }
      : {},
  };
}

const PAD: Record<Size, { paddingVertical: number; paddingHorizontal: number; fontSize: number; radius: number }> = {
  base: { paddingVertical: 16, paddingHorizontal: 26, fontSize: 15.5, radius: radius.control },
  sm: { paddingVertical: 14, paddingHorizontal: 22, fontSize: 15, radius: radius.control },
  lg: { paddingVertical: 17, paddingHorizontal: 30, fontSize: 16, radius: 13 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'base',
  arrow = false,
  play = false,
  block = false,
  disabled = false,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  play?: boolean;
  block?: boolean;
  /** Renders dimmed and inert, and stops the hover lift — used where a
      feature is genuinely not available yet rather than merely failing. */
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const { value, handlers } = useHover();
  const pad = PAD[size];

  const base: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: block ? 'center' : 'flex-start',
    alignSelf: block ? 'stretch' : 'flex-start',
    gap: play ? 12 : 10,
    borderRadius: pad.radius,
    paddingVertical: block ? 15 : pad.paddingVertical,
    paddingHorizontal: block ? 15 : pad.paddingHorizontal,
  };

  const skin: Record<Variant, ViewStyle> = {
    primary: {
      backgroundColor: color.accent,
      ...(size === 'lg' ? shadow.ctaPrimaryLarge : size === 'sm' ? {} : shadow.ctaPrimary),
    },
    ghostInk: {
      backgroundColor: color.white07,
      borderWidth: 1,
      borderColor: color.white20,
    },
    quiet: {
      backgroundColor: color.paper,
      borderWidth: 1,
      borderColor: 'rgba(11,13,18,0.12)',
    },
    plain: {},
  };

  const hoverBg = value.interpolate({
    inputRange: [0, 1],
    outputRange: [
      variant === 'primary' ? color.accent : variant === 'ghostInk' ? color.white07 : color.paper,
      variant === 'primary' ? color.accentHover : variant === 'ghostInk' ? color.white14 : '#EFEEEA',
    ],
  });

  const labelColor =
    variant === 'quiet' ? color.ink : variant === 'plain' ? color.accent : color.white;

  const weight = variant === 'ghostInk' && size === 'base' ? font.bodyMedium : font.bodySemi;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      {...(disabled ? {} : handlers)}
      style={style}
    >
      <Animated.View
        style={[
          base,
          skin[variant],
          {
            backgroundColor: variant === 'plain' ? 'transparent' : hoverBg,
            opacity: disabled ? 0.5 : 1,
            transform: [
              { translateY: disabled ? 0 : value.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
            ],
            ...(play ? { paddingLeft: 16, paddingRight: 22, paddingVertical: 15 } : null),
          },
        ]}
      >
        {play ? (
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: color.white,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 2,
            }}
          >
            <Text style={{ color: color.ink, fontSize: 9 }}>▶</Text>
          </View>
        ) : null}

        <Text style={[{ fontFamily: weight, color: labelColor }, metrics(pad.fontSize, 1.2)]}>
          {label}
        </Text>

        {arrow ? (
          <Text style={{ color: labelColor, fontSize: pad.fontSize, opacity: 0.8 }}>→</Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

/** Text link with a trailing arrow — the "Talk to us" style. */
export function LinkArrow({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={[{ fontFamily: font.bodySemi, color: color.accent }, metrics(14.5, 1.4)]}>
          {label}
        </Text>
        <Text style={{ color: color.accent, fontSize: 14.5 }}>→</Text>
      </View>
    </Pressable>
  );
}

export { useHover };
