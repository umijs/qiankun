import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __QIANKUN_VERSION__?: string;
    [key: string]: unknown;
  }
}

async function bootstrap() {
  console.log('[vite] bootstrap');
}

const containerMap = new WeakMap<Element, ReactDOM.Root>();

interface MicroAppProps {
  container?: Element;
  qiankunVersion?: string;
}

async function mount(props: MicroAppProps = {}) {
  console.log('[vite] mount', props);

  if (props.qiankunVersion) {
    window.__QIANKUN_VERSION__ = props.qiankunVersion;
  }

  const resolvedQiankunVersion = props.qiankunVersion ?? window.__QIANKUN_VERSION__;

  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) {
    return;
  }
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App qiankunVersion={resolvedQiankunVersion} />
    </React.StrictMode>,
  );

  containerMap.set(container, root);
}

async function unmount(props: MicroAppProps = {}) {
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) {
    return;
  }
  const root = containerMap.get(container);
  root?.unmount();
  containerMap.delete(container);
}

const lifecycle = {
  bootstrap,
  mount,
  unmount,
};

window['vite-app'] = lifecycle;
window['sub-app'] = lifecycle;

if (!window.__POWERED_BY_QIANKUN__) {
  mount();
}
