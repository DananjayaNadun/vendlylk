import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { icons } from '@/assets';
import { AutoGrid, Container, Section, useMeasuredWidth } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { WhatsAppIcon } from '@/components/icons';
import { Eyebrow } from '@/components/UI';
import { H2, Lede, metrics } from '@/components/Type';
import { realityPoints } from '@/data';
import { color, font, radius, shadow } from '@/theme/tokens';
import { autoFitColumns, trackWidth, useViewport } from '@/theme/responsive';

export function Reality() {
  const { f } = useViewport();

  return (
    <Section id="reality">
      <Container>
        <Reveal index={0} style={{ maxWidth: 820, marginBottom: f(44, 6, 76) }}>
          <Eyebrow label="The current reality" />
          <H2 style={{ marginBottom: 20 }}>
            Your business doesn't run in one place.
            <Text style={{ color: color.textDim }}> It runs in seventeen.</Text>
          </H2>
          <Lede style={{ maxWidth: 620 }}>
            Messenger, WhatsApp, a notebook by the till, one spreadsheet you're afraid to touch, and a courier
            receipt in your pocket. It works — until it costs you.
          </Lede>
        </Reveal>

        <Reveal index={1} style={{ marginBottom: f(44, 5, 68) }}>
          <AutoGrid minItemWidth={240} gap={16}>
            <Scrap rotate="-0.7deg">
              <ScrapHead icon={<Image source={icons.facebook} style={{ width: 18, height: 18, borderRadius: 9 }} />} label="Messenger" />
              <View style={{ gap: 8 }}>
                <Bubble text="Is the black one available?" />
                <Bubble text="Hello? Still there?" />
              </View>
            </Scrap>

            <Scrap rotate="0.5deg">
              <ScrapHead icon={<WhatsAppIcon size={18} round={130} />} label="WhatsApp" />
              <View style={{ gap: 8 }}>
                <Bubble text="Delivery to Kandy how much?" />
                <Bubble text="Name, address, number pls" out />
              </View>
            </Scrap>

            <Scrap rotate="-0.4deg" paper>
              <ScrapLabel label="Notebook" />
              <View style={{ gap: 8 }}>
                <NoteLine text="Nimal — 2 hoodie — 13,800?" />
                <NoteLine text="Kandy parcel — sent 12th" struck />
                <NoteLine text="advance 2000 — bal COD" />
              </View>
            </Scrap>

            <Scrap rotate="0.8deg">
              <ScrapLabel label="Courier receipt" />
              <View style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(11,13,18,0.2)', borderRadius: 10, padding: 12 }}>
                <ReceiptRow left="Parcel" right="Returned" />
                <ReceiptRow left="COD refused" right="− Rs. 450" loss />
              </View>
            </Scrap>
          </AutoGrid>
        </Reveal>

        <Reveal index={2}>
          <PointsGrid />
        </Reveal>
      </Container>
    </Section>
  );
}

/**
 * The A–F grid. Its hairlines depend on how many tracks the auto-fit grid
 * resolved to, so the column count is computed rather than assumed.
 */
function PointsGrid() {
  const [width, onLayout] = useMeasuredWidth();
  const columns = width > 0 ? autoFitColumns(width, 280, 0) : 1;
  const track = width > 0 ? trackWidth(width, columns, 0) : 0;

  return (
    <View
      onLayout={onLayout}
      style={{ borderTopWidth: 1, borderTopColor: color.lineStrong, flexDirection: 'row', flexWrap: 'wrap' }}
    >
      {realityPoints.map((point, i) => {
        const isFirstInRow = i % columns === 0;
        const isLastInRow = i % columns === columns - 1;
        const isSecondRow = i >= columns;
        return (
          <View
            key={point.key}
            style={{
              width: track || '100%',
              maxWidth: '100%',
              paddingVertical: 26,
              paddingLeft: isFirstInRow ? 0 : 26,
              paddingRight: 26,
              borderRightWidth: isLastInRow || columns === 1 ? 0 : 1,
              borderRightColor: color.line,
              borderTopWidth: isSecondRow ? 1 : 0,
              borderTopColor: color.line,
            }}
          >
            <Text style={[{ fontFamily: font.mono, color: color.accent }, metrics(11, 1.4)]}>{point.key}</Text>
            <Text style={[{ fontFamily: font.bodyMedium, color: color.ink, marginTop: 10 }, metrics(15.5, 1.5)]}>
              {point.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/* ---------------------------------------------------------------- pieces */

function Scrap({
  rotate,
  paper = false,
  children,
}: {
  rotate: string;
  paper?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: paper ? color.paperNote : color.paper2,
        borderWidth: 1,
        borderColor: 'rgba(11,13,18,0.07)',
        borderRadius: 14,
        padding: 18,
        transform: [{ rotate }],
        ...shadow.scrap,
      }}
    >
      {children}
    </View>
  );
}

function ScrapHead({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      {icon}
      <Text style={[{ fontFamily: font.bodySemi, color: color.textMuted }, metrics(12, 1.4)]}>{label}</Text>
    </View>
  );
}

function ScrapLabel({ label }: { label: string }) {
  return (
    <Text
      style={[
        { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 14 },
        metrics(10.5, 1.4, 0.12),
      ]}
    >
      {label}
    </Text>
  );
}

function Bubble({ text, out = false }: { text: string; out?: boolean }) {
  return (
    <View
      style={{
        alignSelf: out ? 'flex-end' : 'flex-start',
        maxWidth: '90%',
        backgroundColor: out ? color.successWash : color.wash,
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: out ? 12 : 4,
        borderBottomRightRadius: out ? 4 : 12,
      }}
    >
      <Text style={[{ fontFamily: font.body, color: color.ink }, metrics(13, 1.4)]}>{text}</Text>
    </View>
  );
}

function NoteLine({ text, struck = false }: { text: string; struck?: boolean }) {
  return (
    <Text
      style={[
        {
          fontFamily: font.mono,
          color: color.textSoft,
          opacity: struck ? 0.55 : 1,
          textDecorationLine: struck ? 'line-through' : 'none',
        },
        metrics(12.5, 1.4),
      ]}
    >
      {text}
    </Text>
  );
}

function ReceiptRow({ left, right, loss = false }: { left: string; right: string; loss?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: loss ? 0 : 8 }}>
      <Text
        style={[
          { fontFamily: loss ? font.monoMedium : font.mono, color: loss ? color.danger : color.textSoft },
          metrics(12, 1.4),
        ]}
      >
        {left}
      </Text>
      <Text
        style={[
          { fontFamily: loss ? font.monoMedium : font.mono, color: loss ? color.danger : color.textSoft },
          metrics(12, 1.4),
        ]}
      >
        {right}
      </Text>
    </View>
  );
}
