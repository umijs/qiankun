<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const props = defineProps<{ error: Error }>();
const emit = defineEmits<{ (event: 'change', failed: boolean): void }>();

// same shape as StageVeil: the slot is the binding's own view of the failure, reported up after
// render so the stage header can stop claiming the app is mounted
onMounted(() => emit('change', true));
onUnmounted(() => emit('change', false));
</script>

<template>
  <div class="failure">
    <p class="label">mount failed</p>
    <p class="message">{{ props.error.message }}</p>
  </div>
</template>

<style scoped>
.failure {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 32px;
  background: color-mix(in srgb, var(--surface) 95%, transparent);
  font-family: var(--font-mono);
}

.label {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--cinnabar);
}

.message {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-soft);
  overflow-wrap: break-word;
}
</style>
