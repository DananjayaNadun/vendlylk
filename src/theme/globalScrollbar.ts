/**
 * Native counterpart to `globalScrollbar.web.ts`.
 *
 * iOS and Android scroll indicators aren't stylable through CSS-equivalent
 * hooks — this is a no-op so the call site in `app/_layout.tsx` doesn't need
 * a platform check.
 */
export function injectGlobalScrollbar(): void {}
