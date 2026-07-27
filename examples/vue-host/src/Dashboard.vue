<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { microApps } from './apps';
import { locale, t } from './i18n';
import { navigate } from './router';

/**
 * The host-side half of the sub apps' window probe: sub apps write
 * window.__SANDBOX_PROBE__ from inside their sandbox; the host realm must never see it.
 */
const probe = ref(String((window as Window & { __SANDBOX_PROBE__?: unknown }).__SANDBOX_PROBE__));
const clean = computed(() => probe.value === 'undefined');

let timer: number | undefined;
onMounted(() => {
  timer = window.setInterval(() => {
    probe.value = String((window as Window & { __SANDBOX_PROBE__?: unknown }).__SANDBOX_PROBE__);
  }, 1500);
});
onBeforeUnmount(() => window.clearInterval(timer));

const realmBody = computed(() => t.value.hostRealmBody.split('{code}'));
</script>

<template>
  <div class="dashboard">
    <!-- the sleeve watermark -->
    <span class="watermark" aria-hidden="true">乾坤</span>

    <header class="hero">
      <p class="eyebrow mono">{{ t.introEyebrow }}</p>
      <h1>{{ t.introTitle }}</h1>
      <p class="lede">{{ t.introLede }}</p>
    </header>

    <section class="registry" aria-label="registered micro apps">
      <div class="registry-head">
        <h2>{{ t.appRegistry }}</h2>
        <span class="mono">&lt;MicroApp&gt; · sandbox: on · style isolation: on</span>
      </div>
      <ul>
        <li v-for="app in microApps" :key="app.name">
          <button type="button" @click="navigate(app.path)">
            <span class="dot" :style="{ backgroundColor: app.accent }" />
            <span class="identity">
              <span class="label">{{ app.label }}</span>
              <span class="name mono">{{ app.name }}</span>
            </span>
            <span class="stack">{{ app.stack[locale] }}</span>
            <span class="entry mono">{{ app.entry }}</span>
            <span class="pill mono" :class="{ esm: app.loadingPath === 'esm sandbox' }">{{ app.loadingPath }}</span>
            <span class="arrow">→</span>
          </button>
        </li>
      </ul>
    </section>

    <section class="realm" aria-label="host realm check">
      <div>
        <h2>{{ t.hostRealmCheck }}</h2>
        <p>
          {{ realmBody[0] }}<code class="mono">window.__SANDBOX_PROBE__</code>{{ realmBody[1] }}
        </p>
      </div>
      <div class="realm-value">
        <code class="mono" :class="clean ? 'ok' : 'bad'">{{ probe }}</code>
        <p class="mono">{{ clean ? t.membraneHolds : t.sandboxBreached }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  max-width: 896px;
  margin: 0 auto;
}

.watermark {
  position: absolute;
  top: -24px;
  right: 0;
  font-family: var(--font-ornament);
  font-size: 120px;
  font-weight: 600;
  line-height: 1;
  color: rgb(27 31 38 / 4%);
  pointer-events: none;
  user-select: none;
}

.hero {
  padding: 24px 0 40px;
}

.eyebrow {
  margin: 0 0 12px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--primary);
}

.hero h1 {
  max-width: 576px;
  margin: 0;
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.lede {
  max-width: 576px;
  margin: 16px 0 0;
  font-size: 15px;
  line-height: 1.625;
  color: var(--ink-soft);
}

.registry {
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--surface);
}

.registry-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--hairline);
}

.registry-head h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.registry-head span {
  font-size: 11px;
  color: var(--ink-soft);
}

.registry ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.registry li {
  border-bottom: 1px solid var(--hairline);
}

.registry li:last-child {
  border-bottom: 0;
}

.registry button {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px 20px;
  border: 0;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease-out;
}

.registry button:hover {
  background: var(--paper);
}

.dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 50%;
}

.identity {
  width: 112px;
  flex-shrink: 0;
}

.identity .label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}

.identity .name {
  display: block;
  font-size: 10px;
  color: var(--ink-soft);
}

.stack {
  flex: 1;
  font-size: 13px;
  color: var(--ink-soft);
}

.entry {
  font-size: 11px;
  color: var(--ink-soft);
}

@media (max-width: 640px) {
  .entry {
    display: none;
  }
}

.pill {
  width: 96px;
  flex-shrink: 0;
  padding: 2px 8px;
  border: 1px solid var(--hairline);
  border-radius: 999px;
  font-size: 10px;
  text-align: center;
  color: var(--ink-soft);
}

.pill.esm {
  border-color: color-mix(in srgb, var(--primary) 25%, transparent);
  color: var(--primary);
}

.arrow {
  color: var(--ink-soft);
  transition: transform 150ms ease-out;
}

.registry button:hover .arrow {
  transform: translateX(2px);
}

.realm {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
  padding: 16px 20px;
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--surface);
}

.realm h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.realm p {
  max-width: 512px;
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.625;
  color: var(--ink-soft);
}

.realm code {
  font-size: 12px;
}

.realm-value {
  text-align: right;
}

.realm-value code {
  font-size: 14px;
}

.realm-value code.ok {
  color: var(--success);
}

.realm-value code.bad {
  color: var(--danger);
}

.realm-value p {
  margin: 4px 0 0;
  font-size: 10px;
}

.mono {
  font-family: var(--font-mono);
}

@media (prefers-reduced-motion: reduce) {
  .registry button,
  .arrow {
    transition: none;
  }
}
</style>
