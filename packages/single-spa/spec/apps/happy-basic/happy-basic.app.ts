export let initialized, mounted;

export async function bootstrap() {
  initialized = true;
}

export async function mount() {
  mounted = true;
}

export async function unmount() {
  mounted = false;
}

export function reset() {
  initialized = false;
  mounted = false;
}

export function wasInitialized() {
  return initialized;
}

export function isMounted() {
  return mounted;
}
