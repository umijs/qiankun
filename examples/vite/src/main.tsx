import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    [key: string]: unknown;
  }
}

async function bootstrap() {
  console.log('[vite] bootstrap');
}

const containerMap = new WeakMap<Element, ReactDOM.Root>();

interface MicroAppProps {
  container?: Element;
}

async function mount(props: MicroAppProps = {}) {
  console.log('[vite] mount', props);

  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) {
    return;
  }
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
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
