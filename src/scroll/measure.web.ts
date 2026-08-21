/**
 * Reads an element's top edge relative to the scroll viewport.
 *
 * The design source computed its scene progress from
 * `getBoundingClientRect().top`, which is always current. Deriving the same
 * number from `onLayout` does not work: react-native-web implements onLayout
 * with a ResizeObserver, so it fires when an element's own size changes but
 * never when the element *moves* because content above it grew — fonts
 * swapping in, images sizing, a reveal expanding. The offset then goes stale
 * and every scroll-linked value is computed against the wrong origin.
 *
 * On web the ref is the DOM node, so this is a synchronous read.
 * `measure.ts` holds the native counterpart.
 */
export function readViewportTop(node: unknown): number | null {
  const element = node as HTMLElement | null;
  if (!element || typeof element.getBoundingClientRect !== 'function') return null;
  return element.getBoundingClientRect().top;
}

/** Web needs no priming — the read above is always live. */
export function primeViewportTop(_node: unknown): void {}
