import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './public-path';
import * as serviceWorker from './serviceWorker';

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log(props);
  render();
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
