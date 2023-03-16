import { loadMicroApp } from '../../packages/qiankun/dist/esm';
import './index.less';

loadMicroApp({
  name: 'react',
  entry: '//localhost:7102',
  container: document.getElementById('subapp-container'),
});
