<script setup lang="ts">
import { computed, ref, version } from 'vue';

const count = ref(0);
const runtime = computed(() => (window.__POWERED_BY_QIANKUN__ ? 'qiankun' : 'standalone'));

const increment = () => {
  count.value += 1;
};
</script>

<template>
  <main class="micro-shell">
    <header class="micro-header">
      <div class="logo-group">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank" rel="noreferrer">
          <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
      </div>
      <h1>Vue Micro App</h1>
      <p>统一现代化子应用界面 · Vue {{ version }}</p>
    </header>

    <section class="card">
      <dl>
        <div>
          <dt>Framework</dt>
          <dd>Vue {{ version }}</dd>
        </div>
        <div>
          <dt>Bundler</dt>
          <dd>Vite 8</dd>
        </div>
        <div>
          <dt>Runtime</dt>
          <dd>{{ runtime }}</dd>
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
  gap: 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #ecfeff 100%);
  color: #0f172a;
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
  margin-bottom: 14px;
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
  display: grid;
  gap: 10px;
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
