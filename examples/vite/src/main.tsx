import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    vite?: { bootstrap: () => Promise<void>; mount: (props?: unknown) => Promise<void>; unmount: (props?: unknown) => Promise<void> };
  }
}

async function bootstrap() {
  console.log('[react15] react app bootstraped');
}

const containerMap = new WeakMap();

async function mount(props: any) {
  console.log('[react18] props from main framework', props);

  const container = props?.container ? props.container.querySelector('#root') : document.getElementById('root');
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );

  containerMap.set(container, root);
}

async function unmount(props: any) {
  const container = props.container ? props.container.querySelector('#root') : document.getElementById('root');
  const root = containerMap.get(container);
  root.unmount();
}

if (!window.__POWERED_BY_QIANKUN__) {
  bootstrap().then(mount);
}

// native ESM lifecycle exports, picked up by the qiankun ESM sandbox from the entry module namespace
export { bootstrap, mount, unmount };

// keep the global for the classic (non-ESM) loading fallback
window.vite = {
  bootstrap,
  mount,
  unmount,
};
