/**
 * @author Kuitos
 * @since 2019-05-16
 */
import './public-path';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'antd/dist/antd.min.css';
import './index.css';

export async function bootstrap() {
  console.log('[react15] react app bootstraped');
}

export async function mount(props = {}) {
  console.log('[react15] props from main framework', props);
  const { container } = props;
  ReactDOM.render(
    <App />,
    container ? container.querySelector('#react15Root') : document.getElementById('react15Root'),
  );
  import('./dynamic.css').then(() => {
    console.log('[react15] dynamic style load');
  });
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#react15Root') : document.getElementById('react15Root'),
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  bootstrap().then(mount);
}
