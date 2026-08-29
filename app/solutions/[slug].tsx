import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ContentPage } from '@/components/ContentPage';
import { Reveal } from '@/components/Reveal';
import { Panel } from '@/components/UI';
import { metrics } from '@/components/Type';
import { categories } from '@/data';
import { solutionsCopy } from '@/data/contentPages';
import { color, font, radius, shadow } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';

const SLUG_TO_CATEGORY: Record<string, string> = {
  'food-beverages': 'Food & Beverages',
  'fashion-apparel': 'Fashion & Apparel',
  'beauty-health': 'Beauty & Health',
  electronics: 'Electronics',
  'home-lifestyle': 'Home & Lifestyle',
  'general-retail': 'General Retail',
};

export default function SolutionSlugScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { isMobile } = useViewport();

  const name = SLUG_TO_CATEGORY[slug ?? ''] ?? SLUG_TO_CATEGORY['food-beverages'];
  const category = categories.find((c) => c.name === name)!;
  const copy = solutionsCopy[name];

  return (
    <ContentPage eyebrow={`Solutions · ${category.tag}`} title={category.name} lede={copy.headline}>
      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: 40 }}>
        <Reveal index={0} style={{ flex: 1, minWidth: 0 }}>
          <View style={{ gap: 18, marginBottom: 28 }}>
            {copy.bullets.map((bullet, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    backgroundColor: category.previewTint,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 1,
                  }}
                >
                  <Text style={[{ fontFamily: font.bodySemi, color: color.ink }, metrics(11, 1.2)]}>{i + 1}</Text>
                </View>
                <Text style={[{ fontFamily: font.body, color: color.textMuted, flex: 1 }, metrics(15, 1.6)]}>
                  {bullet}
                </Text>
              </View>
            ))}
          </View>

          <Pressable onPress={() => router.push('/signup')} accessibilityRole="button">
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: color.accent,
                paddingVertical: 14,
                paddingHorizontal: 24,
                borderRadius: radius.control,
                ...shadow.ctaPrimary,
              }}
            >
              <Text style={[{ fontFamily: font.bodySemi, color: color.white }, metrics(15, 1.2)]}>
                Get started for {category.name}
              </Text>
            </View>
          </Pressable>
        </Reveal>

        <Reveal index={1} style={{ width: isMobile ? '100%' : 340 }}>
          <Panel style={{ padding: 20, backgroundColor: category.previewTint }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.55)',
                  padding: 8,
                }}
              >
                <Image source={category.img} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[{ fontFamily: font.displaySemi, color: color.ink }, metrics(15, 1.3)]} numberOfLines={1}>
                  {category.product}
                </Text>
                <Text style={[{ fontFamily: font.bodyMedium, color: 'rgba(11,13,18,0.6)' }, metrics(13, 1.3)]}>
                  {category.price}
                </Text>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <PreviewRow label="Variant" value={category.variant} />
              <PreviewRow label="Stock" value={category.stock} />
              <PreviewRow label="Latest order" value={category.order} />
            </View>

            <View
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTopWidth: 1,
                borderTopColor: 'rgba(11,13,18,0.12)',
              }}
            >
              <Text style={[{ fontFamily: font.body, color: 'rgba(11,13,18,0.65)' }, metrics(12.5, 1.5)]}>
                {category.note}
              </Text>
            </View>
          </Panel>
        </Reveal>
      </View>
    </ContentPage>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text style={[{ fontFamily: font.mono, color: 'rgba(11,13,18,0.55)' }, metrics(11.5, 1.4)]}>{label}</Text>
      <Text
        style={[{ fontFamily: font.bodyMedium, color: color.ink, flex: 1, textAlign: 'right' }, metrics(12.5, 1.4)]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}
