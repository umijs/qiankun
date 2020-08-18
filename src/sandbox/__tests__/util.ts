// for pass import-html-entry [import-html-entry] Here is no "fetch" on the window env, you need to polyfill it
Object.defineProperty(window, 'fetch', {
  get() {
    return () => {};
  },
  set() {},
  configurable: false,
  enumerable: false,
});
