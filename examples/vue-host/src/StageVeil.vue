<script setup lang="ts">
import { t } from './i18n';
import { onMounted, watch } from 'vue';

const props = defineProps<{ loading: boolean; covering: boolean }>();
const emit = defineEmits<{ (event: 'change', loading: boolean): void }>();

// The loader slot is the binding's own view of "is this app up yet", so the stage header reads it
// from here. Reporting it up after render (never during) keeps it out of <MicroApp />'s render pass.
onMounted(() => emit('change', props.loading));
watch(
  () => props.loading,
  (loading) => emit('change', loading),
);
</script>

<template>
  <div v-if="loading && covering" class="veil">{{ t.crossingBoundary }}</div>
  <div v-else-if="loading" class="corner-tag">{{ t.streamingIn }}</div>
</template>

<style scoped>
.veil {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--surface) 80%, transparent);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-soft);
  animation: veil-pulse 1.6s ease-in-out infinite;
}

@keyframes veil-pulse {
  50% {
    opacity: 0.5;
  }
}

/* the streamed app's tag: pinned to a corner so the arriving chunks stay visible */
.corner-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  padding: 4px 10px;
  border: 1px solid var(--hairline);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface) 90%, transparent);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--ink-soft);
  pointer-events: none;
  animation: veil-pulse 1.6s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .veil,
  .corner-tag {
    animation: none;
  }
}
</style>
