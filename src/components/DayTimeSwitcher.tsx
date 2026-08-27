import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { metrics } from '@/components/Type';
import { font } from '@/theme/tokens';

/**
 * The six-way time-of-day picker for the auth pages' launch panel — a small
 * icon button, top-right, that opens a list of presets. Each swaps the
 * panel's background gradient and star tint together, the way the reference
 * switches its whole scene rather than just a swatch.
 */
export type DayTime = 'predawn' | 'sunrise' | 'daytime' | 'dusk' | 'sunset' | 'night';

export type DayTimeTheme = {
  id: DayTime;
  label: string;
  /** Background gradient, top to bottom. */
  gradient: readonly [string, string, string];
  locations: readonly [number, number, number];
  /** Star/asteroid tint — white reads poorly against the paler themes. */
  fleck: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
};

export const DAY_TIME_THEMES: readonly DayTimeTheme[] = [
  {
    id: 'predawn',
    label: 'Pre-dawn',
    gradient: ['#181A3D', '#2C2E68', '#3E3E86'],
    locations: [0, 0.55, 1],
    fleck: '#C9CCF2',
    Icon: EyeIcon,
  },
  {
    id: 'sunrise',
    label: 'Sunrise',
    gradient: ['#5B4A9E', '#9C6FC4', '#F0B7D6'],
    locations: [0, 0.5, 1],
    fleck: '#FFE3EE',
    Icon: (p) => <SunIcon {...p} horizon />,
  },
  {
    id: 'daytime',
    label: 'Daytime',
    gradient: ['#3E8FD6', '#7FC4E8', '#FCE4A8'],
    locations: [0, 0.5, 1],
    fleck: '#FFF6DE',
    Icon: (p) => <SunIcon {...p} />,
  },
  {
    id: 'dusk',
    label: 'Dusk',
    gradient: ['#3B2F6B', '#8A5A9E', '#E497B0'],
    locations: [0, 0.5, 1],
    fleck: '#FBD9E6',
    Icon: (p) => <SunIcon {...p} horizon dim />,
  },
  {
    id: 'sunset',
    label: 'Sunset',
    gradient: ['#2A2560', '#6E4F9E', '#C98BAE'],
    locations: [0, 0.45, 1],
    fleck: '#E9D3F0',
    Icon: (p) => <SunIcon {...p} dim />,
  },
  {
    id: 'night',
    label: 'Night',
    gradient: ['#181C3F', '#2D2E72', '#4A47A3'],
    locations: [0, 0.5, 1],
    fleck: '#CFCFF5',
    Icon: MoonIcon,
  },
];

export function DayTimeSwitcher({
  value,
  onChange,
}: {
  value: DayTime;
  onChange: (id: DayTime) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<View | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const active = DAY_TIME_THEMES.find((t) => t.id === value) ?? DAY_TIME_THEMES[DAY_TIME_THEMES.length - 1];

  useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 180,
      easing: open ? Easing.out(Easing.back(1.1)) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [open, progress]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !open) return;
    const onDown = (event: MouseEvent) => {
      const node = containerRef.current as unknown as HTMLElement | null;
      if (node && event.target instanceof Node && node.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <View ref={containerRef} style={{ position: 'absolute', top: 18, right: 18, zIndex: 20 }}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={`Time of day: ${active.label}`}
        accessibilityState={{ expanded: open }}
      >
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.28)',
          }}
        >
          <active.Icon size={17} color="#FFFFFF" />
        </View>
      </Pressable>

      {open ? (
        <Animated.View
          style={{
            position: 'absolute',
            top: 40,
            right: 0,
            width: 152,
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            paddingVertical: 6,
            opacity: progress,
            transform: [
              { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) },
              { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
            ],
            boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
          }}
        >
          {DAY_TIME_THEMES.map((t) => {
            const selected = t.id === value;
            return (
              <Pressable
                key={t.id}
                onPress={() => {
                  onChange(t.id);
                  setOpen(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 9,
                    marginHorizontal: 6,
                    paddingVertical: 7,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    backgroundColor: selected ? 'rgba(43,76,242,0.12)' : 'transparent',
                  }}
                >
                  <t.Icon size={14} color={selected ? '#2B4CF2' : '#3C4150'} />
                  <Text
                    style={[
                      { fontFamily: selected ? font.bodySemi : font.body, color: selected ? '#2B4CF2' : '#3C4150' },
                      metrics(13, 1.3),
                    ]}
                  >
                    {t.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </Animated.View>
      ) : null}
    </View>
  );
}

function EyeIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke={color} strokeWidth={1.6} fill="none" />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.6} fill="none" />
    </Svg>
  );
}

function MoonIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/** One glyph covers sunrise/daytime/dusk/sunset: rays around a sun disc,
    optionally cut by a horizon line and dimmed for the two dimmer times. */
function SunIcon({
  size,
  color,
  horizon,
  dim,
}: {
  size: number;
  color: string;
  horizon?: boolean;
  dim?: boolean;
}) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].filter((deg) => !horizon || (deg !== 180 && deg !== 135 && deg !== 225));
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" opacity={dim ? 0.75 : 1}>
      <Circle cx={12} cy={horizon ? 15 : 12} r={5} stroke={color} strokeWidth={1.6} fill="none" />
      {rays.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const cx = 12;
        const cy = horizon ? 15 : 12;
        const x1 = cx + Math.cos(rad) * 7.5;
        const y1 = cy + Math.sin(rad) * 7.5;
        const x2 = cx + Math.cos(rad) * 10.5;
        const y2 = cy + Math.sin(rad) * 10.5;
        return <Line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.6} strokeLinecap="round" />;
      })}
      {horizon ? <Line x1={1} y1={20.5} x2={23} y2={20.5} stroke={color} strokeWidth={1.6} strokeLinecap="round" /> : null}
    </Svg>
  );
}
