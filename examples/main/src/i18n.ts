import { useSyncExternalStore } from 'react';

/**
 * The shell's locale, and the one it hands micro apps through `appProps`.
 *
 * Only prose is translated. Technology names, API surface (`<MicroApp>`, `data-name`), loading
 * paths and package names stay as they are — translating them would make the demo harder to
 * match against the code it demonstrates, not easier.
 */
export type Locale = 'en' | 'zh';

const STORAGE_KEY = 'qiankun-examples-locale';
const LOCALE_EVENT = 'shell:locale';

function initial(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'zh') return stored;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

let current: Locale = initial();
document.documentElement.lang = current === 'zh' ? 'zh-CN' : 'en';

export function setLocale(next: Locale): void {
  if (next === current) return;
  current = next;
  window.localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  window.dispatchEvent(new Event(LOCALE_EVENT));
}

// same shape as the router store: the shell lives for the lifetime of the page
function subscribe(callback: () => void) {
  window.addEventListener(LOCALE_EVENT, callback);
  return () => window.removeEventListener(LOCALE_EVENT, callback);
}

export function useLocale(): Locale {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => current,
  );
}

export function useMessages(): Messages {
  return messages[useLocale()];
}

/** Spelled out rather than inferred, so a missing translation is a type error, not a silent gap. */
export interface Messages {
  /** what the switcher offers to switch *to* */
  localeName: string;
  localeSwitchLabel: string;
  shellSubtitle: string;
  dashboard: string;
  dashboardSub: string;
  microApps: string;
  eyebrow: string;
  heroTitle: string;
  heroLede: string;
  appRegistry: string;
  hostRealmCheck: string;
  /** `{code}` is replaced with the `window.__SANDBOX_PROBE__` code element */
  hostRealmBody: string;
  membraneHolds: string;
  sandboxBreached: string;
  containerIdle: string;
  mounting: string;
  mounted: string;
  failed: string;
  crossingBoundary: string;
  /** the non-covering loader tag: the streamed app must stay visible while it mounts */
  streamingIn: string;
  mountFailed: string;
  isolated: string;
  live: string;
  entry: string;
  trigramSandbox: string;
  trigramStyles: string;
  trigramMounted: string;
  mount: string;
  propsChannelNote: string;
}

export const messages: Record<Locale, Messages> = {
  en: {
    localeName: '中文',
    localeSwitchLabel: 'Switch to Chinese',
    shellSubtitle: '@qiankunjs/react',
    dashboard: 'Dashboard',
    dashboardSub: 'host overview',
    microApps: 'Micro apps',
    eyebrow: '袖里乾坤 · qiankun examples',
    heroTitle: 'A universe in every sleeve.',
    heroLede:
      "Five independent apps — React, Vue, a webpack classic build, plain HTML, and a server-streamed page — mount into this shell. Each one runs inside its own JS sandbox with scoped styles, and this page can prove it. The shell is a plain React app that mounts them through qiankun's own React binding.",
    appRegistry: 'App registry',
    hostRealmCheck: 'Host realm check',
    hostRealmBody: 'Every micro app has a probe button that writes {code} inside its sandbox. The host window you are looking at reads:',
    membraneHolds: 'the membrane holds',
    sandboxBreached: 'sandbox breached',
    containerIdle: 'container idle',
    mounting: 'mounting',
    mounted: 'mounted',
    failed: 'failed',
    crossingBoundary: 'crossing the sandbox boundary…',
    streamingIn: 'streaming the document in…',
    mountFailed: 'mount failed',
    isolated: 'isolated',
    live: 'live',
    entry: 'entry',
    trigramSandbox: 'JS sandbox',
    trigramStyles: 'style isolation',
    trigramMounted: 'mounted',
    mount: 'mount',
    propsChannelNote: 'every micro app exports an update lifecycle, so this reaches it live',
  },
  zh: {
    localeName: 'EN',
    localeSwitchLabel: '切换到英文',
    shellSubtitle: '@qiankunjs/react',
    dashboard: '总览',
    dashboardSub: '主应用视角',
    microApps: '微应用',
    eyebrow: '袖里乾坤 · qiankun 示例',
    heroTitle: '袖里自有乾坤。',
    heroLede:
      '五个互相独立的应用——React、Vue、webpack 传统构建、不经构建的纯 HTML，以及服务端流式推送的页面——都挂载在这个主应用里。每个都跑在自己的 JS 沙箱中、样式各自作用域化，这个页面能当场验证。主应用本身只是个普通 React 应用，通过 qiankun 自己的 React binding 挂载它们。',
    appRegistry: '微应用注册表',
    hostRealmCheck: '宿主 realm 检查',
    hostRealmBody: '每个微应用都有一个探针按钮，会在自己的沙箱里写入 {code}。而你正在看的这个宿主 window 读到的是：',
    membraneHolds: '隔离膜完好',
    sandboxBreached: '沙箱被击穿',
    containerIdle: '容器空闲',
    mounting: '挂载中',
    mounted: '已挂载',
    failed: '已失败',
    crossingBoundary: '正在穿过沙箱边界…',
    streamingIn: '文档流式注入中…',
    mountFailed: '挂载失败',
    isolated: '已隔离',
    live: '运行中',
    entry: '入口',
    trigramSandbox: 'JS 沙箱',
    trigramStyles: '样式隔离',
    trigramMounted: '已挂载',
    mount: '第',
    propsChannelNote: '每个微应用都导出了 update 生命周期，所以这个变化会实时抵达',
  },
};
