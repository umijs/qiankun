import { loadMicroApp } from '../../packages/qiankun/dist/esm';
import './index.less';

loadMicroApp(
  {
    name: 'vite',
    entry: '//localhost:5173',
    container: document.getElementById('subapp-container'),
  },
  { sandbox: false },
);
