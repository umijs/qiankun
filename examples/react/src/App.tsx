import { useRef, useState, version } from 'react';
import './App.css';

const ACCENT = '#087EA4';

export default function App() {
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
        <h1>React micro app</h1>
        <div className="badges">
          <span className="badge">react {version}</span>
          <span className="badge">vite · esm</span>
          <span className={poweredByQiankun ? 'badge badge-live' : 'badge'}>
            {poweredByQiankun ? 'inside qiankun' : 'standalone'}
          </span>
        </div>
      </header>

      <section className="card">
        <h2>Isolation lab</h2>
        <div className="probe">
          <button type="button" onClick={writeWindowProbe}>
            Write window global
          </button>
          <div className="probe-result">
            <output>{probeValue ? `window.__SANDBOX_PROBE__ = '${probeValue}'` : 'window.__SANDBOX_PROBE__ is unset'}</output>
            <p>Proves globals stay inside this app's membrane — the host window never sees them.</p>
          </div>
        </div>
        <div className="probe">
          <button type="button" onClick={startTimerProbe}>
            Start leaky interval
          </button>
          <div className="probe-result">
            <output>{ticks === null ? 'no interval running' : `tick ${ticks}`}</output>
            <p>Never cleared here — proves qiankun reclaims leaked timers on unmount.</p>
          </div>
        </div>
        <div className="probe">
          <button type="button" onClick={injectStyleProbe}>
            Tint body background
          </button>
          <div className="probe-result">
            <output>{tinted ? 'style[data-probe] appended to document.head' : 'no probe style injected'}</output>
            <p>Tints body — proves style isolation keeps the tint inside this app.</p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Local state</h2>
        <div className="counter">
          <button type="button" onClick={() => setCount((c) => c - 1)}>
            −
          </button>
          <span className="counter-value">{count}</span>
          <button type="button" onClick={() => setCount((c) => c + 1)}>
            +
          </button>
          <p>useState lives and dies with this app instance.</p>
        </div>
      </section>

      <footer className="app-footer">entry //localhost:7100 · lifecycle: src/main.tsx</footer>
    </div>
  );
}
