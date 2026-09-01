import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { brand } from '@/assets';
import { Button } from '@/components/Button';
import { accountsLive } from '@/config/company';
import { Seo } from '@/components/Seo';
import { AppleIcon, FacebookIcon, GoogleIcon } from '@/components/icons';
import { DAY_TIME_THEMES, DayTime, DayTimeSwitcher, DayTimeTheme } from '@/components/DayTimeSwitcher';
import { metrics } from '@/components/Type';
import { color, font, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useReducedMotion } from '@/theme/useReducedMotion';

/**
 * Shared shell for the login and signup pages — a light form card beside a
 * gradient "launch" panel, per the handoff. Both pages differ only in their
 * fields and copy, which are passed in rather than duplicating the frame.
 */
export function AuthScreen({
  heading,
  subheading,
  ctaLabel,
  onSubmit,
  footer,
  children,
}: {
  heading: string;
  subheading: string;
  ctaLabel: string;
  onSubmit: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isDesktop, gutter } = useViewport();

  return (
    <>
      <Seo title={heading} description={subheading} noIndex />
      <View style={{ flex: 1, backgroundColor: color.wash, alignItems: 'center', justifyContent: 'center', padding: gutter }}>
      <Pressable
        onPress={() => router.push('/')}
        accessibilityRole="link"
        accessibilityLabel="Back to Vendly.lk"
        style={{ position: 'absolute', top: gutter, left: gutter, flexDirection: 'row', alignItems: 'center', gap: 9 }}
      >
        <Image source={brand.ink} style={{ width: 22, height: 22 }} resizeMode="contain" />
        <Text style={[{ fontFamily: font.displayBold, color: color.ink }, metrics(16, 1.2, -0.03)]}>Vendly</Text>
      </Pressable>

      <View
        style={{
          width: '100%',
          maxWidth: 960,
          maxHeight: '100%',
          flexDirection: isDesktop ? 'row' : 'column',
          backgroundColor: color.paper2,
          borderWidth: 1,
          borderColor: color.line,
          borderRadius: radius.panel,
          overflow: 'hidden',
          ...shadow.panel,
        }}
      >
        <View style={{ flex: isDesktop ? 1.05 : undefined, padding: isDesktop ? 48 : 28 }}>
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <Image source={brand.ink} style={{ width: 34, height: 34, marginBottom: 8 }} resizeMode="contain" />
            <Text style={[{ fontFamily: font.displayBold, color: color.ink }, metrics(20, 1.2, -0.03)]}>
              Vendly<Text style={{ color: color.accent }}>.lk</Text>
            </Text>
          </View>

          <Text style={[{ fontFamily: font.displayBold, color: color.ink, textAlign: 'center', marginBottom: 8 }, metrics(24, 1.2, -0.02)]}>
            {heading}
          </Text>
          <Text style={[{ fontFamily: font.body, color: color.textMuted, textAlign: 'center', marginBottom: 28 }, metrics(14.5, 1.5)]}>
            {subheading}
          </Text>

          {accountsLive ? null : (
            <View
              style={{
                borderWidth: 1,
                borderColor: 'rgba(201,138,43,0.35)',
                backgroundColor: color.cautionWash,
                borderRadius: radius.control,
                padding: 14,
                marginBottom: 20,
              }}
            >
              <Text style={[{ fontFamily: font.bodySemi, color: color.caution, marginBottom: 3 }, metrics(13, 1.4)]}>
                Accounts are not open yet
              </Text>
              <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(13, 1.5)]}>
                Vendly is still in build. Nothing typed here is sent anywhere or stored — please don't enter a
                password you use elsewhere.
              </Text>
            </View>
          )}

          <View style={{ gap: 14, marginBottom: 22 }}>{children}</View>

          <Button
            label={accountsLive ? ctaLabel : 'Available at launch'}
            block
            size="lg"
            disabled={!accountsLive}
            onPress={onSubmit}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: color.line }} />
            <Text style={[{ fontFamily: font.body, color: color.textFaint }, metrics(12.5, 1.3)]}>
              Or continue with
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: color.line }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 14, marginBottom: 26 }}>
            <SocialButton label="Google">
              <GoogleIcon size={20} />
            </SocialButton>
            <SocialButton label="Apple">
              <AppleIcon size={20} />
            </SocialButton>
            <SocialButton label="Facebook">
              <FacebookIcon size={20} />
            </SocialButton>
          </View>

          <View style={{ alignItems: 'center' }}>{footer}</View>
        </View>

        {isDesktop ? (
          <View style={{ width: 340 }}>
            <LaunchPanel />
          </View>
        ) : null}
        </View>
      </View>
    </>
  );
}

/** Text input styled to match the card — plain background, hairline border,
    an accent border on focus. */
export function AuthField({
  placeholder,
  secure,
  value,
  onChangeText,
  autoComplete,
}: {
  placeholder: string;
  secure?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  autoComplete?: React.ComponentProps<typeof TextInput>['autoComplete'];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={color.textFaint}
      secureTextEntry={secure}
      autoCapitalize="none"
      autoComplete={autoComplete}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        {
          fontFamily: font.body,
          color: color.ink,
          backgroundColor: color.paper,
          borderWidth: 1,
          borderColor: focused ? color.accent : color.line,
          borderRadius: radius.control,
          paddingVertical: 14,
          paddingHorizontal: 16,
          outlineStyle: 'none' as any,
        },
        metrics(14.5, 1.3),
      ]}
    />
  );
}

/** Decorative until OAuth is wired: disabled and labelled, so a visitor is
    not left tapping a provider icon that silently does nothing. */
function SocialButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={!accountsLive}
      accessibilityState={{ disabled: !accountsLive }}
      accessibilityLabel={accountsLive ? `Continue with ${label}` : `Continue with ${label} — available at launch`}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: radius.control,
          borderWidth: 1,
          borderColor: color.line,
          backgroundColor: color.paper,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: accountsLive ? 1 : 0.45,
        }}
      >
        {children}
      </View>
    </Pressable>
  );
}

/** The gradient "launch" side — rocket, scattered stars, a couple of
    drifting asteroids, over a time-of-day gradient the viewer can switch.
    Evokes the handoff's illustration without tracing its hundred-odd
    generated vector fragments one for one. */
function LaunchPanel() {
  const [theme, setTheme] = useState<DayTime>('night');
  const [fadeFrom, setFadeFrom] = useState<DayTimeTheme | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const active = DAY_TIME_THEMES.find((t) => t.id === theme) ?? DAY_TIME_THEMES[DAY_TIME_THEMES.length - 1];

  /* The outgoing gradient is kept mounted on top, fading out, rather than
     interpolating colour stops directly — expo-linear-gradient cannot
     animate its `colors` prop, and cross-fading two layers gives the same
     result while staying declarative. */
  const changeTheme = (next: DayTime) => {
    if (next === theme) return;
    setFadeFrom(active);
    fade.setValue(1);
    setTheme(next);
    Animated.timing(fade, {
      toValue: 0,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setFadeFrom(null);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={active.gradient} locations={active.locations} style={StyleSheet.absoluteFill} />
      {fadeFrom ? (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]} pointerEvents="none">
          <LinearGradient colors={fadeFrom.gradient} locations={fadeFrom.locations} style={{ flex: 1 }} />
        </Animated.View>
      ) : null}

      {STARS.map((s, i) => (
        <Text
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: s.size,
            color: active.fleck,
            opacity: s.opacity,
          }}
        >
          ✦
        </Text>
      ))}

      <Asteroid x={16} y={22} size={22} rotate="-20deg" />
      <Asteroid x={80} y={16} size={16} rotate="18deg" />
      <Asteroid x={12} y={70} size={14} rotate="8deg" />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <RocketIcon size={170} />
      </View>

      <DayTimeSwitcher value={theme} onChange={changeTheme} />
    </View>
  );
}

const STARS = [
  { x: 14, y: 12, size: 12, opacity: 0.9 },
  { x: 30, y: 8, size: 8, opacity: 0.7 },
  { x: 48, y: 14, size: 10, opacity: 0.85 },
  { x: 68, y: 10, size: 9, opacity: 0.6 },
  { x: 86, y: 26, size: 11, opacity: 0.8 },
  { x: 8, y: 42, size: 9, opacity: 0.55 },
  { x: 92, y: 46, size: 8, opacity: 0.65 },
  { x: 22, y: 58, size: 10, opacity: 0.75 },
  { x: 78, y: 62, size: 9, opacity: 0.6 },
  { x: 40, y: 82, size: 8, opacity: 0.55 },
  { x: 64, y: 86, size: 11, opacity: 0.7 },
  { x: 15, y: 90, size: 9, opacity: 0.6 },
];

function Asteroid({ x, y, size, rotate }: { x: number; y: number; size: number; rotate: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(255,255,255,0.28)',
        transform: [{ rotate }],
      }}
    />
  );
}

/** Material Symbols' `rocket_launch` glyph, traced verbatim — the exact mark
    supplied for this panel, not a redrawn approximation. */
function RocketIcon({ size = 140 }: { size?: number }) {
  const reduced = useReducedMotion();
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift, reduced]);

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [size * 0.06, -size * 0.06] }) },
        ],
      }}
    >
      <View style={{ transform: [{ rotate: '-45deg' }] }}>
      <Svg width={size} height={size} viewBox="0 -960 960 960">
        <Path
          fill="#FFFFFF"
          d="m226-559 78 33q14-28 29-54t33-52l-56-11-84 84Zm142 83 114 113q42-16 90-49t90-75q70-70 109.5-155.5T806-800q-72-5-158 34.5T492-656q-42 42-75 90t-49 90Zm155-121.5q0-33.5 23-56.5t57-23q34 0 57 23t23 56.5q0 33.5-23 56.5t-57 23q-34 0-57-23t-23-56.5ZM565-220l84-84-11-56q-26 18-52 32.5T532-299l33 79Zm313-653q19 121-23.5 235.5T708-419l20 99q4 20-2 39t-20 33L538-80l-84-197-171-171-197-84 167-168q14-14 33.5-20t39.5-2l99 20q104-104 218-147t235-24ZM157-321q35-35 85.5-35.5T328-322q35 35 34.5 85.5T327-151q-25 25-83.5 43T82-76q14-103 32-161.5t43-83.5Zm57 56q-10 10-20 36.5T180-175q27-4 53.5-13.5T270-208q12-12 13-29t-11-29q-12-12-29-11.5T214-265Z"
        />
      </Svg>
      </View>
    </Animated.View>
  );
}
