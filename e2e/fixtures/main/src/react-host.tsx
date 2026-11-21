import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MicroApp } from '@qiankunjs/react';
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

function ReactHost() {
  const [visible, setVisible] = useState(true);
  const [activeKey, setActiveKey] = useState<keyof typeof APPS>('binding-a');
  const [label, setLabel] = useState('initial');
  const gateRef = useRef(isGated ? createGate() : null);

  const active = APPS[activeKey];

  const mountGate = isGated
    ? () => {
        if (!gateRef.current) gateRef.current = createGate();
        return gateRef.current.promise;
      }
    : undefined;

  return (
    <main>
      <div style={{ marginBottom: '12px' }}>
        <button type="button" data-testid="toggle-app" onClick={() => setVisible((v) => !v)}>
          {visible ? 'Unmount app' : 'Mount app'}
        </button>
        <button
          type="button"
          data-testid="update-label"
          onClick={() => setLabel((prev) => (prev === 'initial' ? 'updated' : 'initial'))}
        >
          Update label
        </button>
        <button type="button" data-testid="switch-b" onClick={() => setActiveKey('binding-b')}>
          Switch B
        </button>
        <button type="button" data-testid="switch-a" onClick={() => setActiveKey('binding-a')}>
          Switch A
        </button>
        <button type="button" data-testid="resolve-mount" onClick={() => gateRef.current?.resolve()}>
          Resolve mount
        </button>
        <button
          type="button"
          data-testid="reject-mount"
          onClick={() => gateRef.current?.reject(new Error('mount failed'))}
        >
          Reject mount
        </button>
      </div>

      {visible && (
        <MicroApp
          name={active.name}
          entry={active.entry}
          className="host-app-container"
          appLabel={active.appLabel}
          label={label}
          mountGate={mountGate}
          bMountGate={bMountGateFn}
          bUnmountGate={bUnmountGateFn}
          onEvent={onEventFn}
          loader={(isLoading) =>
            isLoading ? (
              <div
                data-testid="host-loader"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Loading micro-app...
              </div>
            ) : null
          }
          errorBoundary={(error) => (
            <div
              data-testid="host-error"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 230, 230, 0.95)',
              }}
            >
              Error: {error.message}
            </div>
          )}
        />
      )}
    </main>
  );
}

const root = createRoot(document.getElementById('react-root')!);
root.render(<ReactHost />);
