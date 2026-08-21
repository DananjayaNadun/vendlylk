import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { brand } from '@/assets';
import { Container, Section, useMeasuredWidth } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Eyebrow } from '@/components/UI';
import { H2, Lede, metrics } from '@/components/Type';
import { osModules } from '@/data';
import { color, font, radius } from '@/theme/tokens';
import { autoFitColumns, trackWidth, useViewport } from '@/theme/responsive';

export function OperatingSystem() {
  const { f } = useViewport();

  return (
    <Section id="os" tone="ink">
      <Container>
        <Reveal index={0} style={{ maxWidth: 760, alignSelf: 'center', marginBottom: f(40, 5, 64) }}>
          <View style={{ alignItems: 'center' }}>
            <Eyebrow label="The operating system" tone="ink" center />
            <H2 style={{ color: color.white, marginBottom: 18, textAlign: 'center' }}>
              One system instead of ten disconnected tools.
            </H2>
            <Lede style={{ color: color.white60, textAlign: 'center' }}>
              Every part shares the same products, the same customers and the same numbers. Nothing is re-typed.
              Nothing is out of date.
            </Lede>
          </View>
        </Reveal>

        <Reveal index={1}>
          <View style={{ alignItems: 'center' }}>
            <LinearGradient
              colors={['rgba(43,76,242,0.16)', 'rgba(43,76,242,0.04)']}
              style={{
                width: '100%',
                maxWidth: 520,
                borderWidth: 1,
                borderColor: 'rgba(43,76,242,0.4)',
                borderRadius: radius.panel,
                padding: 26,
                alignItems: 'center',
              }}
            >
              <Image source={brand.light} resizeMode="contain" style={{ width: 34, height: 34, marginBottom: 14 }} />
              <Text
                style={[
                  { fontFamily: font.displayExtra, color: color.white },
                  metrics(f(26, 3, 36), 1, -0.04),
                ]}
              >
                ORDERFLOW
              </Text>
              <Text
                style={[
                  { fontFamily: font.mono, color: color.white50, textTransform: 'uppercase', marginTop: 10 },
                  metrics(10.5, 1.4, 0.16),
                ]}
              >
                One login · one source of truth
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(43,76,242,0.9)', 'rgba(255,255,255,0.12)']}
              style={{ width: 1, height: 40 }}
            />

            <ModuleGrid />
          </View>
        </Reveal>
      </Container>
    </Section>
  );
}

/** A 1px-gap grid whose gutters read as hairlines on ink. */
function ModuleGrid() {
  const [width, onLayout] = useMeasuredWidth();
  const columns = width > 0 ? autoFitColumns(width, 190, 1) : 1;
  const track = width > 0 ? trackWidth(width, columns, 1) : 0;

  return (
    <View
      onLayout={onLayout}
      style={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 1,
        backgroundColor: color.lineInk,
        borderWidth: 1,
        borderColor: color.lineInk,
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {osModules.map((module, i) => (
        <View
          key={module.name}
          style={{
            width: track || '100%',
            maxWidth: '100%',
            minHeight: 132,
            backgroundColor: color.ink,
            paddingVertical: 22,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={[
              { fontFamily: font.mono, color: color.accentLight, marginBottom: 12 },
              metrics(10, 1.4, 0.12),
            ]}
          >
            {String(i + 1).padStart(2, '0')}
          </Text>
          <Text style={[{ fontFamily: font.bodySemi, color: color.white, marginBottom: 6 }, metrics(15.5, 1.3)]}>
            {module.name}
          </Text>
          <Text style={[{ fontFamily: font.body, color: color.white50 }, metrics(13, 1.5)]}>{module.body}</Text>
        </View>
      ))}
    </View>
  );
}
