import { registerMicroApps, start } from 'qiankun';
import { SUB_APP_ENTRIES } from '../../../ports';

const container = document.getElementById('register-root')!;

// hash-based activeRule keeps the static server free of SPA fallback concerns
registerMicroApps([
  {
    name: 'sub-classic',
    entry: SUB_APP_ENTRIES['sub-classic'],
    container,
    activeRule: (location) => location.hash.startsWith('#/classic'),
  },
  {
    name: 'sub-esm',
    entry: SUB_APP_ENTRIES['sub-esm'],
    container,
    activeRule: (location) => location.hash.startsWith('#/esm'),
  },
]);

start();
