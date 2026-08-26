import React from 'react';
import { Image, Text, View } from 'react-native';
import { products } from '@/assets';
import { AutoGrid, Container, Section } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/Button';
import { Eyebrow, Initials } from '@/components/UI';
import { H2, Lede, metrics } from '@/components/Type';
import { color, font, layout, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { useScroll } from '@/scroll/ScrollProvider';

const POINTS = [
  {
    title: 'A catalogue, not a photo album',
    body: 'Products, prices, variants and categories that stay correct everywhere you post.',
  },
  {
    title: 'Built for a phone, in one thumb',
    body: 'Your customer is already on their phone in a chat. Checkout takes three taps.',
  },
  {
    title: 'Card, bank transfer or COD',
    body: 'Payment options you control, with your delivery areas and fees built in.',
  },
];

export function Storefront() {
  const { f, width } = useViewport();
  const { scrollToSection } = useScroll();

  return (
    <Section id="storefront" tone="ink" style={{ overflow: 'hidden' }}>
      <Container>
        <AutoGrid minItemWidth={320} gap={f(40, 6, 90)} align="center">
          <Reveal index={0}>
            <Eyebrow label="Included free" tone="ink" />
            <H2 style={{ color: color.white, marginBottom: 20 }}>Your business deserves a storefront.</H2>
            <Lede style={{ color: color.white62, maxWidth: 540, marginBottom: 34 }}>
              Not a website project. Not a six-week build. A single link that shows your real catalogue, takes a
              proper order, and looks like a business that has been doing this for years.
            </Lede>

            <View style={{ borderTopWidth: 1, borderTopColor: color.white12, marginBottom: 34 }}>
              {POINTS.map((point, i) => (
                <View
                  key={point.title}
                  style={{
                    flexDirection: 'row',
                    gap: 16,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: color.lineInk,
                  }}
                >
                  <Text style={[{ fontFamily: font.mono, color: color.white40, paddingTop: 2 }, metrics(11, 1.4)]}>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[{ fontFamily: font.bodySemi, color: color.white, marginBottom: 4 }, metrics(15, 1.35)]}>
                      {point.title}
                    </Text>
                    <Text style={[{ fontFamily: font.body, color: color.white55 }, metrics(14, 1.5)]}>
                      {point.body}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <Button
              label="See a live storefront"
              variant="ghostInk"
              size="sm"
              arrow
              onPress={() => scrollToSection('categories')}
            />
          </Reveal>

          <Reveal index={1} style={{ alignItems: 'center' }}>
            <View style={{ width: '100%', alignItems: 'center' }}>
              {/* Tilted browser frame behind the phone */}
              <View
                style={{
                  position: 'absolute',
                  top: '8%',
                  left: 0,
                  right: '6%',
                  height: '76%',
                  backgroundColor: color.inkRaised,
                  borderWidth: 1,
                  borderColor: color.lineInk,
                  borderRadius: 14,
                  padding: 12,
                  transform: [{ rotate: '-1.5deg' }],
                }}
              >
                <View style={{ flexDirection: 'row', gap: 5, marginBottom: 12 }}>
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: color.white16 }} />
                  ))}
                </View>
                <View style={{ backgroundColor: color.white05, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 10, marginBottom: 14 }}>
                  <Text style={[{ fontFamily: font.mono, color: color.white40 }, metrics(10.5, 1.4)]}>
                    vendly.lk/kandyan-threads
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={{ flex: 1, height: 54, backgroundColor: color.white05, borderRadius: 8 }} />
                  ))}
                </View>
              </View>

              <Phone width={Math.min(320, width * 0.82)} />
            </View>
          </Reveal>
        </AutoGrid>
      </Container>
    </Section>
  );
}

function Phone({ width }: { width: number }) {
  return (
    <View
      style={{
        width,
        backgroundColor: color.phoneShell,
        borderWidth: 1,
        borderColor: color.white14,
        borderRadius: radius.phone,
        padding: 10,
        ...shadow.phone,
      }}
    >
      <View style={{ backgroundColor: color.paper2, borderRadius: 32, overflow: 'hidden' }}>
        <View style={{ height: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: color.paper3 }}>
          <View style={{ width: 58, height: 5, borderRadius: 4, backgroundColor: 'rgba(11,13,18,0.14)' }} />
        </View>

        <View style={{ padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(11,13,18,0.07)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
            <Initials text="KT" size={38} round={11} bg={color.ink} fg={color.white} fontSize={15} display />
            <View style={{ flex: 1 }}>
              <Text style={[{ fontFamily: font.displayBold, color: color.ink }, metrics(15.5, 1.25, -0.02)]}>
                Kandyan Threads
              </Text>
              <Text style={[{ fontFamily: font.body, color: color.textMuted, marginTop: 2 }, metrics(11.5, 1.35)]}>
                Fashion · Colombo · Island-wide delivery
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 6, marginTop: 14, overflow: 'hidden' }}>
            {['All', 'Hoodies', 'Tees', 'Bags'].map((cat, i) => (
              <View
                key={cat}
                style={{
                  backgroundColor: i === 0 ? color.ink : color.wash,
                  paddingVertical: 6,
                  paddingHorizontal: 11,
                  borderRadius: radius.pill,
                }}
              >
                <Text
                  style={[
                    { fontFamily: i === 0 ? font.bodySemi : font.body, color: i === 0 ? color.white : color.textMuted },
                    metrics(11.5, 1.3),
                  ]}
                >
                  {cat}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, padding: 14 }}>
          <PhoneProduct img={products.hoodie} name="Heavyweight Hoodie" price="Rs. 6,900" stock="In stock" />
          <PhoneProduct img={products.giftBag} name="Canvas Tote" price="Rs. 1,850" stock="4 left" low />
        </View>

        <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
          <View
            style={{
              backgroundColor: color.ink,
              borderRadius: radius.control,
              paddingVertical: 13,
              paddingHorizontal: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={[{ fontFamily: font.mono, color: color.white50 }, metrics(10.5, 1.3)]}>1 ITEM</Text>
              <Text style={[{ fontFamily: font.bodySemi, color: color.white, marginTop: 2 }, metrics(13.5, 1.3)]}>
                Rs. 6,900
              </Text>
            </View>
            <View style={{ backgroundColor: color.paper2, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 9 }}>
              <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(12.5, 1.3)]}>Checkout</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function PhoneProduct({
  img,
  name,
  price,
  stock,
  low = false,
}: {
  img: any;
  name: string;
  price: string;
  stock: string;
  low?: boolean;
}) {
  return (
    <View style={{ flex: 1, borderWidth: 1, borderColor: color.line, borderRadius: radius.control, overflow: 'hidden' }}>
      <View style={{ height: 96, backgroundColor: color.wash, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={img} resizeMode="contain" style={{ width: '84%', height: '84%' }} />
      </View>
      <View style={{ paddingHorizontal: 10, paddingTop: 9, paddingBottom: 11 }}>
        <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(12.5, 1.3)]}>{name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={[{ fontFamily: font.mono, color: color.ink }, metrics(12, 1.3)]}>{price}</Text>
          <Text
            style={[{ fontFamily: font.bodySemi, color: low ? color.caution : color.live }, metrics(10, 1.3)]}
          >
            {stock}
          </Text>
        </View>
      </View>
    </View>
  );
}
