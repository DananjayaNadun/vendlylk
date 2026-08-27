import React, { useMemo } from 'react';
import Svg, { Rect } from 'react-native-svg';
// No type declarations shipped for the CJS entry under our module
// resolution; the library's own bundled .d.ts covers the API we use.
// @ts-ignore
import qrcodeFactory from 'qrcode-generator';

/**
 * A QR code rendered as plain SVG rectangles — one per dark module, computed
 * by `qrcode-generator` (a dependency-free, synchronous encoder with no
 * canvas or Node Buffer requirement, so it runs identically on web and
 * native). Deliberately not an <Image> hitting a third-party generator API:
 * that would make a core piece of this page's content depend on an external
 * service being up, and would leak the destination URL to that service.
 */
export function QRCode({
  value,
  size = 180,
  fg = '#0B0D12',
  bg = '#FFFFFF',
}: {
  value: string;
  size?: number;
  fg?: string;
  bg?: string;
}) {
  const modules = useMemo(() => {
    const qr = qrcodeFactory(0, 'M');
    qr.addData(value);
    qr.make();
    const count = qr.getModuleCount();
    const cells: boolean[][] = [];
    for (let row = 0; row < count; row++) {
      const line: boolean[] = [];
      for (let col = 0; col < count; col++) line.push(qr.isDark(row, col));
      cells.push(line);
    }
    return { count, cells };
  }, [value]);

  const cell = size / modules.count;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect x={0} y={0} width={size} height={size} fill={bg} />
      {modules.cells.map((line, row) =>
        line.map((dark, col) =>
          dark ? (
            <Rect
              key={`${row}-${col}`}
              x={col * cell}
              y={row * cell}
              width={cell}
              height={cell}
              fill={fg}
            />
          ) : null,
        ),
      )}
    </Svg>
  );
}
