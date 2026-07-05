import React, { useEffect, useRef, useState } from 'react';

const ACCENT = '#1C78C0';

declare global {
  interface Window {
    __SANDBOX_PROBE__?: string;
  }
}

function WindowProbe() {
  const [value, setValue] = useState<string>();

  const run = () => {
    window.__SANDBOX_PROBE__ = 'webpack-app:' + Date.now();
    setValue(window.__SANDBOX_PROBE__);
  };

  return (
    <div className="probe">
      <button className="control" onClick={run}>
        Write global
      </button>
      <div className="probe-result">
        <code className="mono">{value ? `window.__SANDBOX_PROBE__ = '${value}'` : 'window.__SANDBOX_PROBE__ = undefined'}</code>
        <p className="probe-note">Writes a window global and reads it back — the value stays inside this app's sandbox membrane.</p>
      </div>
    </div>
  );
}

function TimerProbe() {
  const [ticks, setTicks] = useState<number>();
  const started = useRef(false);

  const run = () => {
    if (started.current) return;
    started.current = true;
    setTicks(0);
    // Deliberately never cleared — qiankun reclaims leaked timers on unmount.
    setInterval(() => setTicks((t) => (t ?? 0) + 1), 1000);
  };

  return (
    <div className="probe">
      <button className="control" onClick={run} disabled={started.current && ticks !== undefined}>
        Leak a timer
      </button>
      <div className="probe-result">
        <code className="mono">{ticks === undefined ? 'no interval running' : `ticks: ${ticks}`}</code>
        <p className="probe-note">Starts a 1s setInterval and never clears it — qiankun reclaims leaked timers on unmount.</p>
      </div>
    </div>
  );
}

function StyleProbe() {
  const [injected, setInjected] = useState(false);

  useEffect(() => {
    return () => {
      document.head.querySelector('style[data-probe]')?.remove();
    };
  }, []);

  const run = () => {
    if (document.head.querySelector('style[data-probe]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-probe', '');
    // body tints the whole page when standalone; under style isolation the body rule is
    // scoped away and only the app root (inside the @scope boundary) picks up the tint
    style.textContent = `body, .webpack-app { background: ${ACCENT}10 !important }`;
    document.head.appendChild(style);
    setInjected(true);
  };

  return (
    <div className="probe">
      <button className="control" onClick={run} disabled={injected}>
        Tint body
      </button>
      <div className="probe-result">
        <code className="mono">{injected ? `body background → ${ACCENT}10` : 'no probe style injected'}</code>
        <p className="probe-note">Appends a style tinting body — style isolation keeps the tint inside this app.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [count, setCount] = useState(0);
  const insideQiankun = Boolean(window.__POWERED_BY_QIANKUN__);

  return (
    <div className="webpack-app">
      <header className="header">
        <span className="accent-dot" aria-hidden="true" />
        <h1 className="title">Webpack micro app</h1>
        <span className="badge mono">react {React.version}</span>
        <span className="badge mono">webpack 5 · classic</span>
        <span className={insideQiankun ? 'badge mono badge-accent' : 'badge mono'}>
          {insideQiankun ? 'inside qiankun' : 'standalone'}
        </span>
      </header>

      <section className="card">
        <h2 className="card-title">Isolation lab</h2>
        <WindowProbe />
        <TimerProbe />
        <StyleProbe />
      </section>

      <section className="card">
        <h2 className="card-title">Local state</h2>
        <div className="probe">
          <button className="control" onClick={() => setCount((c) => c + 1)}>
            count is {count}
          </button>
          <div className="probe-result">
            <p className="probe-note">React state lives entirely inside this app — remounting resets it.</p>
          </div>
        </div>
      </section>

      <footer className="footer mono">entry //localhost:7102 · lifecycle: src/index.tsx</footer>
    </div>
  );
}
