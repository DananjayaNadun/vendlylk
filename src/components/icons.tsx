import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * React Native's <Image> cannot render SVG, so the three supplied vector icons
 * are expressed with react-native-svg primitives. Path data is copied verbatim
 * from the source files — nothing was redrawn.
 */

export function WhatsAppIcon({ size = 19, round }: { size?: number; round?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" accessibilityLabel="WhatsApp">
      <Rect width={512} height={512} rx={round ?? 77} fill="#25d366" />
      <Path
        fill="#25d366"
        stroke="#ffffff"
        strokeWidth={26}
        d="M123 393l14-65a138 138 0 1150 47z"
      />
      <Path
        fill="#ffffff"
        d="M308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18"
      />
    </Svg>
  );
}

export function YouTubeIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 72 72" accessibilityLabel="YouTube">
      <Circle cx={36} cy={36} r={36} fill="#FF0002" />
      <Path
        fillRule="evenodd"
        fill="#FFFFFF"
        d="M31.044,42.269916 L31.0425,28.6877416 L44.0115,35.5022437 L31.044,42.269916 Z M59.52,26.3341627 C59.52,26.3341627 59.0505,23.003199 57.612,21.5363665 C55.7865,19.610299 53.7405,19.6012352 52.803,19.4894477 C46.086,19 36.0105,19 36.0105,19 L35.9895,19 C35.9895,19 25.914,19 19.197,19.4894477 C18.258,19.6012352 16.2135,19.610299 14.3865,21.5363665 C12.948,23.003199 12.48,26.3341627 12.48,26.3341627 C12.48,26.3341627 12,30.2467232 12,34.1577731 L12,37.8256098 C12,41.7381703 12.48,45.6492202 12.48,45.6492202 C12.48,45.6492202 12.948,48.9801839 14.3865,50.4470165 C16.2135,52.3730839 18.612,52.3126583 19.68,52.5135736 C23.52,52.8851913 36,53 36,53 C36,53 46.086,52.9848936 52.803,52.4954459 C53.7405,52.3821478 55.7865,52.3730839 57.612,50.4470165 C59.0505,48.9801839 59.52,45.6492202 59.52,45.6492202 C59.52,45.6492202 60,41.7381703 60,37.8256098 L60,34.1577731 C60,30.2467232 59.52,26.3341627 59.52,26.3341627 L59.52,26.3341627 Z"
      />
    </Svg>
  );
}

/**
 * The current X brand mark (the bare glyph, per X's own brand assets and the
 * Simple Icons set) — replaces the circular twitter-era logo that shipped in
 * the handoff's `uploads/`.
 */
export function XIcon({ size = 19, fill = '#0B0D12' }: { size?: number; fill?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="X">
      <Path
        fill={fill}
        d="M18.901 1.153h3.68l-8.04 9.557L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      />
    </Svg>
  );
}

/** Google's official four-colour "G" mark. */
export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel="Google">
      <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5Z" />
      <Path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7Z" />
      <Path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4C29.4 34.9 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
      <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.5 5.4C41.3 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5Z" />
    </Svg>
  );
}

/** Apple's silhouette mark. */
export function AppleIcon({ size = 20, fill = '#000000' }: { size?: number; fill?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="Apple">
      <Path
        fill={fill}
        d="M16.365 1.43c0 1.14-.415 2.06-1.244 2.87-.898.86-1.98 1.36-3.03 1.28-.126-1.1.417-2.13 1.243-2.93.86-.83 2.13-1.34 3.03-1.22ZM20.6 17.06c-.44 1-.86 1.83-1.44 2.6-.8 1.07-1.62 2.14-2.9 2.16-1.24.02-1.65-.74-3.07-.74-1.42 0-1.87.72-3.04.76-1.24.05-2.18-1.16-2.99-2.22-1.65-2.18-2.92-6.15-1.22-8.83.84-1.34 2.35-2.19 3.99-2.21 1.19-.02 2.3.8 3.02.8.71 0 2.06-.99 3.47-.85.59.02 2.25.24 3.32 1.8-.09.05-1.98 1.16-1.96 3.45.02 2.75 2.4 3.66 2.83 3.24Z"
      />
    </Svg>
  );
}

/** Windows' four-pane flag mark. */
export function WindowsIcon({ size = 20, fill = '#00A4EF' }: { size?: number; fill?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="Windows">
      <Rect x={2} y={2.5} width={9} height={9} fill={fill} />
      <Rect x={13} y={2.5} width={9} height={9} fill={fill} />
      <Rect x={2} y={13.5} width={9} height={9} fill={fill} />
      <Rect x={13} y={13.5} width={9} height={9} fill={fill} />
    </Svg>
  );
}

/** Android's official brand mark — the head-and-shoulders robot with the
    Google green, per the supplied source file. Path data copied verbatim. */
export function AndroidIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={(size * 150) / 256} viewBox="0 0 256 150" accessibilityLabel="Android">
      <Path
        fill="#34A853"
        d="M255.285 143.47c-.084-.524-.164-1.042-.251-1.56a128.119 128.119 0 0 0-12.794-38.288 128.778 128.778 0 0 0-23.45-31.86 129.166 129.166 0 0 0-22.713-18.005c.049-.08.09-.168.14-.25 2.582-4.461 5.172-8.917 7.755-13.38l7.576-13.068c1.818-3.126 3.632-6.26 5.438-9.386a11.776 11.776 0 0 0 .662-10.484 11.668 11.668 0 0 0-4.823-5.536 11.85 11.85 0 0 0-5.004-1.61 11.963 11.963 0 0 0-2.218.018 11.738 11.738 0 0 0-8.968 5.798c-1.814 3.127-3.628 6.26-5.438 9.386l-7.576 13.069c-2.583 4.462-5.173 8.918-7.755 13.38-.282.487-.567.973-.848 1.467-.392-.157-.78-.313-1.172-.462-14.24-5.43-29.688-8.4-45.836-8.4-.442 0-.879 0-1.324.006-14.357.143-28.152 2.64-41.022 7.12a119.434 119.434 0 0 0-4.42 1.642c-.262-.455-.532-.911-.79-1.367-2.583-4.462-5.173-8.918-7.755-13.38L65.123 15.25c-1.818-3.126-3.632-6.259-5.439-9.386A11.736 11.736 0 0 0 48.5.048 11.71 11.71 0 0 0 43.49 1.66a11.716 11.716 0 0 0-4.077 4.063c-.281.474-.532.967-.742 1.473a11.808 11.808 0 0 0-.365 8.188c.259.786.594 1.554 1.023 2.296a3973.32 3973.32 0 0 1 5.439 9.386c2.53 4.357 5.054 8.713 7.58 13.069 2.582 4.462 5.168 8.918 7.75 13.38.02.038.046.075.065.112A129.184 129.184 0 0 0 45.32 64.38a129.693 129.693 0 0 0-22.2 24.015 127.737 127.737 0 0 0-9.34 15.24 128.238 128.238 0 0 0-10.843 28.764 130.743 130.743 0 0 0-1.951 9.524c-.087.518-.167 1.042-.247 1.56A124.978 124.978 0 0 0 0 149.118h256c-.205-1.891-.449-3.77-.734-5.636l.019-.012Z"
      />
      <Path
        fill="#202124"
        d="M194.59 113.712c5.122-3.41 5.867-11.3 1.661-17.62-4.203-6.323-11.763-8.682-16.883-5.273-5.122 3.41-5.868 11.3-1.662 17.621 4.203 6.322 11.764 8.682 16.883 5.272ZM78.518 108.462c4.206-6.321 3.46-14.21-1.662-17.62-5.123-3.41-12.68-1.05-16.886 5.27-4.203 6.323-3.458 14.212 1.662 17.622 5.122 3.41 12.683 1.05 16.886-5.272Z"
      />
    </Svg>
  );
}

/** Facebook's rounded "f" mark. */
export function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 72 72" accessibilityLabel="Facebook">
      <Circle cx={36} cy={36} r={36} fill="#1877F2" />
      <Path
        fill="#FFFFFF"
        d="M48 36l1.3-8.5h-8.2v-5.5c0-2.3 1.1-4.6 4.8-4.6h3.7v-7.3s-3.4-.6-6.6-.6c-6.7 0-11.1 4.1-11.1 11.4v6.6h-7.5V36h7.5v20.6c1.5.2 3 .4 4.6.4s3.1-.1 4.6-.4V36h6.9Z"
      />
    </Svg>
  );
}
