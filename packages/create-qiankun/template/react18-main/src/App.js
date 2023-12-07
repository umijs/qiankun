import './App.css';
import subApplication from './microApp/subs.json';
import { loadMicroApp } from 'qiankun';
import { useRef } from 'react';

function App() {
  const preLoad = useRef(null);
  const preLoadAppName = useRef(null);
  async function changeRouterAndLoadApp(app) {
    if (preLoadAppName.current === app.name) return;

    if (preLoad.current) {
      await preLoad.current.unmount();
    }

    preLoad.current = loadMicroApp({
      name: app.name,
      entry: app.entry,
      container: document.querySelector('#subapp-container'),
    });

    preLoadAppName.current = app.name;

    window.history.pushState(null, '', app.activeRule);
  }

  return (
    <div className="App">
      <div className="mainapp">
        <header className="mainapp-head">
          <h1>QianKun</h1>
        </header>
        <div className="mainapp-main">
          <ul className="mainapp-sidemenu">
            {subApplication.map((app, i) => {
              return (
                <li key={i} onClick={() => changeRouterAndLoadApp(app)}>
                  {app.name}
                </li>
              );
            })}
          </ul>
          {/* <!-- 子应用  --> */}
          <main id="subapp-container"></main>
        </div>
      </div>
    </div>
  );
}

export default App;
