import React from 'react';
import { Image, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { brand, icons } from '@/assets';
import { Container, RuledTop, Section, SplitHead } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { WhatsAppIcon } from '@/components/icons';
import { H2Compact, Note, metrics } from '@/components/Type';
import { howItWorks } from '@/data';
import { color, font, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

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
              left={<H2Compact style={{ maxWidth: 520 }}>How Vendly.lk works</H2Compact>}
              right={
                <Note style={{ maxWidth: 460 }}>
                  Four steps, from the first message to a paid, delivered, recorded order.
                </Note>
              }
            />
          </Reveal>

          <Reveal index={1}>
            <ConnectedFlow />
          </Reveal>
        </RuledTop>
      </Container>
    </Section>
  );
}

/** One dot-and-line "connected flow" step per stage, from the first chat
    message to the parcel being marked delivered — a customer's own path
    through the system rather than a feature-by-feature grid. */
function ConnectedFlow() {
  const { isMobile } = useViewport();

  return (
    <View
      style={
        isMobile
          ? { gap: 26 }
          : { flexDirection: 'row', alignItems: 'flex-start' }
      }
    >
      {howItWorks.map((step, i) => (
        <React.Fragment key={step.title}>
          <FlowStep index={i} title={step.title} body={step.body} isMobile={isMobile} />
          {!isMobile && i < howItWorks.length - 1 && <Connector />}
        </React.Fragment>
      ))}
    </View>
  );
}

function FlowStep({
  index,
  title,
  body,
  isMobile,
}: {
  index: number;
  title: string;
  body: string;
  isMobile: boolean;
}) {
  if (isMobile) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        <StepDot index={index} />
        <View style={{ flex: 1 }}>
          <Text style={[{ fontFamily: font.displaySemi, color: color.ink, marginBottom: 4 }, metrics(16.5, 1.25, -0.01)]}>
            {title}
          </Text>
          <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14.5, 1.5)]}>{body}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 14, paddingHorizontal: 8, minWidth: 0 }}>
      <StepDot index={index} />
      <Text
        style={[
          { fontFamily: font.displaySemi, color: color.ink, textAlign: 'center' },
          metrics(16.5, 1.25, -0.01),
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          { fontFamily: font.body, color: color.textMuted, textAlign: 'center', maxWidth: 190 },
          metrics(14.5, 1.5),
        ]}
      >
        {body}
      </Text>
    </View>
  );
}

/** The line between two dots, sitting level with their centres regardless of
    how tall each step's copy runs beneath it. */
function Connector() {
  return (
    <View style={{ flex: 1, height: 2, minWidth: 24, marginTop: 31, backgroundColor: color.lineStrong }} />
  );
}

const DOT_SIZE = 64;

function StepDot({ index }: { index: number }) {
  const dark = index === 1;
  return (
    <View
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        backgroundColor: dark ? color.ink : color.paper2,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.panelSoft,
      }}
    >
      {index === 0 ? (
        <View style={{ alignItems: 'center', gap: 3 }}>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            <Image source={icons.facebook} style={{ width: 18, height: 18, borderRadius: 9 }} />
            <WhatsAppIcon size={18} round={130} />
          </View>
          <Image source={icons.instagram} style={{ width: 18, height: 18, borderRadius: 5 }} />
        </View>
      ) : index === 1 ? (
        <Image source={brand.light} resizeMode="contain" style={{ width: 26, height: 26 }} />
      ) : index === 2 ? (
        <PackageIcon />
      ) : index === 3 ? (
        <TruckIcon />
      ) : (
        <CheckIcon />
      )}
    </View>
  );
}

const iconProps = { width: 26, height: 26, viewBox: '0 0 24 24' } as const;
const strokeProps = { stroke: color.accent, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function PackageIcon() {
  return (
    <Svg {...iconProps}>
      <Path {...strokeProps} d="M4 9h16M6 9V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3M5 9l1 10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-10" />
    </Svg>
  );
}

function TruckIcon() {
  return (
    <Svg {...iconProps}>
      <Path {...strokeProps} d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
      <Path {...strokeProps} d="M7 18a1.6 1.6 0 1 0 0-.01M18 18a1.6 1.6 0 1 0 0-.01" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg {...iconProps}>
      <Path {...strokeProps} d="M4 12l5 5L20 6" />
    </Svg>
  );
}
