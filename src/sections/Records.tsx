import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { products } from '@/assets';
import { AutoGrid, Container, RuledTop, Section, useMeasuredWidth } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Badge, Chip, Initials, Meter } from '@/components/UI';
import { H2Sub, metrics } from '@/components/Type';
import { productRows, stockLevels } from '@/data';
import { color, font, radius } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

type Tab = 'customers' | 'products' | 'inventory';

export function Records() {
  const { f, isMobile } = useViewport();
  const [tab, setTab] = useState<Tab>('customers');

  return (
    <Section id="customers" flushTop>
      <Container>
        <RuledTop>
          <Reveal index={0} style={{ marginBottom: f(28, 3.5, 40) }}>
            <View
              style={{
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'flex-end',
                justifyContent: 'space-between',
                gap: f(24, 4, 56),
              }}
            >
              <H2Sub style={{ maxWidth: 560, flexShrink: 1 }}>
                Know the customer behind the order — and what's left on the shelf.
              </H2Sub>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 6,
                  backgroundColor: color.paper2,
                  borderWidth: 1,
                  borderColor: 'rgba(11,13,18,0.09)',
                  padding: 5,
                  borderRadius: radius.control,
                }}
                accessibilityRole="tablist"
              >
                {(['customers', 'products', 'inventory'] as Tab[]).map((key) => (
                  <Pressable
                    key={key}
                    onPress={() => setTab(key)}
                    accessibilityRole="tab"
                    aria-selected={tab === key}
                    accessibilityState={{ selected: tab === key }}
                  >
                    <View
                      style={{
                        paddingVertical: 9,
                        paddingHorizontal: 15,
                        borderRadius: radius.chip,
                        backgroundColor: tab === key ? color.ink : 'transparent',
                      }}
                    >
                      <Text
                        style={[
                          { fontFamily: font.bodySemi, color: tab === key ? color.white : color.textMuted },
                          metrics(13.5, 1.3),
                        ]}
                      >
                        {key[0].toUpperCase() + key.slice(1)}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </Reveal>

          {tab === 'customers' ? <CustomersPanel /> : null}
          {tab === 'products' ? <ProductsPanel /> : null}
          {tab === 'inventory' ? <InventoryPanel /> : null}
        </RuledTop>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------------- customers */

function CustomersPanel() {
  const { f } = useViewport();
  const activity = [
    { title: 'Order #2417 delivered', meta: 'Studio Headphones · Card payment · Today' },
    { title: 'Asked about delivery to Kandy', meta: 'Answered by AI assistant · 3 days ago' },
    { title: 'Order #2402 delivered', meta: 'Facial Oil × 2 · COD collected · Last month' },
    { title: 'First order', meta: 'Found you through a Facebook post · March' },
  ];

  return (
    <AutoGrid minItemWidth={300} gap={18}>
      <RecordCard>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(11,13,18,0.07)',
          }}
        >
          <Initials text="SF" size={52} round={15} bg={color.accentWash} fg={color.accentHover} fontSize={18} display />
          <View style={{ flex: 1 }}>
            <Text style={[{ fontFamily: font.displayBold, color: color.ink }, metrics(19, 1.25, -0.025)]}>
              Sithara F.
            </Text>
            <Text style={[{ fontFamily: font.body, color: color.textMuted, marginTop: 3 }, metrics(12.5, 1.35)]}>
              Kandy · Customer since March
            </Text>
          </View>
          <Badge label="Reliable COD" tone="success" />
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(11,13,18,0.07)',
          }}
        >
          {[
            { label: 'Orders', value: '7' },
            { label: 'Total spent', value: 'Rs. 64,300' },
            { label: 'Avg. order', value: 'Rs. 9,180' },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1 }}>
              <Text
                style={[
                  { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 6 },
                  metrics(9.5, 1.4, 0.12),
                ]}
              >
                {stat.label}
              </Text>
              <Text style={[{ fontFamily: font.displayBold, color: color.ink }, metrics(22, 1.2)]}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={{ paddingTop: 18 }}>
          <Text
            style={[
              { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 12 },
              metrics(9.5, 1.4, 0.12),
            ]}
          >
            Bought before
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[products.headphones, products.facialOil, products.hoodie].map((img, i) => (
              <Image
                key={i}
                source={img}
                resizeMode="contain"
                style={{ width: 46, height: 46, backgroundColor: color.paper, borderRadius: 10, padding: 4 }}
              />
            ))}
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 10,
                backgroundColor: color.paper,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={[{ fontFamily: font.bodySemi, color: color.textMuted }, metrics(12, 1.3)]}>+4</Text>
            </View>
          </View>
        </View>
      </RecordCard>

      <RecordCard>
        <Text
          style={[
            { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 16 },
            metrics(9.5, 1.4, 0.12),
          ]}
        >
          Recent activity
        </Text>

        {activity.map((item, i) => (
          <View key={item.title} style={{ flexDirection: 'row', gap: 12, paddingBottom: i === activity.length - 1 ? 0 : 16 }}>
            <View
              style={{
                width: 9,
                height: 9,
                borderRadius: 4.5,
                marginTop: 4,
                backgroundColor: i === 0 ? color.accent : 'rgba(11,13,18,0.18)',
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(13.5, 1.3)]}>{item.title}</Text>
              <Text style={[{ fontFamily: font.body, color: color.textMuted, marginTop: 2 }, metrics(12, 1.35)]}>
                {item.meta}
              </Text>
            </View>
          </View>
        ))}

        <View
          style={{
            marginTop: 20,
            paddingTop: 18,
            borderTopWidth: 1,
            borderTopColor: 'rgba(11,13,18,0.07)',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 7,
          }}
        >
          {['Prefers COD', 'Size XL', 'Evening delivery', 'Repeat buyer'].map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </View>
      </RecordCard>
    </AutoGrid>
  );
}

/* --------------------------------------------------------------- products */

const P_COL = { price: 110, availability: 130 };
const P_GAP = 14;
const P_FIXED = P_COL.price + P_COL.availability + P_GAP * 3;
const P_FLEX_MIN = 200 + 150;

function ProductsPanel() {
  const [width, onLayout] = useMeasuredWidth();
  const contentWidth = Math.max(width, P_FIXED + P_FLEX_MIN);
  const flexAvail = contentWidth - P_FIXED;
  const nameW = (flexAvail * 1.6) / 2.8;
  const variantW = (flexAvail * 1.2) / 2.8;

  return (
    <View
      onLayout={onLayout}
      style={{
        backgroundColor: color.paper2,
        borderWidth: 1,
        borderColor: color.line,
        borderRadius: radius.card,
        overflow: 'hidden',
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{ width: contentWidth }}>
          <View
            style={{
              flexDirection: 'row',
              gap: P_GAP,
              paddingVertical: 13,
              paddingHorizontal: 20,
              backgroundColor: color.paper3,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(11,13,18,0.07)',
            }}
          >
            {[
              { label: 'Product', w: nameW },
              { label: 'Variants', w: variantW },
              { label: 'Price', w: P_COL.price },
              { label: 'Availability', w: P_COL.availability },
            ].map((head) => (
              <Text
                key={head.label}
                style={[
                  { width: head.w, fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase' },
                  metrics(9.5, 1.4, 0.11),
                ]}
              >
                {head.label}
              </Text>
            ))}
          </View>

          {productRows.map((row, i) => (
            <View
              key={row.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: P_GAP,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderBottomWidth: i === productRows.length - 1 ? 0 : 1,
                borderBottomColor: color.lineSoft,
              }}
            >
              <View style={{ width: nameW, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Image
                  source={row.img}
                  resizeMode="contain"
                  style={{ width: 40, height: 40, backgroundColor: color.paper, borderRadius: 9 }}
                />
                <Text style={[{ fontFamily: font.bodySemi, color: color.ink, flex: 1 }, metrics(14, 1.3)]}>
                  {row.name}
                </Text>
              </View>
              <Text style={[{ width: variantW, fontFamily: font.body, color: color.textMuted }, metrics(12.5, 1.3)]}>
                {row.variants}
              </Text>
              <Text style={[{ width: P_COL.price, fontFamily: font.mono, color: color.ink }, metrics(13, 1.3)]}>
                {row.price}
              </Text>
              <View style={{ width: P_COL.availability }}>
                <Badge label={row.status} tone={row.tone} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------- inventory */

function InventoryPanel() {
  return (
    <AutoGrid minItemWidth={280} gap={18}>
      <RecordCard>
        <Text
          style={[
            { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 18 },
            metrics(9.5, 1.4, 0.12),
          ]}
        >
          Stock by variant
        </Text>
        <View style={{ gap: 16 }}>
          {stockLevels.map((item) => (
            <View key={item.name}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }}>
                <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(13.5, 1.3)]}>{item.name}</Text>
                <Text
                  style={[
                    {
                      fontFamily: font.mono,
                      color:
                        item.level === 'low' ? color.caution : item.level === 'out' ? color.danger : color.textMuted,
                    },
                    metrics(13.5, 1.3),
                  ]}
                >
                  {item.count}
                </Text>
              </View>
              <Meter
                fraction={item.fraction}
                fill={item.level === 'low' ? color.gold : item.level === 'out' ? color.danger : color.accent}
              />
            </View>
          ))}
        </View>
      </RecordCard>

      <RecordCard>
        <Text
          style={[
            { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 18 },
            metrics(9.5, 1.4, 0.12),
          ]}
        >
          Needs attention
        </Text>

        <AttentionRow
          img={products.facialOil}
          title="Facial Oil 30ml is out"
          meta="Hidden from your storefront automatically"
          warn
        />
        <AttentionRow img={products.hoodie} title="XL running low" meta="Your most-ordered size this month" />

        <Text style={[{ fontFamily: font.body, color: color.textMuted, marginTop: 18 }, metrics(13.5, 1.55)]}>
          Stock moves when orders move. Nothing to reconcile at the end of the day.
        </Text>
      </RecordCard>
    </AutoGrid>
  );
}

function AttentionRow({
  img,
  title,
  meta,
  warn = false,
}: {
  img: any;
  title: string;
  meta: string;
  warn?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: warn ? color.cautionWash : color.paper,
        borderRadius: radius.control,
        padding: 14,
        marginBottom: 10,
      }}
    >
      <Image source={img} resizeMode="contain" style={{ width: 34, height: 34 }} />
      <View style={{ flex: 1 }}>
        <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(13.5, 1.3)]}>{title}</Text>
        <Text
          style={[
            { fontFamily: font.body, color: warn ? color.caution : color.textMuted, marginTop: 2 },
            metrics(12, 1.35),
          ]}
        >
          {meta}
        </Text>
      </View>
    </View>
  );
}

function RecordCard({ children }: { children: React.ReactNode }) {
  const { f } = useViewport();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.paper2,
        borderWidth: 1,
        borderColor: color.line,
        borderRadius: radius.card,
        padding: f(20, 2.2, 28),
      }}
    >
      {children}
    </View>
  );
}
