import { createApp, defineComponent, h, ref } from 'vue';
import { MicroApp } from '@qiankunjs/vue';
import { SUB_APP_ENTRIES } from '../../../ports';

const params = new URLSearchParams(window.location.search);
const isGated = params.get('gated') === '1';

const APPS = {
  'binding-a': { name: 'sub-binding-a', entry: SUB_APP_ENTRIES['sub-binding-a'], appLabel: 'binding-a' },
  'binding-b': { name: 'sub-binding-b', entry: SUB_APP_ENTRIES['sub-binding-b'], appLabel: 'binding-b' },
} as const;

function createGate() {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

let bMountDeferred: ReturnType<typeof createGate> | null = null;
let bMountEntered = false;
let bUnmountDeferred: ReturnType<typeof createGate> | null = null;
let bUnmountEntered = false;
const events: string[] = [];

const bMountGateFn = (): Promise<void> => {
  if (!bMountDeferred) return Promise.resolve();
  bMountEntered = true;
  return bMountDeferred.promise;
};

const bUnmountGateFn = (): Promise<void> => {
  if (!bUnmountDeferred) return Promise.resolve();
  bUnmountEntered = true;
  return bUnmountDeferred.promise;
};

const onEventFn = (event: string): void => {
  events.push(event);
};

declare global {
  interface Window {
    __HOST_GATES__?: {
      events: () => string[];
      clearEvents: () => void;
      armBMount: () => void;
      isBMountEntered: () => boolean;
      resolveBMount: () => void;
      armBUnmount: () => void;
      isBUnmountEntered: () => boolean;
      resolveBUnmount: () => void;
    };
  }
}

window.__HOST_GATES__ = {
  events: () => [...events],
  clearEvents: () => {
    events.length = 0;
  },
  armBMount: () => {
    bMountEntered = false;
    bMountDeferred = createGate();
  },
  isBMountEntered: () => bMountEntered,
  resolveBMount: () => {
    const gate = bMountDeferred;
    bMountDeferred = null;
    bMountEntered = false;
    gate?.resolve();
  },
  armBUnmount: () => {
    bUnmountEntered = false;
    bUnmountDeferred = createGate();
  },
  isBUnmountEntered: () => bUnmountEntered,
  resolveBUnmount: () => {
    const gate = bUnmountDeferred;
    bUnmountDeferred = null;
    bUnmountEntered = false;
    gate?.resolve();
  },
};

const VueHost = defineComponent({
  setup() {
    const visible = ref(true);
    const activeKey = ref<keyof typeof APPS>('binding-a');
    const label = ref('initial');
    let gate = isGated ? createGate() : null;

    const mountGate = isGated
      ? () => {
          if (!gate) gate = createGate();
          return gate.promise;
        }
      : undefined;

    return () => {
      const active = APPS[activeKey.value];
      return h('main', [
        h('div', { style: { marginBottom: '12px' } }, [
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'toggle-app',
              onClick: () => {
                visible.value = !visible.value;
              },
            },
            visible.value ? 'Unmount app' : 'Mount app',
          ),
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'update-label',
              onClick: () => {
                label.value = label.value === 'initial' ? 'vue-updated' : 'initial';
              },
            },
            'Update label',
          ),
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'switch-b',
              onClick: () => {
                activeKey.value = 'binding-b';
              },
            },
            'Switch B',
          ),
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'switch-a',
              onClick: () => {
                activeKey.value = 'binding-a';
              },
            },
            'Switch A',
          ),
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'resolve-mount',
              onClick: () => gate?.resolve(),
            },
            'Resolve mount',
          ),
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'reject-mount',
              onClick: () => gate?.reject(new Error('mount failed')),
            },
            'Reject mount',
          ),
        ]),
        visible.value
          ? h(
              MicroApp,
              {
                name: active.name,
                entry: active.entry,
                className: 'host-app-container',
                appProps: {
                  appLabel: active.appLabel,
                  label: label.value,
                  mountGate,
                  bMountGate: bMountGateFn,
                  bUnmountGate: bUnmountGateFn,
                  onEvent: onEventFn,
                },
              },
              {
                loader: ({ loading }: { loading: boolean }) =>
                  loading
                    ? h(
                        'div',
                        {
                          'data-testid': 'host-loader',
                          style: {
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255, 255, 255, 0.9)',
                          },
                        },
                        'Loading micro-app...',
                      )
                    : null,
                errorBoundary: ({ error }: { error: Error | undefined }) =>
                  error
                    ? h(
                        'div',
                        {
                          'data-testid': 'host-error',
                          style: {
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255, 230, 230, 0.95)',
                          },
                        },
                        `Error: ${error.message}`,
                      )
                    : null,
              },
            )
          : null,
      ]);
    };
  },
});

createApp(VueHost).mount('#vue-root');
