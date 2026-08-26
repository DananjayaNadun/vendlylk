import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScrollProvider, useScroll } from '@/scroll/ScrollProvider';
import { ViewportProvider } from '@/theme/ViewportProvider';
import { color } from '@/theme/tokens';

import { SiteNav } from '@/sections/SiteNav';
import { Hero } from '@/sections/Hero';
import { Reality } from '@/sections/Reality';
import { Transformation } from '@/sections/Transformation';
import { KeepSelling } from '@/sections/KeepSelling';
import { HowItWorks } from '@/sections/HowItWorks';
import { Storefront } from '@/sections/Storefront';
import { Orders } from '@/sections/Orders';
import { Records } from '@/sections/Records';
import { CodReliability } from '@/sections/CodReliability';
import { AiAssistant } from '@/sections/AiAssistant';
import { Categories } from '@/sections/Categories';
import { OperatingSystem } from '@/sections/OperatingSystem';
import { Outcomes } from '@/sections/Outcomes';
import { Pricing } from '@/sections/Pricing';
import { FinalCta } from '@/sections/FinalCta';
import { SiteFooter } from '@/sections/SiteFooter';

export default function Page() {
  const scrollRef = useRef<ScrollView | null>(null);

  return (
    <ViewportProvider>
      <ScrollProvider scrollRef={scrollRef}>
        <StatusBar style="light" />
        <PageBody scrollRef={scrollRef} />
      </ScrollProvider>
    </ViewportProvider>
  );
}

function PageBody({ scrollRef }: { scrollRef: React.RefObject<ScrollView | null> }) {
  const { publish, viewportHeight } = useScroll();

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator
        onLayout={(e) => {
          viewportHeight.current = e.nativeEvent.layout.height;
        }}
        onScroll={publish}
      >
        <Hero />
        <Reality />
        <Transformation />
        <KeepSelling />
        <HowItWorks />
        <Storefront />
        <Orders />
        <Records />
        <CodReliability />
        <AiAssistant />
        <Categories />
        <OperatingSystem />
        <Outcomes />
        <Pricing />
        <FinalCta />
        <SiteFooter />
      </ScrollView>

      {/* The nav is a sibling of the scroller rather than `position: fixed`,
          which is the portable equivalent and works on native too. */}
      <SiteNav />
    </View>
  );
}
