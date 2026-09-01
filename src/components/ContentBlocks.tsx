import React, { useRef, useState } from 'react';
import { Animated, Easing, Linking, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AutoGrid } from './Layout';
import { Panel } from './UI';
import { metrics } from './Type';
import { color, font, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { company } from '@/config/company';

/** A titled card on a wash background — help topics, docs, guides, careers, partners. */
export function InfoCard({
  title,
  body,
  meta,
  onPress,
}: {
  title: string;
  body: string;
  meta?: string;
  onPress?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const interactive = !!onPress;

  return (
    <Pressable
      onPress={onPress}
      disabled={!interactive}
      accessibilityRole={interactive ? 'link' : undefined}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
    >
      <Panel
        style={{
          padding: 22,
          height: '100%',
          transform: [{ translateY: interactive && hover ? -3 : 0 }],
          borderColor: interactive && hover ? color.accent : color.line,
        }}
      >
        {meta ? (
          <Text
            style={[
              { fontFamily: font.mono, color: color.accent, textTransform: 'uppercase', marginBottom: 10 },
              metrics(10.5, 1.4, 0.1),
            ]}
          >
            {meta}
          </Text>
        ) : null}
        <Text style={[{ fontFamily: font.displaySemi, color: color.ink, marginBottom: 8 }, metrics(17, 1.3, -0.01)]}>
          {title}
        </Text>
        <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14, 1.55)]}>{body}</Text>
        {interactive ? (
          <Text
            style={[
              { fontFamily: font.bodySemi, color: color.accent, marginTop: 14 },
              metrics(13, 1.3),
            ]}
          >
            {hover ? 'Open →' : 'Open'}
          </Text>
        ) : null}
      </Panel>
    </Pressable>
  );
}

/** `AutoGrid` of `InfoCard`s, one call site per resources/company page. */
export function CardGrid({
  items,
  minItemWidth = 260,
}: {
  items: { title: string; body: string; meta?: string; to?: string }[];
  minItemWidth?: number;
}) {
  const router = useRouter();
  return (
    <AutoGrid minItemWidth={minItemWidth} gap={16}>
      {items.map((item) => (
        <InfoCard
          key={item.title}
          title={item.title}
          body={item.body}
          meta={item.meta}
          onPress={item.to ? () => router.push(item.to as any) : undefined}
        />
      ))}
    </AutoGrid>
  );
}

/** One expand/collapse row — FAQ. Height isn't animatable in RN, so the
    answer cross-fades in over a fixed max-height instead of measuring. */
function AccordionRow({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const progress = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    Animated.timing(progress, {
      toValue: next ? 1 : 0,
      duration: 240,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: color.line }}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, gap: 16 }}
      >
        <Text style={[{ fontFamily: font.displaySemi, color: color.ink, flex: 1 }, metrics(16.5, 1.35, -0.01)]}>
          {q}
        </Text>
        <Animated.Text
          style={{
            color: color.accent,
            fontSize: 20,
            lineHeight: 20,
            transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) }],
          }}
        >
          +
        </Animated.Text>
      </Pressable>
      <Animated.View
        style={{
          maxHeight: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 240] }),
          opacity: progress,
          overflow: 'hidden',
        }}
      >
        <Text style={[{ fontFamily: font.body, color: color.textMuted, paddingBottom: 20 }, metrics(14.5, 1.6)]}>
          {a}
        </Text>
      </Animated.View>
    </View>
  );
}

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <View style={{ borderTopWidth: 1, borderTopColor: color.line }}>
      {items.map((item, i) => (
        <AccordionRow key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
      ))}
    </View>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Name + email + message.
 *
 * There is no backend to post to, so this hands the message to the visitor's
 * own mail client with everything pre-filled rather than showing a "message
 * sent" confirmation for a request that was never transmitted. When no
 * support mailbox has been confirmed there is nowhere to send it at all, and
 * the form says so instead of collecting details that would go nowhere.
 */
export function ContactForm({
  submitLabel = 'Send message',
  messageLabel = 'Message',
  messagePlaceholder = 'How can we help?',
}: {
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
}) {
  const { isMobile } = useViewport();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [handedOff, setHandedOff] = useState(false);

  const mailbox = company.supportEmail.confirmed ? company.supportEmail.value : null;

  if (!mailbox) {
    return (
      <Panel style={{ padding: 22 }}>
        <Text style={[{ fontFamily: font.displaySemi, color: color.ink, marginBottom: 6 }, metrics(17, 1.3)]}>
          Contact channels open at launch
        </Text>
        <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14.5, 1.6)]}>
          Vendly is still in build and there is no monitored inbox yet, so there is no form here that would
          reach anyone. Once support is staffed, the address and hours are published on this page.
        </Text>
      </Panel>
    );
  }

  const submit = () => {
    if (!name.trim() || !message.trim()) {
      setError('Fill in your name and a short message.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('That does not look like an email address.');
      return;
    }
    setError(null);
    const subject = encodeURIComponent(`Vendly enquiry from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}

— ${name.trim()} (${email.trim()})`);
    Linking.openURL(`mailto:${mailbox}?subject=${subject}&body=${body}`);
    setHandedOff(true);
  };

  if (handedOff) {
    return (
      <Panel style={{ padding: 26, alignItems: 'flex-start' }}>
        <Text style={[{ fontFamily: font.displaySemi, color: color.ink, marginBottom: 6 }, metrics(18, 1.3)]}>
          Your email app should be open.
        </Text>
        <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14.5, 1.6)]}>
          We have not received anything yet — send the draft to {mailbox} and it reaches us. If nothing
          opened, email that address directly.
        </Text>
      </Panel>
    );
  }

  return (
    <Panel style={{ padding: 22 }}>
      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: 14, marginBottom: 14 }}>
        <FormField label="Your name" value={name} onChangeText={setName} placeholder="Nimal Perera" />
        <FormField label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
      </View>
      <FormField
        label={messageLabel}
        value={message}
        onChangeText={setMessage}
        placeholder={messagePlaceholder}
        multiline
        style={{ marginBottom: 16 }}
      />
      {error ? (
        <Text style={[{ fontFamily: font.bodyMedium, color: color.danger, marginBottom: 12 }, metrics(13, 1.4)]}>
          {error}
        </Text>
      ) : null}
      <Pressable onPress={submit} accessibilityRole="button">
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: color.accent,
            paddingVertical: 13,
            paddingHorizontal: 22,
            borderRadius: radius.control,
            ...shadow.ctaPrimary,
          }}
        >
          <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(14.5, 1.2)]}>{submitLabel}</Text>
        </View>
      </Pressable>
      <Text style={[{ fontFamily: font.body, color: color.textFaint, marginTop: 10 }, metrics(12.5, 1.45)]}>
        Opens a pre-filled draft in your email app — nothing is sent until you send it.
      </Text>
    </Panel>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline = false,
  style,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: 'email-address';
  multiline?: boolean;
  style?: any;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[{ flex: 1 }, style]}>
      <Text
        style={[
          { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 8 },
          metrics(10, 1.4, 0.12),
        ]}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.textFaint}
        keyboardType={keyboardType}
        autoCapitalize="none"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          {
            backgroundColor: color.paper2,
            borderWidth: 1.5,
            borderColor: focused ? color.accent : color.line,
            borderRadius: radius.control,
            paddingVertical: 12,
            paddingHorizontal: 14,
            fontFamily: font.body,
            color: color.ink,
            textAlignVertical: multiline ? 'top' : 'center',
            minHeight: multiline ? 96 : undefined,
          },
          metrics(14.5, 1.4),
        ]}
      />
    </View>
  );
}
