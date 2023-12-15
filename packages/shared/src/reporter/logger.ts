export function warn(msg: string, ...args: unknown[]) {
  console.warn(`[qiankun]: ${msg}`, ...args);
}
