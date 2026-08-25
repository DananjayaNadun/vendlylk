<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import { autoFitColumns, trackWidth, useViewport } from '@/theme/responsive';
import { color, layout } from '@/theme/tokens';
import { SectionId, useScroll } from '@/scroll/ScrollProvider';

/**
 * The width a container hands to its children.
 *
 * CSS resolves grid tracks during layout; React Native cannot, so grids measure
 * themselves. Measurement only arrives a frame later though, which would leave
 * the first paint unsized. Containers therefore publish the width they already
 * know, so every grid lays out correctly on first render and treats its own
 * measurement as a refinement rather than a prerequisite.
 */
const AvailableWidth = createContext(0);

export function ProvideWidth({ width, children }: { width: number; children: React.ReactNode }) {
  return <AvailableWidth.Provider value={Math.max(0, width)}>{children}</AvailableWidth.Provider>;
}

export function useAvailableWidth(): number {
  return useContext(AvailableWidth);
}

/** Republishes the available width minus a container's own padding/borders. */
export function Inset({ by, children }: { by: number; children: React.ReactNode }) {
  const outer = useAvailableWidth();
  return <ProvideWidth width={outer - by}>{children}</ProvideWidth>;
}

/**
 * Measures a container's width, re-measuring whenever the viewport changes.
 *
 * `onLayout` is backed by a ResizeObserver. A measurement taken during a
 * transient layout would otherwise stick, and any grid sized from it would lay
 * its children out wider than the row that holds them.
 */
export function useMeasuredWidth(): [number, (event: LayoutChangeEvent) => void] {
  const [measured, setMeasured] = useState(0);
  const fallback = useAvailableWidth();
  const viewport = useViewport();

  /* Drop a measurement taken at a different viewport rather than trusting it;
     the published width covers the gap until onLayout reports again. */
  useEffect(() => {
    setMeasured(0);
  }, [viewport.width]);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    setMeasured((prev) => (Math.abs(prev - next) > 0.5 ? next : prev));
  };

  return [measured > 0 ? measured : fallback, onLayout];
}

/** max-width: 1320px; margin-inline: auto */
export function Container({
  children,
  style,
  onWidth,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onWidth?: (w: number) => void;
}) {
  const outer = useAvailableWidth();
  return (
    <View
      onLayout={onWidth ? (e) => onWidth(e.nativeEvent.layout.width) : undefined}
      style={[{ width: '100%', maxWidth: layout.container, alignSelf: 'center' }, style]}
    >
      <ProvideWidth width={Math.min(layout.container, outer)}>{children}</ProvideWidth>
    </View>
  );
}

/**
 * A page section. `id` registers the section's scroll offset so the nav and
 * footer links can jump to it — React Native has no URL fragments.
 */
export function Section({
  id,
  tone = 'paper',
  flushTop = false,
  paddingBottom,
  style,
  children,
}: {
  id?: SectionId;
  tone?: 'paper' | 'ink';
  flushTop?: boolean;
  paddingBottom?: number;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}) {
  const { gutter, sectionY, width } = useViewport();
  const { registerSection } = useScroll();

  return (
    <View
      ref={(node) => {
        if (id) registerSection(id, node);
      }}
      style={[
        {
          backgroundColor: tone === 'ink' ? color.ink : color.paper,
          paddingTop: flushTop ? 0 : sectionY,
          paddingBottom: paddingBottom ?? sectionY,
          paddingHorizontal: gutter,
        },
        style,
      ]}
    >
      <ProvideWidth width={width - gutter * 2}>{children}</ProvideWidth>
    </View>
  );
}

/** The hairline + padding that opens the flush-top sections. */
export function RuledTop({ children }: { children: React.ReactNode }) {
  const { f } = useViewport();
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: color.lineStrong,
        paddingTop: f(48, 6, 80),
      }}
    >
      {children}
    </View>
  );
}

/**
 * Reproduces `grid-template-columns: repeat(auto-fit, minmax(min, 1fr))`.
 *
 * CSS fits as many `min`-wide tracks as will go and shares the remainder
 * equally; empty tracks collapse. `spans` lets one child occupy several tracks,
 * which is how the categories panel sits two-thirds wide beside its picker.
 */
export function AutoGrid({
  minItemWidth,
  gap = 18,
  rowGap,
  spans,
  align = 'stretch',
  style,
  children,
}: {
  minItemWidth: number;
  gap?: number;
  rowGap?: number;
  spans?: number[];
  align?: ViewStyle['alignItems'];
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}) {
  const [width, onLayout] = useMeasuredWidth();
  const items = React.Children.toArray(children);

  /* `auto-fit` differs from `auto-fill` by collapsing tracks nothing occupies,
     then sharing the space among the rest. That collapse is what lets the
     categories panel sit two-thirds wide beside a one-third picker instead of
     leaving a fourth track empty. */
  const totalSpan = items.reduce<number>((sum, _, i) => sum + (spans?.[i] ?? 1), 0);
  const fitted = width > 0 ? autoFitColumns(width, minItemWidth, gap) : 1;
  const columns = Math.max(1, Math.min(fitted, totalSpan));
  const track = width > 0 ? trackWidth(width, columns, gap) : 0;

  const widthFor = (index: number) => {
    if (width <= 0) return undefined;
    const span = Math.min(spans?.[index] ?? 1, columns);
    return track * span + gap * (span - 1);
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap: gap,
          rowGap: rowGap ?? gap,
          alignItems: align,
          width: '100%',
        },
        style,
      ]}
    >
      {items.map((child, index) => {
        const childWidth = widthFor(index);
        return (
          /* maxWidth is the safety net: a stale-wide measurement can never push
             a child past its row, it just wraps to one per line instead. */
          <View key={index} style={{ width: childWidth, maxWidth: '100%' }}>
            <ProvideWidth width={childWidth ?? 0}>{child}</ProvideWidth>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Two-column head: a heading on the left, a supporting paragraph pushed to the
 * right edge. Collapses to one column below the grid's fitting width.
 */
export function SplitHead({
  gap,
  minItemWidth = 300,
  left,
  right,
  style,
}: {
  gap?: number;
  minItemWidth?: number;
  left: React.ReactNode;
  right: React.ReactNode;
  style?: ViewStyle;
}) {
  const { f, isMobile } = useViewport();
  const columnGap = gap ?? f(24, 4, 56);

  return (
    <AutoGrid minItemWidth={minItemWidth} gap={columnGap} align="flex-end" style={style}>
      <View style={{ width: '100%' }}>{left}</View>
      <View style={{ width: '100%', alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
        {right}
      </View>
    </AutoGrid>
  );
}

/** Horizontal hairline. */
export function Hairline({ tone = 'paper', style }: { tone?: 'paper' | 'ink'; style?: ViewStyle }) {
  return (
    <View
      style={[
        { height: 1, backgroundColor: tone === 'ink' ? color.lineInk : color.line, width: '100%' },
        style,
      ]}
    />
  );
}
=======
import React, { createContext, useContext, useEffect, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import { autoFitColumns, trackWidth, useViewport } from '@/theme/responsive';
import { color, layout } from '@/theme/tokens';
import { SectionId, useScroll } from '@/scroll/ScrollProvider';

/**
 * The width a container hands to its children.
 *
 * CSS resolves grid tracks during layout; React Native cannot, so grids measure
 * themselves. Measurement only arrives a frame later though, which would leave
 * the first paint unsized. Containers therefore publish the width they already
 * know, so every grid lays out correctly on first render and treats its own
 * measurement as a refinement rather than a prerequisite.
 */
const AvailableWidth = createContext(0);

export function ProvideWidth({ width, children }: { width: number; children: React.ReactNode }) {
  return <AvailableWidth.Provider value={Math.max(0, width)}>{children}</AvailableWidth.Provider>;
}

export function useAvailableWidth(): number {
  return useContext(AvailableWidth);
}

/** Republishes the available width minus a container's own padding/borders. */
export function Inset({ by, children }: { by: number; children: React.ReactNode }) {
  const outer = useAvailableWidth();
  return <ProvideWidth width={outer - by}>{children}</ProvideWidth>;
}

/**
 * Measures a container's width, re-measuring whenever the viewport changes.
 *
 * `onLayout` is backed by a ResizeObserver. A measurement taken during a
 * transient layout would otherwise stick, and any grid sized from it would lay
 * its children out wider than the row that holds them.
 */
export function useMeasuredWidth(): [number, (event: LayoutChangeEvent) => void] {
  const [measured, setMeasured] = useState(0);
  const fallback = useAvailableWidth();
  const viewport = useViewport();

  /* Drop a measurement taken at a different viewport rather than trusting it;
     the published width covers the gap until onLayout reports again. */
  useEffect(() => {
    setMeasured(0);
  }, [viewport.width]);

  const onLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    setMeasured((prev) => (Math.abs(prev - next) > 0.5 ? next : prev));
  };

  return [measured > 0 ? measured : fallback, onLayout];
}

/** max-width: 1320px; margin-inline: auto */
export function Container({
  children,
  style,
  onWidth,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onWidth?: (w: number) => void;
}) {
  const outer = useAvailableWidth();
  return (
    <View
      onLayout={onWidth ? (e) => onWidth(e.nativeEvent.layout.width) : undefined}
      style={[{ width: '100%', maxWidth: layout.container, alignSelf: 'center' }, style]}
    >
      <ProvideWidth width={Math.min(layout.container, outer)}>{children}</ProvideWidth>
    </View>
  );
}

/**
 * A page section. `id` registers the section's scroll offset so the nav and
 * footer links can jump to it — React Native has no URL fragments.
 */
export function Section({
  id,
  tone = 'paper',
  flushTop = false,
  paddingBottom,
  style,
  children,
}: {
  id?: SectionId;
  tone?: 'paper' | 'ink';
  flushTop?: boolean;
  paddingBottom?: number;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}) {
  const { gutter, sectionY, width } = useViewport();
  const { registerSection } = useScroll();

  return (
    <View
      ref={(node) => {
        if (id) registerSection(id, node);
      }}
      style={[
        {
          backgroundColor: tone === 'ink' ? color.ink : color.paper,
          paddingTop: flushTop ? 0 : sectionY,
          paddingBottom: paddingBottom ?? sectionY,
          paddingHorizontal: gutter,
        },
        style,
      ]}
    >
      <ProvideWidth width={width - gutter * 2}>{children}</ProvideWidth>
    </View>
  );
}

/** The hairline + padding that opens the flush-top sections. */
export function RuledTop({ children }: { children: React.ReactNode }) {
  const { f } = useViewport();
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: color.lineStrong,
        paddingTop: f(48, 6, 80),
      }}
    >
      {children}
    </View>
  );
}

/**
 * Reproduces `grid-template-columns: repeat(auto-fit, minmax(min, 1fr))`.
 *
 * CSS fits as many `min`-wide tracks as will go and shares the remainder
 * equally; empty tracks collapse. `spans` lets one child occupy several tracks,
 * which is how the categories panel sits two-thirds wide beside its picker.
 */
export function AutoGrid({
  minItemWidth,
  gap = 18,
  rowGap,
  spans,
  align = 'stretch',
  style,
  children,
}: {
  minItemWidth: number;
  gap?: number;
  rowGap?: number;
  spans?: number[];
  align?: ViewStyle['alignItems'];
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}) {
  const [width, onLayout] = useMeasuredWidth();
  const items = React.Children.toArray(children);

  /* `auto-fit` differs from `auto-fill` by collapsing tracks nothing occupies,
     then sharing the space among the rest. That collapse is what lets the
     categories panel sit two-thirds wide beside a one-third picker instead of
     leaving a fourth track empty. */
  const totalSpan = items.reduce<number>((sum, _, i) => sum + (spans?.[i] ?? 1), 0);
  const fitted = width > 0 ? autoFitColumns(width, minItemWidth, gap) : 1;
  const columns = Math.max(1, Math.min(fitted, totalSpan));
  const track = width > 0 ? trackWidth(width, columns, gap) : 0;

  const widthFor = (index: number) => {
    if (width <= 0) return undefined;
    const span = Math.min(spans?.[index] ?? 1, columns);
    return track * span + gap * (span - 1);
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap: gap,
          rowGap: rowGap ?? gap,
          alignItems: align,
          width: '100%',
        },
        style,
      ]}
    >
      {items.map((child, index) => {
        const childWidth = widthFor(index);
        return (
          /* maxWidth is the safety net: a stale-wide measurement can never push
             a child past its row, it just wraps to one per line instead. */
          <View key={index} style={{ width: childWidth, maxWidth: '100%' }}>
            <ProvideWidth width={childWidth ?? 0}>{child}</ProvideWidth>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Two-column head: a heading on the left, a supporting paragraph pushed to the
 * right edge. Collapses to one column below the grid's fitting width.
 */
export function SplitHead({
  gap,
  minItemWidth = 300,
  left,
  right,
  style,
}: {
  gap?: number;
  minItemWidth?: number;
  left: React.ReactNode;
  right: React.ReactNode;
  style?: ViewStyle;
}) {
  const { f, isMobile } = useViewport();
  const columnGap = gap ?? f(24, 4, 56);

  return (
    <AutoGrid minItemWidth={minItemWidth} gap={columnGap} align="flex-end" style={style}>
      <View style={{ width: '100%' }}>{left}</View>
      <View style={{ width: '100%', alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
        {right}
      </View>
    </AutoGrid>
  );
}

/** Horizontal hairline. */
export function Hairline({ tone = 'paper', style }: { tone?: 'paper' | 'ink'; style?: ViewStyle }) {
  return (
    <View
      style={[
        { height: 1, backgroundColor: tone === 'ink' ? color.lineInk : color.line, width: '100%' },
        style,
      ]}
    />
  );
}
>>>>>>> c1decb5f08ffdabb7df20508d93878b536a73e30
