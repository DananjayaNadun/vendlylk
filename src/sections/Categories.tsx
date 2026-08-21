import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { AutoGrid, Container, Inset, RuledTop, Section, SplitHead } from '@/components/Layout';
import { Reveal } from '@/components/Reveal';
import { Badge } from '@/components/UI';
import { H2, Note, metrics } from '@/components/Type';
import { categories } from '@/data';
import { color, font, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

export function Categories() {
  const { f } = useViewport();
  const [active, setActive] = useState(0);
  const category = categories[active];
  const detailPad = f(20, 2.4, 30);

  return (
    <Section id="categories" flushTop>
      <Container>
        <RuledTop>
          <Reveal index={0} style={{ marginBottom: f(32, 4, 48) }}>
            <SplitHead
              minItemWidth={300}
              left={<H2 style={{ maxWidth: 520 }}>Vendly adapts to your business.</H2>}
              right={
                <Note style={{ maxWidth: 420 }}>
                  A restaurant, a clothing label and an electronics reseller do not run the same way. Pick yours and
                  the system fits around it.
                </Note>
              }
            />
          </Reveal>

          <Reveal index={1}>
            {/* The picker takes one track and the detail panel two, which is how
                the CSS `grid-column: span 2` resolved at desktop widths. */}
            <AutoGrid minItemWidth={290} gap={18} spans={[1, 2]} align="flex-start">
              <View style={{ gap: 8 }}>
                {categories.map((item, i) => (
                  <CategoryButton
                    key={item.name}
                    label={item.name}
                    tag={item.tag}
                    img={item.img}
                    active={i === active}
                    onSelect={() => setActive(i)}
                  />
                ))}
              </View>

              <View
                style={{
                  backgroundColor: color.paper2,
                  borderWidth: 1,
                  borderColor: color.line,
                  borderRadius: radius.card,
                  padding: detailPad,
                  ...shadow.panelSoft,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                    marginBottom: 22,
                  }}
                >
                  <View>
                    <Text
                      style={[
                        { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 6 },
                        metrics(9.5, 1.4, 0.14),
                      ]}
                    >
                      Configured for
                    </Text>
                    <Text
                      style={[
                        { fontFamily: font.displayBold, color: color.ink },
                        metrics(f(19, 1.8, 24), 1.2, -0.028),
                      ]}
                    >
                      {category.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: color.accentWash,
                      paddingVertical: 6,
                      paddingHorizontal: 11,
                      borderRadius: 7,
                    }}
                  >
                    <Text style={[{ fontFamily: font.bodySemi, color: color.accentHover }, metrics(11.5, 1.3)]}>
                      Storefront · Orders · Inventory
                    </Text>
                  </View>
                </View>

                <Inset by={detailPad * 2 + 2}>
                <AutoGrid minItemWidth={220} gap={14} align="stretch">
                  <View style={{ borderWidth: 1, borderColor: color.line, borderRadius: 14, overflow: 'hidden' }}>
                    <View style={{ height: 150, backgroundColor: color.paper, alignItems: 'center', justifyContent: 'center' }}>
                      <Image source={category.img} resizeMode="contain" style={{ width: '78%', height: '78%' }} />
                    </View>
                    <View style={{ padding: 14 }}>
                      <Text style={[{ fontFamily: font.bodySemi, color: color.ink, marginBottom: 5 }, metrics(14.5, 1.3)]}>
                        {category.product}
                      </Text>
                      <Text style={[{ fontFamily: font.body, color: color.textMuted, marginBottom: 12 }, metrics(12.5, 1.35)]}>
                        {category.variant}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <Text style={[{ fontFamily: font.monoMedium, color: color.ink }, metrics(14, 1.3)]}>
                          {category.price}
                        </Text>
                        <Badge label={category.stock} tone="success" small />
                      </View>
                    </View>
                  </View>

                  <View style={{ gap: 12, flex: 1 }}>
                    <View style={{ backgroundColor: color.paper, borderRadius: 14, padding: 16 }}>
                      <Text
                        style={[
                          { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 9 },
                          metrics(9.5, 1.4, 0.12),
                        ]}
                      >
                        Incoming order
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            backgroundColor: color.paper2,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text style={[{ fontFamily: font.bodySemi, color: color.accent }, metrics(11, 1.3)]}>→</Text>
                        </View>
                        <Text style={[{ fontFamily: font.bodyMedium, color: color.ink, flex: 1 }, metrics(13.5, 1.3)]}>
                          {category.order}
                        </Text>
                      </View>
                    </View>

                    <View style={{ backgroundColor: color.paper, borderRadius: 14, padding: 16, flex: 1 }}>
                      <Text
                        style={[
                          { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase', marginBottom: 9 },
                          metrics(9.5, 1.4, 0.12),
                        ]}
                      >
                        What changes for you
                      </Text>
                      <Text style={[{ fontFamily: font.body, color: color.ink }, metrics(13.5, 1.55)]}>
                        {category.note}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <View style={{ flex: 1, backgroundColor: color.ink, padding: 11, borderRadius: 10 }}>
                        <Text
                          style={[
                            { fontFamily: font.bodySemi, color: color.white, textAlign: 'center' },
                            metrics(12.5, 1.3),
                          ]}
                        >
                          Set up my catalogue
                        </Text>
                      </View>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: 'rgba(11,13,18,0.14)',
                          paddingVertical: 11,
                          paddingHorizontal: 14,
                          borderRadius: 10,
                        }}
                      >
                        <Text style={[{ fontFamily: font.bodyMedium, color: color.ink }, metrics(12.5, 1.3)]}>
                          Preview
                        </Text>
                      </View>
                    </View>
                  </View>
                </AutoGrid>
                </Inset>
              </View>
            </AutoGrid>
          </Reveal>
        </RuledTop>
      </Container>
    </Section>
  );
}

function CategoryButton({
  label,
  tag,
  img,
  active,
  onSelect,
}: {
  label: string;
  tag: string;
  img: any;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      onHoverIn={onSelect}
      accessibilityRole="button"
      aria-pressed={active}
      accessibilityState={{ selected: active }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingVertical: 13,
          paddingHorizontal: 16,
          borderRadius: 13,
          backgroundColor: active ? color.ink : color.paper2,
          borderWidth: 1,
          borderColor: active ? color.ink : 'rgba(11,13,18,0.09)',
        }}
      >
        <Image
          source={img}
          resizeMode="contain"
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            padding: 3,
            backgroundColor: active ? color.white08 : color.paper,
          }}
        />
        <Text
          style={[
            { fontFamily: font.bodySemi, color: active ? color.white : color.ink, flex: 1 },
            metrics(15, 1.3, -0.01),
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            { fontFamily: font.mono, color: active ? color.white : color.ink, opacity: 0.6 },
            metrics(10, 1.3, 0.1),
          ]}
        >
          {tag}
        </Text>
      </View>
    </Pressable>
  );
}
