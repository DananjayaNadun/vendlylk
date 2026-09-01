import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ContentPage } from '@/components/ContentPage';
import { Reveal } from '@/components/Reveal';
import { CardGrid, ContactForm } from '@/components/ContentBlocks';
import { SupportChatbot } from '@/components/SupportChatbot';
import { supportChannels } from '@/data/contentPages';

const META: Record<string, { eyebrow: string; title: string; lede: string }> = {
  help: {
    eyebrow: 'Support',
    title: 'Help',
    lede: 'The fastest way to an answer, in order — self-serve first, a real person if you still need one.',
  },
  'contact-support': {
    eyebrow: 'Support',
    title: 'Contact Support',
    lede: "Tell us what's wrong and we'll get back to you — most questions get a reply the same business day.",
  },
};

const QUICK_LINKS = [
  { title: 'FAQ', body: 'Quick answers to the questions sellers ask most.', to: '/resources/faq' },
  { title: 'Documentation', body: 'What each part of Vendly does, module by module.', to: '/resources/documentation' },
  { title: 'Guides', body: 'Step-by-step walkthroughs for common tasks.', to: '/resources/guides' },
  { title: 'Contact Support', body: 'Still stuck? Reach a real person.', to: '/support/contact-support' },
];

export default function SupportSlugScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const key = slug ?? 'help';
  const meta = META[key] ?? META['help'];

  return (
    <ContentPage eyebrow={meta.eyebrow} title={meta.title} lede={meta.lede} floating={<SupportChatbot />}>
      {key === 'help' && (
        <Reveal index={0}>
          <CardGrid items={QUICK_LINKS} minItemWidth={240} />
        </Reveal>
      )}

      {key === 'contact-support' && (
        <>
          <Reveal index={0} style={{ marginBottom: 32 }}>
            <CardGrid items={supportChannels} minItemWidth={260} />
          </Reveal>
          <Reveal index={1} style={{ maxWidth: 620 }}>
            <ContactForm
              submitLabel="Send to support"
              messageLabel="What's going on?"
              messagePlaceholder="Your business name and what you're seeing — an order number helps if it's about one."
            />
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
  return ['help', 'contact-support'].map((slug) => ({ slug }));
}
