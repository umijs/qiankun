import React from 'react';
import ReactDOM from 'react-dom';
import { MicroApp } from '@qiankunjs/react-binding';
import './index.less';

const microApps = [
  { name: 'react15', entry: '//localhost:7102' },
  { name: 'react16', entry: '//localhost:7100' },
];

let prevAppName;
document.querySelector('.mainapp-sidemenu').addEventListener('click', async (e) => {
  window.startTime = Date.now();

  const app = microApps.find((app) => app.name === e.target.dataset.value);
  if (app) {
    if (app.name === prevAppName) return;

    ReactDOM.render(
      <MicroApp name={app.name} entry={app.entry} autoSetLoading />,
      document.querySelector('#subapp-container'),
    );

    prevAppName = app.name;
  } else {
    console.log('not found any app');
  }
});
