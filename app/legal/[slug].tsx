import React from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ContentPage } from '@/components/ContentPage';
import { Reveal } from '@/components/Reveal';
import { metrics } from '@/components/Type';
import { legalPages } from '@/data/contentPages';
import { color, font } from '@/theme/tokens';

export default function LegalSlugScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const page = legalPages[slug ?? ''] ?? legalPages['terms-of-service'];

  return (
    <ContentPage eyebrow="Legal" title={page.title} lede={`Last updated ${page.updated}`}>
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
