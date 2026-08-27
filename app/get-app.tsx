import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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

export default function GetAppScreen() {
  const router = useRouter();
  const { isMobile, gutter } = useViewport();

  return (
    <View style={{ flex: 1, backgroundColor: color.ink }}>
      {/* Soft accent wash behind the content — the same ink + accent
          pairing as the hero and the operating-system section, so this
          page reads as part of the same site rather than a bolted-on
          "coming soon" screen. */}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(43,76,242,0.20)', 'rgba(43,76,242,0.05)', 'rgba(11,13,18,0)']}
        locations={[0, 0.3, 0.65]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '70%' }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 900,
          height: 900,
          marginLeft: -450,
          marginTop: -520,
          borderRadius: 450,
          backgroundColor: 'rgba(110,133,255,0.10)',
        }}
      />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: gutter }}>
        <Pressable
          onPress={() => router.push('/')}
          accessibilityRole="link"
          accessibilityLabel="Back to Vendly.lk"
          style={{ position: 'absolute', top: gutter, left: gutter, flexDirection: 'row', alignItems: 'center', gap: 9 }}
        >
          <Image source={brand.light} style={{ width: 22, height: 22 }} resizeMode="contain" />
          <Text style={[{ fontFamily: font.displayBold, color: color.white }, metrics(16, 1.2, -0.03)]}>
            Vendly<Text style={{ color: color.accentLight }}>.lk</Text>
          </Text>
        </Pressable>

        <View style={{ maxWidth: 720, width: '100%', alignItems: 'center', marginBottom: isMobile ? 36 : 48 }}>
          <Text
            style={[
              { fontFamily: font.mono, color: color.accentLight, textTransform: 'uppercase', marginBottom: 16 },
              metrics(11, 1.4, 0.16),
            ]}
          >
            Get the app
          </Text>
          <Text
            style={[
              { fontFamily: font.displayBold, color: color.white, textAlign: 'center', marginBottom: 14 },
              metrics(isMobile ? 30 : 40, 1.12, -0.03),
            ]}
          >
            Vendly.lk, in your pocket.
          </Text>
          <Text
            style={[
              { fontFamily: font.body, color: color.white62, textAlign: 'center', maxWidth: 460 },
              metrics(15.5, 1.6),
            ]}
          >
            Scan a code below with your phone's camera to install the app — orders, storefront and
            inventory, wherever you're standing. Tap either one first to watch it grow.
          </Text>
        </View>

        <View
          style={{
            flexDirection: isMobile ? 'column' : 'row',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          <PlatformCard
            label="Android"
            store="Google Play"
            url={PLAY_STORE_URL}
            tint="#34A853"
            tintWash="rgba(52,168,83,0.14)"
            icon={<AndroidIcon size={26} />}
          />
          <PlatformCard
            label="iPhone & iPad"
            store="App Store"
            url={APP_STORE_URL}
            tint={color.white}
            tintWash="rgba(255,255,255,0.10)"
            icon={<AppleIcon size={24} fill={color.white} />}
          />
        </View>
      </View>
    </View>
  );
}

function PlatformCard({
  label,
  store,
  url,
  tint,
  tintWash,
  icon,
}: {
  label: string;
  store: string;
  url: string;
  tint: string;
  tintWash: string;
  icon: React.ReactNode;
}) {
  return (
    <View
      style={{
        width: 360,
        alignItems: 'center',
        backgroundColor: color.inkRaised,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
        borderRadius: radius.panel,
        padding: 28,
        ...shadow.panel,
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: tintWash,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        {icon}
      </View>

      <Text style={[{ fontFamily: font.displaySemi, color: color.white, marginBottom: 20 }, metrics(17, 1.2, -0.01)]}>
        {label}
      </Text>

      <View style={{ marginBottom: 12 }}>
        <MagicTreeQR value={url} width={300} height={300} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: radius.pill,
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tint }} />
        <Text style={[{ fontFamily: font.bodyMedium, color: color.white74 }, metrics(12, 1.3)]}>{store}</Text>
      </View>
    </View>
  );
}
