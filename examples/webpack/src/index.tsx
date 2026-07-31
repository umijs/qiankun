import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import App from './App';
import type { Locale } from './i18n';
import './index.css';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
  }
}

interface LifecycleProps {
  container?: Element;
}

let root: Root | undefined;
let locale: Locale = 'en';

function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'zh';
}

function render(props: LifecycleProps = {}) {
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) return;

  root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App locale={locale} />
    </React.StrictMode>,
  );
}

// QiankunWebpackPlugin sets output.library { name: 'webpack-app', type: 'window' },
// so these module exports become window['webpack-app'] — the classic loading path.
export async function bootstrap() {
  console.log('[webpack-app] bootstrap');
}

export async function mount(props: LifecycleProps & { locale?: unknown }) {
  console.log('[webpack-app] mount', props);
  if (isLocale(props.locale)) locale = props.locale;
  render(props);
}

/**
 * The host re-delivers its props here whenever they change — that is how switching the shell's
 * language reaches this app without remounting it.
 */
export async function update(props: Record<string, unknown>) {
  console.log('[webpack-app] update', props);
  if (isLocale(props.locale)) {
    locale = props.locale;
    root?.render(
      <React.StrictMode>
        <App locale={locale} />
      </React.StrictMode>,
    );
  }
}

export async function unmount(props: LifecycleProps) {
  console.log('[webpack-app] unmount', props);
  root?.unmount();
  root = undefined;
}

// Standalone mode: run the lifecycles ourselves.
if (!window.__POWERED_BY_QIANKUN__) {
  void bootstrap().then(() => mount({}));
}
