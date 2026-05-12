import { useState, version } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import './App.css';

interface AppProps {
  qiankunVersion?: string;
}

function App({ qiankunVersion }: AppProps) {
  const [count, setCount] = useState(0);
  const runtime = window.__POWERED_BY_QIANKUN__ ? 'qiankun' : 'standalone';
  const resolvedQiankunVersion = qiankunVersion ?? 'N/A';

  return (
    <main className="micro-shell micro-shell--react">
      <header className="micro-header card micro-hero">
        <div className="badge-row">
          <span className="badge">React</span>
          <span className="badge badge-soft">qiankun {resolvedQiankunVersion}</span>
          <span className="badge badge-soft">{runtime}</span>
        </div>
        <div className="logo-group">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>React Micro App</h1>
        <p>清晰的信息层级、现代化卡片布局与更强可读性 · React {version}</p>
      </header>

      <section className="card">
        <dl className="stats-grid">
          <div className="stat-item">
            <dt>Framework</dt>
            <dd>React {version}</dd>
          </div>
          <div className="stat-item">
            <dt>Bundler</dt>
            <dd>Vite 8</dd>
          </div>
          <div className="stat-item">
            <dt>Runtime</dt>
            <dd>{runtime}</dd>
          </div>
          <div className="stat-item">
            <dt>qiankun</dt>
            <dd>{resolvedQiankunVersion}</dd>
          </div>
        </dl>

        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Counter · {count}
        </button>
        <p className="hint">该应用可独立运行，也可被主应用通过 qiankun 生命周期挂载。</p>
      </section>
    </main>
  );
}

export default App;
