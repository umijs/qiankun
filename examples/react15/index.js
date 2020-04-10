/**
 * @author Kuitos
 * @since 2019-05-16
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './public-path';

import 'antd/dist/antd.min.css';
import './index.css';

function storeTest(props) {
  props.onGlobalStateChange((value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev), true);
  props.setGlobalState({
    ignore: props.name,
    user: {
      name: props.name,
    },
  });
}

export async function bootstrap() {
  console.log('[react15] react app bootstraped');
}

export async function mount(props) {
  console.log('[react15] props from main framework', props);
  storeTest(props);

  ReactDOM.render(<App />, document.getElementById('react15Root'));
  import('./dynamic.css').then(() => {
    console.log('[react15] dynamic style load');
  });
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('react15Root'));
}

if (!window.__POWERED_BY_QIANKUN__) {
  bootstrap().then(mount);
}
