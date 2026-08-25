<<<<<<< HEAD
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { AutoGrid, Container, Section } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { WhatsAppIcon } from '@/components/icons';
import { Eyebrow, Tick } from '@/components/UI';
import { H2Sub, Note, metrics } from '@/components/Type';
import { color, font, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useReducedMotion } from '@/theme/useReducedMotion';

const CAPABILITIES = [
  { strong: 'Answers from your data', rest: ' — availability, price, delivery fee, order status.' },
  { strong: 'Collects order details', rest: ' — product, size, address, phone, payment.' },
  { strong: 'Hands over cleanly', rest: ' — anything unusual goes to you, with the full thread.' },
  { strong: 'Every conversation kept', rest: ' — read what was said, on any order.' },
];

export function AiAssistant() {
  const { f } = useViewport();

  return (
    <Section id="ai">
      <Container>
        <Reveal index={0}>
          <AutoGrid minItemWidth={300} gap={f(28, 4, 64)} align="flex-start">
            <View>
              <Eyebrow label="AI assistant · in every plan" />
              <H2Sub style={{ maxWidth: 460, marginBottom: 18 }}>
                The same three questions, answered without you.
              </H2Sub>
              <Note style={{ maxWidth: 440, marginBottom: 28 }}>
                It knows your real products, prices, stock and delivery areas. It can take a straightforward order
                all the way through — and it steps back the moment a conversation needs a person.
              </Note>

              <View style={{ borderTopWidth: 1, borderTopColor: color.lineStrong }}>
                {CAPABILITIES.map((item, i) => (
                  <View
                    key={item.strong}
                    style={{
                      paddingVertical: 15,
                      borderBottomWidth: i === CAPABILITIES.length - 1 ? 0 : 1,
                      borderBottomColor: color.line,
                    }}
                  >
                    <Text style={[{ fontFamily: font.body, color: color.ink }, metrics(14.5, 1.45)]}>
                      <Text style={{ fontFamily: font.bodySemi }}>{item.strong}</Text>
                      {item.rest}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <ChatPanel />
          </AutoGrid>
        </Reveal>
      </Container>
    </Section>
  );
}

function ChatPanel() {
  return (
    <View
      style={{
        backgroundColor: color.paper2,
        borderWidth: 1,
        borderColor: color.line,
        borderRadius: radius.card,
        overflow: 'hidden',
        ...shadow.chatPanel,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(11,13,18,0.07)',
          backgroundColor: color.paper3,
        }}
      >
        <WhatsAppIcon size={19} round={110} />
        <Text style={[{ fontFamily: font.bodySemi, color: color.ink, flex: 1 }, metrics(13.5, 1.3)]}>
          Chat with Kandyan Threads
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: color.accentWash,
            paddingVertical: 5,
            paddingHorizontal: 9,
            borderRadius: radius.badge,
          }}
        >
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color.accent }} />
          <Text style={[{ fontFamily: font.bodySemi, color: color.accentHover }, metrics(11, 1.3)]}>AI replying</Text>
        </View>
      </View>

      <View style={{ padding: 16, paddingVertical: 18, gap: 10, backgroundColor: '#FDFDFC' }}>
        <Msg text="Do you have XL?" />
        <Msg text="Yes — XL is available in charcoal. Rs. 6,900." out />
        <Msg text="How much is delivery?" />
        <Msg text="Delivery to Colombo is Rs. 350, 1–2 days. Shall I place the order?" out />
        <Msg text="Yes. Nimal, Nugegoda, 077…" />

        <View
          style={{
            alignSelf: 'flex-end',
            maxWidth: '82%',
            backgroundColor: color.paper2,
            borderWidth: 1,
            borderColor: color.lineStrong,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 5,
            paddingVertical: 13,
            paddingHorizontal: 14,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Tick size={18} round={5} bg={color.live} fg={color.white} />
            <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(12.5, 1.3)]}>
              Order #2418 created
            </Text>
          </View>
          <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(12.5, 1.45)]}>
            Hoodie XL · Rs. 6,900 + Rs. 350 delivery · COD
          </Text>
        </View>

        <Msg text="Can I return it if the size is wrong?" />

        <View
          style={{
            alignSelf: 'flex-end',
            maxWidth: '82%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 9,
            backgroundColor: color.cautionWash,
            borderWidth: 1,
            borderColor: 'rgba(201,138,43,0.3)',
            borderRadius: radius.control,
            paddingVertical: 11,
            paddingHorizontal: 13,
          }}
        >
          <Tick size={20} round={6} bg={color.gold} fg={color.white} glyph="↑" />
          <View style={{ flex: 1 }}>
            <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(12.5, 1.3)]}>Handed to you</Text>
            <Text style={[{ fontFamily: font.body, color: color.caution, marginTop: 1 }, metrics(12, 1.3)]}>
              Return policy question · needs a person
            </Text>
          </View>
        </View>

        <TypingDots />
      </View>
    </View>
  );
}

function Msg({ text, out = false }: { text: string; out?: boolean }) {
  return (
    <View
      style={{
        alignSelf: out ? 'flex-end' : 'flex-start',
        maxWidth: '78%',
        backgroundColor: out ? color.accent : color.wash,
        paddingVertical: 11,
        paddingHorizontal: 14,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        borderBottomLeftRadius: out ? 14 : 5,
        borderBottomRightRadius: out ? 5 : 14,
      }}
    >
      <Text style={[{ fontFamily: font.body, color: out ? color.white : color.ink }, metrics(13.5, 1.45)]}>
        {text}
      </Text>
    </View>
  );
}

function TypingDots() {
  const reduced = useReducedMotion();
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    if (reduced) return;
    const loops = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, { toValue: 1, duration: 420, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 420, easing: Easing.in(Easing.ease), useNativeDriver: true }),
          Animated.delay(560 - i * 200),
        ]),
      ),
    );
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [reduced]);

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        gap: 4,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: color.wash,
        borderRadius: 14,
      }}
      accessibilityLabel="Typing"
    >
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: color.textFaint,
            opacity: reduced ? 0.6 : dot.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }),
            transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }],
          }}
        />
      ))}
    </View>
  );
}
=======
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { AutoGrid, Container, Section } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { WhatsAppIcon } from '@/components/icons';
import { Eyebrow, Tick } from '@/components/UI';
import { H2Sub, Note, metrics } from '@/components/Type';
import { color, font, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useReducedMotion } from '@/theme/useReducedMotion';

const CAPABILITIES = [
  { strong: 'Answers from your data', rest: ' — availability, price, delivery fee, order status.' },
  { strong: 'Collects order details', rest: ' — product, size, address, phone, payment.' },
  { strong: 'Hands over cleanly', rest: ' — anything unusual goes to you, with the full thread.' },
  { strong: 'Every conversation kept', rest: ' — read what was said, on any order.' },
];

export function AiAssistant() {
  const { f } = useViewport();

  return (
    <Section id="ai">
      <Container>
        <Reveal index={0}>
          <AutoGrid minItemWidth={300} gap={f(28, 4, 64)} align="flex-start">
            <View>
              <Eyebrow label="AI assistant · in every plan" />
              <H2Sub style={{ maxWidth: 460, marginBottom: 18 }}>
                The same three questions, answered without you.
              </H2Sub>
              <Note style={{ maxWidth: 440, marginBottom: 28 }}>
                It knows your real products, prices, stock and delivery areas. It can take a straightforward order
                all the way through — and it steps back the moment a conversation needs a person.
              </Note>

              <View style={{ borderTopWidth: 1, borderTopColor: color.lineStrong }}>
                {CAPABILITIES.map((item, i) => (
                  <View
                    key={item.strong}
                    style={{
                      paddingVertical: 15,
                      borderBottomWidth: i === CAPABILITIES.length - 1 ? 0 : 1,
                      borderBottomColor: color.line,
                    }}
                  >
                    <Text style={[{ fontFamily: font.body, color: color.ink }, metrics(14.5, 1.45)]}>
                      <Text style={{ fontFamily: font.bodySemi }}>{item.strong}</Text>
                      {item.rest}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <ChatPanel />
          </AutoGrid>
        </Reveal>
      </Container>
    </Section>
  );
}

function ChatPanel() {
  return (
    <View
      style={{
        backgroundColor: color.paper2,
        borderWidth: 1,
        borderColor: color.line,
        borderRadius: radius.card,
        overflow: 'hidden',
        ...shadow.chatPanel,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(11,13,18,0.07)',
          backgroundColor: color.paper3,
        }}
      >
        <WhatsAppIcon size={19} round={110} />
        <Text style={[{ fontFamily: font.bodySemi, color: color.ink, flex: 1 }, metrics(13.5, 1.3)]}>
          Chat with Kandyan Threads
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: color.accentWash,
            paddingVertical: 5,
            paddingHorizontal: 9,
            borderRadius: radius.badge,
          }}
        >
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color.accent }} />
          <Text style={[{ fontFamily: font.bodySemi, color: color.accentHover }, metrics(11, 1.3)]}>AI replying</Text>
        </View>
      </View>

      <View style={{ padding: 16, paddingVertical: 18, gap: 10, backgroundColor: '#FDFDFC' }}>
        <Msg text="Do you have XL?" />
        <Msg text="Yes — XL is available in charcoal. Rs. 6,900." out />
        <Msg text="How much is delivery?" />
        <Msg text="Delivery to Colombo is Rs. 350, 1–2 days. Shall I place the order?" out />
        <Msg text="Yes. Nimal, Nugegoda, 077…" />

        <View
          style={{
            alignSelf: 'flex-end',
            maxWidth: '82%',
            backgroundColor: color.paper2,
            borderWidth: 1,
            borderColor: color.lineStrong,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            borderBottomLeftRadius: 14,
            borderBottomRightRadius: 5,
            paddingVertical: 13,
            paddingHorizontal: 14,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Tick size={18} round={5} bg={color.live} fg={color.white} />
            <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(12.5, 1.3)]}>
              Order #2418 created
            </Text>
          </View>
          <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(12.5, 1.45)]}>
            Hoodie XL · Rs. 6,900 + Rs. 350 delivery · COD
          </Text>
        </View>

        <Msg text="Can I return it if the size is wrong?" />

        <View
          style={{
            alignSelf: 'flex-end',
            maxWidth: '82%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 9,
            backgroundColor: color.cautionWash,
            borderWidth: 1,
            borderColor: 'rgba(201,138,43,0.3)',
            borderRadius: radius.control,
            paddingVertical: 11,
            paddingHorizontal: 13,
          }}
        >
          <Tick size={20} round={6} bg={color.gold} fg={color.white} glyph="↑" />
          <View style={{ flex: 1 }}>
            <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(12.5, 1.3)]}>Handed to you</Text>
            <Text style={[{ fontFamily: font.body, color: color.caution, marginTop: 1 }, metrics(12, 1.3)]}>
              Return policy question · needs a person
            </Text>
          </View>
        </View>

        <TypingDots />
      </View>
    </View>
  );
}

function Msg({ text, out = false }: { text: string; out?: boolean }) {
  return (
    <View
      style={{
        alignSelf: out ? 'flex-end' : 'flex-start',
        maxWidth: '78%',
        backgroundColor: out ? color.accent : color.wash,
        paddingVertical: 11,
        paddingHorizontal: 14,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        borderBottomLeftRadius: out ? 14 : 5,
        borderBottomRightRadius: out ? 5 : 14,
      }}
    >
      <Text style={[{ fontFamily: font.body, color: out ? color.white : color.ink }, metrics(13.5, 1.45)]}>
        {text}
      </Text>
    </View>
  );
}

function TypingDots() {
  const reduced = useReducedMotion();
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    if (reduced) return;
    const loops = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, { toValue: 1, duration: 420, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 420, easing: Easing.in(Easing.ease), useNativeDriver: true }),
          Animated.delay(560 - i * 200),
        ]),
      ),
    );
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [reduced]);

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        gap: 4,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: color.wash,
        borderRadius: 14,
      }}
      accessibilityLabel="Typing"
    >
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: color.textFaint,
            opacity: reduced ? 0.6 : dot.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }),
            transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }],
          }}
        />
      ))}
    </View>
  );
}
>>>>>>> c1decb5f08ffdabb7df20508d93878b536a73e30
