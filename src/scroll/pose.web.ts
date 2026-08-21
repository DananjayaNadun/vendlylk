import type { ScenePose } from './pose';
export type { TransformOp, ScenePose } from './pose';

/** Web counterpart to `pose.ts` — see the comment there for why this exists. */
export function applyPose(ref: { current: unknown }, pose: ScenePose): void {
  const node = ref.current as HTMLElement | null;
  if (!node || !node.style) return;

  if (pose.transforms) {
    const parts: string[] = [];
    for (const op of pose.transforms) {
      if (op.type === 'translate') {
        parts.push(`translate(${op.x ?? 0}px, ${op.y ?? 0}px)`);
      } else if (op.type === 'rotate') {
        parts.push(`rotate(${op.deg}deg)`);
      } else if (op.type === 'scale') {
        parts.push(`scale(${op.value})`);
      }
    }
    if (parts.length) node.style.transform = parts.join(' ');
  }

  if (pose.opacity !== undefined) node.style.opacity = String(pose.opacity);
  if (pose.blurPx !== undefined) node.style.filter = pose.blurPx > 0.01 ? `blur(${pose.blurPx}px)` : 'none';
  if (pose.heightPercent !== undefined) node.style.height = `${pose.heightPercent}%`;
}
