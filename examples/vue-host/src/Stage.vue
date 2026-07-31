<script setup lang="ts">
import { MicroApp } from '@qiankunjs/vue';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import type { MicroAppMeta } from './apps';
import { locale, t } from './i18n';
import StageFailure from './StageFailure.vue';
import StageVeil from './StageVeil.vue';
import Trigram from './Trigram.vue';

const props = defineProps<{ app: MicroAppMeta }>();

// a stable object: the prop is not watched, but a fresh literal per render is still noise
const settings = { sandbox: { styleIsolation: true } };

/**
 * The binding's channel for the micro app's own props. Mutated in place rather than replaced, so the
 * deep watcher fires on a real change instead of on every re-render.
 */
const appProps = reactive({ theme: 'porcelain', locale: locale.value });

// the shell's language is a prop like any other: switching it re-renders the micro app in place
watch(locale, (next) => {
  appProps.locale = next;
});

function toggleTheme() {
  appProps.theme = appProps.theme === 'porcelain' ? 'ink' : 'porcelain';
}

const loading = ref(true);
const failed = ref(false);
const frame = ref<HTMLElement | null>(null);
type Status = 'failed' | 'mounting' | 'mounted';
const status = computed<Status>(() => (failed.value ? 'failed' : loading.value ? 'mounting' : 'mounted'));
const statusLabel = computed(() => t.value[status.value]);

interface ContainerInfo {
  name?: string;
  version?: string;
  mountTimes?: string;
  sandbox: boolean;
  styleIsolation: boolean;
}

const idleContainer: ContainerInfo = { sandbox: false, styleIsolation: false };
const info = ref<ContainerInfo>(idleContainer);

/** `data-sandbox-cfg` is qiankun's own debug summary of the sandbox it built for this app. */
function readSandboxCfg(raw: string | undefined): Pick<ContainerInfo, 'sandbox' | 'styleIsolation'> {
  if (!raw) return { sandbox: false, styleIsolation: false };

  try {
    const cfg: unknown = JSON.parse(raw);
    if (typeof cfg === 'object' && cfg !== null) {
      const { enabled, styleIsolation } = cfg as { enabled?: boolean; styleIsolation?: boolean };
      return { sandbox: enabled !== false, styleIsolation: styleIsolation === true };
    }

    return { sandbox: cfg === true, styleIsolation: false };
  } catch {
    return { sandbox: false, styleIsolation: false };
  }
}

let observer: MutationObserver | undefined;

/**
 * Reads the sandbox facts straight off the live container. `<MicroApp />` creates that element and
 * hands it to qiankun, so we look it up by the class the binding puts on it.
 */
function observeContainer() {
  observer?.disconnect();
  // whatever is on the container right now still belongs to the app we are leaving
  info.value = idleContainer;

  const container = frame.value?.querySelector<HTMLElement>('.qiankun-micro-app-container');
  if (!container) return;

  const read = () => {
    info.value = {
      name: container.dataset.name,
      version: container.dataset.version,
      // qiankun only writes this from the second mount on: seeing it climb proves the remount took
      // the warm path, i.e. that the container kept its identity across app switches
      mountTimes: container.dataset.mountTimes,
      ...readSandboxCfg(container.dataset.sandboxCfg),
    };
  };

  read();
  // attributes only: the micro app's own DOM churn is none of our business
  observer = new MutationObserver(read);
  observer.observe(container, {
    attributes: true,
    attributeFilter: ['data-name', 'data-version', 'data-sandbox-cfg', 'data-mount-times'],
  });
}

// `immediate: true` would run during setup, before <MicroApp /> has rendered its container, so the
// first look has to wait for the mounted hook
onMounted(observeContainer);
watch(
  () => props.app.name,
  () => {
    failed.value = false;
    observeContainer();
  },
  { flush: 'post' },
);
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <section class="stage" aria-label="micro app stage">
    <header class="stage-head">
      <div>
        <h1>{{ app.label }}</h1>
        <p class="mono">{{ app.stack[locale] }} · {{ app.loadingPath }} · {{ t.entry }} {{ app.entry }}</p>
      </div>
      <Trigram
        :sandbox="info.sandbox && status === 'mounted'"
        :styles="info.styleIsolation && status === 'mounted'"
        :mounted="status === 'mounted'"
      />
    </header>

    <div class="props-bar">
      <button type="button" class="mono" @click="toggleTheme">appProps.theme = "{{ appProps.theme }}"</button>
      <p class="mono">{{ t.propsChannelNote }}</p>
    </div>

    <div ref="frame" class="frame">
      <span class="tick tl" /><span class="tick tr" /><span class="tick bl" /><span class="tick br" />

      <div class="frame-head mono">
        <span>
          {{ info.name ? `data-name="${info.name}" · qiankun v${info.version ?? '…'}` : t.containerIdle }}
          {{ info.mountTimes ? `· ${t.mount} #${info.mountTimes}` : '' }}
        </span>
        <span class="status" :class="status === 'mounted' ? 'ok' : status === 'failed' ? 'bad' : 'pending'">
          <span class="status-dot" aria-hidden="true" />
          {{ statusLabel }}
        </span>
      </div>

      <!-- mount, unmount, loading and error capture all belong to the binding; the shell only
           names the app and dresses the two slots -->
      <MicroApp
        :name="app.name"
        :entry="app.entry"
        :settings="settings"
        :app-props="appProps"
        wrapper-class-name="stage-body"
        class-name="stage-container"
      >
        <template #loader="{ loading: mounting }">
          <StageVeil :loading="mounting" @change="loading = $event" />
        </template>
        <template #error-boundary="{ error }">
          <StageFailure :error="error" @change="failed = $event" />
        </template>
      </MicroApp>
    </div>
  </section>
</template>

<style scoped>
.stage {
  animation: stage-lift 280ms ease-out both;
}

.stage-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stage-head h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.stage-head p {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--ink-soft);
}

.mono {
  font-family: var(--font-mono);
}


.props-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.props-bar button {
  padding: 6px 12px;
  border: 1px solid var(--hairline);
  border-radius: 6px;
  background: var(--surface);
  color: var(--ink);
  font-size: 11px;
  cursor: pointer;
  transition: border-color 150ms ease-out;
}

.props-bar button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.props-bar p {
  margin: 0;
  font-size: 11px;
  color: var(--ink-soft);
}

/* viewfinder corner ticks: the visible sandbox boundary */
.tick {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--primary);
  pointer-events: none;
}

.tick.tl {
  top: -1px;
  left: -1px;
  border-top: 2px solid;
  border-left: 2px solid;
  border-top-left-radius: 10px;
}

.tick.tr {
  top: -1px;
  right: -1px;
  border-top: 2px solid;
  border-right: 2px solid;
  border-top-right-radius: 10px;
}

.tick.bl {
  bottom: -1px;
  left: -1px;
  border-bottom: 2px solid;
  border-left: 2px solid;
  border-bottom-left-radius: 10px;
}

.tick.br {
  right: -1px;
  bottom: -1px;
  border-right: 2px solid;
  border-bottom: 2px solid;
  border-bottom-right-radius: 10px;
}

.frame {
  position: relative;
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--surface);
  box-shadow: var(--shadow-stage);
}

.frame-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--hairline);
  font-size: 11px;
  color: var(--ink-soft);
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentcolor;
}

.frame-head .ok {
  color: var(--success);
}

.frame-head .pending {
  color: var(--ink-soft);
}

.frame-head .pending .status-dot {
  background: var(--primary);
}

.frame-head .bad {
  color: var(--danger);
}

/* the binding's wrapper is not positioned, so the overlay slots need this shell to make it one */
:deep(.stage-body) {
  position: relative;
  min-height: 70vh;
  overflow: auto;
}

:deep(.stage-container) {
  min-height: 70vh;
}
</style>
