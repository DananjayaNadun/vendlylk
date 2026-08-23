import React, { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { brand } from '@/assets';
import { Container, Section, SplitHead, useMeasuredWidth } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Badge, Eyebrow, Initials } from '@/components/UI';
import { H2, Note, metrics } from '@/components/Type';
import { orders } from '@/data';
import { color, font, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

/** Column widths from the design's grid template. */
const COL = { order: 92, total: 110, payment: 118, status: 132 };
const GAP = 14;
const FIXED = COL.order + COL.total + COL.payment + COL.status + GAP * 5;
const FLEX_MIN = 180 + 200;

export function Orders() {
  const { f, sectionY } = useViewport();
  const [width, onLayout] = useMeasuredWidth();

  const contentWidth = Math.max(width, FIXED + FLEX_MIN);
  const flexAvail = contentWidth - FIXED;
  const customerW = (flexAvail * 1.3) / 2.7;
  const productsW = (flexAvail * 1.4) / 2.7;

  return (
    <Section id="orders" paddingBottom={f(56, 7, 90)}>
      <Container>
        <Reveal index={0} style={{ marginBottom: f(36, 4.5, 56) }}>
          <SplitHead
            minItemWidth={300}
            left={
              <View>
                <Eyebrow label="Order management" />
                <H2>Your orders are finally organised.</H2>
              </View>
            }
            right={
              <Note style={{ maxWidth: 440 }}>
                Every order — from the storefront or typed in by you — in one queue, with the customer, the
                products, the money, the courier and what happens next.
              </Note>
            }
          />
        </Reveal>

        <Reveal index={1}>
          <View
            onLayout={onLayout}
            style={{
              backgroundColor: color.paper2,
              borderWidth: 1,
              borderColor: color.line,
              borderRadius: radius.card,
              overflow: 'hidden',
              ...shadow.panel,
            }}
          >
            {/* Toolbar */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                paddingVertical: 14,
                paddingHorizontal: 18,
                backgroundColor: color.paper3,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(11,13,18,0.07)',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                <Image source={brand.ink} style={{ width: 16, height: 16 }} resizeMode="contain" />
                <Text style={[{ fontFamily: font.displayBold, color: color.ink }, metrics(14, 1.3, -0.02)]}>
                  Orders
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 4, marginLeft: 8 }}>
                {['All', 'New', 'Packing', 'With courier', 'Delivered'].map((filter, i) => (
                  <View
                    key={filter}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 11,
                      borderRadius: 7,
                      backgroundColor: i === 0 ? color.paper2 : 'transparent',
                      borderWidth: i === 0 ? 1 : 0,
                      borderColor: 'rgba(11,13,18,0.12)',
                    }}
                  >
                    <Text
                      style={[
                        { fontFamily: i === 0 ? font.bodySemi : font.body, color: i === 0 ? color.ink : color.textMuted },
                        metrics(12, 1.3),
                      ]}
                    >
                      {filter}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={{ flex: 1 }} />

              <View style={{ backgroundColor: color.accent, paddingVertical: 7, paddingHorizontal: 13, borderRadius: radius.chip }}>
                <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(12, 1.3)]}>+ New order</Text>
              </View>
            </View>

            {/* Table — scrolls horizontally rather than crushing the columns */}
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <View style={{ width: contentWidth }}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: GAP,
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    backgroundColor: color.paper3,
                    borderBottomWidth: 1,
                    borderBottomColor: color.line,
                  }}
                >
                  {[
                    { label: 'Order', w: COL.order },
                    { label: 'Customer', w: customerW },
                    { label: 'Products', w: productsW },
                    { label: 'Total', w: COL.total },
                    { label: 'Payment', w: COL.payment },
                    { label: 'Status', w: COL.status },
                  ].map((head) => (
                    <Text
                      key={head.label}
                      style={[
                        {
                          width: head.w,
                          fontFamily: font.mono,
                          color: color.textFaint,
                          textTransform: 'uppercase',
                        },
                        metrics(9.5, 1.4, 0.11),
                      ]}
                    >
                      {head.label}
                    </Text>
                  ))}
                </View>

                {orders.map((row, i) => (
                  <View
                    key={row.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: GAP,
                      paddingVertical: 15,
                      paddingHorizontal: 18,
                      backgroundColor: row.selected ? color.rowSelected : 'transparent',
                      borderBottomWidth: i === orders.length - 1 ? 0 : 1,
                      borderBottomColor: color.lineSoft,
                    }}
                  >
                    <View style={{ width: COL.order }}>
                      <Text style={[{ fontFamily: font.monoMedium, color: color.ink }, metrics(12.5, 1.3)]}>
                        {row.id}
                      </Text>
                      <Text style={[{ fontFamily: font.body, color: color.textFaint, marginTop: 2 }, metrics(11, 1.3)]}>
                        {row.when}
                      </Text>
                    </View>

                    <View style={{ width: customerW, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Initials
                        text={row.initials}
                        size={30}
                        round={9}
                        bg={row.accent ? color.accentWash : color.wash}
                        fg={row.accent ? color.accentHover : color.textSoft}
                        fontSize={11.5}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(13.5, 1.3)]}>
                          {row.name}
                        </Text>
                        <Text style={[{ fontFamily: font.body, color: color.textMuted, marginTop: 1 }, metrics(11.5, 1.3)]}>
                          {row.where}
                        </Text>
                      </View>
                    </View>

                    <View style={{ width: productsW, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Image
                        source={row.img}
                        resizeMode="contain"
                        style={{ width: 26, height: 26, backgroundColor: color.wash, borderRadius: 6 }}
                      />
                      <Text style={[{ fontFamily: font.body, color: color.ink }, metrics(13, 1.3)]}>{row.item}</Text>
                    </View>

                    <Text style={[{ width: COL.total, fontFamily: font.mono, color: color.ink }, metrics(13, 1.3)]}>
                      {row.total}
                    </Text>

                    <Text style={[{ width: COL.payment, fontFamily: font.body, color: color.ink }, metrics(12, 1.3)]}>
                      {row.payment}
                    </Text>

                    <View style={{ width: COL.status }}>
                      <Badge label={row.status} tone={row.tone} />
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Footer summary */}
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderTopWidth: 1,
                borderTopColor: 'rgba(11,13,18,0.07)',
                backgroundColor: color.paper3,
              }}
            >
              {[
                { label: 'Selected order', value: '#2418 · Nimal P.' },
                { label: 'Courier', value: 'Island Express · Ready' },
                { label: 'Documents', value: 'Invoice · Receipt · Label' },
              ].map((cell) => (
                <View
                  key={cell.label}
                  style={{
                    flexGrow: 1,
                    flexBasis: 200,
                    paddingVertical: 16,
                    paddingHorizontal: 18,
                    borderRightWidth: 1,
                    borderRightColor: 'rgba(11,13,18,0.06)',
                  }}
                >
                  <Text
                    style={[
                      { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 6 },
                      metrics(9.5, 1.4, 0.12),
                    ]}
                  >
                    {cell.label}
                  </Text>
                  <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(13.5, 1.3)]}>
                    {cell.value}
                  </Text>
                </View>
              ))}

              <View
                style={{
                  flexGrow: 1,
                  flexBasis: 200,
                  paddingVertical: 16,
                  paddingHorizontal: 18,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <View style={{ backgroundColor: color.ink, paddingVertical: 9, paddingHorizontal: 14, borderRadius: radius.chip }}>
                  <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(12.5, 1.3)]}>
                    Confirm order
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: 'rgba(11,13,18,0.14)',
                    paddingVertical: 9,
                    paddingHorizontal: 14,
                    borderRadius: radius.chip,
                  }}
                >
                  <Text style={[{ fontFamily: font.bodyMedium, color: color.ink }, metrics(12.5, 1.3)]}>Message</Text>
                </View>
              </View>
            </View>
          </View>
        </Reveal>
      </Container>
    </Section>
  );
}
