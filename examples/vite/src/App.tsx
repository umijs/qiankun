import { useState, version as reactVersion } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import vitePackage from 'vite/package.json';
import './App.css';

interface AppProps {
  qiankunVersion?: string;
}

function App({ qiankunVersion }: AppProps) {
  const [count, setCount] = useState(0);
  const runtime = window.__POWERED_BY_QIANKUN__ ? 'qiankun' : 'standalone';
  const resolvedQiankunVersion = qiankunVersion ?? 'N/A';

  return (
    <main className="micro-shell micro-shell--vite">
      <header className="micro-header card micro-hero">
        <div className="badge-row">
          <span className="badge">Vite + React</span>
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
        <h1>Vite React Micro App</h1>
        <p>完整展示 React 与 Vite 版本信息的现代化子应用界面</p>
      </header>

      <section className="card">
        <dl className="stats-grid">
          <div className="stat-item">
            <dt>Framework</dt>
            <dd>React {reactVersion}</dd>
          </div>
          <div className="stat-item">
            <dt>Bundler</dt>
            <dd>Vite {vitePackage.version}</dd>
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
        <p className="hint">该应用展示 Vite 最新栈下的 qiankun 子应用挂载能力。</p>
      </section>
    </main>
  );
}

export default App;
