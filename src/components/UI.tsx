<<<<<<< HEAD
import React from 'react';
import { Image, ImageSourcePropType, Text, View, ViewStyle } from 'react-native';
import { color, font, radius } from '@/theme/tokens';
import { metrics } from './Type';

export type BadgeTone = 'accent' | 'success' | 'caution' | 'neutral' | 'danger';

const BADGE_TONE: Record<BadgeTone, { fg: string; bg: string }> = {
  accent: { fg: color.accentHover, bg: color.accentWash },
  success: { fg: color.success, bg: color.successWash },
  caution: { fg: color.caution, bg: color.cautionWash },
  neutral: { fg: color.textSoft, bg: color.wash },
  danger: { fg: color.danger, bg: color.dangerWash },
};

/** 11.5px/600, 5x10 padding, radius 6, semantic wash background. */
export function Badge({
  label,
  tone = 'accent',
  small = false,
  style,
}: {
  label: string;
  tone?: BadgeTone;
  small?: boolean;
  style?: ViewStyle;
}) {
  const skin = BADGE_TONE[tone];
  return (
    <View
      style={[
        {
          backgroundColor: skin.bg,
          borderRadius: radius.badge,
          paddingVertical: small ? 4 : 5,
          paddingHorizontal: small ? 8 : 10,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text
        style={[
          { fontFamily: font.bodySemi, color: skin.fg, textAlign: 'center' },
          metrics(small ? 11 : 11.5, 1.35),
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/** Pill chip — customer traits. */
export function Chip({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: color.paper,
        borderRadius: radius.pill,
        paddingVertical: 6,
        paddingHorizontal: 11,
      }}
    >
      <Text style={[{ fontFamily: font.bodyMedium, color: color.textSoft }, metrics(11.5, 1.4)]}>
        {label}
      </Text>
    </View>
  );
}

/** Accent dot + mono label that opens most sections. */
export function Eyebrow({
  label,
  tone = 'paper',
  center = false,
  style,
}: {
  label: string;
  tone?: 'paper' | 'ink';
  center?: boolean;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: center ? 10 : 12,
          marginBottom: center ? 24 : 22,
          alignSelf: center ? 'center' : 'flex-start',
        },
        style,
      ]}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color.accent }} />
      <Text
        style={[
          {
            fontFamily: font.mono,
            color: tone === 'ink' ? color.white50 : color.textMuted,
            textTransform: 'uppercase',
          },
          metrics(11, 1.4, 0.16),
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/** Thin progress meter — inventory levels and the COD reliability score. */
export function Meter({
  fraction,
  fill,
  track = color.wash,
  height = 6,
}: {
  fraction: number;
  fill: string;
  track?: string;
  height?: number;
}) {
  return (
    <View
      style={{
        height,
        borderRadius: height <= 6 ? 4 : 5,
        backgroundColor: track,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <View
        style={{
          height,
          width: `${Math.max(0, Math.min(100, fraction * 100))}%`,
          backgroundColor: fill,
        }}
      />
    </View>
  );
}

/** Product thumbnail on a wash tile. */
export function Thumb({
  source,
  size,
  background = color.wash,
  round = 6,
  pad = 0,
}: {
  source: ImageSourcePropType;
  size: number;
  background?: string;
  round?: number;
  pad?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round,
        backgroundColor: background,
        padding: pad,
      }}
    >
      <Image
        source={source}
        resizeMode="contain"
        style={{ width: '100%', height: '100%' }}
        accessible={false}
      />
    </View>
  );
}

/** Square avatar with initials. */
export function Initials({
  text,
  size,
  round,
  bg = color.wash,
  fg = color.textSoft,
  fontSize,
  display = false,
}: {
  text: string;
  size: number;
  round: number;
  bg?: string;
  fg?: string;
  fontSize: number;
  display?: boolean;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={[
          { fontFamily: display ? font.displayBold : font.bodySemi, color: fg },
          metrics(fontSize, 1.2),
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

/** Small circular tick used in feature lists. */
export function Tick({
  size = 18,
  bg = color.accentWash,
  fg = color.accent,
  border,
  glyph = '✓',
  round,
}: {
  size?: number;
  bg?: string;
  fg?: string;
  border?: string;
  glyph?: string;
  round?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round ?? size / 2,
        backgroundColor: bg,
        borderWidth: border ? 1 : 0,
        borderColor: border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: fg, fontSize: size * 0.56, lineHeight: size }}>{glyph}</Text>
    </View>
  );
}

/** Card surface used across the product-UI sections. */
export function Panel({
  children,
  style,
  border = color.line,
  background = color.paper2,
  round = radius.card,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  border?: string;
  background?: string;
  round?: number;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: background,
          borderWidth: 1,
          borderColor: border,
          borderRadius: round,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
=======
import React from 'react';
import { Image, ImageSourcePropType, Text, View, ViewStyle } from 'react-native';
import { color, font, radius } from '@/theme/tokens';
import { metrics } from './Type';

export type BadgeTone = 'accent' | 'success' | 'caution' | 'neutral' | 'danger';

const BADGE_TONE: Record<BadgeTone, { fg: string; bg: string }> = {
  accent: { fg: color.accentHover, bg: color.accentWash },
  success: { fg: color.success, bg: color.successWash },
  caution: { fg: color.caution, bg: color.cautionWash },
  neutral: { fg: color.textSoft, bg: color.wash },
  danger: { fg: color.danger, bg: color.dangerWash },
};

/** 11.5px/600, 5x10 padding, radius 6, semantic wash background. */
export function Badge({
  label,
  tone = 'accent',
  small = false,
  style,
}: {
  label: string;
  tone?: BadgeTone;
  small?: boolean;
  style?: ViewStyle;
}) {
  const skin = BADGE_TONE[tone];
  return (
    <View
      style={[
        {
          backgroundColor: skin.bg,
          borderRadius: radius.badge,
          paddingVertical: small ? 4 : 5,
          paddingHorizontal: small ? 8 : 10,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      <Text
        style={[
          { fontFamily: font.bodySemi, color: skin.fg, textAlign: 'center' },
          metrics(small ? 11 : 11.5, 1.35),
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/** Pill chip — customer traits. */
export function Chip({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: color.paper,
        borderRadius: radius.pill,
        paddingVertical: 6,
        paddingHorizontal: 11,
      }}
    >
      <Text style={[{ fontFamily: font.bodyMedium, color: color.textSoft }, metrics(11.5, 1.4)]}>
        {label}
      </Text>
    </View>
  );
}

/** Accent dot + mono label that opens most sections. */
export function Eyebrow({
  label,
  tone = 'paper',
  center = false,
  style,
}: {
  label: string;
  tone?: 'paper' | 'ink';
  center?: boolean;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: center ? 10 : 12,
          marginBottom: center ? 24 : 22,
          alignSelf: center ? 'center' : 'flex-start',
        },
        style,
      ]}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color.accent }} />
      <Text
        style={[
          {
            fontFamily: font.mono,
            color: tone === 'ink' ? color.white50 : color.textMuted,
            textTransform: 'uppercase',
          },
          metrics(11, 1.4, 0.16),
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/** Thin progress meter — inventory levels and the COD reliability score. */
export function Meter({
  fraction,
  fill,
  track = color.wash,
  height = 6,
}: {
  fraction: number;
  fill: string;
  track?: string;
  height?: number;
}) {
  return (
    <View
      style={{
        height,
        borderRadius: height <= 6 ? 4 : 5,
        backgroundColor: track,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <View
        style={{
          height,
          width: `${Math.max(0, Math.min(100, fraction * 100))}%`,
          backgroundColor: fill,
        }}
      />
    </View>
  );
}

/** Product thumbnail on a wash tile. */
export function Thumb({
  source,
  size,
  background = color.wash,
  round = 6,
  pad = 0,
}: {
  source: ImageSourcePropType;
  size: number;
  background?: string;
  round?: number;
  pad?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round,
        backgroundColor: background,
        padding: pad,
      }}
    >
      <Image
        source={source}
        resizeMode="contain"
        style={{ width: '100%', height: '100%' }}
        accessible={false}
      />
    </View>
  );
}

/** Square avatar with initials. */
export function Initials({
  text,
  size,
  round,
  bg = color.wash,
  fg = color.textSoft,
  fontSize,
  display = false,
}: {
  text: string;
  size: number;
  round: number;
  bg?: string;
  fg?: string;
  fontSize: number;
  display?: boolean;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={[
          { fontFamily: display ? font.displayBold : font.bodySemi, color: fg },
          metrics(fontSize, 1.2),
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

/** Small circular tick used in feature lists. */
export function Tick({
  size = 18,
  bg = color.accentWash,
  fg = color.accent,
  border,
  glyph = '✓',
  round,
}: {
  size?: number;
  bg?: string;
  fg?: string;
  border?: string;
  glyph?: string;
  round?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round ?? size / 2,
        backgroundColor: bg,
        borderWidth: border ? 1 : 0,
        borderColor: border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: fg, fontSize: size * 0.56, lineHeight: size }}>{glyph}</Text>
    </View>
  );
}

/** Card surface used across the product-UI sections. */
export function Panel({
  children,
  style,
  border = color.line,
  background = color.paper2,
  round = radius.card,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  border?: string;
  background?: string;
  round?: number;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: background,
          borderWidth: 1,
          borderColor: border,
          borderRadius: round,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
>>>>>>> c1decb5f08ffdabb7df20508d93878b536a73e30
