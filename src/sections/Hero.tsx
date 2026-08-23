import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { HeroVideo } from '@/components/HeroVideo';
import { brand, icons, media, products } from '@/assets';
import { Enter } from '@/components/Enter';
import { Button } from '@/components/Button';
import { WhatsAppIcon } from '@/components/icons';
import { metrics, H1 } from '@/components/Type';
import { color, font, layout, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useScroll } from '@/scroll/ScrollProvider';
import { useReducedMotion } from '@/theme/useReducedMotion';

export function Hero() {
  const { width, height, gutter, isMobile, f } = useViewport();
  const { registerSection, scrollToSection } = useScroll();
  const router = useRouter();
  const reduced = useReducedMotion();

  const minHeight = Math.min(1000, Math.max(660, height));

  return (
    <View
      ref={(node) => registerSection('top', node)}
      style={{ minHeight, backgroundColor: color.ink, overflow: 'hidden' }}
    >
      {/* Background video — full-bleed, muted, looping */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <HeroVideo source={media.heroLoop} paused={reduced} />
      </View>

      {/* Vertical scrim */}
      <LinearGradient
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        colors={[
          'rgba(11,13,18,0.90)',
          'rgba(11,13,18,0.62)',
          'rgba(11,13,18,0.72)',
          'rgba(11,13,18,0.97)',
        ]}
        locations={[0, 0.34, 0.68, 1]}
      />

      {/* The design's left-edge radial vignette; React Native has no radial
          gradient, so it is approximated with the equivalent horizontal ramp. */}
      <LinearGradient
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        colors={['rgba(11,13,18,0.86)', 'rgba(11,13,18,0.42)', 'rgba(11,13,18,0)']}
        locations={[0, 0.42, 0.72]}
        start={{ x: 0.08, y: 0.55 }}
        end={{ x: 0.9, y: 0.55 }}
      />

      {/* Content */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          width: '100%',
          maxWidth: layout.container,
          alignSelf: 'center',
          paddingTop: 132,
          paddingBottom: 40,
          paddingHorizontal: gutter,
        }}
      >
        <View
          style={{
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: f(28, 4, 64),
            width: '100%',
          }}
        >
          <View style={{ flex: isMobile ? undefined : 1.15, width: isMobile ? '100%' : undefined, maxWidth: 760 }}>
            <Enter delay={0} duration={700} distance={0}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  gap: 11,
                  paddingVertical: 7,
                  paddingLeft: 8,
                  paddingRight: 14,
                  borderWidth: 1,
                  borderColor: color.white16,
                  borderRadius: radius.pill,
                  backgroundColor: color.white05,
                  marginBottom: f(22, 3, 32),
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={icons.facebook} style={{ width: 19, height: 19, borderRadius: 9.5 }} />
                  <View style={{ marginLeft: -5, borderRadius: 5, borderWidth: 2, borderColor: color.ink }}>
                    <WhatsAppIcon size={19} round={130} />
                  </View>
                  <Image
                    source={icons.instagram}
                    style={{ width: 19, height: 19, borderRadius: 5, marginLeft: -5, borderWidth: 2, borderColor: color.ink }}
                  />
                </View>
                <Text
                  style={[
                    { fontFamily: font.mono, color: 'rgba(255,255,255,0.78)', textTransform: 'uppercase' },
                    metrics(11, 1.4, 0.1),
                  ]}
                >
                  Built for Sri Lankan social sellers
                </Text>
              </View>
            </Enter>

            <View style={{ marginBottom: f(20, 2.4, 30) }}>
              <Enter delay={60}>
                <H1>The Operating System</H1>
              </Enter>
              <Enter delay={150}>
                <H1>for Facebook &amp;</H1>
              </Enter>
              <Enter delay={240}>
                <H1 style={{ color: 'rgba(255,255,255,0.55)' }}>WhatsApp Businesses.</H1>
              </Enter>
            </View>

            <Enter delay={340}>
              <Text
                style={[
                  { fontFamily: font.body, color: color.white70, maxWidth: 560, marginBottom: f(28, 3.4, 40) },
                  metrics(f(16, 1.35, 19), 1.55),
                ]}
              >
                Keep selling in the chats your customers already use. Vendly.lk organises everything behind them
                — orders, customers, products, inventory, payments, courier and reports — in one place.
              </Text>
            </Enter>

            <Enter delay={420}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                <Button label="Get Started Free" arrow onPress={() => router.push('/signup')} />
                <Button label="See How It Works" variant="ghostInk" play onPress={() => scrollToSection('how-it-works')} />
              </View>
            </Enter>

            <Enter delay={620} duration={900} distance={0}>
              <Text
                style={[
                  {
                    fontFamily: font.mono,
                    color: color.white42,
                    textTransform: 'uppercase',
                    marginTop: f(30, 4, 46),
                  },
                  metrics(11, 1.4, 0.08),
                ]}
              >
                Free to start · No website needed · Set up in an evening
              </Text>
            </Enter>
          </View>

          {/* The floating order card is dropped below 940px. */}
          {!isMobile ? (
            <Enter delay={520} duration={1100} style={{ flex: 0.85 }}>
              <OrderCard />
            </Enter>
          ) : null}
        </View>
      </View>

      {/* Footnote rail */}
      <View style={{ borderTopWidth: 1, borderTopColor: color.white09, paddingVertical: 18, paddingHorizontal: gutter }}>
        <View
          style={{
            width: '100%',
            maxWidth: layout.container,
            alignSelf: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 }}>
            <View style={{ width: 22, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
            <Text
              style={[
                { fontFamily: font.mono, color: color.white40, textTransform: 'uppercase', flexShrink: 1 },
                metrics(11, 1.4, 0.1),
              ]}
            >
              Orders · Customers · Products · Inventory · Payments · Courier · Analytics · AI
            </Text>
          </View>
          <ScrollCue />
        </View>
      </View>
    </View>
  );
}

function ScrollCue() {
  const reduced = useReducedMotion();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduced]);

  return (
    <Animated.View
      style={{
        opacity: reduced ? 1 : pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
        transform: [{ translateY: pulse.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }) }],
      }}
    >
      <Text
        style={[
          { fontFamily: font.mono, color: color.white40, textTransform: 'uppercase' },
          metrics(11, 1.4, 0.1),
        ]}
      >
        Scroll ↓
      </Text>
    </Animated.View>
  );
}

/* ------------------------------------------------------------- order card */

function OrderCard() {
  return (
    <View>
      <View
        style={{
          backgroundColor: 'rgba(255,255,255,0.055)',
          borderWidth: 1,
          borderColor: color.white14,
          borderRadius: radius.card,
          padding: 18,
          ...shadow.orderCard,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 3.5,
                backgroundColor: color.live,
                borderWidth: 4,
                borderColor: 'rgba(18,169,123,0.18)',
              }}
            />
            <Text
              style={[
                { fontFamily: font.mono, color: color.white62, textTransform: 'uppercase' },
                metrics(10.5, 1.4, 0.13),
              ]}
            >
              New order received
            </Text>
          </View>
          <Text style={[{ fontFamily: font.mono, color: color.white40 }, metrics(10.5, 1.4)]}>14:32</Text>
        </View>

        <View
          style={{
            backgroundColor: color.paper2,
            borderRadius: radius.control,
            padding: 16,
            ...shadow.orderCardInner,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 13,
              borderBottomWidth: 1,
              borderBottomColor: color.line,
            }}
          >
            <Text style={[{ fontFamily: font.monoMedium, color: color.ink }, metrics(12, 1.4)]}>#ORD-2418</Text>
            <View style={{ backgroundColor: color.accentWash, paddingVertical: 4, paddingHorizontal: 9, borderRadius: radius.badge }}>
              <Text style={[{ fontFamily: font.bodySemi, color: color.accentHover }, metrics(11, 1.35)]}>
                Via WhatsApp
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingVertical: 13,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(11,13,18,0.06)',
            }}
          >
            <Image
              source={products.hoodie}
              resizeMode="contain"
              style={{ width: 40, height: 40, backgroundColor: color.wash, borderRadius: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(13.5, 1.35)]}>
                Heavyweight Hoodie · XL
              </Text>
              <Text style={[{ fontFamily: font.body, color: color.textMuted, marginTop: 2 }, metrics(12, 1.35)]}>
                Qty 1 · Charcoal
              </Text>
            </View>
            <Text style={[{ fontFamily: font.monoMedium, color: color.ink }, metrics(13, 1.35)]}>Rs. 6,900</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, paddingTop: 13 }}>
            {[
              { label: 'Deliver to', value: 'Nugegoda, Colombo' },
              { label: 'Payment', value: 'COD · Reliable' },
            ].map((fact) => (
              <View key={fact.label} style={{ flex: 1 }}>
                <Text
                  style={[
                    { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 4 },
                    metrics(9.5, 1.4, 0.12),
                  ]}
                >
                  {fact.label}
                </Text>
                <Text style={[{ fontFamily: font.bodyMedium, color: color.ink }, metrics(12.5, 1.35)]}>
                  {fact.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }}>
          <View style={{ flex: 1, backgroundColor: color.paper2, padding: 10, borderRadius: 9 }}>
            <Text style={[{ fontFamily: font.bodySemi, color: color.ink, textAlign: 'center' }, metrics(12.5, 1.3)]}>
              Confirm
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: color.white08,
              borderWidth: 1,
              borderColor: color.white16,
              padding: 10,
              borderRadius: 9,
            }}
          >
            <Text style={[{ fontFamily: font.bodyMedium, color: color.white80, textAlign: 'center' }, metrics(12.5, 1.3)]}>
              Assign courier
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          left: -26,
          bottom: -30,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: color.paper2,
          borderRadius: radius.control,
          paddingVertical: 11,
          paddingHorizontal: 14,
          ...shadow.orderChat,
        }}
      >
        <WhatsAppIcon size={22} round={130} />
        <View>
          <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(12, 1.35)]}>Customer chat</Text>
          <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(13, 1.35)]}>
            “Complete your order here.”
          </Text>
        </View>
      </View>
    </View>
  );
}
