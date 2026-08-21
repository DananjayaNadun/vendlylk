import React from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

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

export function XIcon({ size = 19 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1668.56 1221.19" accessibilityLabel="X">
      <Circle cx={834.28} cy={610.6} r={481.33} fill="#000000" stroke="#FFFFFF" />
      <G transform="translate(52.390088,-25.058597)">
        <Path
          fill="#FFFFFF"
          d="M485.39,356.79l230.07,307.62L483.94,914.52h52.11l202.7-218.98l163.77,218.98h177.32L836.82,589.6l215.5-232.81h-52.11L813.54,558.46L662.71,356.79H485.39z M562.02,395.17h81.46l359.72,480.97h-81.46L562.02,395.17z"
        />
      </G>
    </Svg>
  );
}
