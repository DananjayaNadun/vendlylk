import React, { useCallback, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { brand, products } from '@/assets';
import { metrics } from '@/components/Type';
import { color, font, layout, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { SectionId, useScroll, useScrollListener } from '@/scroll/ScrollProvider';

type MenuKey = 'product' | 'solutions';

const PRODUCT_LINKS: { title: string; desc: string; to: SectionId; on?: boolean }[] = [
  { title: 'COD Reliability Score', desc: 'Stop repeat courier losses without turning away real buyers', to: 'cod', on: true },
  { title: 'Storefront', desc: 'A real order page for a business that never had a website', to: 'storefront', on: true },
  { title: 'Orders', desc: 'Every order in one queue, from chat or storefront', to: 'orders' },
  { title: 'Customers & Inventory', desc: 'Who bought what, and what is left on the shelf', to: 'customers' },
  { title: 'AI Assistant', desc: 'Answers the questions you answer forty times a day', to: 'ai' },
  { title: 'The full system', desc: 'Payments, courier, invoices, receipts, reports, analytics', to: 'os' },
];

const SOLUTION_LINKS = [
  { label: 'Food & Beverages', img: products.burger },
  { label: 'Fashion & Apparel', img: products.hoodie },
  { label: 'Beauty & Health', img: products.facialOil },
  { label: 'Electronics', img: products.headphones },
  { label: 'Home & Lifestyle', img: products.tableLamp },
  { label: 'General Retail', img: products.giftBag },
];

export function SiteNav() {
  const { gutter, isMobile } = useViewport();
  const { scrollToSection, scrollToTop } = useScroll();

  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Transparent over the hero, ink glass past 20px — a 340ms cross-fade rather
     than a scroll-linked interpolation, matching the prototype. */
  const backdrop = useRef(new Animated.Value(0)).current;
  const solid = useRef(false);

  useScrollListener(
    useCallback(
      (y) => {
        const next = y > 20;
        if (next === solid.current) return;
        solid.current = next;
        Animated.timing(backdrop, {
          toValue: next ? 1 : 0,
          duration: 340,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          useNativeDriver: true,
        }).start();
      },
      [backdrop],
    ),
  );

  const openMenu = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (isMobile) return;
    setMenu(key);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 120);
  };

  const go = (id: SectionId) => {
    setMenu(null);
    setSheetOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
        }}
        pointerEvents="box-none"
      >
        <View style={{ position: 'relative' }} pointerEvents="box-none">
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(11,13,18,0.84)',
              borderBottomWidth: 1,
              borderBottomColor: color.white09,
              opacity: backdrop,
            }}
          />

          <View
            style={{
              width: '100%',
              maxWidth: layout.container,
              alignSelf: 'center',
              paddingHorizontal: gutter,
              height: layout.navHeight,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <Pressable onPress={scrollToTop} accessibilityRole="link" accessibilityLabel="Vendly OrderFlow — home">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image source={brand.light} style={{ width: 26, height: 26 }} resizeMode="contain" />
                <Text style={[{ fontFamily: font.displayBold, color: color.white }, metrics(19, 1.2, -0.03)]}>
                  Vendly
                </Text>
                <View style={{ borderLeftWidth: 1, borderLeftColor: color.white20, paddingLeft: 10, marginLeft: 2 }}>
                  <Text
                    style={[
                      { fontFamily: font.mono, color: color.white50, textTransform: 'uppercase' },
                      metrics(10, 1.4, 0.14),
                    ]}
                  >
                    OrderFlow
                  </Text>
                </View>
              </View>
            </Pressable>

            {!isMobile ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <MenuTrigger
                    label="Product"
                    open={menu === 'product'}
                    onOpen={() => openMenu('product')}
                    onClose={scheduleClose}
                  />
                  <MenuTrigger
                    label="Solutions"
                    open={menu === 'solutions'}
                    onOpen={() => openMenu('solutions')}
                    onClose={scheduleClose}
                  />
                  <NavLink label="How It Works" onPress={() => go('how-it-works')} />
                  <NavLink label="Pricing" onPress={() => go('pricing')} />
                  <NavLink label="Resources" onPress={() => go('resources')} />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <NavLink label="Sign In" onPress={() => {}} plain />
                  <Pressable onPress={() => go('get-started')} accessibilityRole="button">
                    <View
                      style={{
                        backgroundColor: color.accent,
                        paddingVertical: 11,
                        paddingHorizontal: 20,
                        borderRadius: 10,
                        ...shadow.navCta,
                      }}
                    >
                      <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(14.5, 1.2)]}>
                        Get Started Free
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Pressable onPress={() => go('get-started')} accessibilityRole="button">
                  <View style={{ backgroundColor: color.accent, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 }}>
                    <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(14, 1.2)]}>
                      Get Started
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => setSheetOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Open menu"
                  accessibilityState={{ expanded: sheetOpen }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      backgroundColor: color.white08,
                      borderWidth: 1,
                      borderColor: color.white14,
                      borderRadius: 11,
                    }}
                  >
                    <View style={{ width: 16, height: 1.5, backgroundColor: color.white, borderRadius: 2 }} />
                    <View style={{ width: 16, height: 1.5, backgroundColor: color.white, borderRadius: 2 }} />
                  </View>
                </Pressable>
              </View>
            )}
          </View>

          {menu === 'product' && !isMobile ? (
            <MegaPanel width={720} padding={20} gap={4} onOpen={() => openMenu('product')} onClose={scheduleClose}>
              {PRODUCT_LINKS.map((link) => (
                <MegaLink key={link.title} {...link} onPress={() => go(link.to)} />
              ))}
            </MegaPanel>
          ) : null}

          {menu === 'solutions' && !isMobile ? (
            <MegaPanel width={560} padding={14} gap={2} onOpen={() => openMenu('solutions')} onClose={scheduleClose}>
              {SOLUTION_LINKS.map((link) => (
                <MegaCat key={link.label} {...link} onPress={() => go('categories')} />
              ))}
            </MegaPanel>
          ) : null}
        </View>
      </View>

      {sheetOpen && isMobile ? <MobileSheet onClose={() => setSheetOpen(false)} onGo={go} /> : null}
    </>
  );
}

/* ------------------------------------------------------------------ links */

function NavLink({
  label,
  onPress,
  plain = false,
}: {
  label: string;
  onPress: () => void;
  plain?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
    >
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 8,
          backgroundColor: !plain && hover ? color.white07 : 'transparent',
        }}
      >
        <Text
          style={[
            { fontFamily: font.bodyMedium, color: hover ? color.white : color.white74 },
            metrics(14.5, 1.2),
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function MenuTrigger({
  label,
  open,
  onOpen,
  onClose,
}: {
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <View onPointerEnter={onOpen} onPointerLeave={onClose}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onHoverIn={onOpen}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 8,
            backgroundColor: open ? color.white07 : 'transparent',
          }}
        >
          <Text
            style={[
              { fontFamily: font.bodyMedium, color: open ? color.white : color.white74 },
              metrics(14.5, 1.2),
            ]}
          >
            {label}
          </Text>
          <Text style={{ color: open ? color.white : color.white74, fontSize: 9, opacity: 0.7 }}>▾</Text>
        </View>
      </Pressable>
    </View>
  );
}

/* ------------------------------------------------------------- mega panel */

function MegaPanel({
  width,
  padding,
  gap,
  onOpen,
  onClose,
  children,
}: {
  width: number;
  padding: number;
  gap: number;
  onOpen: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const items = React.Children.toArray(children);
  return (
    <View
      style={{
        position: 'absolute',
        top: layout.navHeight,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 24,
      }}
      onPointerEnter={onOpen}
      onPointerLeave={onClose}
    >
      <View
        style={{
          width: '100%',
          maxWidth: width,
          backgroundColor: color.inkRaised,
          borderWidth: 1,
          borderColor: color.lineInk,
          borderRadius: 16,
          padding,
          flexDirection: 'row',
          flexWrap: 'wrap',
          rowGap: gap,
          columnGap: gap,
          ...shadow.mega,
        }}
      >
        {items.map((child, i) => (
          <View key={i} style={{ width: `${50}%`, paddingRight: i % 2 === 0 ? gap / 2 : 0, paddingLeft: i % 2 === 1 ? gap / 2 : 0 }}>
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}

function MegaLink({
  title,
  desc,
  on,
  onPress,
}: {
  title: string;
  desc: string;
  on?: boolean;
  onPress: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable onPress={onPress} accessibilityRole="link" onHoverIn={() => setHover(true)} onHoverOut={() => setHover(false)}>
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          padding: 14,
          borderRadius: 11,
          backgroundColor: hover ? color.white05 : 'transparent',
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginTop: 6,
            backgroundColor: on ? color.accent : 'rgba(255,255,255,0.3)',
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={[{ fontFamily: font.bodySemi, color: color.white, marginBottom: 3 }, metrics(14.5, 1.3)]}>
            {title}
          </Text>
          <Text style={[{ fontFamily: font.body, color: color.white50 }, metrics(13, 1.45)]}>{desc}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function MegaCat({ label, img, onPress }: { label: string; img: any; onPress: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable onPress={onPress} accessibilityRole="link" onHoverIn={() => setHover(true)} onHoverOut={() => setHover(false)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 11,
          paddingVertical: 11,
          paddingHorizontal: 12,
          borderRadius: 10,
          backgroundColor: hover ? color.white05 : 'transparent',
        }}
      >
        <Image source={img} style={{ width: 26, height: 26 }} resizeMode="contain" />
        <Text
          style={[{ fontFamily: font.bodyMedium, color: hover ? color.white : color.white82 }, metrics(14.5, 1.3)]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------------------ mobile sheet */

function MobileSheet({ onClose, onGo }: { onClose: () => void; onGo: (id: SectionId) => void }) {
  const primary: { label: string; to: SectionId }[] = [
    { label: 'Orders', to: 'orders' },
    { label: 'Storefront', to: 'storefront' },
    { label: 'COD Reliability', to: 'cod' },
    { label: 'AI Assistant', to: 'ai' },
  ];
  const secondary: { label: string; to: SectionId | null }[] = [
    { label: 'How It Works', to: 'how-it-works' },
    { label: 'Pricing', to: 'pricing' },
    { label: 'Resources', to: 'resources' },
    { label: 'Sign In', to: null },
  ];

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 300,
        backgroundColor: color.ink,
      }}
      accessibilityViewIsModal
      accessibilityLabel="Menu"
    >
      <View
        style={{
          height: layout.navHeight,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: color.white08,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source={brand.light} style={{ width: 24, height: 24 }} resizeMode="contain" />
          <Text style={[{ fontFamily: font.displayBold, color: color.white }, metrics(18, 1.2, -0.03)]}>Vendly</Text>
        </View>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close menu">
          <View
            style={{
              width: 42,
              height: 42,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: color.white08,
              borderWidth: 1,
              borderColor: color.white14,
              borderRadius: 11,
            }}
          >
            <Text style={{ color: color.white, fontSize: 20, lineHeight: 22 }}>×</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 26 }}>
        <Text
          style={[
            { fontFamily: font.mono, color: color.white34, textTransform: 'uppercase', marginBottom: 14 },
            metrics(10, 1.4, 0.16),
          ]}
        >
          Product
        </Text>
        <View style={{ marginBottom: 34 }}>
          {primary.map((item) => (
            <Pressable key={item.label} onPress={() => onGo(item.to)} accessibilityRole="link">
              <View style={{ paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)' }}>
                <Text style={[{ fontFamily: font.displaySemi, color: color.white }, metrics(26, 1.2, -0.025)]}>
                  {item.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Text
          style={[
            { fontFamily: font.mono, color: color.white34, textTransform: 'uppercase', marginBottom: 14 },
            metrics(10, 1.4, 0.16),
          ]}
        >
          Company
        </Text>
        <View>
          {secondary.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => (item.to ? onGo(item.to) : onClose())}
              accessibilityRole="link"
            >
              <View
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: i === secondary.length - 1 ? 0 : 1,
                  borderBottomColor: 'rgba(255,255,255,0.07)',
                }}
              >
                <Text style={[{ fontFamily: font.bodyMedium, color: color.white72 }, metrics(16, 1.3)]}>
                  {item.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={{ padding: 20, paddingTop: 16, paddingBottom: 26, borderTopWidth: 1, borderTopColor: color.white08 }}>
        <Pressable onPress={() => onGo('get-started')} accessibilityRole="button">
          <View style={{ backgroundColor: color.accent, borderRadius: radius.control, padding: 16, alignItems: 'center' }}>
            <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(16, 1.2)]}>
              Get Started Free
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
