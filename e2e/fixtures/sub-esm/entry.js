/**
 * Native ESM sub app: lifecycles exported from the entry module namespace,
 * picked up by the qiankun ESM sandbox engine.
 */
import { getCount, increment } from './modules/counter.js';
import { readSelfFlag } from './modules/flags.js';

// pollute the sandboxed window; must never be visible from the main realm
window.__ESM_POLLUTION__ = 'from-sub-esm';

let mountCount = 0;

export async function bootstrap() {}

export async function mount(props) {
  mountCount += 1;
  increment();
  const root = (props?.container ?? document).querySelector('#esm-root');
  root.innerHTML = [
    '<h2 data-testid="esm-title">esm mounted</h2>',
    // getCount() proves the imported module executed in the same sandboxed graph
    `<p data-testid="esm-counters">mount:${mountCount},importedCount:${getCount()}</p>`,
    `<p data-testid="esm-main-global">${String(window.__MAIN_GLOBAL__)}</p>`,
    // bare dunder reads: __RUNTIME_FLAG__ was created at runtime by another module,
    // readSelfFlag() reads a flag written after its own module bindings were created
    `<p data-testid="esm-flags">runtime:${__RUNTIME_FLAG__},self:${readSelfFlag()}</p>`,
  ].join('');
}

export async function unmount(props) {
  const root = (props?.container ?? document).querySelector('#esm-root');
  if (root) root.innerHTML = '';
}

// standalone mode for local debugging
if (!window.__POWERED_BY_QIANKUN__) {
  void mount({});
}
