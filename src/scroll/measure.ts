/**
 * Native counterpart to `measure.web.ts`.
 *
 * `measureInWindow` is asynchronous, so the value is cached and refreshed as a
 * side effect of each read. Callers therefore see the previous frame's
 * position, which is imperceptible for scroll-linked work and self-corrects
 * continuously — unlike an onLayout offset, which goes stale the moment
 * anything above the element changes height.
 */
type Measurable = { measureInWindow?: (cb: (x: number, y: number) => void) => void };

const cache = new WeakMap<object, number>();

export function readViewportTop(node: unknown): number | null {
  const target = node as Measurable | null;
  if (!target || typeof target.measureInWindow !== 'function') return null;
  target.measureInWindow((_x, y) => {
    cache.set(target as object, y);
  });
  const cached = cache.get(target as object);
  return cached == null ? null : cached;
}

/** Take a first measurement so the initial read has something to return. */
export function primeViewportTop(node: unknown): void {
  readViewportTop(node);
}
