<<<<<<< HEAD
import React from 'react';
import { Image, Text, View } from 'react-native';
import { icons } from '@/assets';
import { AutoGrid, Container, Section } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { WhatsAppIcon } from '@/components/icons';
import { Badge, Eyebrow, Tick } from '@/components/UI';
import { H2, H3, Lede, metrics } from '@/components/Type';
import { color, font, radius } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

export function KeepSelling() {
  const { f } = useViewport();

  return (
    <Section id="keep-selling">
      <Container>
        <Reveal index={0} style={{ maxWidth: 780, marginBottom: f(40, 5, 64) }}>
          <Eyebrow label="No behaviour change" />
          <H2 style={{ marginBottom: 20 }}>Keep selling the way you already sell.</H2>
          <Lede style={{ maxWidth: 620 }}>
            Some customers will tap your storefront link. Others will insist on finishing the whole thing in chat.
            Both are fine — both end up as one structured order.
          </Lede>
        </Reveal>

        <Reveal index={1}>
          <AutoGrid minItemWidth={300} gap={18} align="stretch">
            <PathCard
              label="Path A"
              badge={<Badge label="Customer completes it" tone="accent" />}
              title="You send the link. They do the typing."
              body="Reply with “Complete your order here.” The storefront collects the product, address, phone and payment method — correctly, the first time."
              steps={[
                { icon: <WhatsAppIcon size={20} round={110} />, text: 'vendly.lk/kandyan-threads', state: 'Opened' },
                { icon: <Tick size={20} round={6} bg={color.accent} fg={color.white} />, text: 'Order #2418 created automatically' },
              ]}
            />

            <PathCard
              label="Path B"
              badge={<Badge label="You enter it yourself" tone="neutral" />}
              title="They'd rather chat. Add the order in seconds."
              body="Nobody is forced onto a link. Create the order manually and it behaves exactly like every other order — same records, same courier flow, same reports."
              steps={[
                {
                  icon: <Image source={icons.facebook} style={{ width: 20, height: 20, borderRadius: 10 }} />,
                  text: '“Just send 2 to my usual address”',
                },
                { icon: <Tick size={20} round={6} bg={color.ink} fg={color.white} glyph="+" />, text: 'New order · returning customer found' },
              ]}
            />

            <EitherWay />
          </AutoGrid>
        </Reveal>
      </Container>
    </Section>
  );
}

function PathCard({
  label,
  badge,
  title,
  body,
  steps,
}: {
  label: string;
  badge: React.ReactNode;
  title: string;
  body: string;
  steps: { icon: React.ReactNode; text: string; state?: string }[];
}) {
  const { f } = useViewport();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.paper2,
        borderWidth: 1,
        borderColor: 'rgba(11,13,18,0.07)',
        borderRadius: radius.card,
        padding: f(22, 2.4, 32),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <Text
          style={[
            { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase' },
            metrics(10.5, 1.4, 0.14),
          ]}
        >
          {label}
        </Text>
        {badge}
      </View>

      <H3 style={{ marginBottom: 12 }}>{title}</H3>
      <Text style={[{ fontFamily: font.body, color: color.textMuted, marginBottom: 22 }, metrics(14.5, 1.55)]}>
        {body}
      </Text>

      <View style={{ marginTop: 'auto', gap: 10 }}>
        {steps.map((step) => (
          <View
            key={step.text}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: color.paper,
              borderRadius: 11,
              padding: 12,
            }}
          >
            {step.icon}
            <Text style={[{ fontFamily: font.body, color: color.ink, flex: 1 }, metrics(13, 1.4)]}>{step.text}</Text>
            {step.state ? (
              <Text style={[{ fontFamily: font.bodySemi, color: color.live }, metrics(11, 1.3)]}>{step.state}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

function EitherWay() {
  const { f } = useViewport();
  const outcomes = [
    'Stock adjusted',
    'Customer history updated',
    'Invoice and receipt ready',
    'Counted in your reports',
  ];

  return (
    <View
      style={{
        flex: 1,
        minHeight: 260,
        backgroundColor: color.ink,
        borderRadius: radius.card,
        padding: f(22, 2.4, 32),
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text
          style={[
            { fontFamily: font.mono, color: color.white42, textTransform: 'uppercase' },
            metrics(10.5, 1.4, 0.14),
          ]}
        >
          Either way
        </Text>
        <Text
          accessibilityRole="header"
          style={[
            { fontFamily: font.displayBold, color: color.white, marginTop: 18, marginBottom: 12 },
            metrics(f(22, 2, 28), 1.1, -0.03),
          ]}
        >
          One structured order, in one place.
        </Text>
        <Text style={[{ fontFamily: font.body, color: color.white60 }, metrics(14.5, 1.55)]}>
          Chat stays where your customers are comfortable. The record of the sale lives where you can actually run
          a business from it.
        </Text>
      </View>

      <View style={{ gap: 9, marginTop: 26 }}>
        {outcomes.map((item) => (
          <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Tick size={16} bg="rgba(43,76,242,0.25)" border={color.accent} fg={color.white} />
            <Text style={[{ fontFamily: font.body, color: color.white86 }, metrics(13.5, 1.4)]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
=======
import React from 'react';
import { Image, Text, View } from 'react-native';
import { icons } from '@/assets';
import { AutoGrid, Container, Section } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { WhatsAppIcon } from '@/components/icons';
import { Badge, Eyebrow, Tick } from '@/components/UI';
import { H2, H3, Lede, metrics } from '@/components/Type';
import { color, font, radius } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

export function KeepSelling() {
  const { f } = useViewport();

  return (
    <Section id="keep-selling">
      <Container>
        <Reveal index={0} style={{ maxWidth: 780, marginBottom: f(40, 5, 64) }}>
          <Eyebrow label="No behaviour change" />
          <H2 style={{ marginBottom: 20 }}>Keep selling the way you already sell.</H2>
          <Lede style={{ maxWidth: 620 }}>
            Some customers will tap your storefront link. Others will insist on finishing the whole thing in chat.
            Both are fine — both end up as one structured order.
          </Lede>
        </Reveal>

        <Reveal index={1}>
          <AutoGrid minItemWidth={300} gap={18} align="stretch">
            <PathCard
              label="Path A"
              badge={<Badge label="Customer completes it" tone="accent" />}
              title="You send the link. They do the typing."
              body="Reply with “Complete your order here.” The storefront collects the product, address, phone and payment method — correctly, the first time."
              steps={[
                { icon: <WhatsAppIcon size={20} round={110} />, text: 'vendly.lk/kandyan-threads', state: 'Opened' },
                { icon: <Tick size={20} round={6} bg={color.accent} fg={color.white} />, text: 'Order #2418 created automatically' },
              ]}
            />

            <PathCard
              label="Path B"
              badge={<Badge label="You enter it yourself" tone="neutral" />}
              title="They'd rather chat. Add the order in seconds."
              body="Nobody is forced onto a link. Create the order manually and it behaves exactly like every other order — same records, same courier flow, same reports."
              steps={[
                {
                  icon: <Image source={icons.facebook} style={{ width: 20, height: 20, borderRadius: 10 }} />,
                  text: '“Just send 2 to my usual address”',
                },
                { icon: <Tick size={20} round={6} bg={color.ink} fg={color.white} glyph="+" />, text: 'New order · returning customer found' },
              ]}
            />

            <EitherWay />
          </AutoGrid>
        </Reveal>
      </Container>
    </Section>
  );
}

function PathCard({
  label,
  badge,
  title,
  body,
  steps,
}: {
  label: string;
  badge: React.ReactNode;
  title: string;
  body: string;
  steps: { icon: React.ReactNode; text: string; state?: string }[];
}) {
  const { f } = useViewport();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.paper2,
        borderWidth: 1,
        borderColor: 'rgba(11,13,18,0.07)',
        borderRadius: radius.card,
        padding: f(22, 2.4, 32),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <Text
          style={[
            { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase' },
            metrics(10.5, 1.4, 0.14),
          ]}
        >
          {label}
        </Text>
        {badge}
      </View>

      <H3 style={{ marginBottom: 12 }}>{title}</H3>
      <Text style={[{ fontFamily: font.body, color: color.textMuted, marginBottom: 22 }, metrics(14.5, 1.55)]}>
        {body}
      </Text>

      <View style={{ marginTop: 'auto', gap: 10 }}>
        {steps.map((step) => (
          <View
            key={step.text}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: color.paper,
              borderRadius: 11,
              padding: 12,
            }}
          >
            {step.icon}
            <Text style={[{ fontFamily: font.body, color: color.ink, flex: 1 }, metrics(13, 1.4)]}>{step.text}</Text>
            {step.state ? (
              <Text style={[{ fontFamily: font.bodySemi, color: color.live }, metrics(11, 1.3)]}>{step.state}</Text>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

function EitherWay() {
  const { f } = useViewport();
  const outcomes = [
    'Stock adjusted',
    'Customer history updated',
    'Invoice and receipt ready',
    'Counted in your reports',
  ];

  return (
    <View
      style={{
        flex: 1,
        minHeight: 260,
        backgroundColor: color.ink,
        borderRadius: radius.card,
        padding: f(22, 2.4, 32),
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text
          style={[
            { fontFamily: font.mono, color: color.white42, textTransform: 'uppercase' },
            metrics(10.5, 1.4, 0.14),
          ]}
        >
          Either way
        </Text>
        <Text
          accessibilityRole="header"
          style={[
            { fontFamily: font.displayBold, color: color.white, marginTop: 18, marginBottom: 12 },
            metrics(f(22, 2, 28), 1.1, -0.03),
          ]}
        >
          One structured order, in one place.
        </Text>
        <Text style={[{ fontFamily: font.body, color: color.white60 }, metrics(14.5, 1.55)]}>
          Chat stays where your customers are comfortable. The record of the sale lives where you can actually run
          a business from it.
        </Text>
      </View>

      <View style={{ gap: 9, marginTop: 26 }}>
        {outcomes.map((item) => (
          <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Tick size={16} bg="rgba(43,76,242,0.25)" border={color.accent} fg={color.white} />
            <Text style={[{ fontFamily: font.body, color: color.white86 }, metrics(13.5, 1.4)]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
>>>>>>> c1decb5f08ffdabb7df20508d93878b536a73e30
