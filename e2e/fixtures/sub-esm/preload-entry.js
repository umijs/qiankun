/**
 * ESM sub app variant whose HTML carries a <link rel="modulepreload"> for its dep.
 * The e2e case asserts the ESM sandbox rewrites it to a preload-as-fetch warm-up
 * whose response the module pipeline picks up from the browser preload cache
 * (exactly one server hit for the dep).
 */
import { marker } from './modules/preloaded.js';

export async function bootstrap() {}

export async function mount(props) {
  const root = (props?.container ?? document).querySelector('#esm-preload-root');
  root.innerHTML = `<p data-testid="esm-preload-marker">preloaded:${marker}</p>`;
}

export async function unmount(props) {
  const root = (props?.container ?? document).querySelector('#esm-preload-root');
  if (root) root.innerHTML = '';
}

// standalone mode for local debugging
if (!window.__POWERED_BY_QIANKUN__) {
  void mount({});
}
