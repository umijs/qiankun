import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    [key: string]: unknown;
  }
}

let root: ReactDOM.Root | undefined;

function render(props: { container?: Element } = {}) {
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) return;

  root = ReactDOM.createRoot(container, { identifierPrefix: 'react-' });
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

function bootstrap() {
  console.log('[react] bootstrap');
  return Promise.resolve();
}

function mount(props: { container?: Element } = {}) {
  console.log('[react] mount', props);
  render(props);
  return Promise.resolve();
}

function unmount(props: { container?: Element }) {
  console.log('[react] unmount', props);
  if (root) {
    root.unmount();
    root = undefined;
  }
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (container) {
    container.innerHTML = '';
  }
  return Promise.resolve();
}

const lifecycle = {
  bootstrap,
  mount,
  unmount,
};

window['react-app'] = lifecycle;
window['sub-app'] = lifecycle;

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
