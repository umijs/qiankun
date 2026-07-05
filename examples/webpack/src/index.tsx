import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import App from './App';
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

function render(props: LifecycleProps = {}) {
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) return;

  root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// QiankunWebpackPlugin sets output.library { name: 'webpack-app', type: 'window' },
// so these module exports become window['webpack-app'] — the classic loading path.
export async function bootstrap() {
  console.log('[webpack-app] bootstrap');
}

export async function mount(props: LifecycleProps) {
  console.log('[webpack-app] mount', props);
  render(props);
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
