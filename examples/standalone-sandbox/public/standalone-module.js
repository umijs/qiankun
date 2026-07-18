import { moduleLabel } from './standalone-module-dep.js';

window.__STANDALONE_ESM__ = 'sandbox-only';

export const status = `${moduleLabel}:${String(window === self && self === globalThis)}`;
