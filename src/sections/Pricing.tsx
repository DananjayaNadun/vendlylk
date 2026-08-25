<<<<<<< HEAD
import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AutoGrid, Container, RuledTop, Section, SplitHead } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Button, LinkArrow } from '@/components/Button';
import { Tick } from '@/components/UI';
import { H2Sub, Note, metrics } from '@/components/Type';
import { growthFeatures, starterFeatures } from '@/data';
import { color, font, radius } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

export function Pricing() {
  const { f } = useViewport();
  const router = useRouter();

  return (
    <Section id="pricing" flushTop>
      <Container>
        <RuledTop>
          <Reveal index={0} style={{ marginBottom: f(32, 4, 44) }}>
            <SplitHead
              minItemWidth={300}
              left={<H2Sub style={{ maxWidth: 520 }}>Start free. Grow into the rest.</H2Sub>}
              right={
                <Note style={{ maxWidth: 420 }}>
                  Selling, order-taking and your storefront are free — for good. The operational tools come with
                  Growth.
                </Note>
              }
            />
          </Reveal>

          <Reveal index={1}>
            <AutoGrid minItemWidth={300} gap={18} align="stretch">
              <Plan
                name="Starter"
                tag="Free, always"
                tagTone="free"
                body="Everything you need to sell properly and keep your orders in one place."
                features={starterFeatures}
                cta={<Button label="Get Started Free" variant="quiet" block onPress={() => router.push('/signup')} />}
              />

              <Plan
                ink
                name="Growth"
                tag="Pricing at launch"
                tagTone="soon"
                body="Everything in Starter, plus the operational side of the business."
                features={growthFeatures}
                cta={<Button label="Start free, upgrade later" block onPress={() => router.push('/signup')} />}
              />

              <HonestNote />
            </AutoGrid>
          </Reveal>
        </RuledTop>
      </Container>
    </Section>
  );
}

function Plan({
  name,
  tag,
  tagTone,
  body,
  features,
  cta,
  ink = false,
}: {
  name: string;
  tag: string;
  tagTone: 'free' | 'soon';
  body: string;
  features: string[];
  cta: React.ReactNode;
  ink?: boolean;
}) {
  const { f } = useViewport();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: ink ? color.ink : color.paper2,
        borderWidth: ink ? 0 : 1,
        borderColor: 'rgba(11,13,18,0.09)',
        borderRadius: radius.panel,
        padding: f(24, 2.6, 34),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <Text
          accessibilityRole="header"
          style={[{ fontFamily: font.displayBold, color: ink ? color.white : color.ink }, metrics(24, 1.2, -0.03)]}
        >
          {name}
        </Text>
        <View
          style={{
            backgroundColor: tagTone === 'free' ? color.successWash : color.accent,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: radius.badge,
          }}
        >
          <Text
            style={[
              { fontFamily: font.bodySemi, color: tagTone === 'free' ? color.success : color.white },
              metrics(12, 1.3),
            ]}
          >
            {tag}
          </Text>
        </View>
      </View>

      <Text
        style={[
          { fontFamily: font.body, color: ink ? color.white60 : color.textMuted, marginBottom: 24 },
          metrics(14.5, 1.55),
        ]}
      >
        {body}
      </Text>

      <View style={{ gap: 13, marginBottom: 28 }}>
        {features.map((feature) => (
          <View key={feature} style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
            <Tick
              size={18}
              bg={ink ? 'rgba(43,76,242,0.3)' : color.accentWash}
              fg={ink ? color.white : color.accent}
              border={ink ? color.accent : undefined}
            />
            <Text
              style={[{ fontFamily: font.body, color: ink ? color.white : color.ink, flex: 1 }, metrics(14.5, 1.4)]}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 'auto' }}>{cta}</View>
    </View>
  );
}

function HonestNote() {
  const { f } = useViewport();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.paper2,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(11,13,18,0.16)',
        borderRadius: radius.panel,
        padding: f(24, 2.6, 34),
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text
          style={[
            { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 16 },
            metrics(10, 1.4, 0.14),
          ]}
        >
          Honest about where we are
        </Text>
        <Text style={[{ fontFamily: font.body, color: color.ink, marginBottom: 16 }, metrics(15, 1.6)]}>
          Vendly is preparing for launch in Sri Lanka. Final Growth pricing will be published before anyone is
          charged, in rupees, with no surprise conversions.
        </Text>
        <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14, 1.6)]}>
          Start on Starter today. Nothing you build — products, customers, orders — is lost when you upgrade.
        </Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <LinkArrow label="Talk to us about your business" />
      </View>
    </View>
  );
}
=======
import React from 'react';
import { Text, View } from 'react-native';
import { AutoGrid, Container, RuledTop, Section, SplitHead } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Button, LinkArrow } from '@/components/Button';
import { Tick } from '@/components/UI';
import { H2Sub, Note, metrics } from '@/components/Type';
import { growthFeatures, starterFeatures } from '@/data';
import { color, font, radius } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useScroll } from '@/scroll/ScrollProvider';

export function Pricing() {
  const { f } = useViewport();
  const { scrollToSection } = useScroll();

  return (
    <Section id="pricing" flushTop>
      <Container>
        <RuledTop>
          <Reveal index={0} style={{ marginBottom: f(32, 4, 44) }}>
            <SplitHead
              minItemWidth={300}
              left={<H2Sub style={{ maxWidth: 520 }}>Start free. Grow into the rest.</H2Sub>}
              right={
                <Note style={{ maxWidth: 420 }}>
                  Selling, order-taking and your storefront are free — for good. The operational tools come with
                  Growth.
                </Note>
              }
            />
          </Reveal>

          <Reveal index={1}>
            <AutoGrid minItemWidth={300} gap={18} align="stretch">
              <Plan
                name="Starter"
                tag="Free, always"
                tagTone="free"
                body="Everything you need to sell properly and keep your orders in one place."
                features={starterFeatures}
                cta={<Button label="Get Started Free" variant="quiet" block onPress={() => scrollToSection('get-started')} />}
              />

              <Plan
                ink
                name="Growth"
                tag="Pricing at launch"
                tagTone="soon"
                body="Everything in Starter, plus the operational side of the business."
                features={growthFeatures}
                cta={<Button label="Start free, upgrade later" block onPress={() => scrollToSection('get-started')} />}
              />

              <HonestNote />
            </AutoGrid>
          </Reveal>
        </RuledTop>
      </Container>
    </Section>
  );
}

function Plan({
  name,
  tag,
  tagTone,
  body,
  features,
  cta,
  ink = false,
}: {
  name: string;
  tag: string;
  tagTone: 'free' | 'soon';
  body: string;
  features: string[];
  cta: React.ReactNode;
  ink?: boolean;
}) {
  const { f } = useViewport();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: ink ? color.ink : color.paper2,
        borderWidth: ink ? 0 : 1,
        borderColor: 'rgba(11,13,18,0.09)',
        borderRadius: radius.panel,
        padding: f(24, 2.6, 34),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <Text
          accessibilityRole="header"
          style={[{ fontFamily: font.displayBold, color: ink ? color.white : color.ink }, metrics(24, 1.2, -0.03)]}
        >
          {name}
        </Text>
        <View
          style={{
            backgroundColor: tagTone === 'free' ? color.successWash : color.accent,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: radius.badge,
          }}
        >
          <Text
            style={[
              { fontFamily: font.bodySemi, color: tagTone === 'free' ? color.success : color.white },
              metrics(12, 1.3),
            ]}
          >
            {tag}
          </Text>
        </View>
      </View>

      <Text
        style={[
          { fontFamily: font.body, color: ink ? color.white60 : color.textMuted, marginBottom: 24 },
          metrics(14.5, 1.55),
        ]}
      >
        {body}
      </Text>

      <View style={{ gap: 13, marginBottom: 28 }}>
        {features.map((feature) => (
          <View key={feature} style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
            <Tick
              size={18}
              bg={ink ? 'rgba(43,76,242,0.3)' : color.accentWash}
              fg={ink ? color.white : color.accent}
              border={ink ? color.accent : undefined}
            />
            <Text
              style={[{ fontFamily: font.body, color: ink ? color.white : color.ink, flex: 1 }, metrics(14.5, 1.4)]}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 'auto' }}>{cta}</View>
    </View>
  );
}

function HonestNote() {
  const { f } = useViewport();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.paper2,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(11,13,18,0.16)',
        borderRadius: radius.panel,
        padding: f(24, 2.6, 34),
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text
          style={[
            { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 16 },
            metrics(10, 1.4, 0.14),
          ]}
        >
          Honest about where we are
        </Text>
        <Text style={[{ fontFamily: font.body, color: color.ink, marginBottom: 16 }, metrics(15, 1.6)]}>
          Vendly is preparing for launch in Sri Lanka. Final Growth pricing will be published before anyone is
          charged, in rupees, with no surprise conversions.
        </Text>
        <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14, 1.6)]}>
          Start on Starter today. Nothing you build — products, customers, orders — is lost when you upgrade.
        </Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <LinkArrow label="Talk to us about your business" />
      </View>
    </View>
  );
}
>>>>>>> c1decb5f08ffdabb7df20508d93878b536a73e30
