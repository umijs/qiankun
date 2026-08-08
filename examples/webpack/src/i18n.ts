/**
 * This app's own copy, in both languages. The host hands `locale` over through qiankun's props
 * channel and re-delivers it on `update` (see src/index.tsx) — a micro app is independent, so it
 * owns its translations rather than importing the shell's.
 */
export type Locale = 'en' | 'zh';

export interface Messages {
  title: string;
  insideQiankun: string;
  standalone: string;
  isolationLab: string;
  writeGlobal: string;
  globalUndefined: string;
  globalNote: string;
  leakTimer: string;
  noInterval: string;
  ticks: (n: number) => string;
  timerNote: string;
  tintBody: string;
  tinted: (color: string) => string;
  noStyle: string;
  styleNote: string;
  localState: string;
  countIs: (n: number) => string;
  stateNote: string;
  entry: string;
  lifecycle: string;
}

export const messages: Record<Locale, Messages> = {
  en: {
    title: 'Webpack micro app',
    insideQiankun: 'inside qiankun',
    standalone: 'standalone',
    isolationLab: 'Isolation lab',
    writeGlobal: 'Write global',
    globalUndefined: 'window.__SANDBOX_PROBE__ = undefined',
    globalNote: "Writes a window global and reads it back — the value stays inside this app's sandbox membrane.",
    leakTimer: 'Leak a timer',
    noInterval: 'no interval running',
    ticks: (n) => `ticks: ${n}`,
    timerNote: 'Starts a 1s setInterval and never clears it — qiankun reclaims leaked timers on unmount.',
    tintBody: 'Tint body',
    tinted: (color) => `body background → ${color}`,
    noStyle: 'no probe style injected',
    styleNote: 'Appends a style tinting body — style isolation keeps the tint inside this app.',
    localState: 'Local state',
    countIs: (n) => `count is ${n}`,
    stateNote: 'React state lives entirely inside this app — remounting resets it.',
    entry: 'entry',
    lifecycle: 'lifecycle',
  },
  zh: {
    title: 'Webpack 微应用',
    insideQiankun: '运行在 qiankun 中',
    standalone: '独立运行',
    isolationLab: '隔离实验台',
    writeGlobal: '写入全局变量',
    globalUndefined: 'window.__SANDBOX_PROBE__ = undefined',
    globalNote: '写入一个 window 全局变量再读回来——这个值始终留在本应用的沙箱隔离膜内。',
    leakTimer: '泄漏一个定时器',
    noInterval: '没有定时器在跑',
    ticks: (n) => `已触发 ${n} 次`,
    timerNote: '启动一个 1 秒的 setInterval 且从不清理——qiankun 会在卸载时回收它。',
    tintBody: '给 body 染色',
    tinted: (color) => `body 背景 → ${color}`,
    noStyle: '尚未注入探针样式',
    styleNote: '插入一段给 body 染色的样式——样式隔离会把染色关在这个应用内部。',
    localState: '本地状态',
    countIs: (n) => `计数为 ${n}`,
    stateNote: 'React 状态完全活在这个应用内部——重新挂载就会重置。',
    entry: '入口',
    lifecycle: '生命周期',
  },
};
