import writableDOM from '@writable-dom-under-test';

declare global {
  interface Window {
    __WRITABLE_DOM_UNDER_TEST__?: typeof writableDOM;
  }
}

window.__WRITABLE_DOM_UNDER_TEST__ = writableDOM;
