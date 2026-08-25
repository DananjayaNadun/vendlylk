<<<<<<< HEAD
import React, { createContext, useContext, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

type Size = { width: number; height: number };

const ViewportContext = createContext<Size | null>(null);

/**
 * Measures the app root and publishes its size.
 *
 * `useWindowDimensions()` is not dependable on react-native-web here — it can
 * report a stale size and miss later resizes, which pins every `clamp()` value
 * to its minimum and flips the layout into its mobile composition on a desktop
 * viewport. `onLayout` reports the real measured size and behaves identically
 * on iOS and Android, so it is the authority; the window size is only a
 * first-paint seed.
 */
export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const window = useWindowDimensions();
  const [size, setSize] = useState<Size>({ width: window.width, height: window.height });

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width <= 0 || height <= 0) return;
        setSize((prev) =>
          Math.abs(prev.width - width) > 0.5 || Math.abs(prev.height - height) > 0.5
            ? { width, height }
            : prev,
        );
      }}
    >
      <ViewportContext.Provider value={size}>{children}</ViewportContext.Provider>
    </View>
  );
}

/** Falls back to the window size when rendered outside a provider. */
export function useViewportSize(): Size {
  const measured = useContext(ViewportContext);
  const window = useWindowDimensions();
  if (measured && measured.width > 0) return measured;
  return { width: window.width, height: window.height };
}
=======
import React, { createContext, useContext, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

type Size = { width: number; height: number };

const ViewportContext = createContext<Size | null>(null);

/**
 * Measures the app root and publishes its size.
 *
 * `useWindowDimensions()` is not dependable on react-native-web here — it can
 * report a stale size and miss later resizes, which pins every `clamp()` value
 * to its minimum and flips the layout into its mobile composition on a desktop
 * viewport. `onLayout` reports the real measured size and behaves identically
 * on iOS and Android, so it is the authority; the window size is only a
 * first-paint seed.
 */
export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const window = useWindowDimensions();
  const [size, setSize] = useState<Size>({ width: window.width, height: window.height });

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width <= 0 || height <= 0) return;
        setSize((prev) =>
          Math.abs(prev.width - width) > 0.5 || Math.abs(prev.height - height) > 0.5
            ? { width, height }
            : prev,
        );
      }}
    >
      <ViewportContext.Provider value={size}>{children}</ViewportContext.Provider>
    </View>
  );
}

/** Falls back to the window size when rendered outside a provider. */
export function useViewportSize(): Size {
  const measured = useContext(ViewportContext);
  const window = useWindowDimensions();
  if (measured && measured.width > 0) return measured;
  return { width: window.width, height: window.height };
}
>>>>>>> c1decb5f08ffdabb7df20508d93878b536a73e30
