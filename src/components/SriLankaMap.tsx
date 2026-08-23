/**
 * Native stand-in for the 3D Sri Lanka relief.
 *
 * The real component (SriLankaMap.web.tsx) is plain-DOM React built on three
 * and @react-three/fiber — it needs WebGL and a `<div>`, neither of which
 * exists on iOS or Android. Rendering nothing here keeps native builds
 * compiling and the section intact, since the map is decorative: every claim
 * it illustrates is already made by the copy and the module ring beside it.
 *
 * Bringing it to native later means expo-gl plus @react-three/fiber/native,
 * which is a real port rather than a config change — hence the split file
 * rather than a runtime Platform check.
 */
export type SriLankaMapProps = { width: number; height: number };

export function SriLankaMap(_props: SriLankaMapProps) {
  return null;
}
