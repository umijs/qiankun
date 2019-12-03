/**
 * @author Kuitos
 * @since 2019-05-16
 */
import 'antd/dist/antd.min.css';
import loadjs from 'loadjs';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

(async () => {
  console.log('pre loadjs');
  await loadjs(['https://gw.alipayobjects.com/os/lib/react/16.9.0/umd/react.production.min.js'], {
    returnPromise: true,
  });
  console.log('loadjs done');
})();

(async () => {
  console.log('pre load');
  await toast.js('https://gw.alipayobjects.com/os/lib/react-dom/16.12.0/umd/react-dom.production.min.js');
  console.log('done');
})();

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log('props from main framework', props);
  ReactDOM.render(<App />, document.getElementById('react15Root'));
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('react15Root'));
}
