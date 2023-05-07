import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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

// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  bootstrap().then(mount);
}

window.vite = {
  bootstrap,
  mount,
  unmount,
};
