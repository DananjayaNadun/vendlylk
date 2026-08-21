import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

/**
 * Native implementation of the hero background loop.
 * `HeroVideo.web.tsx` holds the web equivalent, which uses a real `<video>`.
 */
export function HeroVideo({ source, paused = false }: { source: number; paused?: boolean }) {
  const player = useVideoPlayer(source, (instance) => {
    instance.loop = true;
    instance.muted = true;
  });

  useEffect(() => {
    player.muted = true;
    if (paused) player.pause();
    else player.play();
  }, [player, paused]);

  /* Ken Burns: scale 1.04 -> 1.16 over 34s, alternating. */
  const zoom = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (paused) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(zoom, {
          toValue: 1,
          duration: 34000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(zoom, {
          toValue: 0,
          duration: 34000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [paused, zoom]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { transform: [{ scale: zoom.interpolate({ inputRange: [0, 1], outputRange: [1.04, 1.16] }) }] },
      ]}
    >
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
    </Animated.View>
  );
}
