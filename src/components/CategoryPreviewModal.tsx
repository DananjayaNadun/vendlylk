import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { Category } from '@/data';
import { metrics } from '@/components/Type';
import { color, font, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useHover } from '@/components/Button';

/** The reference Figma frame this card recreates, at 1:1 design scale. */
const FRAME_WIDTH = 1440;
const FRAME_HEIGHT = 1024;
const FRAME_RATIO = FRAME_WIDTH / FRAME_HEIGHT;
const CARD_GUTTER = 24;

/**
 * The product preview triggered by the Categories section's "Preview"
 * button. Floats as its own layer above the detail panel — a centered card
 * with a dim backdrop behind it, rather than replacing the panel's content
 * in place, so the page around it stays visible. The card keeps the
 * reference design's 1440:1024 frame proportions at any size, with every
 * element inside (wordmark, divider, glyph, FAB) scaled off the card's
 * measured width so it stays faithful whether the panel is small or large.
 */
export function CategoryPreviewModal({
  category,
  visible,
  onClose,
}: {
  category: Category;
  visible: boolean;
  onClose: () => void;
}) {
  const [rendered, setRendered] = useState(false);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  /* onLayout only refines the fit; the panel can never exceed the viewport,
     so that's a safe upper bound to render from on the very first frame
     instead of waiting a tick for the real measurement. */
  const viewport = useViewport();

  useEffect(() => {
    if (visible) {
      setRendered(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.back(1.15)),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setRendered(false);
      });
    }
  }, [visible, progress]);

  /* Esc closes, web only — there's no keyboard equivalent to wire on native. */
  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible, onClose]);

  if (!rendered) return null;

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const size = containerSize ?? { width: viewport.width, height: viewport.height };
  const availW = Math.max(0, size.width - CARD_GUTTER * 2);
  const availH = Math.max(0, size.height - CARD_GUTTER * 2);
  let cardWidth = availW;
  let cardHeight = cardWidth / FRAME_RATIO;
  if (cardHeight > availH) {
    cardHeight = availH;
    cardWidth = cardHeight * FRAME_RATIO;
  }

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      onLayout={onContainerLayout}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
      }}
    >
      {/* Invisible — just catches a click outside the card to close it. The
          card's own shadow already reads as "floating", so no visible dim
          is layered behind it. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close preview" accessibilityRole="button" />

      {cardWidth > 0 && cardHeight > 0 && (
        <Animated.View
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: radius.panel,
            overflow: 'hidden',
            backgroundColor: category.previewTint,
            transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }],
            ...shadow.panel,
          }}
        >
          <PreviewFrame category={category} cardWidth={cardWidth} onClose={onClose} />
        </Animated.View>
      )}
    </Animated.View>
  );
}

/** Everything inside the card, scaled off `cardWidth` against the 1440px
    reference frame so the recreation holds its proportions at any size. */
function PreviewFrame({ category, cardWidth, onClose }: { category: Category; cardWidth: number; onClose: () => void }) {
  const scale = cardWidth / FRAME_WIDTH;

  return (
    <>
      <Text
        numberOfLines={1}
        style={{
          position: 'absolute',
          left: 207 * scale,
          top: 231 * scale,
          fontFamily: font.displayBold,
          fontSize: 350 * scale,
          lineHeight: 369 * scale,
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        Vendly
      </Text>

      <DashDivider scale={scale} />
      <AccountGlyph scale={scale} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 100 * scale }}>
        <Image
          source={category.img}
          resizeMode="contain"
          style={{ width: '100%', height: '100%' }}
          accessibilityLabel={category.product}
        />
      </View>

      <GoBackFab onPress={onClose} scale={scale} />
    </>
  );
}

/** Row of dashes near the top, echoing the reference's five-segment divider. */
function DashDivider({ scale }: { scale: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 50 * scale,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 36 * scale,
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{ width: 77 * scale, height: Math.max(2, 3 * scale), borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.85)' }}
        />
      ))}
    </View>
  );
}

function AccountGlyph({ scale }: { scale: number }) {
  const size = 51 * scale;
  return (
    <View
      style={{
        position: 'absolute',
        top: 24 * scale,
        right: 24 * scale,
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={11} stroke="rgba(255,255,255,0.85)" strokeWidth={1.4} fill="none" />
        <Circle cx={12} cy={9.5} r={3.4} fill="rgba(255,255,255,0.85)" />
        <Path d="M4.8 19.2C6.2 16.6 8.9 15 12 15c3.1 0 5.8 1.6 7.2 4.2" stroke="rgba(255,255,255,0.85)" strokeWidth={1.4} strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  );
}

/** Red circular close button, floating at the card's bottom-right corner —
    matches the reference's `#F93333` FAB at its 109px/1440px design ratio. */
function GoBackFab({ onPress, scale }: { onPress: () => void; scale: number }) {
  const { value, handlers } = useHover();
  const size = 109 * scale;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      {...handlers}
      style={{ position: 'absolute', right: 63 * scale, bottom: 47 * scale }}
    >
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#F93333',
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: value.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }],
        }}
      >
        <Text
          style={[
            { fontFamily: font.bodySemi, color: color.white, textAlign: 'center' },
            metrics(Math.max(9, 15 * scale), 1.2, 0.01),
          ]}
        >
          GO{'\n'}Back
        </Text>
      </Animated.View>
    </Pressable>
  );
}
