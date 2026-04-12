import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __QIANKUN_VERSION__?: string;
    [key: string]: unknown;
  }
}

let root: ReactDOM.Root | undefined;

interface MicroAppProps {
  container?: Element;
  qiankunVersion?: string;
}

function render(props: MicroAppProps = {}) {
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) return;

  if (props.qiankunVersion) {
    window.__QIANKUN_VERSION__ = props.qiankunVersion;
  }

  const resolvedQiankunVersion = props.qiankunVersion ?? window.__QIANKUN_VERSION__;

  root = ReactDOM.createRoot(container, { identifierPrefix: 'react-' });
  root.render(
    <React.StrictMode>
      <App qiankunVersion={resolvedQiankunVersion} />
    </React.StrictMode>,
  );
}

function bootstrap() {
  console.log('[react] bootstrap');
  return Promise.resolve();
}

function mount(props: MicroAppProps = {}) {
  console.log('[react] mount', props);
  render(props);
  return Promise.resolve();
}

function unmount(props: MicroAppProps) {
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

export { bootstrap, mount, unmount };

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
