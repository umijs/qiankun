import React, { useEffect, useRef, useState } from 'react';
import { messages, type Locale, type Messages } from './i18n';

const ACCENT = '#1C78C0';

declare global {
  interface Window {
    __SANDBOX_PROBE__?: string;
  }
}

/**
 * Where the shells fetch this app from: its own dev server locally, a path on the deployed site.
 * Defined by webpack.config.js off its `deployBase` env, the same value it pins publicPath to.
 */
declare const __MICRO_APP_ENTRY__: string;

function WindowProbe({ m }: { m: Messages }) {
  const [value, setValue] = useState<string>();

  const run = () => {
    window.__SANDBOX_PROBE__ = 'webpack-app:' + Date.now();
    setValue(window.__SANDBOX_PROBE__);
  };

  return (
    <div className="probe">
      <button className="control" onClick={run}>
        {m.writeGlobal}
      </button>
      <div className="probe-result">
        <code className="mono">{value ? `window.__SANDBOX_PROBE__ = '${value}'` : m.globalUndefined}</code>
        <p className="probe-note">{m.globalNote}</p>
      </div>
    </div>
  );
}

function TimerProbe({ m }: { m: Messages }) {
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
        {m.leakTimer}
      </button>
      <div className="probe-result">
        <code className="mono">{ticks === undefined ? m.noInterval : m.ticks(ticks)}</code>
        <p className="probe-note">{m.timerNote}</p>
      </div>
    </div>
  );
}

function StyleProbe({ m }: { m: Messages }) {
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
        {m.tintBody}
      </button>
      <div className="probe-result">
        <code className="mono">{injected ? m.tinted(`${ACCENT}10`) : m.noStyle}</code>
        <p className="probe-note">{m.styleNote}</p>
      </div>
    </div>
  );
}

export default function App({ locale = 'en' }: { locale?: Locale }) {
  const m = messages[locale];
  const [count, setCount] = useState(0);
  const insideQiankun = Boolean(window.__POWERED_BY_QIANKUN__);

  return (
    <div className="webpack-app">
      <header className="header">
        <span className="accent-dot" aria-hidden="true" />
        <h1 className="title">{m.title}</h1>
        <span className="badge mono">react {React.version}</span>
        <span className="badge mono">webpack 5 · classic</span>
        <span className={insideQiankun ? 'badge mono badge-accent' : 'badge mono'}>
          {insideQiankun ? m.insideQiankun : m.standalone}
        </span>
      </header>

      <section className="card">
        <h2 className="card-title">{m.isolationLab}</h2>
        <WindowProbe m={m} />
        <TimerProbe m={m} />
        <StyleProbe m={m} />
      </section>

      <section className="card">
        <h2 className="card-title">{m.localState}</h2>
        <div className="probe">
          <button className="control" onClick={() => setCount((c) => c + 1)}>
            {m.countIs(count)}
          </button>
          <div className="probe-result">
            <p className="probe-note">{m.stateNote}</p>
          </div>
        </div>
      </section>

      <footer className="footer mono">
        {m.entry} {__MICRO_APP_ENTRY__} · {m.lifecycle}: src/index.tsx
      </footer>
    </div>
  );
}
