import { createSandbox, type SandboxController } from '@qiankunjs/sandbox';
import widgetScriptUrl from './third-party-widget.js?url';
import './styles.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Standalone sandbox demo root was not found');

app.innerHTML = `
  <main class="lab-shell">
    <header class="masthead">
      <p class="wordmark">Standalone sandbox lab</p>
      <span class="package-name">@qiankunjs/sandbox · no qiankun · no loader</span>
    </header>

    <section class="intro" aria-labelledby="page-title">
      <div>
        <p class="eyebrow">A browser containment experiment</p>
        <h1 id="page-title">Run foreign code. Keep the boundary visible.</h1>
        <p class="intro-copy">
          This page fetches a local classic script, evaluates it through a standalone sandbox, and lets that
          script create DOM, styles, a timer, and a window listener. The ledger below reports what crosses back
          into the host realm.
        </p>
      </div>

      <aside class="host-card" aria-labelledby="host-probe-title">
        <h2 id="host-probe-title">Host realm control</h2>
        <p class="shared-label" data-host-shared-label>.shared-label stays purple outside the boundary.</p>
        <p class="host-note">
          The widget injects a coral rule for this exact class name. Runtime style isolation should keep this
          control unchanged.
        </p>
      </aside>
    </section>

    <section aria-label="Sandbox controls and evidence">
      <div class="control-strip">
        <button class="primary" type="button" data-action="run">Run local widget</button>
        <button type="button" data-action="ping" disabled>Send host ping</button>
        <button class="danger" type="button" data-action="dispose" disabled>Dispose sandbox</button>
        <span class="controller-state" data-controller-state data-state="idle">Idle</span>
      </div>

      <div class="workbench">
        <div class="metrics" aria-live="polite">
          <div class="metric">
            <span class="metric-label">Host global</span>
            <strong class="metric-value good" data-metric="global">Absent</strong>
          </div>
          <div class="metric">
            <span class="metric-label">Shared style</span>
            <strong class="metric-value good" data-metric="style">Unchanged</strong>
          </div>
          <div class="metric">
            <span class="metric-label">Widget ticks</span>
            <strong class="metric-value" data-metric="ticks">0</strong>
          </div>
          <div class="metric">
            <span class="metric-label">Ping replies</span>
            <strong class="metric-value" data-metric="acks">0</strong>
          </div>
        </div>

        <div class="boundary-section">
          <div class="boundary-frame">
            <span class="boundary-label">DOM + style containment boundary</span>
            <div id="sandbox-container"></div>
          </div>
        </div>

        <div class="evidence-grid">
          <div class="code-panel">
            <span class="code-caption">The complete host integration</span>
            <pre><code>const controller = createSandbox('pulseboard-widget', {
  container,
  styleIsolation: true,
});

await controller.mount();
const source = await fetch('./third-party-widget.js').then(r =&gt; r.text());
await controller.instance.evaluateScript(source);

// Releases timers, listeners, DOM patches, and the Compartment.
await controller.dispose();</code></pre>
          </div>

          <div class="log-panel">
            <h2>Boundary log</h2>
            <ol class="activity-log" data-activity-log aria-live="polite"></ol>
          </div>
        </div>
      </div>
    </section>
  </main>
`;

function getRequiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Required demo element not found: ${selector}`);
  return element;
}

const container = getRequiredElement<HTMLDivElement>('#sandbox-container');
const hostSharedLabel = getRequiredElement<HTMLElement>('[data-host-shared-label]');
const runButton = getRequiredElement<HTMLButtonElement>('[data-action="run"]');
const pingButton = getRequiredElement<HTMLButtonElement>('[data-action="ping"]');
const disposeButton = getRequiredElement<HTMLButtonElement>('[data-action="dispose"]');
const controllerState = getRequiredElement<HTMLElement>('[data-controller-state]');
const activityLog = getRequiredElement<HTMLOListElement>('[data-activity-log]');
const globalMetric = getRequiredElement<HTMLElement>('[data-metric="global"]');
const styleMetric = getRequiredElement<HTMLElement>('[data-metric="style"]');
const tickMetric = getRequiredElement<HTMLElement>('[data-metric="ticks"]');
const ackMetric = getRequiredElement<HTMLElement>('[data-metric="acks"]');
const hostLabelColor = getComputedStyle(hostSharedLabel).color;

let controller: SandboxController | undefined;
let tickCount = 0;
let ackCount = 0;
let timerCleanupProbe = 0;

function formatTime(): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
}

function log(message: string): void {
  const entry = document.createElement('li');
  const time = document.createElement('span');
  const copy = document.createElement('span');
  time.className = 'log-time';
  time.textContent = formatTime();
  copy.textContent = message;
  entry.append(time, copy);
  activityLog.prepend(entry);

  while (activityLog.children.length > 8) {
    activityLog.lastElementChild?.remove();
  }
}

function setControllerState(state: 'idle' | 'loading' | 'running' | 'disposed' | 'failed'): void {
  controllerState.dataset.state = state;
  controllerState.textContent = state === 'loading' ? 'Loading local script' : state;
  const isRunning = state === 'running';
  runButton.disabled = isRunning || state === 'loading';
  pingButton.disabled = !isRunning;
  disposeButton.disabled = !isRunning;
}

function refreshIsolationMetrics(): void {
  const hostWasPolluted = Reflect.has(window, '__STANDALONE_WIDGET__');
  globalMetric.textContent = hostWasPolluted ? 'Present' : 'Absent';
  globalMetric.classList.toggle('good', !hostWasPolluted);

  const hostStyleWasChanged = getComputedStyle(hostSharedLabel).color !== hostLabelColor;
  styleMetric.textContent = hostStyleWasChanged ? 'Leaked' : 'Unchanged';
  styleMetric.classList.toggle('good', !hostStyleWasChanged);
  tickMetric.textContent = String(tickCount);
  ackMetric.textContent = String(ackCount);
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function runWidget(): Promise<void> {
  if (controller) return;

  timerCleanupProbe += 1;
  delete controllerState.dataset.timerCleanup;
  container.replaceChildren();
  delete container.dataset.esmStatus;
  tickCount = 0;
  ackCount = 0;
  refreshIsolationMetrics();
  setControllerState('loading');
  log('Created a fresh mount point for the local third-party widget.');

  let nextController: SandboxController | undefined;
  try {
    nextController = createSandbox('pulseboard-widget', {
      container,
      styleIsolation: true,
    });
    await nextController.mount();
    log('Mounted the DOM, timer, listener, and style-isolation plugins.');

    const response = await fetch(widgetScriptUrl);
    if (!response.ok) {
      throw new Error(`Widget source request failed with ${String(response.status)}`);
    }
    const source = await response.text();
    await nextController.instance.evaluateScript(source, { sourceURL: widgetScriptUrl });
    // resolved against this document, not the origin root: e2e serves this build from a server
    // root while the deployed site serves it from /standalone-sandbox/
    const moduleNamespace = await nextController.instance.import(
      new URL('./standalone-module.js', window.location.href).href,
    );
    container.dataset.esmStatus = String(moduleNamespace.status);
    controller = nextController;

    refreshIsolationMetrics();
    setControllerState('running');
    log('Classic script evaluated through a blob URL inside the sandbox global.');
    log('Dynamic DOM and the coral .shared-label rule stayed inside the marked boundary.');
  } catch (error) {
    try {
      await nextController?.dispose();
    } catch {
      // Preserve the actionable evaluation error in the UI.
    }
    controller = undefined;
    container.replaceChildren();
    setControllerState('failed');
    log(`Run failed: ${describeError(error)}`);
  }
}

async function disposeWidget(): Promise<void> {
  const activeController = controller;
  if (!activeController) return;

  controller = undefined;
  setControllerState('loading');
  const acknowledgementsBeforeDispose = ackCount;

  try {
    await activeController.dispose();
    const ticksAfterDispose = tickCount;
    const currentProbe = ++timerCleanupProbe;
    container.replaceChildren();
    delete container.dataset.esmStatus;
    window.dispatchEvent(new Event('standalone-widget:ping'));
    await Promise.resolve();

    setControllerState('disposed');
    controllerState.dataset.timerCleanup = 'checking';
    refreshIsolationMetrics();
    log('Disposed the controller and cleared the caller-owned mount point.');
    log(
      ackCount === acknowledgementsBeforeDispose
        ? 'The disposed widget listener ignored a post-dispose host ping.'
        : 'The post-dispose listener probe unexpectedly received a reply.',
    );
    window.setTimeout(() => {
      if (currentProbe !== timerCleanupProbe) return;
      const timerStopped = tickCount === ticksAfterDispose;
      controllerState.dataset.timerCleanup = timerStopped ? 'stopped' : 'leaked';
      log(
        timerStopped
          ? 'The widget timer stayed stopped for a complete interval after disposal.'
          : 'The widget timer continued after disposal.',
      );
    }, 1200);
  } catch (error) {
    setControllerState('failed');
    log(`Dispose failed: ${describeError(error)}`);
  }
}

window.addEventListener('standalone-widget:tick', (event) => {
  const { ticks } = (event as CustomEvent<{ ticks: number }>).detail;
  tickCount = ticks;
  refreshIsolationMetrics();
});

window.addEventListener('standalone-widget:ack', (event) => {
  const { pingCount } = (event as CustomEvent<{ pingCount: number }>).detail;
  ackCount = pingCount;
  refreshIsolationMetrics();
  log(`The sandboxed listener replied to host ping ${String(pingCount)}.`);
});

runButton.addEventListener('click', () => {
  void runWidget();
});

pingButton.addEventListener('click', () => {
  window.dispatchEvent(new Event('standalone-widget:ping'));
  log('Host dispatched standalone-widget:ping.');
});

disposeButton.addEventListener('click', () => {
  void disposeWidget();
});

log('Ready. The example imports only @qiankunjs/sandbox.');
refreshIsolationMetrics();
void runWidget();
