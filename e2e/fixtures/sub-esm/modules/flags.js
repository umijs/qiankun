// Simulates the bundler feature-flag idiom (e.g. Vue's __VUE_OPTIONS_API__): modules create
// dunder globals at runtime and read them back as BARE identifiers, possibly from other modules.

// written at module-eval time, read later by the entry module as a bare identifier
window.__RUNTIME_FLAG__ = 'flag-on';

// read back as a bare identifier from THIS module, but only at call time (after the write below);
// exercises the live-binding path, a plain eval-time snapshot would still see undefined here
export function readSelfFlag() {
  return typeof __SELF_FLAG__ === 'undefined' ? 'missing' : __SELF_FLAG__;
}

globalThis.__SELF_FLAG__ = 'self-on';
