import { v } from './modules/shared-collision.js';
import { slowTag } from './modules/delayed.js';

export async function bootstrap() {}

export async function mount(props) {
  const root = (props?.container ?? document).querySelector('#esm-root');
  const result = document.createElement('p');
  result.dataset.testid = 'esm-concurrent-result';
  result.textContent = `${v}:${slowTag}:${String(window.__SHARED_COLLISION_HISTORY__)}`;
  root.appendChild(result);
}

export async function unmount(props) {
  const root = (props?.container ?? document).querySelector('#esm-root');
  if (root) root.innerHTML = '';
}
