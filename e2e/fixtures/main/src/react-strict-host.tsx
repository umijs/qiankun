import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MicroApp } from '@qiankunjs/react';
import { SUB_APP_ENTRIES } from '../../../ports';

const strictRecord = {
  probeSetups: 0,
  probeCleanups: 0,
  appEvents: [] as string[],
};

declare global {
  interface Window {
    __STRICT_E2E__?: typeof strictRecord;
  }
}

window.__STRICT_E2E__ = strictRecord;

function StrictEffectProbe() {
  useEffect(() => {
    strictRecord.probeSetups += 1;
    return () => {
      strictRecord.probeCleanups += 1;
    };
  }, []);
  return null;
}

function ReactStrictHost() {
  const [visible, setVisible] = useState(true);
  const [label, setLabel] = useState('strict-initial');

  return (
    <main>
      <StrictEffectProbe />
      <div style={{ marginBottom: '12px' }}>
        <button type="button" data-testid="toggle-app" onClick={() => setVisible((v) => !v)}>
          {visible ? 'Unmount app' : 'Mount app'}
        </button>
        <button
          type="button"
          data-testid="update-label"
          onClick={() => setLabel((prev) => (prev === 'strict-initial' ? 'strict-updated' : 'strict-initial'))}
        >
          Update label
        </button>
      </div>

      {visible && (
        <MicroApp
          name="sub-binding-a"
          entry={SUB_APP_ENTRIES['sub-binding-a']}
          className="host-app-container"
          appLabel="binding-a"
          label={label}
          onEvent={(event: string) => {
            strictRecord.appEvents.push(event);
          }}
        />
      )}
    </main>
  );
}

const root = createRoot(document.getElementById('react-strict-root')!);
root.render(
  <StrictMode>
    <ReactStrictHost />
  </StrictMode>,
);
