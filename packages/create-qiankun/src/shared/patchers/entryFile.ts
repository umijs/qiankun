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
  const propsInterface = isTs
    ? `
interface MicroAppProps {
  container?: Element;
  qiankunVersion?: string;
}
`
    : '';
  const propsType = isTs ? ': MicroAppProps' : '';
  const defaultPropsType = isTs ? ': MicroAppProps = {}' : ' = {}';

  const content = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __QIANKUN_VERSION__?: string;
    [key: string]: unknown;
  }
}
${propsInterface}
let root${typeAnnotation};

function render(props${defaultPropsType}) {
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (!container) return;

  if (props.qiankunVersion) {
    window.__QIANKUN_VERSION__ = props.qiankunVersion;
  }

  const resolvedQiankunVersion = props.qiankunVersion ?? window.__QIANKUN_VERSION__;

  root = ReactDOM.createRoot(container, { identifierPrefix: '${appName}-' });
  root.render(
    <React.StrictMode>
      <App qiankunVersion={resolvedQiankunVersion} />
    </React.StrictMode>,
  );
}

function bootstrap() {
  console.log('[${appName}] bootstrap');
  return Promise.resolve();
}

function mount(props${defaultPropsType}) {
  console.log('[${appName}] mount', props);
  render(props);
  return Promise.resolve();
}

function unmount(props${propsType}) {
  console.log('[${appName}] unmount', props);
  if (root) {
    root.unmount();
    root = undefined;
  }
  const container = props.container?.querySelector('#root') ?? document.getElementById('root');
  if (container) {
    container.innerHTML = '';
  }
  return Promise.resolve();
}

export { bootstrap, mount, unmount };

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
`;

  await fse.writeFile(entryPath, content, 'utf-8');
}

async function writeVueEntry(appRoot: string, appName: string, isTs: boolean): Promise<void> {
  const ext = isTs ? 'ts' : 'js';
  const entryPath = path.join(appRoot, `src/main.${ext}`);

  const typeAnnotation = isTs ? ': ReturnType<typeof createApp> | undefined' : '';
  const propsInterface = isTs
    ? `
interface MicroAppProps {
  container?: Element;
  qiankunVersion?: string;
}
`
    : '';
  const propsType = isTs ? ': MicroAppProps' : '';
  const defaultPropsType = isTs ? ': MicroAppProps = {}' : ' = {}';
  const declareGlobal = isTs
    ? `
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __QIANKUN_VERSION__?: string;
    [key: string]: unknown;
  }
}
`
    : '';

  const content = `import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
${declareGlobal}${propsInterface}
let app${typeAnnotation};

function render(props${defaultPropsType}) {
  const container = props.container?.querySelector('#app') ?? document.getElementById('app');
  if (!container) return;

  if (props.qiankunVersion) {
    window.__QIANKUN_VERSION__ = props.qiankunVersion;
  }

  const resolvedQiankunVersion = props.qiankunVersion ?? window.__QIANKUN_VERSION__ ?? 'N/A';

  app = createApp(App, { qiankunVersion: resolvedQiankunVersion });
  app.config.idPrefix = '${appName}-';
  app.mount(container);
}

function bootstrap() {
  console.log('[${appName}] bootstrap');
  return Promise.resolve();
}

function mount(props${defaultPropsType}) {
  console.log('[${appName}] mount', props);
  render(props);
  return Promise.resolve();
}

function unmount(props${propsType}) {
  console.log('[${appName}] unmount', props);
  if (app) {
    app.unmount();
    app = undefined;
  }
  const container = props.container?.querySelector('#app') ?? document.getElementById('app');
  if (container) {
    container.innerHTML = '';
  }
  return Promise.resolve();
}

export { bootstrap, mount, unmount };

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
`;

  await fse.writeFile(entryPath, content, 'utf-8');
}
