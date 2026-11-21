import { disposeCompartmentAssets, transpileAssets } from '@qiankunjs/shared';
import writableDOM from '@writable-dom-under-test';

declare global {
  interface Window {
    __WRITABLE_DOM_UNDER_TEST__?: typeof writableDOM;
  }
}

window.__WRITABLE_DOM_UNDER_TEST__ = writableDOM;

Object.assign(window, { __STYLE_ASSETS_UNDER_TEST__: { disposeCompartmentAssets, transpileAssets } });
