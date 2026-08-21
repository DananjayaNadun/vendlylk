import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { color, font } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

/**
 * CSS expresses line-height as a ratio and letter-spacing in `em`. React Native
 * takes absolute pixels for both, so they are resolved against the font size.
 */
export function metrics(size: number, lineRatio: number, letterEm = 0): TextStyle {
  return {
    fontSize: size,
    lineHeight: Math.round(size * lineRatio * 100) / 100,
    letterSpacing: Math.round(size * letterEm * 1000) / 1000,
  };
}

type Props = TextProps & { style?: TextStyle | TextStyle[]; children: React.ReactNode };

/** clamp(38px, 5.6vw, 78px) / 0.98 / -0.042em */
export function H1({ style, children, ...rest }: Props) {
  const { f } = useViewport();
  return (
    <Text
      accessibilityRole="header"
      {...rest}
      style={[{ fontFamily: font.displayBold, color: color.white }, metrics(f(38, 5.6, 78), 0.98, -0.042), style]}
    >
      {children}
    </Text>
  );
}

/** clamp(30px, 4.4vw, 58px) / 1.02 / -0.038em */
export function H2({ style, children, ...rest }: Props) {
  const { f } = useViewport();
  return (
    <Text
      accessibilityRole="header"
      {...rest}
      style={[{ fontFamily: font.displayBold, color: color.text }, metrics(f(30, 4.4, 58), 1.02, -0.038), style]}
    >
      {children}
    </Text>
  );
}

/** clamp(26px, 3.4vw, 44px) / 1.04 / -0.035em */
export function H2Sub({ style, children, ...rest }: Props) {
  const { f } = useViewport();
  return (
    <Text
      accessibilityRole="header"
      {...rest}
      style={[{ fontFamily: font.displayBold, color: color.text }, metrics(f(26, 3.4, 44), 1.04, -0.035), style]}
    >
      {children}
    </Text>
  );
}

/** clamp(26px, 3.2vw, 42px) / 1.05 / -0.035em */
export function H2Compact({ style, children, ...rest }: Props) {
  const { f } = useViewport();
  return (
    <Text
      accessibilityRole="header"
      {...rest}
      style={[{ fontFamily: font.displayBold, color: color.text }, metrics(f(26, 3.2, 42), 1.05, -0.035), style]}
    >
      {children}
    </Text>
  );
}

/** clamp(20px, 1.8vw, 25px) / 1.15 / -0.028em */
export function H3({ style, children, ...rest }: Props) {
  const { f } = useViewport();
  return (
    <Text
      accessibilityRole="header"
      {...rest}
      style={[{ fontFamily: font.displayBold, color: color.text }, metrics(f(20, 1.8, 25), 1.15, -0.028), style]}
    >
      {children}
    </Text>
  );
}

/** 19px / 1.2 / -0.025em */
export function H3Small({ style, children, ...rest }: Props) {
  return (
    <Text
      accessibilityRole="header"
      {...rest}
      style={[{ fontFamily: font.displayBold, color: color.text }, metrics(19, 1.2, -0.025), style]}
    >
      {children}
    </Text>
  );
}

/** clamp(15.5px, 1.2vw, 18px) / 1.6 */
export function Lede({ style, children, ...rest }: Props) {
  const { f } = useViewport();
  return (
    <Text
      {...rest}
      style={[{ fontFamily: font.body, color: color.textMuted }, metrics(f(15.5, 1.2, 18), 1.6), style]}
    >
      {children}
    </Text>
  );
}

/** 15.5px / 1.6 — the fixed-size side paragraphs. */
export function Note({ style, children, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: font.body, color: color.textMuted }, metrics(15.5, 1.6), style]}
    >
      {children}
    </Text>
  );
}

/** Body copy at an explicit size. */
export function Body({
  size = 14.5,
  ratio = 1.55,
  style,
  children,
  ...rest
}: Props & { size?: number; ratio?: number }) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: font.body, color: color.text }, metrics(size, ratio), style]}
    >
      {children}
    </Text>
  );
}

/** IBM Plex Mono, uppercase, wide tracking — data labels and meta. */
export function Mono({
  size = 9.5,
  letter = 0.12,
  upper = true,
  medium = false,
  style,
  children,
  ...rest
}: Props & { size?: number; letter?: number; upper?: boolean; medium?: boolean }) {
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: medium ? font.monoMedium : font.mono,
          color: color.textFaint,
          textTransform: upper ? 'uppercase' : 'none',
        },
        metrics(size, 1.4, letter),
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export const textStyles = StyleSheet.create({
  onInk: { color: color.white },
  muted: { color: color.textMuted },
  faint: { color: color.textFaint },
});
