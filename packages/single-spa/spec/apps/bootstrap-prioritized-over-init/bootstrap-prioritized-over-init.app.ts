export let bootstrapCalled = false,
  initCalled = false;

export async function bootstrap() {
  bootstrapCalled = true;
}
export async function init() {
  initCalled = true;
}
export async function mount() {}
export async function unmount() {}
