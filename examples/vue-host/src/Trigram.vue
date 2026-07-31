<script setup lang="ts">
import { computed } from 'vue';
import { t } from './i18n';

const props = defineProps<{ sandbox: boolean; styles: boolean; mounted: boolean }>();

/**
 * The qian trigram (☰) as a live status display: one bar per isolation dimension.
 * A solid (yang) bar means the dimension is active; a broken (yin) bar means off or
 * pending. A mounted, fully isolated app completes the trigram.
 */
const bars = computed(() => [
  { on: props.sandbox, label: t.value.trigramSandbox },
  { on: props.styles, label: t.value.trigramStyles },
  { on: props.mounted, label: t.value.trigramMounted },
]);

const live = computed(() => bars.value.every((bar) => bar.on));
const title = computed(() => bars.value.map((b) => `${b.label}: ${b.on ? 'on' : 'off'}`).join(' · '));
const onCount = computed(() => bars.value.filter((b) => b.on).length);
</script>

<template>
  <div class="trigram" :title="title">
    <div class="bars" aria-hidden="true">
      <template v-for="bar in bars" :key="bar.label">
        <span v-if="bar.on" class="bar yang" />
        <span v-else class="bar yin">
          <span />
          <span />
        </span>
      </template>
    </div>
    <span class="mono" :class="{ live }">{{ live ? `${t.isolated} · ${t.live}` : `${onCount}/3` }}</span>
  </div>
</template>

<style scoped>
.trigram {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.bar {
  height: 3px;
  width: 28px;
}

.yang {
  border-radius: 999px;
  background: var(--success);
}

.yin {
  display: flex;
  justify-content: space-between;
}

.yin span {
  width: 12px;
  height: 3px;
  border-radius: 999px;
  background: var(--hairline);
}

.mono {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-soft);
}

.mono.live {
  color: var(--success);
}
</style>
