import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ContentPage } from '@/components/ContentPage';
import { Reveal } from '@/components/Reveal';
import { Accordion, CardGrid } from '@/components/ContentBlocks';
import { docSections, faqList, guideList, helpTopics } from '@/data/contentPages';

const META: Record<string, { eyebrow: string; title: string; lede: string }> = {
  'help-centre': {
    eyebrow: 'Resources',
    title: 'Help Centre',
    lede: 'Answers to the questions sellers ask most, grouped by what you are trying to do.',
  },
  documentation: {
    eyebrow: 'Resources',
    title: 'Documentation',
    lede: 'What each part of Vendly does, module by module.',
  },
  guides: {
    eyebrow: 'Resources',
    title: 'Guides',
    lede: 'Short, practical walkthroughs for the things you will actually do this week.',
  },
  faq: {
    eyebrow: 'Resources',
    title: 'Frequently Asked Questions',
    lede: 'The questions we hear most from sellers deciding whether Vendly fits their business.',
  },
};

export default function ResourceSlugScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const key = slug ?? 'help-centre';
  const meta = META[key] ?? META['help-centre'];

  return (
    <ContentPage eyebrow={meta.eyebrow} title={meta.title} lede={meta.lede}>
      {key === 'help-centre' && (
        <Reveal index={0}>
          <CardGrid items={helpTopics.map((t) => ({ title: t.title, body: t.body, to: t.to }))} />
        </Reveal>
      )}

      {key === 'documentation' && (
        <Reveal index={0}>
          <CardGrid items={docSections} minItemWidth={240} />
        </Reveal>
      )}

      {key === 'guides' && (
        <Reveal index={0}>
          <CardGrid
            items={guideList.map((g) => ({ title: g.title, body: g.body, meta: g.time }))}
            minItemWidth={280}
          />
        </Reveal>
      )}

      {key === 'faq' && (
        <Reveal index={0}>
          <View style={{ maxWidth: 760 }}>
            <Accordion items={faqList} />
          </View>
        </Reveal>
      )}
    </ContentPage>
  );
}
