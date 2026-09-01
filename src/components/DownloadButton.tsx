import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Linking, Platform, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { AndroidIcon, AppleIcon, WindowsIcon } from '@/components/icons';
import { metrics } from '@/components/Type';
import { color, font, radius } from '@/theme/tokens';
import { releases } from '@/releases';

/**
 * The hero's primary CTA — "Download", opening a small popup underneath with
 * the platform choices, rather than linking straight to a signup page.
 * Windows and Mac fetch the installer directly once released; Android/iOS
 * has no single file to hand over, so it goes to /get-app instead. Platforms
 * that have not shipped yet are listed but marked "Soon" and are not
 * pressable, rather than handing over a link that 404s — see src/releases.ts.
 * Closes on picking an option or clicking anywhere else on the page, the same
 * click-outside pattern used by the auth pages' time-of-day picker.
 */
export function DownloadButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<View | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 180,
      easing: open ? Easing.out(Easing.back(1.1)) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [open, progress]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !open) return;
    const onDown = (event: MouseEvent) => {
      const node = containerRef.current as unknown as HTMLElement | null;
      if (node && event.target instanceof Node && node.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <View ref={containerRef} style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <Button
        label="Download"
        arrow
        onPress={() => setOpen((v) => !v)}
        style={{ alignSelf: 'flex-start' }}
      />

      {open ? (
        <Animated.View
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 10,
            width: 250,
            borderRadius: radius.control,
            backgroundColor: 'rgba(247,246,243,0.96)',
            borderWidth: 1,
            borderColor: 'rgba(11,13,18,0.08)',
            paddingVertical: 6,
            opacity: progress,
            transform: [
              { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) },
              { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
            ],
            boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
            zIndex: 50,
          }}
        >
          <DownloadOption
            label="Download for Windows"
            icon={<WindowsIcon size={16} />}
            available={releases.windows.available}
            onPress={() => {
              setOpen(false);
              Linking.openURL(releases.windows.url);
            }}
          />
          <DownloadOption
            label="Download for Mac"
            icon={<AppleIcon size={16} />}
            available={releases.mac.available}
            onPress={() => {
              setOpen(false);
              Linking.openURL(releases.mac.url);
            }}
          />
          {/* Always live: /get-app explains where each mobile build stands,
              so it stays useful before the stores approve the listings. */}
          <DownloadOption
            label="Android / iPhone"
            icon={
              <View style={{ flexDirection: 'row', gap: 3 }}>
                <AndroidIcon size={15} />
                <AppleIcon size={15} />
              </View>
            }
            available
            onPress={() => {
              setOpen(false);
              router.push('/get-app');
            }}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

function DownloadOption({
  label,
  icon,
  available,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  available: boolean;
  onPress: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      onPress={available ? onPress : undefined}
      disabled={!available}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      accessibilityRole="button"
      accessibilityState={{ disabled: !available }}
      accessibilityLabel={available ? label : `${label} — not released yet`}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingVertical: 10,
          paddingHorizontal: 14,
          marginHorizontal: 6,
          borderRadius: 8,
          backgroundColor: hover && available ? 'rgba(11,13,18,0.05)' : 'transparent',
          opacity: available ? 1 : 0.55,
        }}
      >
        {icon}
        <Text
          style={[{ fontFamily: font.bodyMedium, color: color.ink, flex: 1 }, metrics(13.5, 1.3)]}
        >
          {label}
        </Text>
        {available ? null : (
          <Text
            style={[
              { fontFamily: font.mono, color: color.textFaint, textTransform: 'uppercase' },
              metrics(9.5, 1.3, 0.1),
            ]}
          >
            Soon
          </Text>
        )}
      </View>
    </Pressable>
  );
}
