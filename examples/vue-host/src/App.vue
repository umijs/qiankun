<script setup lang="ts">
import { computed } from 'vue';
import { appByPath, microApps } from './apps';
import { currentPath, navigate } from './router';
import Stage from './Stage.vue';

const activeApp = computed(() => appByPath(currentPath.value));
</script>

<template>
  <div class="shell">
    <aside>
      <header>
        <span class="seal" aria-hidden>乾坤</span>
        <span>
          <strong>qiankun</strong>
          <small class="mono">vue host · @qiankunjs/vue</small>
        </span>
      </header>

      <nav>
        <button
          v-for="app in microApps"
          :key="app.name"
          type="button"
          :aria-current="currentPath.startsWith(app.path) ? 'page' : undefined"
          :class="{ active: currentPath.startsWith(app.path) }"
          @click="navigate(app.path)"
        >
          <span class="dot" :style="{ backgroundColor: app.accent }" />
          <span>
            <span class="label">{{ app.label }}</span>
            <span class="sub">{{ app.stack }}</span>
          </span>
        </button>
      </nav>

      <footer class="mono">
        <a href="https://github.com/umijs/qiankun" target="_blank" rel="noreferrer">umijs/qiankun ↗</a>
      </footer>
    </aside>

    <main>
      <!-- deliberately not keyed: keeping one <Stage> alive lets the binding handle the app switch,
           which is the path worth exercising -->
      <Stage v-if="activeApp" :app="activeApp" />
      <section v-else class="intro">
        <p class="eyebrow mono">袖里乾坤 · vue host</p>
        <h1>The same four apps, mounted from Vue.</h1>
        <p class="lede">
          This shell is a plain Vue 3 app. It mounts the micro apps with
          <code class="mono">&lt;MicroApp&gt;</code> from <code class="mono">@qiankunjs/vue</code> — the binding we
          publish — and dresses its <code class="mono">#loader</code> and
          <code class="mono">#error-boundary</code> slots. Pick an app on the left; “Missing app” is unreachable on
          purpose, so the error slot has something to show.
        </p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
}

aside {
  display: flex;
  width: 256px;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid var(--hairline);
  background: var(--surface);
}

aside header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--hairline);
}

.seal {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: var(--cinnabar);
  color: #fff;
  font-family: var(--font-ornament);
  font-size: 13px;
  line-height: 1.1;
  letter-spacing: -1px;
}

aside header strong {
  display: block;
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: -0.01em;
}

aside header small {
  display: block;
  font-size: 11px;
  color: var(--ink-soft);
}

nav {
  flex: 1;
  padding: 16px 12px;
}

nav button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: var(--ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease-out;
}

nav button:hover {
  background: var(--paper);
}

nav button.active {
  background: color-mix(in srgb, var(--primary) 8%, transparent);
  color: var(--primary);
}

.dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
}

.sub {
  display: block;
  font-size: 12px;
  color: var(--ink-soft);
}

nav button.active .sub {
  color: color-mix(in srgb, var(--primary) 70%, transparent);
}

aside footer {
  padding: 16px 20px;
  border-top: 1px solid var(--hairline);
  font-size: 11px;
}

aside footer a {
  color: var(--ink-soft);
  text-decoration: none;
}

aside footer a:hover {
  color: var(--primary);
}

main {
  flex: 1;
  min-width: 0;
  padding: 32px 40px;
}

.mono {
  font-family: var(--font-mono);
}

.intro {
  max-width: 640px;
}

.eyebrow {
  margin: 0 0 12px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--primary);
}

.intro h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 600;
  line-height: 1.14;
  letter-spacing: -0.02em;
}

.lede {
  margin: 16px 0 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink-soft);
}

.lede code {
  font-size: 13px;
  color: var(--ink);
}
</style>
