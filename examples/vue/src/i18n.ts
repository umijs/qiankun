/**
 * This app's own copy, in both languages. The host hands `locale` over through qiankun's props
 * channel and re-delivers it on `update` (see src/main.ts) — a micro app is independent, so it
 * owns its translations rather than importing the shell's.
 */
export type Locale = 'en' | 'zh';

export interface Messages {
  title: string;
  insideQiankun: string;
  standalone: string;
  isolationLab: string;
  writeGlobal: string;
  globalUnset: string;
  globalNote: string;
  startInterval: string;
  noInterval: string;
  tick: (n: number) => string;
  intervalNote: string;
  tintBody: string;
  styleInjected: string;
  noStyle: string;
  styleNote: string;
  localState: string;
  stateNote: string;
  entry: string;
  lifecycle: string;
  hostProps: string;
  none: string;
}

export const messages: Record<Locale, Messages> = {
  en: {
    title: 'Vue micro app',
    insideQiankun: 'inside qiankun',
    standalone: 'standalone',
    isolationLab: 'Isolation lab',
    writeGlobal: 'Write window global',
    globalUnset: 'window.__SANDBOX_PROBE__ is unset',
    globalNote: "Proves globals stay inside this app's membrane — the host window never sees them.",
    startInterval: 'Start leaky interval',
    noInterval: 'no interval running',
    tick: (n) => `tick ${n}`,
    intervalNote: 'Never cleared here — proves qiankun reclaims leaked timers on unmount.',
    tintBody: 'Tint body background',
    styleInjected: 'style[data-probe] appended to document.head',
    noStyle: 'no probe style injected',
    styleNote: 'Tints body — proves style isolation keeps the tint inside this app.',
    localState: 'Local state',
    stateNote: 'ref state lives and dies with this app instance.',
    entry: 'entry',
    lifecycle: 'lifecycle',
    hostProps: 'host props',
    none: 'none',
  },
  zh: {
    title: 'Vue 微应用',
    insideQiankun: '运行在 qiankun 中',
    standalone: '独立运行',
    isolationLab: '隔离实验台',
    writeGlobal: '写入 window 全局变量',
    globalUnset: 'window.__SANDBOX_PROBE__ 尚未设置',
    globalNote: '证明全局变量留在这个应用的隔离膜内——宿主 window 永远看不到它们。',
    startInterval: '制造一个泄漏的定时器',
    noInterval: '没有定时器在跑',
    tick: (n) => `第 ${n} 次`,
    intervalNote: '这里故意不清理——证明 qiankun 会在卸载时回收泄漏的定时器。',
    tintBody: '给 body 染色',
    styleInjected: 'style[data-probe] 已插入 document.head',
    noStyle: '尚未注入探针样式',
    styleNote: '给 body 染色——证明样式隔离把染色关在了这个应用内部。',
    localState: '本地状态',
    stateNote: 'ref 状态与这个应用实例同生共死。',
    entry: '入口',
    lifecycle: '生命周期',
    hostProps: '宿主传入的 props',
    none: '无',
  },
};
