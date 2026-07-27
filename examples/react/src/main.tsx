import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import type { Locale } from './i18n';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __SANDBOX_PROBE__?: string;
    [key: string]: unknown;
  }
}

let root: ReactDOM.Root | undefined;
let locale: Locale = 'en';

function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'zh';
}

function render(props: { container?: Element } = {}) {
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) return;

  root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App locale={locale} />
    </React.StrictMode>,
  );
}

export async function bootstrap() {
  console.log('[react] bootstrap');
}

export async function mount(props: { container?: Element; locale?: unknown }) {
  console.log('[react] mount', props);
  if (isLocale(props.locale)) locale = props.locale;
  render(props);
}

/**
 * The host re-delivers its props here whenever they change — that is how switching the shell's
 * language reaches this app without remounting it.
 */
export async function update(props: Record<string, unknown>) {
  console.log('[react] update', props);
  if (isLocale(props.locale)) {
    locale = props.locale;
    root?.render(
      <React.StrictMode>
        <App locale={locale} />
      </React.StrictMode>,
    );
  }
}

export async function unmount(props: { container?: Element }) {
  console.log('[react] unmount', props);
  root?.unmount();
  root = undefined;
}

if (window.__POWERED_BY_QIANKUN__) {
  // classic-mode fallback: expose the lifecycles on window under the registered app name
  window['react'] = { bootstrap, mount, update, unmount };
} else {
  render();
}
