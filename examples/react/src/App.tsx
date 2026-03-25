import { useState, version } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const runtime = window.__POWERED_BY_QIANKUN__ ? 'qiankun' : 'standalone';

  return (
    <main className="micro-shell">
      <header className="micro-header">
        <div className="logo-group">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>React Micro App</h1>
        <p>统一现代化子应用界面 · React {version}</p>
      </header>

      <section className="card">
        <dl>
          <div>
            <dt>Framework</dt>
            <dd>React {version}</dd>
          </div>
          <div>
            <dt>Bundler</dt>
            <dd>Vite 8</dd>
          </div>
          <div>
            <dt>Runtime</dt>
            <dd>{runtime}</dd>
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
