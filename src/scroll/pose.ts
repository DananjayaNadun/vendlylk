/**
 * Imperative style application for the pinned transformation scene.
 *
 * The scene used to store its scroll progress in React state and let JSX
 * re-render every element from it. That put React's render/commit/paint cycle
 * on the critical path between "the browser moved a pixel" and "our
 * counter-transform reflects it" — and that cycle is reliably slower than a
 * single scroll frame for a subtree this size (6 chaos cards, 11 chips, the
 * OrderFlow window, two headline blocks). The visible result was a bounce:
 * each scroll tick, the pinned stage would show through at its OLD position
 * for one frame (native scroll had already moved, the counter-transform
 * hadn't caught up), then snap to the correct position once React committed.
 *
 * This writes styles straight to the underlying node instead, in the same
 * synchronous pass as the scroll listener — no state, no re-render, no gap for
 * the browser to paint a stale frame in. It is the standard escape hatch for
 * scroll-linked animation in React Native (see "Direct Manipulation" in the
 * RN docs): `setNativeProps` on native, and the equivalent direct DOM write on
 * web (`pose.web.ts`), which react-native-web's refs support because a `View`
 * ref there *is* the DOM node.
 */

export type TransformOp =
  | { type: 'translate'; x?: number; y?: number }
  | { type: 'rotate'; deg: number }
  | { type: 'scale'; value: number };

export type ScenePose = {
  opacity?: number;
  transforms?: TransformOp[];
  /** Web only — React Native has no blur filter. Silently ignored on native. */
  blurPx?: number;
  /** 0–100, for the progress rail fill. */
  heightPercent?: number;
};

type Nativeish = { setNativeProps?: (props: { style: Record<string, unknown> }) => void };

export function applyPose(ref: { current: unknown }, pose: ScenePose): void {
  const node = ref.current as Nativeish | null;
  if (!node || typeof node.setNativeProps !== 'function') return;

  const style: Record<string, unknown> = {};

  if (pose.transforms) {
    const transform: Record<string, unknown>[] = [];
    for (const op of pose.transforms) {
      if (op.type === 'translate') {
        if (op.x !== undefined) transform.push({ translateX: op.x });
        if (op.y !== undefined) transform.push({ translateY: op.y });
      } else if (op.type === 'rotate') {
        transform.push({ rotate: `${op.deg}deg` });
      } else if (op.type === 'scale') {
        transform.push({ scale: op.value });
      }
    }
    if (transform.length) style.transform = transform;
  }

  if (pose.opacity !== undefined) style.opacity = pose.opacity;
  if (pose.heightPercent !== undefined) style.height = `${pose.heightPercent}%`;

  node.setNativeProps!({ style });
}
