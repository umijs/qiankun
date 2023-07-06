import { loadMicroApp } from '../../packages/qiankun/dist/esm';
// import { loadMicroApp } from 'qiankun';

import './index.less';

// document.querySelector('.mainapp-sidemenu').addEventListener('click', (e) => {
//   window.startTime = Date.now();
//   loadMicroApp(
//     {
//       name: 'react15',
//       entry: '//localhost:7102',
//       container: document.querySelector('#subapp-container'),
//     },
//     { sandbox: true },
//   );
// });

window.startTime = Date.now();
loadMicroApp(
  {
    name: 'react15',
    entry: '//localhost:7102',
    container: document.querySelector('#subapp-container'),
  },
  { sandbox: true },
);
