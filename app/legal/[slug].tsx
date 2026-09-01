import React from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ContentPage } from '@/components/ContentPage';
import { Reveal } from '@/components/Reveal';
import { metrics } from '@/components/Type';
import { legalPages } from '@/data/contentPages';
import { legalPagesReviewed } from '@/config/company';
import { color, font, radius } from '@/theme/tokens';

export default function LegalSlugScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const page = legalPages[slug ?? ''] ?? legalPages['terms-of-service'];

  return (
    <ContentPage
      eyebrow="Legal"
      title={page.title}
      lede={legalPagesReviewed ? `In force since ${page.updated}` : 'Draft — not yet in force'}
    >
      {/* These pages set out real obligations. Until the values they depend
          on are confirmed and a lawyer has read them, saying so is more
          honest than printing an effective date that never happened. */}
      {legalPagesReviewed ? null : (
        <Reveal index={0} style={{ maxWidth: 720, marginBottom: 28 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(201,138,43,0.35)',
              backgroundColor: color.cautionWash,
              borderRadius: radius.control,
              padding: 16,
            }}
          >
            <Text style={[{ fontFamily: font.bodySemi, color: color.caution, marginBottom: 4 }, metrics(13.5, 1.4)]}>
              Draft — pending legal review
            </Text>
            <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(13.5, 1.55)]}>
              This document describes how Vendly is intended to operate. It has not been reviewed by a lawyer
              and is not yet binding on either side.
            </Text>
          </View>
        </Reveal>
      )}

      <Reveal index={0} style={{ maxWidth: 720, marginBottom: 44 }}>
        <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(15.5, 1.6)]}>{page.intro}</Text>
      </Reveal>

      <View style={{ maxWidth: 720, gap: 34 }}>
        {page.sections.map((section, i) => (
          <Reveal key={section.heading} index={i + 1}>
            <Text
              style={[
                { fontFamily: font.displaySemi, color: color.ink, marginBottom: 10 },
                metrics(19, 1.3, -0.01),
              ]}
            >
              {section.heading}
            </Text>
            <View style={{ gap: 10 }}>
              {section.body.map((paragraph, j) => (
                <Text key={j} style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14.5, 1.6)]}>
                  {paragraph}
                </Text>
              ))}
            </View>
          </Reveal>
        ))}
      </View>
    </ContentPage>
  );
}

/**
 * Pre-renders one HTML file per slug at export time. Without this the
 * static build emits a single literal `[slug].html`, so every one of
 * these pages would ship with no crawlable markup of its own.
 */
export async function generateStaticParams(): Promise<Record<string, string>[]> {
  return ['terms-of-service', 'privacy-policy', 'cookie-policy', 'data-protection'].map((slug) => ({ slug }));
}
