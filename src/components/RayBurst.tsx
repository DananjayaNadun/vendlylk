/**
 * Native stand-in for the hero's ray burst.
 *
 * The real component (RayBurst.web.tsx) paints to a DOM <canvas> with the 2D
 * context, which does not exist on iOS or Android. It is purely decorative —
 * the hero reads exactly the same without it — so native renders nothing
 * rather than pulling in a canvas shim for a background flourish.
 */
export function RayBurst(_props: { opacity?: number }) {
  return null;
}
