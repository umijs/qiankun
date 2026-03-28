import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __QIANKUN_VERSION__?: string;
    [key: string]: unknown;
  }
}

let app: ReturnType<typeof createApp> | undefined;

interface MicroAppProps {
  container?: Element;
  qiankunVersion?: string;
}

function render(props: MicroAppProps = {}) {
  const container = props.container?.querySelector('#app') ?? document.getElementById('app');
  if (!container) return;

  if (props.qiankunVersion) {
    window.__QIANKUN_VERSION__ = props.qiankunVersion;
  }

  const resolvedQiankunVersion = props.qiankunVersion ?? window.__QIANKUN_VERSION__ ?? 'N/A';

  app = createApp(App, { qiankunVersion: resolvedQiankunVersion });
  app.config.idPrefix = 'vue-';
  app.mount(container);
}

function bootstrap() {
  console.log('[vue] bootstrap');
  return Promise.resolve();
}

function mount(props: MicroAppProps = {}) {
  console.log('[vue] mount', props);
  render(props);
  return Promise.resolve();
}

function unmount(props: MicroAppProps) {
  console.log('[vue] unmount', props);
  if (app) {
    app.unmount();
    app = undefined;
  }
  const container = props.container?.querySelector('#app') ?? document.getElementById('app');
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

window['vue-app'] = lifecycle;
window['sub-app'] = lifecycle;

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
