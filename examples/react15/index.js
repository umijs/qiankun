/**
 * @author Kuitos
 * @since 2019-05-16
 */
import './public-path';
import 'antd/dist/antd.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log('props from main framework', props);
  ReactDOM.render(<App />, document.getElementById('react15Root'));
  import('./dynamic.css').then(r => console.log(r));
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('react15Root'));
}

if (!window.__POWERED_BY_QIANKUN__) {
  bootstrap().then(mount);
}
