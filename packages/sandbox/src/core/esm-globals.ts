/**
 * @author Kuitos
 * @since 2026-07-04
 * The destructurable globals base set for the ESM sandbox (ESM sandbox RFC §1).
 * Kept out of globals.ts on purpose: that file is generated from sindresorhus/globals and gets
 * rewritten wholesale on regeneration.
 */
import { globalsInBrowser } from './globals';

/*
 * Value-typed / getter-semantic window properties that a one-off destructuring snapshot cannot
 * represent (the ESM top-of-module injection is an evaluation-time snapshot). Bare references to
 * them fall back to the real global, which is acceptable as they are mostly read-only layout
 * values, and is documented as a known limitation.
 */
const nonDestructurableGlobals = [
  'closed',
  'defaultstatus',
  'defaultStatus',
  'devicePixelRatio',
  'event',
  'innerHeight',
  'innerWidth',
  'length',
  'name',
  'offscreenBuffering',
  'opener',
  'outerHeight',
  'outerWidth',
  'pageXOffset',
  'pageYOffset',
  'screenLeft',
  'screenTop',
  'screenX',
  'screenY',
  'scrollX',
  'scrollY',
  'status',
];

/*
 * The base set for the ESM top-of-module destructuring injection: the full browser globals list
 * (so the coverage matches the classic with(proxy) sandbox as closely as possible) plus the sandbox
 * intrinsics that must always resolve to the membrane proxy, minus the live-value properties above.
 * The per-module destructuring set is this base set filtered by an identifier scan of the module source.
 */
export const esmDestructurableGlobals: string[] = Array.from(
  new Set(globalsInBrowser.concat(['window', 'self', 'globalThis', 'document', 'top', 'parent', 'location'])),
).filter((p) => nonDestructurableGlobals.indexOf(p) === -1);
