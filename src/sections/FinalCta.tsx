import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { brand } from '@/assets';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/Button';
import { metrics } from '@/components/Type';
import { color, font } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useScroll } from '@/scroll/ScrollProvider';

export function FinalCta() {
  const { f, gutter } = useViewport();
  const { registerSection, scrollToSection } = useScroll();

  return (
    <View
      onLayout={(e) => registerSection('get-started', e.nativeEvent.layout.y)}
      style={{
        backgroundColor: color.ink,
        paddingVertical: f(80, 13, 180),
        paddingHorizontal: gutter,
        overflow: 'hidden',
      }}
    >
      {/* The design's radial glow rising from the bottom edge; approximated
          with the equivalent vertical ramp. */}
      <LinearGradient
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        colors={['rgba(43,76,242,0)', 'rgba(43,76,242,0.10)', 'rgba(43,76,242,0.28)']}
        locations={[0.3, 0.72, 1]}
      />

      <Reveal index={0} style={{ maxWidth: 900, alignSelf: 'center', width: '100%' }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={brand.light}
            resizeMode="contain"
            style={{ width: 40, height: 40, marginBottom: 30, opacity: 0.9 }}
          />

          <Text
            accessibilityRole="header"
            style={[
              { fontFamily: font.displayBold, color: color.white, textAlign: 'center', marginBottom: 22 },
              metrics(f(32, 5.2, 68), 1, -0.042),
            ]}
          >
            Your business is already online.{'\n'}
            <Text style={{ color: color.white50 }}>Now give it an operating system.</Text>
          </Text>

          <Text
            style={[
              {
                fontFamily: font.body,
                color: color.white62,
                textAlign: 'center',
                maxWidth: 560,
                marginBottom: f(32, 4, 44),
              },
              metrics(f(15.5, 1.3, 19), 1.6),
            ]}
          >
            Set up your storefront, add your products, and take your next order in OrderFlow — while still selling
            exactly where you sell today.
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Button label="Get Started Free" size="lg" arrow onPress={() => scrollToSection('get-started')} />
            <Button label="Explore Vendly" variant="ghostInk" size="lg" onPress={() => scrollToSection('storefront')} />
          </View>

          <Text
            style={[
              { fontFamily: font.mono, color: color.white35, textTransform: 'uppercase', marginTop: 28, textAlign: 'center' },
              metrics(11, 1.4, 0.1),
            ]}
          >
            Free to start · No card required · Sri Lanka
          </Text>
        </View>
      </Reveal>
    </View>
  );
}
