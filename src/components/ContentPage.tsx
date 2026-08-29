import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScrollProvider, useScroll } from '@/scroll/ScrollProvider';
import { Container, Section } from './Layout';
import { Reveal } from './Reveal';
import { Eyebrow } from './UI';
import { H1, Lede } from './Type';
import { color } from '@/theme/tokens';
import { useViewport } from '@/theme/responsive';
import { SiteNav } from '@/sections/SiteNav';
import { SiteFooter } from '@/sections/SiteFooter';

/**
 * Shared shell for every footer/legal/company/resources/support/solutions
 * page — the same nav, footer and Reveal-on-scroll rhythm as the homepage,
 * around a dark hero (eyebrow + H1 + optional lede) and a paper-toned body.
 *
 * Each of these routes gets its own ScrollProvider and ScrollView, exactly
 * like the homepage does in app/index.tsx — Section, Reveal and SiteFooter
 * all read from that context, so it has to exist on every page that uses
 * them, not just the one at "/".
 */
export function ContentPage({
  eyebrow,
  title,
  lede,
  floating,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Rendered as a fixed overlay, outside the ScrollView — a chat launcher,
      for instance, that should stay put while the page scrolls. */
  floating?: React.ReactNode;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<ScrollView | null>(null);

  return (
    <ScrollProvider scrollRef={scrollRef}>
      <StatusBar style="light" />
      <ContentPageBody scrollRef={scrollRef} eyebrow={eyebrow} title={title} lede={lede} floating={floating}>
        {children}
      </ContentPageBody>
    </ScrollProvider>
  );
}

function ContentPageBody({
  scrollRef,
  eyebrow,
  title,
  lede,
  floating,
  children,
}: {
  scrollRef: React.RefObject<ScrollView | null>;
  eyebrow: string;
  title: string;
  lede?: string;
  floating?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { publish, notify, viewportHeight } = useScroll();
  const { f } = useViewport();

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator
        onLayout={(e) => {
          viewportHeight.current = e.nativeEvent.layout.height;
          /* Reveals mount before this fires and bail out with no viewport
             height to check against — re-run them now that one exists,
             rather than leaving the page blank until the user scrolls. */
          notify();
        }}
        onScroll={publish}
      >
        <Section tone="ink" style={{ paddingTop: f(150, 15, 220) }}>
          <Container>
            <Reveal index={0} style={{ maxWidth: 720 }}>
              <Eyebrow label={eyebrow} tone="ink" />
              <H1 style={{ marginBottom: lede ? 18 : 0 }}>{title}</H1>
              {lede ? <Lede style={{ color: color.white62, maxWidth: 620 }}>{lede}</Lede> : null}
            </Reveal>
          </Container>
        </Section>

        <Section>
          <Container>{children}</Container>
        </Section>

        <SiteFooter />
      </ScrollView>

      <SiteNav />
      {floating}
    </View>
  );
}
