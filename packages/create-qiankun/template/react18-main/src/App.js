import './App.css';
import subApplication from './microApp/subs.json';
import { loadMicroApp } from 'qiankun';
import { useState } from 'react';
import { Menu } from 'antd';

const menuItems = subApplication.map(({ name }) => ({ key: name, label: name }))

function App() {
  const [preLoadApp, setPreLoadApp] = useState(null);

  async function changeRouterAndLoadApp({ key }) {
    const app = subApplication.find(item => item.name === key)
    if (!app || preLoadApp?.name === app.name) return;

    if (preLoadApp) {
      await preLoadApp.unmount();
    }

    const microApp = loadMicroApp({
      name: app.name,
      entry: app.entry,
      container: document.querySelector('#subapp-container'),
    });
    setPreLoadApp(microApp)

    window.history.pushState(null, '', app.activeRule);
  }

  return (
    <div className="app">
      <div className="main-app-title">QianKun</div>
      <div className="main-app-menu">
        <Menu
          mode="inline"
          onSelect={changeRouterAndLoadApp}
          style={{ width: '100%', height: '100%' }}
          items={menuItems}
        />
      </div>
      <div id="subapp-container"></div>
    </div>
  );
}

export default App;
