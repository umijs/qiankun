<script setup lang="ts">
import { computed, ref, version } from 'vue';

const ACCENT = '#42B883';

const poweredByQiankun = !!window.__POWERED_BY_QIANKUN__;
const modeLabel = poweredByQiankun ? 'inside qiankun' : 'standalone';

const probeValue = ref('');
const ticks = ref<number | null>(null);
const tinted = ref(false);
const count = ref(0);
let timerStarted = false;

const probeOutput = computed(() =>
  probeValue.value ? `window.__SANDBOX_PROBE__ = '${probeValue.value}'` : 'window.__SANDBOX_PROBE__ is unset',
);
const tickOutput = computed(() => (ticks.value === null ? 'no interval running' : `tick ${ticks.value}`));
const styleOutput = computed(() =>
  tinted.value ? 'style[data-probe] appended to document.head' : 'no probe style injected',
);

function writeWindowProbe() {
  window.__SANDBOX_PROBE__ = 'vue:' + Date.now();
  probeValue.value = String(window.__SANDBOX_PROBE__);
}

function startTimerProbe() {
  if (timerStarted) return;
  timerStarted = true;
  ticks.value = 0;
  // deliberately never cleared — qiankun reclaims the leaked interval on unmount
  setInterval(() => {
    ticks.value = (ticks.value ?? 0) + 1;
  }, 1000);
}

function injectStyleProbe() {
  if (tinted.value) return;
  const style = document.createElement('style');
  style.dataset.probe = '';
  // body tints the whole page when standalone; under style isolation the body rule is
  // scoped away and only the app root (inside the @scope boundary) picks up the tint
  style.textContent = `body, .vue-app { background: ${ACCENT}18 !important }`;
  document.head.appendChild(style);
  tinted.value = true;
}
</script>

<template>
  <div class="vue-app">
    <header class="app-header">
      <span class="accent-dot" aria-hidden="true" />
      <h1>Vue micro app</h1>
      <div class="badges">
        <span class="badge">vue {{ version }}</span>
        <span class="badge">vite · esm</span>
        <span :class="poweredByQiankun ? 'badge badge-live' : 'badge'">{{ modeLabel }}</span>
      </div>
    </header>

    <section class="card">
      <h2>Isolation lab</h2>
      <div class="probe">
        <button type="button" @click="writeWindowProbe">Write window global</button>
        <div class="probe-result">
          <output>{{ probeOutput }}</output>
          <p>Proves globals stay inside this app's membrane — the host window never sees them.</p>
        </div>
      </div>
      <div class="probe">
        <button type="button" @click="startTimerProbe">Start leaky interval</button>
        <div class="probe-result">
          <output>{{ tickOutput }}</output>
          <p>Never cleared here — proves qiankun reclaims leaked timers on unmount.</p>
        </div>
      </div>
      <div class="probe">
        <button type="button" @click="injectStyleProbe">Tint body background</button>
        <div class="probe-result">
          <output>{{ styleOutput }}</output>
          <p>Tints body — proves style isolation keeps the tint inside this app.</p>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>Local state</h2>
      <div class="counter">
        <button type="button" @click="count--">−</button>
        <span class="counter-value">{{ count }}</span>
        <button type="button" @click="count++">+</button>
        <p>ref state lives and dies with this app instance.</p>
      </div>
    </section>

    <footer class="app-footer">entry //localhost:7101 · lifecycle: src/main.ts</footer>
  </div>
</template>

<style>
/* All rules scoped under .vue-app — no body/html rules here (design contract). */

.vue-app {
  --paper: #f7f8fa;
  --surface: #ffffff;
  --ink: #1b1f26;
  --ink-soft: #5c6470;
  --hairline: #e4e7ec;
  --primary: #2f54eb;
  --accent: #42b883;
  --sans: 'IBM Plex Sans', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, monospace;
  --display: 'Space Grotesk', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;

  box-sizing: border-box;
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 24px 32px;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.5;
}

.vue-app *,
.vue-app *::before,
.vue-app *::after {
  box-sizing: inherit;
}

.vue-app .app-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.vue-app .accent-dot {
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
}

.vue-app h1 {
  margin: 0;
  font-family: var(--display);
  font-size: 26px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.vue-app .badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-left: auto;
}

.vue-app .badge {
  padding: 3px 8px;
  border: 1px solid var(--hairline);
  border-radius: 6px;
  background: var(--surface);
  color: var(--ink-soft);
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
}

.vue-app .badge-live {
  border-color: rgb(47 84 235 / 35%);
  color: var(--primary);
}

.vue-app .card {
  margin-bottom: 16px;
  padding: 18px 20px;
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--surface);
}

.vue-app .card h2 {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.vue-app .probe {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 8px 20px;
  align-items: start;
  padding: 14px 0;
  border-bottom: 1px solid var(--hairline);
}

.vue-app .probe:last-of-type {
  padding-bottom: 4px;
  border-bottom: none;
}

.vue-app button {
  padding: 6px 12px;
  border: 1px solid var(--hairline);
  border-radius: 6px;
  background: var(--surface);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  transition:
    border-color 160ms ease-out,
    color 160ms ease-out;
}

.vue-app button:hover {
  border-color: var(--accent);
  color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .vue-app button {
    transition: none;
  }
}

.vue-app .probe-result output {
  display: block;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.vue-app .probe-result p {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--ink-soft);
}

.vue-app .counter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.vue-app .counter-value {
  min-width: 3ch;
  text-align: center;
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 500;
}

.vue-app .counter p {
  margin: 0 0 0 8px;
  font-size: 13px;
  color: var(--ink-soft);
}

.vue-app .app-footer {
  margin-top: 20px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--ink-soft);
}
</style>
