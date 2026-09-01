import React from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ContentPage } from '@/components/ContentPage';
import { Reveal } from '@/components/Reveal';
import { CardGrid, ContactForm } from '@/components/ContentBlocks';
import { metrics } from '@/components/Type';
import { aboutContent, careersRoles, contactChannels, partnerCategories } from '@/data/contentPages';
import { color, font } from '@/theme/tokens';

const META: Record<string, { eyebrow: string; title: string; lede: string }> = {
  about: {
    eyebrow: 'Company',
    title: 'About Vendly',
    lede: aboutContent.mission,
  },
  contact: {
    eyebrow: 'Company',
    title: 'Contact us',
    lede: 'Questions about your account, a feature, or whether Vendly fits your business — this is the fastest way to reach us.',
  },
  careers: {
    eyebrow: 'Company',
    title: 'Careers',
    lede: 'We hire in small numbers, when a role genuinely needs filling — not on a schedule.',
  },
  partners: {
    eyebrow: 'Company',
    title: 'Partners',
    lede: 'The integrations Vendly is built around, and how to connect a service to it.',
  },
};

export default function CompanySlugScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const key = slug ?? 'about';
  const meta = META[key] ?? META['about'];

  return (
    <ContentPage eyebrow={meta.eyebrow} title={meta.title} lede={meta.lede}>
      {key === 'about' && (
        <>
          <Reveal index={0} style={{ maxWidth: 680, marginBottom: 40, gap: 14 }}>
            {aboutContent.story.map((p, i) => (
              <Text key={i} style={[{ fontFamily: font.body, color: color.textMuted }, metrics(15.5, 1.65)]}>
                {p}
              </Text>
            ))}
          </Reveal>
          <Reveal index={1}>
            <CardGrid items={aboutContent.values} minItemWidth={220} />
          </Reveal>
        </>
      )}

      {key === 'contact' && (
        <>
          {contactChannels.length > 0 ? (
            <Reveal index={0} style={{ marginBottom: 32 }}>
              <CardGrid items={contactChannels} minItemWidth={220} />
            </Reveal>
          ) : null}
          <Reveal index={1} style={{ maxWidth: 620 }}>
            <ContactForm submitLabel="Send message" />
          </Reveal>
        </>
      )}

      {key === 'careers' && (
        <>
          {careersRoles.length > 0 ? (
            <Reveal index={0} style={{ marginBottom: 32 }}>
              <CardGrid items={careersRoles} minItemWidth={280} />
            </Reveal>
          ) : (
            <Reveal index={0} style={{ maxWidth: 560, marginBottom: 24 }}>
              <Text style={[{ fontFamily: font.displaySemi, color: color.ink, marginBottom: 8 }, metrics(18, 1.3)]}>
                No open roles right now.
              </Text>
              <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14.5, 1.6)]}>
                We are not hiring for a specific position at the moment. When that changes, the role will be
                listed on this page.
              </Text>
            </Reveal>
          )}
          <Reveal index={1} style={{ maxWidth: 560 }}>
            <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14.5, 1.6)]}>
              Think you'd be a good addition anyway? Reach out through the{' '}
              <Text style={{ fontFamily: font.bodySemi, color: color.accent }}>contact page</Text> and tell us
              what you'd want to work on.
            </Text>
          </Reveal>
        </>
      )}

      {key === 'partners' && (
        <>
          <Reveal index={0} style={{ marginBottom: 32 }}>
            <CardGrid items={partnerCategories} minItemWidth={240} />
          </Reveal>
          <Reveal index={1} style={{ maxWidth: 560 }}>
            <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(14.5, 1.6)]}>
              Running a courier, payments or business-tool service and want to connect to Vendly sellers?
              Get in touch through the{' '}
              <Text style={{ fontFamily: font.bodySemi, color: color.accent }}>contact page</Text> and tell us
              a bit about what you do.
            </Text>
          </Reveal>
        </>
      )}
    </ContentPage>
  );
}

/**
 * Pre-renders one HTML file per slug at export time. Without this the
 * static build emits a single literal `[slug].html`, so every one of
 * these pages would ship with no crawlable markup of its own.
 */
export async function generateStaticParams(): Promise<Record<string, string>[]> {
  return ['about', 'contact', 'careers', 'partners'].map((slug) => ({ slug }));
}
