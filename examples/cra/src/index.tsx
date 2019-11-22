import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props: any) {
  console.log('props from main framework', props);
  ReactDOM.render(<App />, document.getElementById('cra'));
}

export async function unmount() {
  const $cra = document.getElementById('cra');
  if ($cra) {
    ReactDOM.unmountComponentAtNode($cra);
  }
}

// fallback to global variable who named with ${appName} while module exports not found
window['cra'] = {
  bootstrap,
  mount,
  unmount,
};
