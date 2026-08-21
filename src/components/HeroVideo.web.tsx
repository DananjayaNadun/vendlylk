import React, { useEffect, useRef } from 'react';
import { Asset } from 'expo-asset';

/**
 * Web implementation of the hero background loop.
 *
 * react-native-web has no video primitive, and driving `expo-video` through its
 * player API left the element neither sized nor playing. A real `<video>` is
 * the right primitive on this platform: `muted` + `playsInline` + `autoplay` is
 * exactly what browsers require to start a background loop, and `object-fit:
 * cover` on an absolutely-filled element is what makes it full-bleed.
 *
 * The Ken Burns push is a CSS keyframe animation here, as in the design source,
 * so it runs on the compositor instead of through the JS animation loop.
 * `HeroVideo.tsx` holds the native equivalent.
 */
const KEYFRAME_ID = 'vendly-hero-zoom';

function ensureKeyframes() {
  if (typeof document === 'undefined' || document.getElementById(KEYFRAME_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAME_ID;
  style.textContent =
    '@keyframes vendlyHeroZoom{from{transform:scale(1.04)}to{transform:scale(1.16)}}';
  document.head.appendChild(style);
}

export function HeroVideo({ source, paused = false }: { source: number; paused?: boolean }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  /* react-native-web has no Image.resolveAssetSource; expo-asset is the
     supported way to turn a Metro asset module into a URL on both platforms. */
  const uri = Asset.fromModule(source).uri;

  ensureKeyframes();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    /* Set muted on the element itself before play(); autoplay is refused
       otherwise, and the attribute alone is not always enough. */
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (paused) {
      video.pause();
      return;
    }

    const attempt = () => {
      const promise = video.play();
      if (promise && promise.catch) promise.catch(() => {});
    };

    attempt();
    /* Safari can refuse before metadata is ready — retry once it is. */
    video.addEventListener('loadeddata', attempt);
    return () => video.removeEventListener('loadeddata', attempt);
  }, [paused, uri]);

  return React.createElement('video', {
    ref,
    src: uri,
    autoPlay: !paused,
    loop: true,
    muted: true,
    playsInline: true,
    preload: 'auto',
    tabIndex: -1,
    'aria-hidden': true,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      pointerEvents: 'none',
      filter: 'saturate(0.92) contrast(1.04)',
      animation: paused ? undefined : 'vendlyHeroZoom 34s ease-in-out infinite alternate',
      willChange: 'transform',
    },
  });
}
