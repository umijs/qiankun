const eventTarget = new EventTarget();

export function getEventTarget() {
  return eventTarget;
}
export async function init() {}
export async function mount() {
  eventTarget.dispatchEvent(new CustomEvent("mount-start"));
  await new Promise((r) => setTimeout(r, 20));
}
export async function unmount() {}
