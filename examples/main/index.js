import { loadMicroApp } from '../../packages/qiankun/dist/esm';
import './index.less';

// loadMicroApp(
//   {
//     name: 'vite',
//     entry: '//localhost:5173',
//     container: document.getElementById('subapp-container'),
//   },
//   { sandbox: false },
// );

const microApp = loadMicroApp(
  {
    name: 'react15',
    entry: '//localhost:7102',
    container: document.getElementById('subapp-container'),
  },
  { sandbox: true },
);

document.getElementById('switch').addEventListener('click', () => {
  const status = microApp.getStatus();
  switch (status) {
    case 'MOUNTED':
      microApp.unmount();
      break;
    case 'NOT_MOUNTED':
      microApp.mount();
      break;
  }
});
