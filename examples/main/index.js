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

loadMicroApp(
  {
    name: 'react15',
    entry: '//localhost:7102',
    container: document.getElementById('subapp-container-react'),
  },
  { sandbox: true },
);
