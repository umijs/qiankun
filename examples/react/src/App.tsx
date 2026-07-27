import { useRef, useState, version } from 'react';
import './App.css';
import { messages, type Locale } from './i18n';

const ACCENT = '#087EA4';

/**
 * Where the shells fetch this app from: its own dev server locally, a path on the deployed site
 * (`pages` is the mode `scripts/build-examples-site.mjs` builds with, and it sets Vite's base).
 */
const ENTRY = import.meta.env.MODE === 'pages' ? import.meta.env.BASE_URL : '//localhost:7100';

export default function App({ locale = 'en' }: { locale?: Locale }) {
  const m = messages[locale];
  const poweredByQiankun = !!window.__POWERED_BY_QIANKUN__;

  const [probeValue, setProbeValue] = useState('');
  const [ticks, setTicks] = useState<number | null>(null);
  const [tinted, setTinted] = useState(false);
  const [count, setCount] = useState(0);
  const timerStarted = useRef(false);

  const writeWindowProbe = () => {
    window.__SANDBOX_PROBE__ = 'react:' + Date.now();
    setProbeValue(String(window.__SANDBOX_PROBE__));
  };

  const startTimerProbe = () => {
    if (timerStarted.current) return;
    timerStarted.current = true;
    setTicks(0);
    // deliberately never cleared — qiankun reclaims the leaked interval on unmount
    setInterval(() => setTicks((t) => (t ?? 0) + 1), 1000);
  };

  const injectStyleProbe = () => {
    if (tinted) return;
    const style = document.createElement('style');
    style.dataset.probe = '';
    // body tints the whole page when standalone; under style isolation the body rule is
    // scoped away and only the app root (inside the @scope boundary) picks up the tint
    style.textContent = `body, .react-app { background: ${ACCENT}10 !important }`;
    document.head.appendChild(style);
    setTinted(true);
  };

  return (
    <div className="react-app">
      <header className="app-header">
        <span className="accent-dot" aria-hidden="true" />
        <h1>{m.title}</h1>
        <div className="badges">
          <span className="badge">react {version}</span>
          <span className="badge">vite · esm</span>
          <span className={poweredByQiankun ? 'badge badge-live' : 'badge'}>
            {poweredByQiankun ? m.insideQiankun : m.standalone}
          </span>
        </div>
      </header>

      <section className="card">
        <h2>{m.isolationLab}</h2>
        <div className="probe">
          <button type="button" onClick={writeWindowProbe}>
            {m.writeGlobal}
          </button>
          <div className="probe-result">
            <output>{probeValue ? `window.__SANDBOX_PROBE__ = '${probeValue}'` : m.globalUnset}</output>
            <p>{m.globalNote}</p>
          </div>
        </div>
        <div className="probe">
          <button type="button" onClick={startTimerProbe}>
            {m.startInterval}
          </button>
          <div className="probe-result">
            <output>{ticks === null ? m.noInterval : m.tick(ticks)}</output>
            <p>{m.intervalNote}</p>
          </div>
        </div>
        <div className="probe">
          <button type="button" onClick={injectStyleProbe}>
            {m.tintBody}
          </button>
          <div className="probe-result">
            <output>{tinted ? m.styleInjected : m.noStyle}</output>
            <p>{m.styleNote}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>{m.localState}</h2>
        <div className="counter">
          <button type="button" onClick={() => setCount((c) => c - 1)}>
            −
          </button>
          <span className="counter-value">{count}</span>
          <button type="button" onClick={() => setCount((c) => c + 1)}>
            +
          </button>
          <p>{m.stateNote}</p>
        </div>
      </section>

      <footer className="app-footer">
        {m.entry} {ENTRY} · {m.lifecycle}: src/main.tsx
      </footer>
    </div>
  );
}
