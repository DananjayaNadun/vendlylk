import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { docSections, faqList, guideList, helpTopics } from '@/data/contentPages';
import { metrics } from './Type';
import { color, font, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

/**
 * A real, working assistant, not a scripted demo like the one on the
 * homepage's AI Assistant section — it actually searches the FAQ, help
 * topics, guides and docs content for the closest match to what was typed,
 * and says so plainly when nothing matches well enough to be useful.
 */

type Msg = { id: number; text: string; out: boolean; to?: string };

type KbEntry = { q: string; a: string; to?: string };

const KB: KbEntry[] = [
  ...faqList.map((f) => ({ q: f.q, a: f.a })),
  ...helpTopics.map((t) => ({ q: t.title, a: t.body, to: t.to })),
  ...guideList.map((g) => ({ q: g.title, a: g.body })),
  ...docSections.map((d) => ({ q: d.title, a: d.body })),
];

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'you', 'your', 'with', 'that', 'this', 'does',
  'how', 'what', 'when', 'can', 'a', 'an', 'to', 'of', 'is', 'it', 'in',
  'on', 'do', 'i', 'my', 'me', 'about',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function bestMatch(query: string): KbEntry | null {
  const qTokens = new Set(tokenize(query));
  if (qTokens.size === 0) return null;

  let best: KbEntry | null = null;
  let bestScore = 0;
  for (const entry of KB) {
    const entryTokens = tokenize(`${entry.q} ${entry.a}`);
    let score = 0;
    for (const t of entryTokens) if (qTokens.has(t)) score++;
    /* A hit in the question itself counts double — it's the strongest signal
       that this entry is actually what was asked, not just a word that shows
       up in passing inside a longer answer. */
    for (const t of tokenize(entry.q)) if (qTokens.has(t)) score++;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return bestScore >= 2 ? best : null;
}

const GREETING =
  "Hi — I'm the Vendly assistant. I search our FAQ, guides and documentation, so I can answer questions about pricing, COD, WhatsApp orders, your storefront and the rest of the product.";

const FALLBACK =
  "I don't have a confident answer for that from our help content. Try rephrasing it, or head to Contact Support to reach a person.";

export function SupportChatbot() {
  const router = useRouter();
  const { isMobile } = useViewport();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, text: GREETING, out: false }]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const nextId = useRef(1);
  const scrollRef = useRef<ScrollView | null>(null);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: 220,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  }, [open, anim]);

  const send = () => {
    const text = input.trim();
    if (!text || thinking) return;
    const userMsg: Msg = { id: nextId.current++, text, out: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const match = bestMatch(text);
      const reply: Msg = match
        ? { id: nextId.current++, text: match.a, out: false, to: match.to }
        : { id: nextId.current++, text: FALLBACK, out: false };
      setMessages((prev) => [...prev, reply]);
      setThinking(false);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }, 500 + Math.min(600, text.length * 12));

    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', right: 20, bottom: 20, alignItems: 'flex-end' }}>
      {open ? (
        <Animated.View
          style={{
            width: isMobile ? 300 : 340,
            height: 440,
            marginBottom: 14,
            borderRadius: radius.card,
            overflow: 'hidden',
            backgroundColor: color.paper2,
            borderWidth: 1,
            borderColor: color.line,
            opacity: anim,
            transform: [
              { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
              { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
            ],
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
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                backgroundColor: color.accentWash,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SparkIcon size={14} color={color.accent} />
            </View>
            <Text style={[{ fontFamily: font.bodySemi, color: color.ink, flex: 1 }, metrics(13.5, 1.3)]}>
              Vendly Assistant
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
                marginRight: 4,
              }}
            >
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color.accent }} />
              <Text style={[{ fontFamily: font.bodySemi, color: color.accentHover }, metrics(11, 1.3)]}>
                {thinking ? 'Typing' : 'Online'}
              </Text>
            </View>
            <Pressable
              onPress={() => setOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Close assistant"
              hitSlop={8}
            >
              <Text style={{ color: color.textFaint, fontSize: 18, lineHeight: 20 }}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            ref={scrollRef}
            style={{ flex: 1, backgroundColor: '#FDFDFC' }}
            contentContainerStyle={{ padding: 14, gap: 10 }}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            {messages.map((m) => (
              <ChatBubble key={m.id} msg={m} onOpenLink={(to) => router.push(to as any)} />
            ))}
            {thinking ? <TypingDots /> : null}
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              padding: 10,
              borderTopWidth: 1,
              borderTopColor: color.line,
              backgroundColor: color.paper2,
            }}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={send}
              placeholder="Ask a question…"
              placeholderTextColor={color.textFaint}
              returnKeyType="send"
              style={[
                {
                  flex: 1,
                  backgroundColor: color.wash,
                  borderRadius: radius.pill,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  fontFamily: font.body,
                  color: color.ink,
                },
                metrics(13.5, 1.3),
              ]}
            />
            <Pressable onPress={send} accessibilityRole="button" accessibilityLabel="Send">
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.pill,
                  backgroundColor: color.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SendIcon size={15} />
              </View>
            </Pressable>
          </View>
        </Animated.View>
      ) : null}

      <Pressable onPress={() => setOpen((v) => !v)} accessibilityRole="button" accessibilityLabel="Chat with the Vendly assistant">
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: color.accent,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadow.ctaPrimaryLarge,
          }}
        >
          {open ? <Text style={{ color: color.white, fontSize: 24, lineHeight: 26 }}>×</Text> : <SparkIcon size={22} color={color.white} />}
        </View>
      </Pressable>
    </View>
  );
}

function ChatBubble({ msg, onOpenLink }: { msg: Msg; onOpenLink: (to: string) => void }) {
  return (
    <View
      style={{
        alignSelf: msg.out ? 'flex-end' : 'flex-start',
        maxWidth: '84%',
        backgroundColor: msg.out ? color.accent : color.wash,
        paddingVertical: 10,
        paddingHorizontal: 13,
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        borderBottomLeftRadius: msg.out ? 13 : 4,
        borderBottomRightRadius: msg.out ? 4 : 13,
      }}
    >
      <Text style={[{ fontFamily: font.body, color: msg.out ? color.white : color.ink }, metrics(13, 1.45)]}>
        {msg.text}
      </Text>
      {msg.to ? (
        <Pressable onPress={() => onOpenLink(msg.to!)} accessibilityRole="link">
          <Text style={[{ fontFamily: font.bodySemi, color: color.accentHover, marginTop: 6 }, metrics(12.5, 1.3)]}>
            Open this topic →
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function TypingDots() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const loops = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(dot, { toValue: 1, duration: 380, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 380, easing: Easing.in(Easing.ease), useNativeDriver: true }),
          Animated.delay(520 - i * 180),
        ]),
      ),
    );
    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        gap: 4,
        paddingVertical: 10,
        paddingHorizontal: 13,
        backgroundColor: color.wash,
        borderRadius: 13,
      }}
      accessibilityLabel="Assistant is typing"
    >
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: color.textFaint,
            opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }),
            transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }],
          }}
        />
      ))}
    </View>
  );
}

function SparkIcon({ size, color: fill }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        d="M12 2c.6 3.2 1.2 4.8 2.6 6.2C16 9.6 17.6 10.2 20.8 10.8c-3.2.6-4.8 1.2-6.2 2.6-1.4 1.4-2 3-2.6 6.2-.6-3.2-1.2-4.8-2.6-6.2C8 12.2 6.4 11.6 3.2 11c3.2-.6 4.8-1.2 6.2-2.6C10.8 7 11.4 5.4 12 2Z"
      />
    </Svg>
  );
}

function SendIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill="#FFFFFF" d="M3 11.5 20.5 3l-6 17.5-3.6-7.4L3 11.5Z" />
    </Svg>
  );
}
