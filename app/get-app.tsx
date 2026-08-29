import React, { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { brand } from '@/assets';
import { MagicTreeQR } from '@/components/MagicTreeQR';
import { AndroidIcon, AppleIcon } from '@/components/icons';
import { metrics } from '@/components/Type';
import { color, font, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

/* TODO: swap for the real listings once each store approves the app. The
   Play Store URL already matches this project's real package id
   (lk.vendly.app, set in app.json); the App Store URL needs the numeric
   app id Apple assigns on submission. */
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=lk.vendly.app';
const APP_STORE_URL = 'https://apps.apple.com/lk/app/vendly-lk/id0000000000';

const CREAM = '#F3EFE5';
const INK = '#171A21';
/** Web-only style extras (cursor, outline) spread into RN style objects —
    spreading (rather than a literal property) sidesteps TS's excess-property
    check on ViewStyle/TextStyle, same trick the theme's `shadow` tokens use
    for `boxShadow`. Native ignores unknown style keys at runtime. */
const webCursor = { cursor: 'pointer' } as any;
const noOutline = { outlineStyle: 'none' } as any;

type SeasonKey = 'spring' | 'summer' | 'autumn';
const SEASONS: { key: SeasonKey; label: string; color: string; Icon: React.ComponentType<{ size: number; on: boolean }> }[] = [
  { key: 'spring', label: 'Spring', color: '#F3B6CE', Icon: SpringIcon },
  { key: 'summer', label: 'Summer', color: '#4CAF50', Icon: SummerIcon },
  { key: 'autumn', label: 'Autumn', color: '#D97F3D', Icon: AutumnIcon },
];

const SWATCHES = ['#F3B6CE', '#B48CD6', '#E1483A', '#F0B429', '#3E7BE0', '#D8E4EC'];

export default function GetAppScreen() {
  const router = useRouter();
  const { isMobile, gutter } = useViewport();

  return (
    <View style={{ flex: 1, backgroundColor: CREAM }}>
      <View style={{ flex: 1 }}>
        <Pressable
          onPress={() => router.push('/')}
          accessibilityRole="link"
          accessibilityLabel="Back to Vendly.lk"
          hitSlop={8}
          style={({ pressed }) => ({
            position: 'absolute',
            top: gutter,
            left: gutter,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 9,
            opacity: pressed ? 0.6 : 1,
            ...webCursor,
          })}
        >
          <Image source={brand.ink} style={{ width: 20, height: 20 }} resizeMode="contain" />
          <Text style={[{ fontFamily: font.displayBold, color: INK }, metrics(15, 1.2, -0.03)]}>
            Vendly<Text style={{ color: color.accent }}>.lk</Text>
          </Text>
        </Pressable>

        <View
          style={{
            flex: 1,
            flexDirection: isMobile ? 'column' : 'row',
            paddingTop: isMobile ? 76 : 0,
          }}
        >
          <TreeCard
            platformLabel="Android"
            storeLabel="Google Play"
            defaultUrl={PLAY_STORE_URL}
            isMobile={isMobile}
            Icon={AndroidIcon}
          />
          <TreeCard
            platformLabel="iPhone & iPad"
            storeLabel="App Store"
            defaultUrl={APP_STORE_URL}
            isMobile={isMobile}
            Icon={AppleIcon}
          />
        </View>

        {/* Centered heading, floating over the split — same ink/accent
            pairing as the rest of the site so this page still reads as
            part of it, not a bolted-on "coming soon" screen. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: isMobile ? 84 : '10%',
            left: 0,
            right: 0,
            alignItems: 'center',
            paddingHorizontal: gutter,
          }}
        >
          <View
            style={{
              maxWidth: 520,
              width: '100%',
              paddingVertical: isMobile ? 20 : 28,
              paddingHorizontal: isMobile ? 22 : 32,
              alignItems: 'center',
            }}
          >
            <Text
              style={[
                { fontFamily: font.mono, color: color.accent, textTransform: 'uppercase', marginBottom: 10 },
                metrics(10.5, 1.4, 0.16),
              ]}
            >
              Get the app
            </Text>
            <Text
              style={[
                { fontFamily: font.displayBold, color: INK, textAlign: 'center', marginBottom: 10 },
                metrics(isMobile ? 24 : 30, 1.14, -0.03),
              ]}
            >
              Vendly.lk, in your pocket.
            </Text>
            <Text
              style={[
                { fontFamily: font.body, color: '#5B5748', textAlign: 'center' },
                metrics(13.5, 1.55),
              ]}
            >
              Scan a code below with your phone's camera to install the app — orders, storefront and
              inventory, wherever you're standing. Tap either one first to watch it grow.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function TreeCard({
  platformLabel,
  storeLabel,
  defaultUrl,
  isMobile,
  Icon,
}: {
  platformLabel: string;
  storeLabel: string;
  defaultUrl: string;
  isMobile: boolean;
  Icon: React.ComponentType<{ size?: number }>;
}) {
  const [season, setSeason] = useState<SeasonKey>('spring');
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [url, setUrl] = useState(defaultUrl);
  const [revealed, setRevealed] = useState(false);
  const [urlFocused, setUrlFocused] = useState(false);
  const [copied, setCopied] = useState(false);

  const seasonColor = SEASONS.find((s) => s.key === season)!.color;
  const leafColor = customColor ?? seasonColor;
  const treeSize = isMobile ? 460 : 600;

  const share = async () => {
    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await (navigator as any).share({ title: 'Vendly.lk', url });
        return;
      }
    } catch {
      /* user cancelled the native share sheet — fall through to copy */
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — nothing more we can do here */
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: isMobile ? 74 : 104, paddingBottom: 40 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: radius.pill,
          backgroundColor: color.white,
          marginBottom: 22,
          ...shadow.panelSoft,
        }}
      >
        <Icon size={17} />
        <Text style={[{ fontFamily: font.bodySemi, color: INK }, metrics(13.5, 1.3)]}>{platformLabel}</Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <MagicTreeQR
          value={url}
          width={treeSize}
          height={treeSize}
          leafColor={leafColor}
          hint={false}
          onToggle={setRevealed}
        />

        <Text style={[{ fontFamily: font.mono, color: '#8A8578', marginTop: 4 }, metrics(10.5, 1.4, 0.04)]}>
          {revealed ? 'Tap to see the tree' : 'Tap the tree to see the QR code'}
        </Text>
      </View>

      <View style={{ width: '100%', maxWidth: 440, alignItems: 'center', marginTop: 24 }}>
        <View style={{ flexDirection: 'row', width: '100%', gap: 10, marginBottom: 18 }}>
          <TextInput
            value={url}
            onChangeText={setUrl}
            onFocus={() => setUrlFocused(true)}
            onBlur={() => setUrlFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              {
                flex: 1,
                backgroundColor: color.white,
                borderRadius: radius.pill,
                paddingVertical: 15,
                paddingHorizontal: 20,
                fontFamily: font.body,
                color: INK,
                borderWidth: 1.5,
                borderColor: urlFocused ? color.accent : 'transparent',
                ...noOutline,
              },
              metrics(14.5, 1.3),
            ]}
          />
          <Pressable
            onPress={share}
            accessibilityRole="button"
            accessibilityLabel={copied ? 'Link copied' : `Share ${storeLabel} link`}
            style={({ pressed }) => ({
              width: 52,
              height: 52,
              borderRadius: radius.pill,
              backgroundColor: copied ? '#3D8B40' : '#C0672E',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.94 : 1 }],
              ...webCursor,
            })}
          >
            {copied ? <CheckIcon size={19} /> : <ShareIcon size={20} />}
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', flex: 1, gap: 8 }}>
            {SEASONS.map((s) => {
              const active = season === s.key && !customColor;
              return (
                <Pressable
                  key={s.key}
                  onPress={() => {
                    setSeason(s.key);
                    setCustomColor(null);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`${s.label} theme`}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 7,
                    paddingVertical: 11,
                    paddingHorizontal: 16,
                    borderRadius: radius.pill,
                    backgroundColor: active ? color.white : 'transparent',
                    opacity: pressed ? 0.7 : 1,
                    ...webCursor,
                    ...(active ? shadow.panelSoft : null),
                  })}
                >
                  <s.Icon size={15} on={active} />
                  <Text
                    style={[
                      { fontFamily: font.bodyMedium, color: active ? INK : '#8A8578' },
                      metrics(14, 1.3),
                    ]}
                  >
                    {s.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            onPress={() => setMuted((m) => !m)}
            accessibilityRole="button"
            accessibilityLabel={muted ? 'Unmute' : 'Mute'}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: radius.pill,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? 'rgba(23,26,33,0.06)' : 'transparent',
              ...webCursor,
            })}
          >
            <SpeakerIcon size={19} muted={muted} />
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', gap: 14 }}>
          {SWATCHES.map((c) => {
            const active = customColor === c || (!customColor && c === seasonColor);
            return (
              <Pressable
                key={c}
                onPress={() => setCustomColor(c)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel="Leaf color"
                hitSlop={6}
                style={({ pressed }) => ({
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: c,
                  borderWidth: active ? 2.5 : 0,
                  borderColor: INK,
                  transform: [{ scale: pressed ? 0.88 : 1 }],
                  ...webCursor,
                })}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

/* ---------------------------------------------------------------- icons */

function SpringIcon({ size, on }: { size: number; on: boolean }) {
  const c = on ? '#E1487A' : '#8A8578';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={3.2} fill={c} />
      <Circle cx={12} cy={5} r={3} fill={c} opacity={0.8} />
      <Circle cx={12} cy={19} r={3} fill={c} opacity={0.8} />
      <Circle cx={5} cy={12} r={3} fill={c} opacity={0.8} />
      <Circle cx={19} cy={12} r={3} fill={c} opacity={0.8} />
    </Svg>
  );
}

function SummerIcon({ size, on }: { size: number; on: boolean }) {
  const c = on ? '#E2A233' : '#8A8578';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={4.6} fill={c} />
      <Path
        stroke={c}
        strokeWidth={1.6}
        strokeLinecap="round"
        d="M12 2v2.4M12 19.6V22M22 12h-2.4M4.4 12H2M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7 5.3 5.3"
      />
    </Svg>
  );
}

function AutumnIcon({ size, on }: { size: number; on: boolean }) {
  const c = on ? '#8A6A46' : '#8A8578';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke={c}
        strokeWidth={1.7}
        strokeLinecap="round"
        d="M5 10a4.5 4.5 0 0 1 8.6-1.8A3.8 3.8 0 0 1 19 11.8 3.6 3.6 0 0 1 17.5 15H6.2A3.6 3.6 0 0 1 5 10Z"
      />
      <Path stroke={c} strokeWidth={1.7} strokeLinecap="round" d="M8 18v2M12 18v3M16 18v2" />
    </Svg>
  );
}

function ShareIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#FFFFFF"
        d="M12 3.2a1 1 0 0 1 .7.3l4 4a1 1 0 0 1-1.4 1.4L13 6.6V15a1 1 0 1 1-2 0V6.6L8.7 8.9a1 1 0 1 1-1.4-1.4l4-4a1 1 0 0 1 .7-.3Z"
      />
      <Path
        fill="#FFFFFF"
        d="M5 13a1 1 0 0 1 1 1v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5a1 1 0 1 1 2 0v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5a1 1 0 0 1 1-1Z"
      />
    </Svg>
  );
}

function CheckIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12.5l4.5 4.5L19 7"
      />
    </Svg>
  );
}

function SpeakerIcon({ size, muted }: { size: number; muted: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill="#8A8578" d="M4 9v6h4l5 5V4L8 9H4Z" />
      {muted ? (
        <Path stroke="#8A8578" strokeWidth={1.8} strokeLinecap="round" d="M16 9l5 6M21 9l-5 6" />
      ) : (
        <Path
          fill="none"
          stroke="#8A8578"
          strokeWidth={1.6}
          strokeLinecap="round"
          d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"
        />
      )}
    </Svg>
  );
}
