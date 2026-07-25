import { createApp, reactive } from 'vue';
import App from './App.vue';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __SANDBOX_PROBE__?: string;
    [key: string]: unknown;
  }
}

let app: ReturnType<typeof createApp> | undefined;

/**
 * Props the host hands over. qiankun re-delivers them through the `update` lifecycle, which this app
 * is the only example to implement — it is what makes the ui bindings' props channel observable.
 */
const hostProps = reactive<Record<string, unknown>>({});

function render(props: { container?: Element } = {}) {
  const container = props.container?.querySelector('#app') ?? document.getElementById('app');
  if (!container) return;

  app = createApp(App, { hostProps });
  app.mount(container);
}

export async function bootstrap() {
  console.log('[vue] bootstrap');
}

export async function mount(props: { container?: Element }) {
  console.log('[vue] mount', props);
  render(props);
}

export async function update(props: Record<string, unknown>) {
  console.log('[vue] update', props);
  Object.assign(hostProps, props);
}

export async function unmount(props: { container?: Element }) {
  console.log('[vue] unmount', props);
  app?.unmount();
  app = undefined;
}

if (window.__POWERED_BY_QIANKUN__) {
  // classic-mode fallback: expose the lifecycles on window under the registered app name
  window['vue'] = { bootstrap, mount, update, unmount };
} else {
  render();
}
