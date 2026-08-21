import React from 'react';
import { Text, View } from 'react-native';
import { Container, Section } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Eyebrow } from '@/components/UI';
import { H2, metrics } from '@/components/Type';
import { outcomes } from '@/data';
import { color, font } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

export function Outcomes() {
  const { f, width, isMobile } = useViewport();
  const stack = width <= 620;

  return (
    <Section id="outcomes" paddingBottom={f(56, 7, 96)}>
      <Container>
        <Reveal index={0} style={{ marginBottom: f(36, 4.5, 56) }}>
          <Eyebrow label="What changes on Monday" />
          <H2 style={{ maxWidth: 720 }}>Less admin. Fewer losses. A business you can actually see.</H2>
        </Reveal>

        <Reveal index={1}>
          <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(11,13,18,0.12)' }}>
            {outcomes.map((item, i) => (
              <View
                key={item.title}
                style={{
                  flexDirection: stack ? 'column' : 'row',
                  alignItems: stack ? 'flex-start' : 'baseline',
                  gap: stack ? 8 : f(16, 3, 40),
                  paddingVertical: f(18, 2, 24),
                  borderBottomWidth: i === outcomes.length - 1 ? 0 : 1,
                  borderBottomColor: color.line,
                }}
              >
                <Text
                  style={[
                    { fontFamily: font.mono, color: color.textFaint, width: 28 },
                    metrics(11, 1.4),
                  ]}
                >
                  {String(i + 1).padStart(2, '0')}
                </Text>

                <Text
                  style={[
                    { fontFamily: font.displaySemi, color: color.ink, flex: stack ? undefined : 1, minWidth: 200 },
                    metrics(f(20, 2.4, 30), 1.2, -0.03),
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    { fontFamily: font.body, color: color.textMuted, maxWidth: stack ? undefined : 380 },
                    metrics(14, 1.5),
                  ]}
                >
                  {item.body}
                </Text>
              </View>
            ))}
          </View>
        </Reveal>
      </Container>
    </Section>
  );
}
