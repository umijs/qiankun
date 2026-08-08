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
 * Props the host hands over — seeded on mount, then kept current by the `update` lifecycle every
 * example implements. This is what makes the ui bindings' props channel observable: the shell's
 * locale (and its theme toggle) land here without the app ever remounting.
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
  // the host's props are already there on the first mount — seeding them here is what lets the
  // app come up in the host's language instead of waiting for the first `update`
  Object.assign(hostProps, props);
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
