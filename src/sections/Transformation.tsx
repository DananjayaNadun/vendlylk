import React, { useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { brand, icons } from '@/assets';
import { WhatsAppIcon } from '@/components/icons';
import { Badge } from '@/components/UI';
import { Reveal } from '@/components/Reveal';
import { metrics } from '@/components/Type';
import { chaosCards, moduleChips, sceneNav, sceneOrders } from '@/data';
import { color, font, layout, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useScroll } from '@/scroll/ScrollProvider';
import { useReducedMotion } from '@/theme/useReducedMotion';

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Samples an arbitrary progress function into an Animated interpolation.
 *
 * The prototype drove this scene from a rAF scroll handler, so it could apply
 * easing and clamping in plain arithmetic. Animated only interpolates linearly
 * between stops, so each curve is sampled into enough stops to be
 * indistinguishable, and the maths itself is copied verbatim.
 */
function sampled(
  node: Animated.Value,
  startPx: number,
  endPx: number,
  fn: (t: number) => number,
  steps = 24,
) {
  if (!(endPx > startPx)) return fn(1);
  const inputRange: number[] = [];
  const outputRange: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    inputRange.push(startPx + (endPx - startPx) * t);
    outputRange.push(fn(t));
  }
  return node.interpolate({ inputRange, outputRange, extrapolate: 'clamp' });
}

function sampledDeg(node: Animated.Value, startPx: number, endPx: number, fn: (t: number) => number, steps = 24) {
  if (!(endPx > startPx)) return `${fn(1)}deg`;
  const inputRange: number[] = [];
  const outputRange: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    inputRange.push(startPx + (endPx - startPx) * t);
    outputRange.push(`${fn(t)}deg`);
  }
  return node.interpolate({ inputRange, outputRange, extrapolate: 'clamp' });
}

export function Transformation() {
  const { isMobile } = useViewport();
  return isMobile ? <TransformStack /> : <PinnedScene />;
}

/* ------------------------------------------------------------ pinned scene */

function PinnedScene() {
  const { width, height, gutter, f } = useViewport();
  const { scrollY, registerSection } = useScroll();
  const reduced = useReducedMotion();
  const [top, setTop] = useState<number | null>(null);

  /* 380vh section over a 100vh stage. */
  const sectionHeight = reduced ? height : height * 3.8;
  const span = sectionHeight - height;
  const measured = top != null && span > 0 && !reduced;

  /** Converts a scene progress value (0–1) into a scroll offset in pixels. */
  const at = (p: number) => (top ?? 0) + span * p;

  /* Scale the scatter down on smaller viewports so nothing clips. */
  const k = Math.min(1, width / 1380) * Math.min(1, height / 820);

  const stickyOffset = measured
    ? scrollY.interpolate({
        inputRange: [top!, top! + span],
        outputRange: [0, span],
        extrapolate: 'clamp',
      })
    : 0;

  const railHeight = measured
    ? scrollY.interpolate({
        inputRange: [top!, top! + span],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
      })
    : reduced
      ? '100%'
      : '0%';

  const headPad = f(56, 7, 96);

  return (
    <View
      onLayout={(e) => {
        registerSection('transform', e.nativeEvent.layout.y);
        setTop(e.nativeEvent.layout.y);
      }}
      style={{ height: sectionHeight, backgroundColor: color.ink }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height,
          overflow: 'hidden',
          justifyContent: 'center',
          transform: [{ translateY: stickyOffset as any }],
        }}
      >
        {/* Progress rail */}
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: gutter, width: 1, backgroundColor: color.lineInk }}>
          <Animated.View style={{ width: 1, height: railHeight as any, backgroundColor: color.accent }} />
        </View>

        {/* Before / after headlines */}
        <View
          style={{
            height: 156,
            width: '100%',
            maxWidth: layout.container,
            alignSelf: 'center',
            paddingHorizontal: headPad,
            justifyContent: 'flex-end',
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              left: headPad,
              right: 0,
              bottom: 0,
              opacity: measured ? (sampled(scrollY, at(0.06), at(0.3), (t) => 1 - t) as any) : reduced ? 0 : 1,
              transform: [
                { translateY: measured ? (sampled(scrollY, at(0.06), at(0.3), (t) => t * -18) as any) : 0 },
              ],
            }}
          >
            <SceneKicker label="Before" />
            <SceneTitle>
              Messages. Notes. Spreadsheets.
              <Text style={{ color: color.white45 }}> Manual work. Courier losses.</Text>
            </SceneTitle>
          </Animated.View>

          <Animated.View
            style={{
              position: 'absolute',
              left: headPad,
              right: 0,
              bottom: 0,
              opacity: measured ? (sampled(scrollY, at(0.34), at(0.6), ease) as any) : reduced ? 1 : 0,
              transform: [
                { translateY: measured ? (sampled(scrollY, at(0.34), at(0.6), (t) => (1 - ease(t)) * 18) as any) : 0 },
              ],
            }}
          >
            <SceneKicker label="After" accent />
            <SceneTitle>One system your whole business runs on.</SceneTitle>
          </Animated.View>
        </View>

        {/* Chaos field + converged window */}
        <View style={{ flex: 1, minHeight: 0 }}>
          {!reduced
            ? chaosCards.map((card, i) => {
                const start = at(0.02 + i * 0.035);
                const end = at(0.46 + i * 0.035);
                return (
                  <Animated.View
                    key={i}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: card.width,
                      marginLeft: -card.width / 2,
                      marginTop: card.offsetY,
                      opacity: measured ? (sampled(scrollY, start, end, (t) => clamp01(1 - ease(t) * 1.35)) as any) : 1,
                      transform: [
                        { translateX: measured ? (sampled(scrollY, start, end, (t) => card.x * k * (1 - ease(t))) as any) : card.x * k },
                        { translateY: measured ? (sampled(scrollY, start, end, (t) => card.y * k * (1 - ease(t))) as any) : card.y * k },
                        { rotate: measured ? (sampledDeg(scrollY, start, end, (t) => card.rot * (1 - ease(t))) as any) : `${card.rot}deg` },
                        { scale: measured ? (sampled(scrollY, start, end, (t) => 1 - ease(t) * 0.42) as any) : 1 },
                      ],
                    }}
                  >
                    <ChaosCard index={i} />
                  </Animated.View>
                );
              })
            : null}

          <Animated.View
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: Math.min(880, width * 0.78),
              marginLeft: -Math.min(880, width * 0.78) / 2,
              marginTop: -170,
              opacity: measured ? (sampled(scrollY, at(0.3), at(0.68), ease) as any) : reduced ? 1 : 0,
              transform: [
                { scale: measured ? (sampled(scrollY, at(0.3), at(0.68), (t) => 0.9 + ease(t) * 0.1) as any) : reduced ? 1 : 0.9 },
                { translateY: measured ? (sampled(scrollY, at(0.3), at(0.68), (t) => (1 - ease(t)) * 26) as any) : reduced ? 0 : 26 },
              ],
            }}
          >
            <SceneWindow />
          </Animated.View>
        </View>

        {/* Module chips */}
        <View
          style={{
            width: '100%',
            maxWidth: layout.container,
            alignSelf: 'center',
            paddingHorizontal: headPad,
            paddingBottom: f(28, 4, 44),
          }}
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {moduleChips.map((chip, i) => {
              const start = at(0.58 + i * 0.028);
              const end = at(0.72 + i * 0.028);
              return (
                <Animated.View
                  key={chip}
                  style={{
                    opacity: measured ? (sampled(scrollY, start, end, ease) as any) : reduced ? 1 : 0,
                    transform: [
                      { translateY: measured ? (sampled(scrollY, start, end, (t) => (1 - ease(t)) * 14) as any) : 0 },
                    ],
                  }}
                >
                  <ModuleChip label={chip} on={i === 0} />
                </Animated.View>
              );
            })}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

/* ------------------------------------------------------------------ parts */

function SceneKicker({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <Text
      style={[
        {
          fontFamily: font.mono,
          color: accent ? color.accentLight : color.white40,
          textTransform: 'uppercase',
          marginBottom: 16,
        },
        metrics(11, 1.4, 0.16),
      ]}
    >
      {label}
    </Text>
  );
}

function SceneTitle({ children }: { children: React.ReactNode }) {
  const { f } = useViewport();
  return (
    <Text
      accessibilityRole="header"
      style={[
        { fontFamily: font.displayBold, color: color.white, maxWidth: 760 },
        metrics(f(30, 4.2, 56), 1.02, -0.04),
      ]}
    >
      {children}
    </Text>
  );
}

function ModuleChip({ label, on }: { label: string; on: boolean }) {
  return (
    <View
      style={{
        backgroundColor: on ? 'rgba(43,76,242,0.9)' : color.white06,
        borderWidth: 1,
        borderColor: color.white14,
        paddingVertical: 8,
        paddingHorizontal: 13,
        borderRadius: radius.chip,
      }}
    >
      <Text
        style={[{ fontFamily: font.mono, color: on ? color.white : color.white82 }, metrics(11, 1.4, 0.06)]}
      >
        {label}
      </Text>
    </View>
  );
}

function ChaosCard({ index }: { index: number }) {
  const shell = {
    backgroundColor: index === 2 ? color.paperNote : color.paper2,
    borderRadius: 13,
    padding: index === 3 ? 12 : 14,
    ...shadow.chaos,
  } as const;

  const label = (text: string) => (
    <Text
      style={[
        { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 9 },
        metrics(9.5, 1.4, 0.12),
      ]}
    >
      {text}
    </Text>
  );

  const head = (icon: React.ReactNode, text: string) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 }}>
      {icon}
      <Text style={[{ fontFamily: font.bodySemi, color: color.textMuted }, metrics(11, 1.4)]}>{text}</Text>
    </View>
  );

  const msg = (text: string) => (
    <View
      style={{
        backgroundColor: color.wash,
        paddingVertical: 8,
        paddingHorizontal: 11,
        borderTopLeftRadius: 11,
        borderTopRightRadius: 11,
        borderBottomRightRadius: 11,
        borderBottomLeftRadius: 4,
      }}
    >
      <Text style={[{ fontFamily: font.body, color: color.ink }, metrics(12.5, 1.4)]}>{text}</Text>
    </View>
  );

  if (index === 0) {
    return (
      <View style={shell}>
        {head(<Image source={icons.facebook} style={{ width: 16, height: 16, borderRadius: 8 }} />, 'Messenger')}
        {msg('Is this available?')}
      </View>
    );
  }
  if (index === 1) {
    return (
      <View style={shell}>
        {head(<WhatsAppIcon size={16} round={110} />, 'WhatsApp')}
        {msg('Delivery to Kandy how much?')}
      </View>
    );
  }
  if (index === 2) {
    return (
      <View style={shell}>
        {label('Notebook')}
        <Text style={[{ fontFamily: font.mono, color: color.textSoft }, metrics(12, 1.7)]}>
          Nimal — 2 hoodie{'\n'}advance 2000 — bal COD
        </Text>
      </View>
    );
  }
  if (index === 3) {
    const cell = (text: string, last: boolean, bottom: boolean, flagged = false) => (
      <View
        style={{
          flex: 1,
          paddingVertical: 5,
          paddingHorizontal: 7,
          borderRightWidth: last ? 0 : 1,
          borderRightColor: color.lineStrong,
          borderBottomWidth: bottom ? 1 : 0,
          borderBottomColor: color.lineStrong,
          backgroundColor: flagged ? color.cautionWash : 'transparent',
        }}
      >
        <Text style={[{ fontFamily: font.mono, color: color.textSoft }, metrics(11, 1.4)]}>{text}</Text>
      </View>
    );
    return (
      <View style={shell}>
        {label('Sheet1')}
        <View style={{ borderWidth: 1, borderColor: color.lineStrong }}>
          <View style={{ flexDirection: 'row' }}>
            {cell('Nimal', false, true)}
            {cell('2', false, true)}
            {cell('13800', true, true)}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {cell('Sithara', false, false)}
            {cell('1', false, false)}
            {cell('?', true, false, true)}
          </View>
        </View>
      </View>
    );
  }
  if (index === 4) {
    return (
      <View style={shell}>
        {label('Courier')}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[{ fontFamily: font.monoMedium, color: color.danger }, metrics(12, 1.4)]}>COD refused</Text>
          <Text style={[{ fontFamily: font.monoMedium, color: color.danger }, metrics(12, 1.4)]}>− Rs. 450</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={shell}>
      {label('Asked again')}
      <Text style={[{ fontFamily: font.body, color: color.ink }, metrics(12.5, 1.4)]}>“Is delivery free?”</Text>
    </View>
  );
}

function SceneWindow() {
  return (
    <View style={{ backgroundColor: color.paper2, borderRadius: 16, overflow: 'hidden', ...shadow.sceneWindow }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: color.line,
          backgroundColor: color.paper3,
        }}
      >
        <Image source={brand.ink} style={{ width: 17, height: 17 }} resizeMode="contain" />
        <Text style={[{ fontFamily: font.displayBold, color: color.ink }, metrics(13.5, 1.3, -0.02)]}>Vendly</Text>
        <View style={{ borderLeftWidth: 1, borderLeftColor: 'rgba(11,13,18,0.12)', paddingLeft: 10 }}>
          <Text
            style={[
              { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase' },
              metrics(9.5, 1.4, 0.12),
            ]}
          >
            OrderFlow
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <Text style={[{ fontFamily: font.mono, color: color.live }, metrics(10.5, 1.4)]}>● Live</Text>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            width: 168,
            borderRightWidth: 1,
            borderRightColor: 'rgba(11,13,18,0.07)',
            paddingVertical: 14,
            paddingHorizontal: 12,
            backgroundColor: color.paper3,
            gap: 3,
          }}
        >
          {sceneNav.map((item, i) => (
            <View
              key={item}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 9,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: radius.chip,
                backgroundColor: i === 0 ? color.accentWash : 'transparent',
              }}
            >
              <View
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 2.5,
                  backgroundColor: i === 0 ? color.accent : 'rgba(11,13,18,0.2)',
                }}
              />
              <Text
                style={[
                  { fontFamily: i === 0 ? font.bodySemi : font.body, color: i === 0 ? color.ink : color.textMuted },
                  metrics(12.5, 1.3),
                ]}
              >
                {item}
              </Text>
              {i === 0 ? (
                <Text style={[{ fontFamily: font.mono, color: color.accent, marginLeft: 'auto' }, metrics(10.5, 1.3)]}>
                  6
                </Text>
              ) : null}
            </View>
          ))}
        </View>

        <View style={{ flex: 1, padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <Text style={[{ fontFamily: font.displayBold, color: color.ink }, metrics(16, 1.3, -0.02)]}>Orders</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <View style={{ backgroundColor: color.accent, paddingVertical: 5, paddingHorizontal: 10, borderRadius: radius.badge }}>
                <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(11, 1.3)]}>New order</Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'rgba(11,13,18,0.12)',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: radius.badge,
                }}
              >
                <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(11, 1.3)]}>Export</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              paddingBottom: 9,
              borderBottomWidth: 1,
              borderBottomColor: color.line,
            }}
          >
            {['Order', 'Customer', 'Total', 'Status'].map((headCell, i) => (
              <Text
                key={headCell}
                style={[
                  {
                    fontFamily: font.mono,
                    color: color.textFaint,
                    textTransform: 'uppercase',
                    width: i === 0 ? 88 : i === 2 ? 96 : i === 3 ? 92 : undefined,
                    flex: i === 1 ? 1 : undefined,
                  },
                  metrics(9.5, 1.4, 0.1),
                ]}
              >
                {headCell}
              </Text>
            ))}
          </View>

          {sceneOrders.map((row, i) => (
            <View
              key={row.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 11,
                borderBottomWidth: i === sceneOrders.length - 1 ? 0 : 1,
                borderBottomColor: color.lineSoft,
              }}
            >
              <Text style={[{ fontFamily: font.mono, color: color.textMuted, width: 88 }, metrics(12.5, 1.35)]}>
                {row.id}
              </Text>
              <Text style={[{ fontFamily: font.bodyMedium, color: color.ink, flex: 1 }, metrics(12.5, 1.35)]}>
                {row.who}
              </Text>
              <Text style={[{ fontFamily: font.mono, color: color.ink, width: 96 }, metrics(12.5, 1.35)]}>
                {row.total}
              </Text>
              <View style={{ width: 92 }}>
                <Badge label={row.status} tone={row.tone} small />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------- stacked mobile variant */

function TransformStack() {
  const { registerSection } = useScroll();

  return (
    <View
      onLayout={(e) => registerSection('transform', e.nativeEvent.layout.y)}
      style={{ backgroundColor: color.ink, paddingVertical: 72, paddingHorizontal: 20 }}
    >
      <SceneKicker label="Before" />
      <Text
        style={[
          { fontFamily: font.displayBold, color: color.white, marginBottom: 22 },
          metrics(30, 1.05, -0.035),
        ]}
      >
        Messages. Notes. Spreadsheets. Courier losses.
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
        {['Messenger', 'WhatsApp', 'Notebook', 'Spreadsheet', 'Courier slip'].map((tag) => (
          <View
            key={tag}
            style={{
              backgroundColor: color.white06,
              borderWidth: 1,
              borderColor: color.white12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: radius.chip,
            }}
          >
            <Text style={[{ fontFamily: font.body, color: color.white70 }, metrics(13, 1.35)]}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={{ width: 1, height: 44, backgroundColor: color.accent, alignSelf: 'center', marginBottom: 24, opacity: 0.7 }} />

      <SceneKicker label="After" accent />
      <Text
        style={[
          { fontFamily: font.displayBold, color: color.white, marginBottom: 22 },
          metrics(30, 1.05, -0.035),
        ]}
      >
        One system your whole business runs on.
      </Text>

      <Reveal index={0}>
        <View style={{ backgroundColor: color.paper2, borderRadius: 14, overflow: 'hidden', ...shadow.stackPanel }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 9,
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderBottomWidth: 1,
              borderBottomColor: color.line,
              backgroundColor: color.paper3,
            }}
          >
            <Image source={brand.ink} style={{ width: 16, height: 16 }} resizeMode="contain" />
            <Text style={[{ fontFamily: font.displayBold, color: color.ink }, metrics(13, 1.3)]}>Vendly</Text>
            <Text
              style={[
                { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase' },
                metrics(9, 1.4, 0.12),
              ]}
            >
              OrderFlow
            </Text>
          </View>
          <View style={{ padding: 14 }}>
            {sceneOrders.map((row, i) => (
              <View
                key={row.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: i === sceneOrders.length - 1 ? 0 : 1,
                  borderBottomColor: 'rgba(11,13,18,0.06)',
                }}
              >
                <Text style={[{ fontFamily: font.bodyMedium, color: color.ink }, metrics(13, 1.35)]}>
                  {row.id} · {row.who.split(' · ')[0]}
                </Text>
                <Badge label={row.status} tone={row.tone} small />
              </View>
            ))}
          </View>
        </View>
      </Reveal>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 20 }}>
        {moduleChips.slice(0, 6).concat(['ANALYTICS', 'AI']).map((chip, i) => (
          <View
            key={chip}
            style={{
              backgroundColor: i === 0 ? 'rgba(43,76,242,0.9)' : color.white06,
              borderWidth: i === 0 ? 0 : 1,
              borderColor: color.white12,
              paddingVertical: 7,
              paddingHorizontal: 11,
              borderRadius: 7,
            }}
          >
            <Text style={[{ fontFamily: font.mono, color: i === 0 ? color.white : color.white80 }, metrics(10.5, 1.4)]}>
              {chip}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
