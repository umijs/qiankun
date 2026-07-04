/**
 * @author Kuitos
 * @since 2026-07-04
 * Substituted source for /@vite/client (RFC §13).
 *
 * The real Vite HMR client would connect its WebSocket successfully inside the sandbox (the HMR host
 * is a serve-time literal) and then trigger destructive full reloads or re-import original URLs that
 * bypass the blob cache. So HMR is deliberately disabled here, while the style injection helpers used
 * by Vite dev CSS-as-JS modules keep working.
 *
 * This stub goes through the regular rewrite pipeline like any other module, so its `document` access
 * is membrane-proxied and dynamically injected <style> elements are routed to the app's virtual head.
 */

export const isViteClientUrl = (url: string): boolean => {
  try {
    return new URL(url).pathname === '/@vite/client';
  } catch {
    return false;
  }
};

export const viteClientStubSource = `/* qiankun stub for /@vite/client: HMR is disabled inside the qiankun sandbox, edit-and-reload manually */
const sheetsMap = new Map();

export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (style) {
    style.textContent = content;
  } else {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-vite-dev-id', id);
    style.textContent = content;
    document.head.appendChild(style);
    sheetsMap.set(id, style);
  }
}

export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
    sheetsMap.delete(id);
  }
}

const noop = () => {};
const hotContext = {
  accept: noop,
  acceptExports: noop,
  dispose: noop,
  prune: noop,
  invalidate: noop,
  decline: noop,
  on: noop,
  off: noop,
  send: noop,
  data: {},
};

export function createHotContext() {
  return hotContext;
}

export function injectQuery(url) {
  return url;
}

export class ErrorOverlay {}

export default {};
`;
