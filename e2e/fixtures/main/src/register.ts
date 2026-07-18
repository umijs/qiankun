import { registerMicroApps, start } from 'qiankun';
import { SUB_APP_ENTRIES } from '../../../ports';

const container = document.getElementById('register-root')!;

// hash-based activeRule keeps the static server free of SPA fallback concerns
registerMicroApps([
  {
    name: 'sub-classic',
    entry: SUB_APP_ENTRIES['sub-classic'],
    container,
    activeRule: (location: Location) => location.hash.startsWith('#/classic'),
  },
  {
    name: 'sub-esm',
    entry: SUB_APP_ENTRIES['sub-esm'],
    container,
    activeRule: (location: Location) => location.hash.startsWith('#/esm'),
  },
  {
    name: 'sub-classic-multiscript',
    entry: SUB_APP_ENTRIES['sub-classic-multiscript'],
    container,
    activeRule: (location: Location) => location.hash.startsWith('#/multiscript'),
  },
]);

start();
