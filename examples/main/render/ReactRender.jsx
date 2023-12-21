import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MicroApp } from '../../../packages/ui-bindings/react/dist/esm/';
import '../index.less';

const root = ReactDOM.createRoot(
  document.getElementById('subapp-container'),
);
const sidemenu = document.querySelector('.mainapp-sidemenu');

const microApps = [
  { name: 'react15', entry: '//localhost:7102' },
  { name: 'react16', entry: '//localhost:7100' },
];

function App() {
  const [appName, setAppName] = useState('');

  const handleMenuClick = (e) => {
    const app = microApps.find((app) => app.name === e.target.dataset.value);
    if (app && app.name !== appName) {
      setAppName(app.name);
    } else {
      console.log('not found any app');
    }
  }

  useEffect(() => {
    sidemenu.addEventListener('click', handleMenuClick);

    return () => {
      sidemenu.removeEventListener('click', handleMenuClick);
    }
  }, []);

  if (appName) {
    const appEntry = microApps.find((app) => app.name === appName)?.entry;
    return <MicroApp name={appName} entry={appEntry} autoCaptureError />;
  }

  return null;
}

function reactRender() {
  // 将组件挂载到指定的节点上
  root.render(<App />);
}

reactRender();