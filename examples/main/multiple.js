import { loadMicroApp } from '../../packages/qiankun/dist/esm';

let app;

function mount() {
  app = loadMicroApp(
    { name: 'react18', entry: '//localhost:3000', container: '#react18' },
    { sandbox: { experimentalStyleIsolation: true } },
  );
}

function unmount() {
  app.unmount();
}

document.querySelector('#mount').addEventListener('click', mount);
document.querySelector('#unmount').addEventListener('click', unmount);

loadMicroApp({ name: 'vue', entry: '//localhost:3002', container: '#vue' });
