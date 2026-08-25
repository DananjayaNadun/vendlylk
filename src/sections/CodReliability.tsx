<<<<<<< HEAD
import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AutoGrid, Container, Section } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/Button';
import { Eyebrow, Initials } from '@/components/UI';
import { H2, Lede, metrics } from '@/components/Type';
import { color, font, radius } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

const HISTORY: ('ok' | 'no' | 'next')[] = ['ok', 'ok', 'ok', 'no', 'ok', 'no', 'no', 'next'];

export function CodReliability() {
  const { f } = useViewport();

  return (
    <Section id="cod" tone="ink">
      <Container>
        <Reveal index={0}>
          <AutoGrid minItemWidth={320} gap={f(36, 5, 80)} align="flex-start">
            <View>
              <Eyebrow label="COD Reliability Score" tone="ink" />
              <H2 style={{ color: color.white, marginBottom: 20 }}>Stop paying for parcels that come back.</H2>
              <Lede style={{ color: color.white62, maxWidth: 540, marginBottom: 30 }}>
                When the same customer refuses cash-on-delivery again and again, you pay the courier both ways.
                Vendly.lk keeps that history for you and quietly adjusts what that customer can choose at checkout.
              </Lede>

              <View style={{ gap: 14, marginBottom: 32 }}>
                {[
                  'Delivered and collected orders build reliability.',
                  'Repeated refusals and returns reduce it.',
                  'If COD becomes unavailable, the customer still has three ways to buy.',
                ].map((line) => (
                  <View key={line} style={{ flexDirection: 'row', gap: 12 }}>
                    <Text style={{ color: color.accentLight, fontSize: 14.5, lineHeight: 22.5 }}>—</Text>
                    <Text style={[{ fontFamily: font.body, color: color.white80, flex: 1 }, metrics(14.5, 1.55)]}>
                      {line}
                    </Text>
                  </View>
                ))}
              </View>

              <Button label="How the score works" size="sm" arrow />

              <Text
                style={[
                  { fontFamily: font.body, color: color.white38, marginTop: 26, maxWidth: 460 },
                  metrics(12.5, 1.5),
                ]}
              >
                Reliability is calculated inside your own business only. Vendly does not share customer scores
                between businesses.
              </Text>
            </View>

            <View>
              <ScoreCard />
              <AlternativesCard />
            </View>
          </AutoGrid>
        </Reveal>
      </Container>
    </Section>
  );
}

function ScoreCard() {
  const { f } = useViewport();

  return (
    <View
      style={{
        backgroundColor: color.white04,
        borderWidth: 1,
        borderColor: color.white12,
        borderRadius: radius.card,
        padding: f(20, 2.2, 26),
        marginBottom: 14,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 13,
          paddingBottom: 18,
          borderBottomWidth: 1,
          borderBottomColor: color.lineInk,
        }}
      >
        <Initials text="TK" size={42} round={12} bg={color.white08} fg={color.white} fontSize={14} />
        <View style={{ flex: 1 }}>
          <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(15, 1.3)]}>Tharindu K.</Text>
          <Text style={[{ fontFamily: font.body, color: color.white50, marginTop: 2 }, metrics(12, 1.35)]}>
            Wattala · 9 orders with you
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'rgba(228,199,122,0.13)',
            borderWidth: 1,
            borderColor: 'rgba(228,199,122,0.3)',
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: radius.badge,
          }}
        >
          <Text style={[{ fontFamily: font.bodySemi, color: color.goldLight }, metrics(11.5, 1.3)]}>Moderate</Text>
        </View>
      </View>

      <View style={{ paddingVertical: 18 }}>
        <Text
          style={[
            { fontFamily: font.mono, color: color.white40, textTransform: 'uppercase', marginBottom: 12 },
            metrics(9.5, 1.4, 0.12),
          ]}
        >
          COD history
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {HISTORY.map((mark, i) => (
            <View
              key={i}
              style={{
                width: 30,
                height: 30,
                borderRadius: radius.chip,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderStyle: mark === 'next' ? 'dashed' : 'solid',
                backgroundColor:
                  mark === 'ok'
                    ? 'rgba(18,169,123,0.16)'
                    : mark === 'no'
                      ? 'rgba(214,90,52,0.16)'
                      : color.white05,
                borderColor:
                  mark === 'ok'
                    ? 'rgba(18,169,123,0.45)'
                    : mark === 'no'
                      ? 'rgba(214,90,52,0.5)'
                      : 'rgba(255,255,255,0.2)',
              }}
            >
              <Text
                style={{
                  color: mark === 'ok' ? '#4FD6A8' : mark === 'no' ? '#F09A78' : 'rgba(255,255,255,0.35)',
                  fontSize: mark === 'next' ? 11 : 12,
                }}
              >
                {mark === 'ok' ? '✓' : mark === 'no' ? '✕' : '·'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ paddingTop: 4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={[{ fontFamily: font.body, color: color.white60 }, metrics(12.5, 1.3)]}>Reliability</Text>
          <Text style={[{ fontFamily: font.mono, color: color.white60 }, metrics(12.5, 1.3)]}>Moderate</Text>
        </View>

        <View style={{ height: 7, borderRadius: 5, backgroundColor: color.white08, overflow: 'hidden' }}>
          <LinearGradient
            colors={[color.gold, color.goldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '54%', height: 7 }}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          {['Low', 'Reliable'].map((label) => (
            <Text
              key={label}
              style={[
                { fontFamily: font.mono, color: color.white34, textTransform: 'uppercase' },
                metrics(9.5, 1.4, 0.1),
              ]}
            >
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function AlternativesCard() {
  const { f } = useViewport();
  const options = [
    { label: 'Pay by card' },
    { label: 'Bank transfer' },
    { label: 'Prepay the delivery fee', hint: 'Rs. 450 now, the rest as cash on delivery' },
  ];

  return (
    <View
      style={{
        backgroundColor: 'rgba(43,76,242,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(43,76,242,0.35)',
        borderRadius: radius.card,
        padding: f(20, 2.2, 26),
      }}
    >
      <Text style={[{ fontFamily: font.bodySemi, color: color.white, marginBottom: 4 }, metrics(14.5, 1.3)]}>
        COD is paused for this customer
      </Text>
      <Text style={[{ fontFamily: font.body, color: color.white62, marginBottom: 18 }, metrics(13.5, 1.5)]}>
        They can still order — with a payment method that protects you both.
      </Text>

      <View style={{ gap: 8 }}>
        {options.map((option, i) => (
          <View
            key={option.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 11,
              backgroundColor: color.white06,
              borderRadius: 11,
              paddingVertical: 13,
              paddingHorizontal: 14,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: radius.badge,
                backgroundColor: i === options.length - 1 ? color.accent : color.white,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={[
                  { fontFamily: font.bodySemi, color: i === options.length - 1 ? color.white : color.ink },
                  metrics(11, 1.3),
                ]}
              >
                {i + 1}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[{ fontFamily: font.body, color: color.white }, metrics(13.5, 1.35)]}>{option.label}</Text>
              {option.hint ? (
                <Text style={[{ fontFamily: font.body, color: color.white50, marginTop: 2 }, metrics(12, 1.35)]}>
                  {option.hint}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
=======
import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AutoGrid, Container, Section } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/Button';
import { Eyebrow, Initials } from '@/components/UI';
import { H2, Lede, metrics } from '@/components/Type';
import { color, font, radius } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

const HISTORY: ('ok' | 'no' | 'next')[] = ['ok', 'ok', 'ok', 'no', 'ok', 'no', 'no', 'next'];

export function CodReliability() {
  const { f } = useViewport();

  return (
    <Section id="cod" tone="ink">
      <Container>
        <Reveal index={0}>
          <AutoGrid minItemWidth={320} gap={f(36, 5, 80)} align="flex-start">
            <View>
              <Eyebrow label="COD Reliability Score" tone="ink" />
              <H2 style={{ color: color.white, marginBottom: 20 }}>Stop paying for parcels that come back.</H2>
              <Lede style={{ color: color.white62, maxWidth: 540, marginBottom: 30 }}>
                When the same customer refuses cash-on-delivery again and again, you pay the courier both ways.
                OrderFlow keeps that history for you and quietly adjusts what that customer can choose at checkout.
              </Lede>

              <View style={{ gap: 14, marginBottom: 32 }}>
                {[
                  'Delivered and collected orders build reliability.',
                  'Repeated refusals and returns reduce it.',
                  'If COD becomes unavailable, the customer still has three ways to buy.',
                ].map((line) => (
                  <View key={line} style={{ flexDirection: 'row', gap: 12 }}>
                    <Text style={{ color: color.accentLight, fontSize: 14.5, lineHeight: 22.5 }}>—</Text>
                    <Text style={[{ fontFamily: font.body, color: color.white80, flex: 1 }, metrics(14.5, 1.55)]}>
                      {line}
                    </Text>
                  </View>
                ))}
              </View>

              <Button label="How the score works" size="sm" arrow />

              <Text
                style={[
                  { fontFamily: font.body, color: color.white38, marginTop: 26, maxWidth: 460 },
                  metrics(12.5, 1.5),
                ]}
              >
                Reliability is calculated inside your own business only. Vendly does not share customer scores
                between businesses.
              </Text>
            </View>

            <View>
              <ScoreCard />
              <AlternativesCard />
            </View>
          </AutoGrid>
        </Reveal>
      </Container>
    </Section>
  );
}

function ScoreCard() {
  const { f } = useViewport();

  return (
    <View
      style={{
        backgroundColor: color.white04,
        borderWidth: 1,
        borderColor: color.white12,
        borderRadius: radius.card,
        padding: f(20, 2.2, 26),
        marginBottom: 14,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 13,
          paddingBottom: 18,
          borderBottomWidth: 1,
          borderBottomColor: color.lineInk,
        }}
      >
        <Initials text="TK" size={42} round={12} bg={color.white08} fg={color.white} fontSize={14} />
        <View style={{ flex: 1 }}>
          <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(15, 1.3)]}>Tharindu K.</Text>
          <Text style={[{ fontFamily: font.body, color: color.white50, marginTop: 2 }, metrics(12, 1.35)]}>
            Wattala · 9 orders with you
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'rgba(228,199,122,0.13)',
            borderWidth: 1,
            borderColor: 'rgba(228,199,122,0.3)',
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: radius.badge,
          }}
        >
          <Text style={[{ fontFamily: font.bodySemi, color: color.goldLight }, metrics(11.5, 1.3)]}>Moderate</Text>
        </View>
      </View>

      <View style={{ paddingVertical: 18 }}>
        <Text
          style={[
            { fontFamily: font.mono, color: color.white40, textTransform: 'uppercase', marginBottom: 12 },
            metrics(9.5, 1.4, 0.12),
          ]}
        >
          COD history
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {HISTORY.map((mark, i) => (
            <View
              key={i}
              style={{
                width: 30,
                height: 30,
                borderRadius: radius.chip,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderStyle: mark === 'next' ? 'dashed' : 'solid',
                backgroundColor:
                  mark === 'ok'
                    ? 'rgba(18,169,123,0.16)'
                    : mark === 'no'
                      ? 'rgba(214,90,52,0.16)'
                      : color.white05,
                borderColor:
                  mark === 'ok'
                    ? 'rgba(18,169,123,0.45)'
                    : mark === 'no'
                      ? 'rgba(214,90,52,0.5)'
                      : 'rgba(255,255,255,0.2)',
              }}
            >
              <Text
                style={{
                  color: mark === 'ok' ? '#4FD6A8' : mark === 'no' ? '#F09A78' : 'rgba(255,255,255,0.35)',
                  fontSize: mark === 'next' ? 11 : 12,
                }}
              >
                {mark === 'ok' ? '✓' : mark === 'no' ? '✕' : '·'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ paddingTop: 4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={[{ fontFamily: font.body, color: color.white60 }, metrics(12.5, 1.3)]}>Reliability</Text>
          <Text style={[{ fontFamily: font.mono, color: color.white60 }, metrics(12.5, 1.3)]}>Moderate</Text>
        </View>

        <View style={{ height: 7, borderRadius: 5, backgroundColor: color.white08, overflow: 'hidden' }}>
          <LinearGradient
            colors={[color.gold, color.goldLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: '54%', height: 7 }}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          {['Low', 'Reliable'].map((label) => (
            <Text
              key={label}
              style={[
                { fontFamily: font.mono, color: color.white34, textTransform: 'uppercase' },
                metrics(9.5, 1.4, 0.1),
              ]}
            >
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function AlternativesCard() {
  const { f } = useViewport();
  const options = [
    { label: 'Pay by card' },
    { label: 'Bank transfer' },
    { label: 'Prepay the delivery fee', hint: 'Rs. 450 now, the rest as cash on delivery' },
  ];

  return (
    <View
      style={{
        backgroundColor: 'rgba(43,76,242,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(43,76,242,0.35)',
        borderRadius: radius.card,
        padding: f(20, 2.2, 26),
      }}
    >
      <Text style={[{ fontFamily: font.bodySemi, color: color.white, marginBottom: 4 }, metrics(14.5, 1.3)]}>
        COD is paused for this customer
      </Text>
      <Text style={[{ fontFamily: font.body, color: color.white62, marginBottom: 18 }, metrics(13.5, 1.5)]}>
        They can still order — with a payment method that protects you both.
      </Text>

      <View style={{ gap: 8 }}>
        {options.map((option, i) => (
          <View
            key={option.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 11,
              backgroundColor: color.white06,
              borderRadius: 11,
              paddingVertical: 13,
              paddingHorizontal: 14,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: radius.badge,
                backgroundColor: i === options.length - 1 ? color.accent : color.white,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={[
                  { fontFamily: font.bodySemi, color: i === options.length - 1 ? color.white : color.ink },
                  metrics(11, 1.3),
                ]}
              >
                {i + 1}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[{ fontFamily: font.body, color: color.white }, metrics(13.5, 1.35)]}>{option.label}</Text>
              {option.hint ? (
                <Text style={[{ fontFamily: font.body, color: color.white50, marginTop: 2 }, metrics(12, 1.35)]}>
                  {option.hint}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
>>>>>>> c1decb5f08ffdabb7df20508d93878b536a73e30
