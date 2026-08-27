import React from 'react';
import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';
/* Imported by subpath, not from the package root: the root re-exports every
   weight and italic of each family, which makes Metro bundle all 40 font files
   instead of the 10 this design uses. */
import { SchibstedGrotesk_400Regular } from '@expo-google-fonts/schibsted-grotesk/400Regular';
import { SchibstedGrotesk_500Medium } from '@expo-google-fonts/schibsted-grotesk/500Medium';
import { SchibstedGrotesk_600SemiBold } from '@expo-google-fonts/schibsted-grotesk/600SemiBold';
import { SchibstedGrotesk_700Bold } from '@expo-google-fonts/schibsted-grotesk/700Bold';
import { SchibstedGrotesk_800ExtraBold } from '@expo-google-fonts/schibsted-grotesk/800ExtraBold';
import { IBMPlexSans_400Regular } from '@expo-google-fonts/ibm-plex-sans/400Regular';
import { IBMPlexSans_500Medium } from '@expo-google-fonts/ibm-plex-sans/500Medium';
import { IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans/600SemiBold';
import { IBMPlexMono_400Regular } from '@expo-google-fonts/ibm-plex-mono/400Regular';
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono/500Medium';
import { color } from '@/theme/tokens';
import { injectGlobalScrollbar } from '@/theme/globalScrollbar';
import { ViewportProvider } from '@/theme/ViewportProvider';

/* Module scope, not inside the component: runs exactly once at startup,
   before the first paint, on both the loading spinner below and the real
   page — matching how fonts are requested above. */
injectGlobalScrollbar();

export default function RootLayout() {
  const [loaded] = useFonts({
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_500Medium,
    SchibstedGrotesk_600SemiBold,
    SchibstedGrotesk_700Bold,
    SchibstedGrotesk_800ExtraBold,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: color.ink, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={color.accentLight} />
      </View>
    );
  }

  return (
    <ViewportProvider>
      <Slot />
    </ViewportProvider>
  );
}
