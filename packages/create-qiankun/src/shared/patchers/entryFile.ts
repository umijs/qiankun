import path from 'node:path';
import fse from 'fs-extra';
import type { ViteTemplate } from '../types';
import { isReactTemplate, isTypeScriptTemplate } from '../types';

export async function writeEntryFile(appRoot: string, appName: string, template: ViteTemplate): Promise<void> {
  const isReact = isReactTemplate(template);
  const isTs = isTypeScriptTemplate(template);

  if (isReact) {
    await writeReactEntry(appRoot, appName, isTs);
  } else {
    await writeVueEntry(appRoot, appName, isTs);
  }
}

async function writeReactEntry(appRoot: string, appName: string, isTs: boolean): Promise<void> {
  const ext = isTs ? 'tsx' : 'jsx';
  const entryPath = path.join(appRoot, `src/main.${ext}`);

  const typeAnnotation = isTs ? ': ReactDOM.Root | undefined' : '';
  const propsType = isTs ? ': { container?: Element }' : '';
  const defaultPropsType = isTs ? ': { container?: Element } = {}' : ' = {}';

  const content = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const appName = '${appName}';
let root${typeAnnotation};

function render(props${defaultPropsType}) {
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) return;

  root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

export async function bootstrap() {
  return Promise.resolve();
}

export async function mount(props${propsType}) {
  render(props);
}

export async function unmount(props${propsType}) {
  if (root) {
    root.unmount();
    root = undefined;
  }
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (container) {
    container.innerHTML = '';
  }
}

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    [key: string]: unknown;
  }
}

if (window.__POWERED_BY_QIANKUN__) {
  window[appName] = { bootstrap, mount, unmount };
} else {
  render();
}
`;

  await fse.writeFile(entryPath, content, 'utf-8');
}

async function writeVueEntry(appRoot: string, appName: string, isTs: boolean): Promise<void> {
  const ext = isTs ? 'ts' : 'js';
  const entryPath = path.join(appRoot, `src/main.${ext}`);

  const typeAnnotation = isTs ? ': ReturnType<typeof createApp> | undefined' : '';
  const propsType = isTs ? ': { container?: Element }' : '';
  const defaultPropsType = isTs ? ': { container?: Element } = {}' : ' = {}';
  const declareGlobal = isTs
    ? `
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    [key: string]: unknown;
  }
}
`
    : '';

  const content = `import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

const appName = '${appName}';
let app${typeAnnotation};

function render(props${defaultPropsType}) {
  const container = props.container?.querySelector('#app') ?? document.getElementById('app');
  if (!container) return;

  app = createApp(App);
  app.mount(container);
}

export async function bootstrap() {
  return Promise.resolve();
}

export async function mount(props${propsType}) {
  render(props);
}

export async function unmount(props${propsType}) {
  if (app) {
    app.unmount();
    app = undefined;
  }
  const container = props.container?.querySelector('#app') ?? document.getElementById('app');
  if (container) {
    container.innerHTML = '';
  }
}
${declareGlobal}
if (window.__POWERED_BY_QIANKUN__) {
  window[appName] = { bootstrap, mount, unmount };
} else {
  render();
}
`;

  await fse.writeFile(entryPath, content, 'utf-8');
}
