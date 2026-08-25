<<<<<<< HEAD
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Image, Platform, Text, View, ViewStyle } from 'react-native';
import { brand, icons } from '@/assets';
import { WhatsAppIcon } from '@/components/icons';
import { Badge } from '@/components/UI';
import { Reveal } from '@/components/Reveal';
import { metrics } from '@/components/Type';
import { chaosCards, moduleChips, sceneNav, sceneOrders } from '@/data';
import { color, font, layout, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useScroll, useScrollListener } from '@/scroll/ScrollProvider';
import { readViewportTop } from '@/scroll/measure';
import { applyPose } from '@/scroll/pose';
import { useReducedMotion } from '@/theme/useReducedMotion';

/* The prototype's helpers, unchanged. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** See the comment at the heads box below. */
const HEADS_TOP_CLEARANCE = 150;

export function Transformation() {
  const { isMobile } = useViewport();
  return isMobile ? <TransformStack /> : <PinnedScene />;
}

/* ------------------------------------------------------------ pinned scene */

function PinnedScene() {
  const { width, height, gutter, f } = useViewport();
  const { registerSection } = useScroll();
  const reduced = useReducedMotion();

  const sceneRef = useRef<View | null>(null);
  const stageRef = useRef<View | null>(null);
  const railFillRef = useRef<View | null>(null);
  const beforeRef = useRef<View | null>(null);
  const afterRef = useRef<View | null>(null);
  const windowRef = useRef<View | null>(null);
  const chaosRefs = useRef<(View | null)[]>(chaosCards.map(() => null));
  const chipRefs = useRef<(View | null)[]>(moduleChips.map(() => null));

  /** Progress the scene last painted, kept outside React state. A render
      triggered for an unrelated reason (the viewport resizing) uses this as
      its style baseline, so it repaints the current position instead of
      snapping back to 0 — see the effect below. */
  const lastP = useRef(reduced ? 1 : 0);

  /* 380vh section over a 100vh stage. */
  const sectionHeight = reduced ? height : height * 3.8;
  const span = sectionHeight - height;

  /* Scale the scatter down on smaller viewports so nothing clips. */
  const k = Math.min(1, width / 1380) * Math.min(1, height / 820);

  /**
   * Writes one frame straight to the underlying nodes — see `pose.ts` for why
   * this bypasses React state entirely. This is the design source's exact
   * arithmetic, just applied imperatively instead of through re-render.
   */
  const applyFrame = useCallback(
    (p: number, stick: number) => {
      lastP.current = p;

      applyPose(stageRef, { transforms: [{ type: 'translate', y: stick }] });
      applyPose(railFillRef, { heightPercent: p * 100 });

      const beforeT = seg(p, 0.06, 0.3);
      applyPose(beforeRef, {
        opacity: 1 - beforeT,
        transforms: [{ type: 'translate', y: beforeT * -18 }],
      });

      const afterT = ease(seg(p, 0.34, 0.6));
      applyPose(afterRef, {
        opacity: afterT,
        transforms: [{ type: 'translate', y: (1 - afterT) * 18 }],
      });

      const windowT = ease(seg(p, 0.3, 0.68));
      applyPose(windowRef, {
        opacity: windowT,
        transforms: [
          { type: 'scale', value: 0.9 + windowT * 0.1 },
          { type: 'translate', y: (1 - windowT) * 26 },
        ],
      });

      chaosCards.forEach((card, i) => {
        const t = ease(seg(p, 0.02 + i * 0.035, 0.46 + i * 0.035));
        applyPose(
          { current: chaosRefs.current[i] },
          {
            opacity: clamp01(1 - t * 1.35),
            transforms: [
              { type: 'translate', x: card.x * k * (1 - t), y: card.y * k * (1 - t) },
              { type: 'rotate', deg: card.rot * (1 - t) },
              { type: 'scale', value: 1 - t * 0.42 },
            ],
            blurPx: t * 3,
          },
        );
      });

      moduleChips.forEach((_, i) => {
        const t = ease(seg(p, 0.58 + i * 0.028, 0.72 + i * 0.028));
        applyPose(
          { current: chipRefs.current[i] },
          { opacity: t, transforms: [{ type: 'translate', y: (1 - t) * 14 }] },
        );
      });
    },
    [k],
  );

  useScrollListener(
    useCallback(() => {
      if (reduced || span <= 0) return;
      const top = readViewportTop(sceneRef.current);
      if (top == null) return;
      applyFrame(clamp01(-top / span), Math.min(span, Math.max(0, -top)));
    }, [reduced, span, applyFrame]),
  );

  /* A render for any other reason (e.g. resize) rebuilds this JSX from
     lastP, so it must be repainted immediately afterward to stay in sync —
     the render itself doesn't touch the refs. */
  useEffect(() => {
    const stick = span > 0 ? Math.min(span, Math.max(0, lastP.current * span)) : 0;
    applyFrame(lastP.current, stick);
  }, [applyFrame, span]);

  const headPad = f(56, 7, 96);
  const windowWidth = Math.min(880, width * 0.78);

  /* First-paint (and post-resize) baseline — see `lastP` above. */
  const p0 = lastP.current;
  const stick0 = span > 0 ? Math.min(span, Math.max(0, p0 * span)) : 0;
  const before0T = seg(p0, 0.06, 0.3);
  const after0T = ease(seg(p0, 0.34, 0.6));
  const window0T = ease(seg(p0, 0.3, 0.68));

  return (
    <View
      ref={(node) => {
        sceneRef.current = node;
        registerSection('transform', node);
      }}
      style={{ height: sectionHeight, backgroundColor: color.ink }}
    >
      {/* Stands in for `position: sticky` — the stage tracks the scroll so it
          holds still in the viewport for the length of the section. */}
      <View
        ref={stageRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height,
          overflow: 'hidden',
          justifyContent: 'center',
          transform: [{ translateY: stick0 }],
        }}
      >
        {/* Progress rail */}
        <View
          style={{ position: 'absolute', top: 0, bottom: 0, left: gutter, width: 1, backgroundColor: color.lineInk }}
        >
          <View ref={railFillRef} style={{ width: 1, height: `${p0 * 100}%`, backgroundColor: color.accent }} />
        </View>

        {/* Before / after headlines.
            The fixed nav overlays the top `navHeight` px of the viewport at
            every scroll position. The heads box sits flush at the top of the
            stage, and because the chaos field below it has flex:1 and soaks
            up all remaining height, centering the stage's children has no
            room to act on — so without this, the heading's top edge lands
            under the nav and shows through it. Extra top clearance here
            pushes the (bottom-anchored) text down until it fully clears the
            nav, without moving the chaos field or chips below it. The number
            is calibrated against the heading at its largest clamped size
            (reached at 1333px+ width, where it stops growing) plus a ~30px
            gap below the nav — narrower supported widths get a shorter
            heading and so end up with more clearance, never less. */}
        <View
          style={{
            height: 156 + HEADS_TOP_CLEARANCE,
            width: '100%',
            maxWidth: layout.container,
            alignSelf: 'center',
            paddingHorizontal: headPad,
            justifyContent: 'flex-end',
          }}
        >
          <View
            ref={beforeRef}
            style={{
              position: 'absolute',
              left: headPad,
              right: 0,
              bottom: 0,
              opacity: 1 - before0T,
              transform: [{ translateY: before0T * -18 }],
            }}
          >
            <SceneKicker label="Before" />
            <SceneTitle>
              Messages. Notes. Spreadsheets.
              <Text style={{ color: color.white45 }}> Manual work. Courier losses.</Text>
            </SceneTitle>
          </View>

          <View
            ref={afterRef}
            style={{
              position: 'absolute',
              left: headPad,
              right: 0,
              bottom: 0,
              opacity: after0T,
              transform: [{ translateY: (1 - after0T) * 18 }],
            }}
          >
            <SceneKicker label="After" accent />
            <SceneTitle>One system your whole business runs on.</SceneTitle>
          </View>
        </View>

        {/* Chaos field converging on the Vendly.lk window */}
        <View style={{ flex: 1, minHeight: 0 }}>
          {chaosCards.map((card, i) => {
            const t0 = ease(seg(p0, 0.02 + i * 0.035, 0.46 + i * 0.035));
            const blur0 = t0 * 3;
            return (
              <View
                key={i}
                ref={(node) => {
                  chaosRefs.current[i] = node;
                }}
                style={[
                  {
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: card.width,
                    marginLeft: -card.width / 2,
                    marginTop: card.offsetY,
                    opacity: clamp01(1 - t0 * 1.35),
                    transform: [
                      { translateX: card.x * k * (1 - t0) },
                      { translateY: card.y * k * (1 - t0) },
                      { rotate: `${card.rot * (1 - t0)}deg` },
                      { scale: 1 - t0 * 0.42 },
                    ],
                  },
                  /* React Native has no blur filter; on web it is a real style. */
                  Platform.OS === 'web' && blur0 > 0.01
                    ? ({ filter: `blur(${blur0}px)` } as unknown as ViewStyle)
                    : null,
                ]}
                pointerEvents="none"
              >
                <ChaosCard index={i} />
              </View>
            );
          })}

          <View
            ref={windowRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: windowWidth,
              marginLeft: -windowWidth / 2,
              marginTop: -170,
              opacity: window0T,
              transform: [{ scale: 0.9 + window0T * 0.1 }, { translateY: (1 - window0T) * 26 }],
            }}
            pointerEvents="none"
          >
            <SceneWindow />
          </View>
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
              const t0 = ease(seg(p0, 0.58 + i * 0.028, 0.72 + i * 0.028));
              return (
                <View
                  key={chip}
                  ref={(node) => {
                    chipRefs.current[i] = node;
                  }}
                  style={{ opacity: t0, transform: [{ translateY: (1 - t0) * 14 }] }}
                >
                  <ModuleChip label={chip} on={i === 0} />
                </View>
              );
            })}
          </View>
        </View>
      </View>
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

const ModuleChip = memo(function ModuleChip({ label, on }: { label: string; on: boolean }) {
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
      <Text style={[{ fontFamily: font.mono, color: on ? color.white : color.white82 }, metrics(11, 1.4, 0.06)]}>
        {label}
      </Text>
    </View>
  );
});

/* Memoised so the per-frame progress updates only touch wrapper styles. */
const ChaosCard = memo(function ChaosCard({ index }: { index: number }) {
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
});

const SceneWindow = memo(function SceneWindow() {
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
            Vendly.lk
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

          <View style={{ flexDirection: 'row', gap: 10, paddingBottom: 9, borderBottomWidth: 1, borderBottomColor: color.line }}>
            {[
              { label: 'Order', w: 88 },
              { label: 'Customer', w: undefined },
              { label: 'Total', w: 96 },
              { label: 'Status', w: 92 },
            ].map((head) => (
              <Text
                key={head.label}
                style={[
                  {
                    fontFamily: font.mono,
                    color: color.textFaint,
                    textTransform: 'uppercase',
                    width: head.w,
                    flex: head.w ? undefined : 1,
                  },
                  metrics(9.5, 1.4, 0.1),
                ]}
              >
                {head.label}
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
});

/* -------------------------------------------------- stacked mobile variant */

function TransformStack() {
  const { registerSection } = useScroll();

  return (
    <View
      ref={(node) => registerSection('transform', node)}
      style={{ backgroundColor: color.ink, paddingVertical: 72, paddingHorizontal: 20 }}
    >
      <SceneKicker label="Before" />
      <Text style={[{ fontFamily: font.displayBold, color: color.white, marginBottom: 22 }, metrics(30, 1.05, -0.035)]}>
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
      <Text style={[{ fontFamily: font.displayBold, color: color.white, marginBottom: 22 }, metrics(30, 1.05, -0.035)]}>
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
              Vendly.lk
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
=======
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Image, Platform, Text, View, ViewStyle } from 'react-native';
import { brand, icons } from '@/assets';
import { WhatsAppIcon } from '@/components/icons';
import { Badge } from '@/components/UI';
import { Reveal } from '@/components/Reveal';
import { metrics } from '@/components/Type';
import { chaosCards, moduleChips, sceneNav, sceneOrders } from '@/data';
import { color, font, layout, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useScroll, useScrollListener } from '@/scroll/ScrollProvider';
import { readViewportTop } from '@/scroll/measure';
import { applyPose } from '@/scroll/pose';
import { useReducedMotion } from '@/theme/useReducedMotion';

/* The prototype's helpers, unchanged. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** See the comment at the heads box below. */
const HEADS_TOP_CLEARANCE = 150;

export function Transformation() {
  const { isMobile } = useViewport();
  return isMobile ? <TransformStack /> : <PinnedScene />;
}

/* ------------------------------------------------------------ pinned scene */

function PinnedScene() {
  const { width, height, gutter, f } = useViewport();
  const { registerSection } = useScroll();
  const reduced = useReducedMotion();

  const sceneRef = useRef<View | null>(null);
  const stageRef = useRef<View | null>(null);
  const railFillRef = useRef<View | null>(null);
  const beforeRef = useRef<View | null>(null);
  const afterRef = useRef<View | null>(null);
  const windowRef = useRef<View | null>(null);
  const chaosRefs = useRef<(View | null)[]>(chaosCards.map(() => null));
  const chipRefs = useRef<(View | null)[]>(moduleChips.map(() => null));

  /** Progress the scene last painted, kept outside React state. A render
      triggered for an unrelated reason (the viewport resizing) uses this as
      its style baseline, so it repaints the current position instead of
      snapping back to 0 — see the effect below. */
  const lastP = useRef(reduced ? 1 : 0);

  /* 380vh section over a 100vh stage. */
  const sectionHeight = reduced ? height : height * 3.8;
  const span = sectionHeight - height;

  /* Scale the scatter down on smaller viewports so nothing clips. */
  const k = Math.min(1, width / 1380) * Math.min(1, height / 820);

  /**
   * Writes one frame straight to the underlying nodes — see `pose.ts` for why
   * this bypasses React state entirely. This is the design source's exact
   * arithmetic, just applied imperatively instead of through re-render.
   */
  const applyFrame = useCallback(
    (p: number, stick: number) => {
      lastP.current = p;

      applyPose(stageRef, { transforms: [{ type: 'translate', y: stick }] });
      applyPose(railFillRef, { heightPercent: p * 100 });

      const beforeT = seg(p, 0.06, 0.3);
      applyPose(beforeRef, {
        opacity: 1 - beforeT,
        transforms: [{ type: 'translate', y: beforeT * -18 }],
      });

      const afterT = ease(seg(p, 0.34, 0.6));
      applyPose(afterRef, {
        opacity: afterT,
        transforms: [{ type: 'translate', y: (1 - afterT) * 18 }],
      });

      const windowT = ease(seg(p, 0.3, 0.68));
      applyPose(windowRef, {
        opacity: windowT,
        transforms: [
          { type: 'scale', value: 0.9 + windowT * 0.1 },
          { type: 'translate', y: (1 - windowT) * 26 },
        ],
      });

      chaosCards.forEach((card, i) => {
        const t = ease(seg(p, 0.02 + i * 0.035, 0.46 + i * 0.035));
        applyPose(
          { current: chaosRefs.current[i] },
          {
            opacity: clamp01(1 - t * 1.35),
            transforms: [
              { type: 'translate', x: card.x * k * (1 - t), y: card.y * k * (1 - t) },
              { type: 'rotate', deg: card.rot * (1 - t) },
              { type: 'scale', value: 1 - t * 0.42 },
            ],
            blurPx: t * 3,
          },
        );
      });

      moduleChips.forEach((_, i) => {
        const t = ease(seg(p, 0.58 + i * 0.028, 0.72 + i * 0.028));
        applyPose(
          { current: chipRefs.current[i] },
          { opacity: t, transforms: [{ type: 'translate', y: (1 - t) * 14 }] },
        );
      });
    },
    [k],
  );

  useScrollListener(
    useCallback(() => {
      if (reduced || span <= 0) return;
      const top = readViewportTop(sceneRef.current);
      if (top == null) return;
      applyFrame(clamp01(-top / span), Math.min(span, Math.max(0, -top)));
    }, [reduced, span, applyFrame]),
  );

  /* A render for any other reason (e.g. resize) rebuilds this JSX from
     lastP, so it must be repainted immediately afterward to stay in sync —
     the render itself doesn't touch the refs. */
  useEffect(() => {
    const stick = span > 0 ? Math.min(span, Math.max(0, lastP.current * span)) : 0;
    applyFrame(lastP.current, stick);
  }, [applyFrame, span]);

  const headPad = f(56, 7, 96);
  const windowWidth = Math.min(880, width * 0.78);

  /* First-paint (and post-resize) baseline — see `lastP` above. */
  const p0 = lastP.current;
  const stick0 = span > 0 ? Math.min(span, Math.max(0, p0 * span)) : 0;
  const before0T = seg(p0, 0.06, 0.3);
  const after0T = ease(seg(p0, 0.34, 0.6));
  const window0T = ease(seg(p0, 0.3, 0.68));

  return (
    <View
      ref={(node) => {
        sceneRef.current = node;
        registerSection('transform', node);
      }}
      style={{ height: sectionHeight, backgroundColor: color.ink }}
    >
      {/* Stands in for `position: sticky` — the stage tracks the scroll so it
          holds still in the viewport for the length of the section. */}
      <View
        ref={stageRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height,
          overflow: 'hidden',
          justifyContent: 'center',
          transform: [{ translateY: stick0 }],
        }}
      >
        {/* Progress rail */}
        <View
          style={{ position: 'absolute', top: 0, bottom: 0, left: gutter, width: 1, backgroundColor: color.lineInk }}
        >
          <View ref={railFillRef} style={{ width: 1, height: `${p0 * 100}%`, backgroundColor: color.accent }} />
        </View>

        {/* Before / after headlines.
            The fixed nav overlays the top `navHeight` px of the viewport at
            every scroll position. The heads box sits flush at the top of the
            stage, and because the chaos field below it has flex:1 and soaks
            up all remaining height, centering the stage's children has no
            room to act on — so without this, the heading's top edge lands
            under the nav and shows through it. Extra top clearance here
            pushes the (bottom-anchored) text down until it fully clears the
            nav, without moving the chaos field or chips below it. The number
            is calibrated against the heading at its largest clamped size
            (reached at 1333px+ width, where it stops growing) plus a ~30px
            gap below the nav — narrower supported widths get a shorter
            heading and so end up with more clearance, never less. */}
        <View
          style={{
            height: 156 + HEADS_TOP_CLEARANCE,
            width: '100%',
            maxWidth: layout.container,
            alignSelf: 'center',
            paddingHorizontal: headPad,
            justifyContent: 'flex-end',
          }}
        >
          <View
            ref={beforeRef}
            style={{
              position: 'absolute',
              left: headPad,
              right: 0,
              bottom: 0,
              opacity: 1 - before0T,
              transform: [{ translateY: before0T * -18 }],
            }}
          >
            <SceneKicker label="Before" />
            <SceneTitle>
              Messages. Notes. Spreadsheets.
              <Text style={{ color: color.white45 }}> Manual work. Courier losses.</Text>
            </SceneTitle>
          </View>

          <View
            ref={afterRef}
            style={{
              position: 'absolute',
              left: headPad,
              right: 0,
              bottom: 0,
              opacity: after0T,
              transform: [{ translateY: (1 - after0T) * 18 }],
            }}
          >
            <SceneKicker label="After" accent />
            <SceneTitle>One system your whole business runs on.</SceneTitle>
          </View>
        </View>

        {/* Chaos field converging on the OrderFlow window */}
        <View style={{ flex: 1, minHeight: 0 }}>
          {chaosCards.map((card, i) => {
            const t0 = ease(seg(p0, 0.02 + i * 0.035, 0.46 + i * 0.035));
            const blur0 = t0 * 3;
            return (
              <View
                key={i}
                ref={(node) => {
                  chaosRefs.current[i] = node;
                }}
                style={[
                  {
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: card.width,
                    marginLeft: -card.width / 2,
                    marginTop: card.offsetY,
                    opacity: clamp01(1 - t0 * 1.35),
                    transform: [
                      { translateX: card.x * k * (1 - t0) },
                      { translateY: card.y * k * (1 - t0) },
                      { rotate: `${card.rot * (1 - t0)}deg` },
                      { scale: 1 - t0 * 0.42 },
                    ],
                  },
                  /* React Native has no blur filter; on web it is a real style. */
                  Platform.OS === 'web' && blur0 > 0.01
                    ? ({ filter: `blur(${blur0}px)` } as unknown as ViewStyle)
                    : null,
                ]}
                pointerEvents="none"
              >
                <ChaosCard index={i} />
              </View>
            );
          })}

          <View
            ref={windowRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: windowWidth,
              marginLeft: -windowWidth / 2,
              marginTop: -170,
              opacity: window0T,
              transform: [{ scale: 0.9 + window0T * 0.1 }, { translateY: (1 - window0T) * 26 }],
            }}
            pointerEvents="none"
          >
            <SceneWindow />
          </View>
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
              const t0 = ease(seg(p0, 0.58 + i * 0.028, 0.72 + i * 0.028));
              return (
                <View
                  key={chip}
                  ref={(node) => {
                    chipRefs.current[i] = node;
                  }}
                  style={{ opacity: t0, transform: [{ translateY: (1 - t0) * 14 }] }}
                >
                  <ModuleChip label={chip} on={i === 0} />
                </View>
              );
            })}
          </View>
        </View>
      </View>
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

const ModuleChip = memo(function ModuleChip({ label, on }: { label: string; on: boolean }) {
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
      <Text style={[{ fontFamily: font.mono, color: on ? color.white : color.white82 }, metrics(11, 1.4, 0.06)]}>
        {label}
      </Text>
    </View>
  );
});

/* Memoised so the per-frame progress updates only touch wrapper styles. */
const ChaosCard = memo(function ChaosCard({ index }: { index: number }) {
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
});

const SceneWindow = memo(function SceneWindow() {
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

          <View style={{ flexDirection: 'row', gap: 10, paddingBottom: 9, borderBottomWidth: 1, borderBottomColor: color.line }}>
            {[
              { label: 'Order', w: 88 },
              { label: 'Customer', w: undefined },
              { label: 'Total', w: 96 },
              { label: 'Status', w: 92 },
            ].map((head) => (
              <Text
                key={head.label}
                style={[
                  {
                    fontFamily: font.mono,
                    color: color.textFaint,
                    textTransform: 'uppercase',
                    width: head.w,
                    flex: head.w ? undefined : 1,
                  },
                  metrics(9.5, 1.4, 0.1),
                ]}
              >
                {head.label}
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
});

/* -------------------------------------------------- stacked mobile variant */

function TransformStack() {
  const { registerSection } = useScroll();

  return (
    <View
      ref={(node) => registerSection('transform', node)}
      style={{ backgroundColor: color.ink, paddingVertical: 72, paddingHorizontal: 20 }}
    >
      <SceneKicker label="Before" />
      <Text style={[{ fontFamily: font.displayBold, color: color.white, marginBottom: 22 }, metrics(30, 1.05, -0.035)]}>
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
      <Text style={[{ fontFamily: font.displayBold, color: color.white, marginBottom: 22 }, metrics(30, 1.05, -0.035)]}>
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
>>>>>>> c1decb5f08ffdabb7df20508d93878b536a73e30
