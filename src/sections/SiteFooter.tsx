import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { brand, icons } from '@/assets';
import { WhatsAppIcon, XIcon, YouTubeIcon } from '@/components/icons';
import { metrics } from '@/components/Type';
import { footerColumns } from '@/data';
import { ProvideWidth, useMeasuredWidth } from '@/components/Layout';
import { color, font, layout } from '@/theme/tokens';
import { autoFitColumns, trackWidth, useViewport } from '@/theme/responsive';
import { SectionId, useScroll } from '@/scroll/ScrollProvider';

/** Where each footer link jumps to, since there are no URL fragments here. */
const TARGETS: Record<string, SectionId> = {
  Orders: 'orders',
  Customers: 'customers',
  Inventory: 'customers',
  'AI Assistant': 'ai',
  'COD Reliability': 'cod',
  Storefront: 'storefront',
  'Food & Beverages': 'categories',
  'Fashion & Apparel': 'categories',
  'Beauty & Health': 'categories',
  Electronics: 'categories',
  'Home & Lifestyle': 'categories',
  'General Retail': 'categories',
};

export function SiteFooter() {
  const { f, gutter, isMobile, width: viewportWidth } = useViewport();
  const { registerSection, scrollToSection } = useScroll();
  const [width, onLayout] = useMeasuredWidth();

  /* grid-template-columns: minmax(240px,1.5fr) repeat(auto-fit, minmax(140px,1fr)) */
  const gap = 32;
  const brandMin = 240;
  const linkCols = width > 0 ? Math.max(1, autoFitColumns(width - brandMin - gap, 140, gap)) : 1;
  const linkTrack = width > 0 ? trackWidth(width - brandMin - gap, linkCols, gap) : 0;
  const stacked = isMobile || linkTrack < 120;

  return (
    <View
      ref={(node) => registerSection('resources', node)}
      style={{
        backgroundColor: color.ink,
        paddingTop: f(56, 8, 96),
        paddingHorizontal: gutter,
      }}
    >
      <ProvideWidth width={Math.min(layout.container, viewportWidth - gutter * 2)}>
      <View style={{ width: '100%', maxWidth: layout.container, alignSelf: 'center' }}>
        <View
          onLayout={onLayout}
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            columnGap: gap,
            rowGap: f(32, 4, 56),
            paddingBottom: f(48, 6, 72),
          }}
        >
          <View style={{ width: stacked ? '100%' : brandMin, maxWidth: 320 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <Image source={brand.light} resizeMode="contain" style={{ width: 28, height: 28 }} />
              <Text style={[{ fontFamily: font.displayBold, color: color.white }, metrics(21, 1.2, -0.03)]}>
                Vendly
              </Text>
            </View>

            <Text style={[{ fontFamily: font.body, color: color.white50, marginBottom: 22 }, metrics(14.5, 1.6)]}>
              Vendly.lk is the operating system for businesses that sell through Facebook and WhatsApp. Built in Sri
              Lanka, for Sri Lankan businesses.
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Social label="Facebook">
                <Image source={icons.facebook} style={{ width: 18, height: 18, borderRadius: 9 }} />
              </Social>
              <Social label="WhatsApp">
                <WhatsAppIcon size={18} round={110} />
              </Social>
              <Social label="Instagram">
                <Image source={icons.instagram} style={{ width: 18, height: 18, borderRadius: 5 }} />
              </Social>
              <Social label="YouTube">
                <YouTubeIcon size={18} />
              </Social>
              <Social label="X" light>
                <XIcon size={17} />
              </Social>
            </View>
          </View>

          {footerColumns.map((column) => (
            <View key={column.title} style={{ width: stacked ? '45%' : linkTrack, minWidth: 130 }}>
              <Text
                style={[
                  { fontFamily: font.mono, color: color.white36, textTransform: 'uppercase', marginBottom: 18 },
                  metrics(10, 1.4, 0.16),
                ]}
              >
                {column.title}
              </Text>
              <View style={{ gap: 11 }}>
                {column.links.map((link) => (
                  <FooterLink
                    key={link}
                    label={link}
                    onPress={() => {
                      const target = TARGETS[link];
                      if (target) scrollToSection(target);
                    }}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: color.white09,
            paddingTop: 24,
            paddingBottom: 32,
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            columnGap: 26,
            rowGap: 12,
          }}
        >
          <Text style={[{ fontFamily: font.body, color: color.white42 }, metrics(13, 1.4)]}>© 2026 Vendly</Text>

          {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Data Protection'].map((item) => (
            <FooterLink key={item} label={item} small />
          ))}

          <View style={{ flex: 1, minWidth: 0 }} />

          {['Sri Lanka · LKR', 'English'].map((item) => (
            <View
              key={item}
              style={{
                borderWidth: 1,
                borderColor: color.white12,
                borderRadius: 8,
                paddingVertical: 7,
                paddingHorizontal: 12,
              }}
            >
              <Text style={[{ fontFamily: font.mono, color: color.white55 }, metrics(11.5, 1.3)]}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
      </ProvideWidth>
    </View>
  );
}

function FooterLink({
  label,
  onPress,
  small = false,
}: {
  label: string;
  onPress?: () => void;
  small?: boolean;
}) {
  const [hover, setHover] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <Text
          style={[
            { fontFamily: font.body, color: hover ? color.white : small ? color.white55 : color.white72 },
            metrics(small ? 13 : 14.5, 1.4),
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function Social({
  label,
  light = false,
  children,
}: {
  label: string;
  light?: boolean;
  children: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: light
            ? hover
              ? 'rgba(255,255,255,0.82)'
              : color.white
            : hover
              ? 'rgba(255,255,255,0.13)'
              : color.white06,
          transform: [{ translateY: hover ? -2 : 0 }],
        }}
      >
        {children}
      </View>
    </Pressable>
  );
}
