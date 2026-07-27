<script setup lang="ts">
import { computed } from 'vue';
import { appByPath, microApps, siblingShell } from './apps';
import { locale, t, toggleLocale } from './i18n';
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
          <small class="mono">{{ t.shellSubtitle }}</small>
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
            <span class="sub">{{ app.stack[locale] }}</span>
          </span>
        </button>
      </nav>

      <footer class="mono">
        <a :href="siblingShell.href">{{ siblingShell.label }} · {{ siblingShell.sub }} ↗</a>
        <a href="https://github.com/umijs/qiankun" target="_blank" rel="noreferrer">umijs/qiankun ↗</a>
      </footer>
    </aside>

    <main>
      <div class="toolbar">
        <button type="button" class="locale mono" :aria-label="t.localeSwitchLabel" @click="toggleLocale">
          {{ t.localeName }}
        </button>
      </div>

      <!-- deliberately not keyed: keeping one <Stage> alive lets the binding handle the app switch,
           which is the path worth exercising -->
      <Stage v-if="activeApp" :app="activeApp" />
      <section v-else class="intro">
        <p class="eyebrow mono">{{ t.introEyebrow }}</p>
        <h1>{{ t.introTitle }}</h1>
        <p class="lede">{{ t.introLede }}</p>
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

/* the chop carries the logo's construction: a purple field cut by an amber corner */
.seal {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background:
    linear-gradient(135deg, transparent 62%, var(--amber) 62%),
    var(--primary);
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
  display: flex;
  flex-direction: column;
  gap: 8px;
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

/* its own row, so the control does not move when the stage replaces the intro */
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.locale {
  padding: 4px 10px;
  border: 1px solid var(--hairline);
  border-radius: 6px;
  background: var(--surface);
  color: var(--ink-soft);
  font-size: 11px;
  cursor: pointer;
  transition:
    border-color 150ms ease-out,
    color 150ms ease-out;
}

.locale:hover {
  border-color: var(--primary);
  color: var(--primary);
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
