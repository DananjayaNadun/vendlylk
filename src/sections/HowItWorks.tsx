import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Container, RuledTop, Section, SplitHead, useMeasuredWidth } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { H2Compact, H3Small, Note, metrics } from '@/components/Type';
import { howItWorks } from '@/data';
import { color, font } from '@/theme/tokens';
import { autoFitColumns, trackWidth, useViewport } from '@/theme/responsive';

export function HowItWorks() {
  const { f } = useViewport();

  return (
    <Section id="how-it-works" flushTop>
      <Container>
        <RuledTop>
          <Reveal index={0} style={{ marginBottom: f(40, 5, 60) }}>
            <SplitHead
              minItemWidth={280}
              gap={f(28, 4, 56)}
              left={<H2Compact style={{ maxWidth: 520 }}>How OrderFlow works</H2Compact>}
              right={
                <Note style={{ maxWidth: 460 }}>
                  Four steps, from the first message to a paid, delivered, recorded order.
                </Note>
              }
            />
          </Reveal>

          <Reveal index={1}>
            <Steps />
          </Reveal>
        </RuledTop>
      </Container>
    </Section>
  );
}

/**
 * A 1px-gap grid whose gutters read as hairlines — the CSS used a `gap: 1px`
 * grid over a line-coloured background, which is reproduced here with borders
 * computed from the resolved column count.
 */
function Steps() {
  const { f } = useViewport();
  const [width, onLayout] = useMeasuredWidth();
  const columns = width > 0 ? autoFitColumns(width, 240, 1) : 1;
  const track = width > 0 ? trackWidth(width, columns, 1) : 0;

  return (
    <View
      onLayout={onLayout}
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 1,
        backgroundColor: color.lineStrong,
        borderWidth: 1,
        borderColor: color.lineStrong,
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {howItWorks.map((step, i) => (
        <View
          key={step.title}
          style={{
            width: track || '100%',
            maxWidth: '100%',
            minHeight: 210,
            backgroundColor: color.paper,
            padding: f(22, 2.4, 30),
          }}
        >
          <Text style={[{ fontFamily: font.mono, color: color.accent, marginBottom: 22 }, metrics(12, 1.4)]}>
            {String(i + 1).padStart(2, '0')}
          </Text>
          <H3Small style={{ marginBottom: 10 }}>{step.title}</H3Small>
          <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14, 1.55)]}>{step.body}</Text>
        </View>
      ))}
    </View>
  );
}
