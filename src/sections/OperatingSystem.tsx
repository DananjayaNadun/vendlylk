import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, RadialGradient, Stop } from 'react-native-svg';
import { brand } from '@/assets';
import { Container, Section } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Eyebrow } from '@/components/UI';
import { H2, Lede, metrics } from '@/components/Type';
import { osModules } from '@/data';
import { color, font, radius } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useReducedMotion } from '@/theme/useReducedMotion';
import { SriLankaMap } from '@/components/SriLankaMap';

/* The scene is authored at a fixed 640px so the orbit geometry stays exact,
   then scaled as one unit to whatever width the container can give it. The
   detail card sits to its right and is part of the same board, so the
   connector line between a chip and the card lives in one coordinate space. */
const SCENE = 640;
const CENTER = SCENE / 2;
const CARD_WIDTH = 264;
const CARD_GAP = 44;
const BOARD_WIDTH = SCENE + CARD_GAP + CARD_WIDTH;

/** Hit box around each chip — generous enough for the longest label. */
const SLOT_WIDTH = 240;
const SLOT_HEIGHT = 44;

type Tone = 'accent' | 'live' | 'white';

const TONE: Record<Tone, string> = {
  accent: color.accentLight,
  live: color.live,
  white: color.white,
};

/**
 * Two rings turning against each other. Five chips each, evenly spaced, with
 * the outer ring offset half a step from the inner one so the two never line
 * up into a spoke.
 */
const ORBITS = [
  {
    radius: 300,
    startAngle: -90,
    duration: 90000,
    /** 1 = clockwise. The chips counter-rotate so their text stays upright. */
    direction: 1,
    items: [
      { module: 1, tone: 'accent' as Tone }, // Orders
      { module: 5, tone: 'live' as Tone }, // Payments
      { module: 6, tone: 'accent' as Tone }, // Courier
      { module: 7, tone: 'white' as Tone }, // Analytics
      { module: 0, tone: 'live' as Tone }, // Storefront
    ],
  },
  {
    radius: 190,
    startAngle: -54,
    duration: 70000,
    direction: -1,
    items: [
      { module: 2, tone: 'live' as Tone }, // Customers
      { module: 3, tone: 'white' as Tone }, // Products
      { module: 4, tone: 'accent' as Tone }, // Inventory
      { module: 8, tone: 'live' as Tone }, // AI assistant
      { module: 9, tone: 'white' as Tone }, // COD Reliability
    ],
  },
];

type Chip = { module: number; orbit: number; angle: number; radius: number; tone: Tone };

const CHIPS: Chip[] = ORBITS.flatMap((orbit, orbitIndex) =>
  orbit.items.map((item, i) => ({
    module: item.module,
    orbit: orbitIndex,
    angle: orbit.startAngle + (i * 360) / orbit.items.length,
    radius: orbit.radius,
    tone: item.tone,
  })),
);

export function OperatingSystem() {
  const { f } = useViewport();

  return (
    <Section id="os" tone="ink">
      <Container>
        <Reveal index={0} style={{ maxWidth: 760, alignSelf: 'center', marginBottom: f(28, 3.4, 44) }}>
          <View style={{ alignItems: 'center' }}>
            <Eyebrow label="The operating system" tone="ink" center />
            <H2 style={{ color: color.white, marginBottom: 18, textAlign: 'center' }}>
              One system instead of ten disconnected tools.
            </H2>
            <Lede style={{ color: color.white60, textAlign: 'center' }}>
              Every part shares the same products, the same customers and the same numbers. Nothing is re-typed.
              Nothing is out of date.
            </Lede>
          </View>
        </Reveal>

        <Reveal index={1}>
          <OrbitScene />
        </Reveal>
      </Container>
    </Section>
  );
}

/**
 * A linear 0→1 ramp that can be paused and resumed where it left off.
 *
 * `Animated.loop` always restarts from zero, which would make the rings snap
 * back every time a chip is opened. Re-running a single timing over the
 * remaining fraction keeps the position continuous across a pause.
 */
function useSpin(duration: number, paused: boolean, still: boolean) {
  const value = useRef(new Animated.Value(0)).current;
  const progress = useRef(0);

  useEffect(() => {
    const id = value.addListener(({ value: v }) => {
      progress.current = v;
    });
    return () => value.removeListener(id);
  }, [value]);

  useEffect(() => {
    if (paused || still) return;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      Animated.timing(value, {
        toValue: 1,
        duration: Math.max(16, duration * (1 - progress.current)),
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || cancelled) return;
        value.setValue(0);
        progress.current = 0;
        run();
      });
    };

    run();
    return () => {
      cancelled = true;
      value.stopAnimation();
    };
  }, [duration, paused, still, value]);

  return { value, progress };
}

function spinTo(value: Animated.Value, direction: number) {
  return value.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', direction > 0 ? '360deg' : '-360deg'],
  });
}

function OrbitScene() {
  const { isMobile, contentWidth } = useViewport();
  const reduced = useReducedMotion();
  const boardRef = useRef<View | null>(null);

  /* Hovering previews a module; clicking pins it. A pinned module outranks
     whatever the pointer happens to be over, and survives until the next
     click lands outside the board. */
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = pinned ?? hovered;

  const outer = useSpin(ORBITS[0].duration, active !== null, reduced || isMobile);
  const inner = useSpin(ORBITS[1].duration, active !== null, reduced || isMobile);
  const spins = [outer, inner];

  useEffect(() => {
    if (Platform.OS !== 'web' || pinned === null) return;
    const onDown = (event: MouseEvent) => {
      const node = boardRef.current as unknown as HTMLElement | null;
      if (node && event.target instanceof Node && node.contains(event.target)) return;
      setPinned(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [pinned]);

  /* Where the active chip sits right now. The rings turn linearly, so the
     position is just its base angle plus however far its ring has travelled —
     no measuring, which would report the pre-transform position anyway. */
  const anchor = useMemo(() => {
    if (active === null) return null;
    const chip = CHIPS.find((c) => c.module === active);
    if (!chip) return null;
    const turned = spins[chip.orbit].progress.current * 360 * ORBITS[chip.orbit].direction;
    const radians = ((chip.angle + turned) * Math.PI) / 180;
    return {
      x: CENTER + chip.radius * Math.cos(radians),
      y: CENTER + chip.radius * Math.sin(radians),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const toggle = (module: number) => setPinned((prev) => (prev === module ? null : module));

  if (isMobile) return <StackedModules active={active} onToggle={toggle} />;

  const scale = Math.min(1, contentWidth / BOARD_WIDTH);

  /* The relief takes whatever width the ring leaves over on the right. Under
     ~260px there is nothing left to read, so it is dropped rather than
     squeezed — the section stands on its own without it. */
  const boardWidth = BOARD_WIDTH * scale;
  const mapWidth = Math.min(480, contentWidth - boardWidth - 32);
  /* Near square on purpose. The island turns about its vertical axis, so the
     width it needs (its long diagonal) and the height it needs (that diagonal
     foreshortened, plus the arcs) come out close to equal — a tall box would
     only push the camera back and leave the island small in empty space. */
  const mapHeight = Math.min(SCENE * scale, mapWidth * 1.05);
  const showMap = mapWidth >= 260;

  return (
    <View style={{ width: '100%', alignItems: 'flex-start' }}>
      <View
        style={{
          width: BOARD_WIDTH * scale,
          height: SCENE * scale,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          ref={boardRef}
          style={{ position: 'absolute', width: BOARD_WIDTH, height: SCENE, transform: [{ scale }] }}
        >
          <Ring inset={0} />
          <Ring inset={110} />
          <Glow />

          {anchor ? (
            <Svg
              width={BOARD_WIDTH}
              height={SCENE}
              style={{ position: 'absolute', left: 0, top: 0 }}
              pointerEvents="none"
            >
              <Line
                x1={anchor.x}
                y1={anchor.y}
                x2={SCENE + CARD_GAP}
                y2={CENTER}
                stroke={color.accentLight}
                strokeWidth={1.25}
              />
              <Circle cx={anchor.x} cy={anchor.y} r={3.5} fill={color.accentLight} />
            </Svg>
          ) : null}

          <Core />

          {ORBITS.map((orbit, orbitIndex) => (
            <Animated.View
              key={orbitIndex}
              pointerEvents="box-none"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: SCENE,
                height: SCENE,
                transform: [{ rotate: spinTo(spins[orbitIndex].value, orbit.direction) }],
              }}
            >
              {CHIPS.filter((chip) => chip.orbit === orbitIndex).map((chip) => {
                const radians = (chip.angle * Math.PI) / 180;
                return (
                  <View
                    key={chip.module}
                    pointerEvents="box-none"
                    style={{
                      position: 'absolute',
                      left: CENTER + chip.radius * Math.cos(radians) - SLOT_WIDTH / 2,
                      top: CENTER + chip.radius * Math.sin(radians) - SLOT_HEIGHT / 2,
                      width: SLOT_WIDTH,
                      height: SLOT_HEIGHT,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Animated.View
                      style={{ transform: [{ rotate: spinTo(spins[orbitIndex].value, -orbit.direction) }] }}
                    >
                      <ModuleChip
                        chip={chip}
                        active={active === chip.module}
                        onHoverIn={() => setHovered(chip.module)}
                        onHoverOut={() => setHovered((prev) => (prev === chip.module ? null : prev))}
                        onPress={() => toggle(chip.module)}
                      />
                    </Animated.View>
                  </View>
                );
              })}
            </Animated.View>
          ))}

          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              left: SCENE + CARD_GAP,
              top: 0,
              width: CARD_WIDTH,
              height: SCENE,
              justifyContent: 'center',
            }}
          >
            {active !== null ? <DetailCard module={active} /> : null}
          </View>
        </View>
      </View>

      {/* Centred under the ring itself, not the board — the detail card's
          column would otherwise drag the caption off to the right. */}
      <Text
        style={[
          {
            fontFamily: font.mono,
            color: color.white50,
            textTransform: 'uppercase',
            textAlign: 'center',
            marginTop: 26,
            width: SCENE * scale,
          },
          metrics(10.5, 1.4, 0.16),
        ]}
      >
        One login · one source of truth
      </Text>

      {showMap ? (
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: mapWidth,
            height: SCENE * scale,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SriLankaMap width={Math.round(mapWidth)} height={Math.round(mapHeight)} />
        </View>
      ) : null}
    </View>
  );
}

function Ring({ inset }: { inset: number }) {
  const size = SCENE - inset * 2;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: inset,
        top: inset,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.14)',
        borderStyle: 'dashed',
      }}
    />
  );
}

/**
 * The halo behind the core. A flat circle would show its own edge, so this is
 * a real radial fade — white at 12% in the middle, gone by 70% of the radius,
 * exactly the gradient the reference uses.
 */
function Glow() {
  const r = (SCENE - 360) / 2;
  return (
    <Svg width={SCENE} height={SCENE} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
      <Defs>
        <RadialGradient id="osGlow" cx={CENTER} cy={CENTER} r={r} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.12} />
          <Stop offset="0.7" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={CENTER} cy={CENTER} r={r} fill="url(#osGlow)" />
    </Svg>
  );
}

function Core() {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: CENTER - 64,
        top: CENTER - 64,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: color.inkRaised,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 70px rgba(255,255,255,0.25)',
      }}
    >
      <Image source={brand.light} resizeMode="contain" style={{ width: 46, height: 46 }} />
    </View>
  );
}

function ModuleChip({
  chip,
  active,
  onHoverIn,
  onHoverOut,
  onPress,
}: {
  chip: Chip;
  active: boolean;
  onHoverIn: () => void;
  onHoverOut: () => void;
  onPress: () => void;
}) {
  const module = osModules[chip.module];

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      accessibilityRole="button"
      accessibilityLabel={`${module.name} — ${module.body}`}
      accessibilityState={{ selected: active }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderRadius: radius.pill,
          paddingVertical: 9,
          paddingHorizontal: 15,
          backgroundColor: active ? '#1B2233' : color.inkRaised,
          borderWidth: 1,
          borderColor: active ? color.accentLight : 'rgba(255,255,255,0.16)',
          boxShadow: '0 10px 26px rgba(0,0,0,0.45)',
        }}
      >
        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: TONE[chip.tone] }} />
        <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(13.5, 1.3)]}>
          {module.name}
        </Text>
      </View>
    </Pressable>
  );
}

/** The panel the connector line points at: the module's dot, name and body. */
function DetailCard({ module, style }: { module: number; style?: object }) {
  const chip = CHIPS.find((c) => c.module === module);
  const entry = osModules[module];
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    reveal.setValue(0);
    Animated.timing(reveal, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [module, reveal]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: color.inkRaised,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.16)',
          borderRadius: radius.card,
          padding: 20,
          opacity: reveal,
          transform: [{ translateX: reveal.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) }],
          boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <View
          style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: TONE[chip?.tone ?? 'white'] }}
        />
        <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(15.5, 1.3)]}>
          {entry.name}
        </Text>
      </View>
      <Text style={[{ fontFamily: font.body, color: color.white60 }, metrics(13.5, 1.55)]}>
        {entry.body}
      </Text>
    </Animated.View>
  );
}

/**
 * Below the breakpoint the orbit has nowhere to turn, so the same chips stack
 * into a wrapped list and the detail card drops underneath the one tapped.
 */
function StackedModules({ active, onToggle }: { active: number | null; onToggle: (module: number) => void }) {
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Core2 />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 9,
          justifyContent: 'center',
          marginTop: 26,
        }}
      >
        {CHIPS.map((chip) => (
          <ModuleChip
            key={chip.module}
            chip={chip}
            active={active === chip.module}
            onHoverIn={() => {}}
            onHoverOut={() => {}}
            onPress={() => onToggle(chip.module)}
          />
        ))}
      </View>

      {active !== null ? (
        <DetailCard module={active} style={{ marginTop: 20, width: '100%', maxWidth: 360 }} />
      ) : null}

      <Text
        style={[
          { fontFamily: font.mono, color: color.white50, textTransform: 'uppercase', textAlign: 'center', marginTop: 24 },
          metrics(10.5, 1.4, 0.16),
        ]}
      >
        One login · one source of truth
      </Text>
    </View>
  );
}

function Core2() {
  return (
    <View
      style={{
        width: 104,
        height: 104,
        borderRadius: 52,
        backgroundColor: color.inkRaised,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.16)',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 60px rgba(255,255,255,0.14)',
      }}
    >
      <Image source={brand.light} resizeMode="contain" style={{ width: 40, height: 40 }} />
    </View>
  );
}
