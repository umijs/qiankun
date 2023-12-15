import { loadMicroApp } from '../../packages/qiankun/dist/esm';
// import { loadMicroApp } from 'qiankun';
import './index.less';

const microApps = [
  { name: 'react15', entry: '//localhost:7102' },
  { name: 'react16', entry: '//localhost:7100' },
];

let prevApp;
let prevAppName;
document.querySelector('.mainapp-sidemenu').addEventListener('click', async (e) => {
  window.startTime = Date.now();
  const app = microApps.find((app) => app.name === e.target.dataset.value);
  if (app) {
    if (app.name === prevAppName) return;

    await prevApp?.unmount();

    prevApp = loadMicroApp(
      {
        name: app.name,
        entry: app.entry,
        container: document.querySelector('#subapp-container'),
      },
      { sandbox: true },
    );
    prevAppName = app.name;
  } else {
    console.log('not found any app');
  }
});

// document.querySelector('[data-value=react15]').click();
