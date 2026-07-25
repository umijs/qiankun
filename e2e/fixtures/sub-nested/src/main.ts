/**
 * Nested sub app: a classic (UMD-shaped) app that is itself a qiankun host — it bundles its own
 * copy of qiankun and loads another sub app into a container inside its own DOM.
 *
 * The point of the fixture is attribution under nesting: every DOM API this app and its inner app
 * touch goes through a *chain* of proxied documents (inner sandbox → outer sandbox → real), so the
 * styles each one injects must still be owned by the app whose container receives them.
 */
import { loadMicroApp, type MicroApp } from 'qiankun';
import { SUB_APP_ENTRIES } from '../../../ports';

// pollute the outer app's sandboxed window; must stay invisible to the main realm
(window as unknown as Record<string, unknown>).__NESTED_OUTER_POLLUTION__ = 'from-sub-nested';

const INNER_APP_NAME = 'nested-inner';

let innerApp: MicroApp | undefined;
let outerStyleInjected = false;

function injectOuterStyle(): void {
  if (outerStyleInjected) return;
  // created through the outer sandbox's document and appended to the outer virtual head
  const style = document.createElement('style');
  style.setAttribute('data-testid', 'nested-outer-style');
  style.textContent = '.nested-outer-target { color: rgb(41, 42, 43) }';
  document.head.appendChild(style);
  outerStyleInjected = true;
}

const lifecycles = {
  bootstrap(): Promise<void> {
    return Promise.resolve();
  },
  async mount(): Promise<void> {
    injectOuterStyle();

    const container = document.querySelector<HTMLElement>('#nested-inner-container');
    if (!container) throw new Error('nested inner container was not found');

    innerApp = loadMicroApp(
      { name: INNER_APP_NAME, entry: SUB_APP_ENTRIES['sub-classic-bodyless'], container },
      { sandbox: { styleIsolation: true } },
    );
    await innerApp.mountPromise;

    // Created in the OUTER app's realm, then handed to the INNER app's container — the shape a
    // host takes when it decorates a child app's mount node. Ownership must follow the container
    // that receives the node, so this rule has to be scoped to the inner app, not to this one.
    const crossTarget = document.createElement('p');
    crossTarget.className = 'nested-cross-target';
    crossTarget.setAttribute('data-testid', 'nested-cross-target');
    crossTarget.textContent = 'inserted by the outer app into the inner container';
    container.appendChild(crossTarget);

    const crossStyle = document.createElement('style');
    crossStyle.setAttribute('data-testid', 'nested-cross-style');
    crossStyle.textContent = '.nested-cross-target { color: rgb(51, 52, 53) }';
    container.appendChild(crossStyle);
  },
  async unmount(): Promise<void> {
    await innerApp?.unmount();
    innerApp = undefined;
  },
};

// must stay the last global write of the entry script: the sandbox reports it as the app's export
(window as unknown as Record<string, unknown>)['sub-nested'] = lifecycles;
