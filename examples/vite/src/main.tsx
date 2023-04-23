import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

export async function bootstrap() {
  console.log('[react15] react app bootstraped');
}

const containerMap = new WeakMap();

export async function mount(props: any) {
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

export async function unmount(props: any) {
  const container = props.container ? props.container.querySelector('#root') : document.getElementById('root');
  const root = containerMap.get(container);
  root.unmount();
}

// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  bootstrap().then(mount);
}
