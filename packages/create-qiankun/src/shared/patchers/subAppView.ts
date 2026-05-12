import path from 'node:path';
import fse from 'fs-extra';
import type { ViteTemplate } from '../types';
import { isReactTemplate, isTypeScriptTemplate } from '../types';
import { QIANKUN_VERSION } from '../versions';

export async function writeSubAppView(appRoot: string, template: ViteTemplate): Promise<void> {
  if (isReactTemplate(template)) {
    await writeReactAppComponent(appRoot, isTypeScriptTemplate(template));
    await writeReactAppStyles(appRoot);
    return;
  }

  await writeVueAppComponent(appRoot, isTypeScriptTemplate(template));
}

async function writeReactAppComponent(appRoot: string, isTs: boolean): Promise<void> {
  const ext = isTs ? 'tsx' : 'jsx';
  const appPath = path.join(appRoot, `src/App.${ext}`);

  const propsType = isTs
    ? `interface AppProps {
  qiankunVersion?: string;
}

`
    : '';
  const functionArgs = isTs ? '{ qiankunVersion }: AppProps' : '{ qiankunVersion }';

  const content = `import { useState, version } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

${propsType}function App(${functionArgs}) {
  const [count, setCount] = useState(0);
  const runtime = window.__POWERED_BY_QIANKUN__ ? 'qiankun' : 'standalone';
  const resolvedQiankunVersion = qiankunVersion ?? '${QIANKUN_VERSION}';

  return (
    <main className="micro-shell micro-shell--react">
      <header className="micro-header card micro-hero">
        <div className="badge-row">
          <span className="badge">React</span>
          <span className="badge badge-soft">qiankun {resolvedQiankunVersion}</span>
          <span className="badge badge-soft">{runtime}</span>
        </div>
        <div className="logo-group">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>React Micro App</h1>
        <p>清晰的信息层级、现代化卡片布局与更强可读性 · React {version}</p>
      </header>

      <section className="card">
        <dl className="stats-grid">
          <div className="stat-item">
            <dt>Framework</dt>
            <dd>React {version}</dd>
          </div>
          <div className="stat-item">
            <dt>Bundler</dt>
            <dd>Vite</dd>
          </div>
          <div className="stat-item">
            <dt>Runtime</dt>
            <dd>{runtime}</dd>
          </div>
          <div className="stat-item">
            <dt>qiankun</dt>
            <dd>{resolvedQiankunVersion}</dd>
          </div>
        </dl>

        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Counter · {count}
        </button>
        <p className="hint">该应用可独立运行，也可被主应用通过 qiankun 生命周期挂载。</p>
      </section>
    </main>
  );
}

export default App;
`;

  await fse.writeFile(appPath, content, 'utf-8');
}

async function writeReactAppStyles(appRoot: string): Promise<void> {
  const cssPath = path.join(appRoot, 'src/App.css');

  const content = `.micro-shell {
  min-height: 100vh;
  padding: 28px;
  box-sizing: border-box;
  display: grid;
  align-content: start;
  gap: 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  color: #0f172a;
}

.micro-shell--react {
  background: radial-gradient(circle at top right, #dbeafe 0%, #f8fafc 42%, #eef2ff 100%);
}

.micro-hero {
  display: grid;
  gap: 14px;
}

.micro-header h1 {
  margin: 0;
  font-size: 28px;
}

.micro-header p {
  margin: 8px 0 0;
  color: #475569;
}

.logo-group {
  display: flex;
  gap: 10px;
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
}

.badge-soft {
  color: #1e293b;
  background: #e2e8f0;
}

.logo {
  width: 42px;
  height: 42px;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: translateY(-1px) scale(1.03);
}

.card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 16px 40px -32px #1e293b;
}

.card dl {
  margin: 0 0 16px;
}

.stats-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.stat-item {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 12px;
}

.card dt {
  font-size: 12px;
  color: #64748b;
}

.card dd {
  margin: 2px 0 0;
  font-weight: 600;
}

.card button {
  border: 0;
  background: #2563eb;
  color: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
}

.hint {
  color: #64748b;
  margin-bottom: 0;
}
`;

  await fse.writeFile(cssPath, content, 'utf-8');
}

async function writeVueAppComponent(appRoot: string, isTs: boolean): Promise<void> {
  const appPath = path.join(appRoot, 'src/App.vue');
  const scriptTag = isTs ? '<script setup lang="ts">' : '<script setup>';
  const propDecl = isTs
    ? `const props = withDefaults(defineProps<{ qiankunVersion?: string }>(), {
  qiankunVersion: '${QIANKUN_VERSION}',
});`
    : `const props = defineProps({
  qiankunVersion: {
    type: String,
    default: '${QIANKUN_VERSION}',
  },
});`;

  const content = `${scriptTag}
import { computed, ref, version } from 'vue';

${propDecl}

const count = ref(0);
const runtime = computed(() => (window.__POWERED_BY_QIANKUN__ ? 'qiankun' : 'standalone'));

const increment = () => {
  count.value += 1;
};
</script>

<template>
  <main class="micro-shell">
    <header class="micro-header card micro-hero">
      <div class="badge-row">
        <span class="badge">Vue</span>
        <span class="badge badge-soft">qiankun {{ props.qiankunVersion }}</span>
        <span class="badge badge-soft">{{ runtime }}</span>
      </div>
      <div class="logo-group">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank" rel="noreferrer">
          <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
      </div>
      <h1>Vue Micro App</h1>
      <p>一致化视觉风格、信息卡分组与更清晰层级 · Vue {{ version }}</p>
    </header>

    <section class="card">
      <dl class="stats-grid">
        <div class="stat-item">
          <dt>Framework</dt>
          <dd>Vue {{ version }}</dd>
        </div>
        <div class="stat-item">
          <dt>Bundler</dt>
          <dd>Vite</dd>
        </div>
        <div class="stat-item">
          <dt>Runtime</dt>
          <dd>{{ runtime }}</dd>
        </div>
        <div class="stat-item">
          <dt>qiankun</dt>
          <dd>{{ props.qiankunVersion }}</dd>
        </div>
      </dl>

      <button type="button" @click="increment">Counter · {{ count }}</button>
      <p class="hint">该应用可独立运行，也可被主应用通过 qiankun 生命周期挂载。</p>
    </section>
  </main>
</template>

<style scoped>
.micro-shell {
  min-height: 100vh;
  padding: 28px;
  box-sizing: border-box;
  display: grid;
  align-content: start;
  gap: 20px;
  background: radial-gradient(circle at top right, #ccfbf1 0%, #f8fafc 38%, #ecfeff 100%);
  color: #0f172a;
}

.micro-hero {
  display: grid;
  gap: 14px;
}

.micro-header h1 {
  margin: 0;
  font-size: 28px;
}

.micro-header p {
  margin: 8px 0 0;
  color: #475569;
}

.logo-group {
  display: flex;
  gap: 10px;
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #0d9488, #0f766e);
}

.badge-soft {
  color: #1e293b;
  background: #e2e8f0;
}

.logo {
  width: 42px;
  height: 42px;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: translateY(-1px) scale(1.03);
}

.card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 16px 40px -32px #1e293b;
}

.card dl {
  margin: 0 0 16px;
}

.stats-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.stat-item {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  padding: 12px;
}

.card dt {
  font-size: 12px;
  color: #64748b;
}

.card dd {
  margin: 2px 0 0;
  font-weight: 600;
}

button {
  border: 0;
  background: #0d9488;
  color: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
}

.hint {
  color: #64748b;
  margin-bottom: 0;
}
</style>
`;

  await fse.writeFile(appPath, content, 'utf-8');
}
