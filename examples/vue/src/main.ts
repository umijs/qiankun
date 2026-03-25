import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    [key: string]: unknown;
  }
}

let app: ReturnType<typeof createApp> | undefined;

function render(props: { container?: Element } = {}) {
  const container = props.container?.querySelector('#app') ?? document.getElementById('app');
  if (!container) return;

  app = createApp(App);
  app.config.idPrefix = 'vue-';
  app.mount(container);
}

function bootstrap() {
  console.log('[vue] bootstrap');
  return Promise.resolve();
}

function mount(props: { container?: Element } = {}) {
  console.log('[vue] mount', props);
  render(props);
  return Promise.resolve();
}

function unmount(props: { container?: Element }) {
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
