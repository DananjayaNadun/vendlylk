/**
 * Native stand-in for the 3D magic-tree QR code.
 *
 * The real component (MagicTreeQR.web.tsx) is plain-DOM React built on three
 * and @react-three/fiber — it needs WebGL and a `<canvas>`, neither of which
 * exists on iOS or Android. Declared here rather than in the .web file for
 * the same reason as SriLankaMap: TypeScript's own module resolution has no
 * concept of the `.web` platform extension, so a bare import resolves to
 * whichever file `tsc` finds first.
 */
export type MagicTreeQRProps = { value: string; width: number; height: number };

export function MagicTreeQR(_props: MagicTreeQRProps) {
  return null;
}
