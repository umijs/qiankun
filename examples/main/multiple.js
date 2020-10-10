import { loadMicroApp } from '../../es';

const app1 = loadMicroApp(
  { name: 'react15', entry: '//localhost:7102', container: '#react15' },
  {
    sandbox: {
      // strictStyleIsolation: true,
    },
  },
);

// for cached scenario
setTimeout(() => {
  app1.unmount();

  setTimeout(() => {
    loadMicroApp({ name: 'react15', entry: '//localhost:7102', container: '#react15' });
  }, 1000 * 5);
}, 1000 * 5);

const app2 = loadMicroApp(
  { name: 'vue', entry: '//localhost:7101', container: '#vue' },
  {
    sandbox: {
      // strictStyleIsolation: true,
    },
  },
);
