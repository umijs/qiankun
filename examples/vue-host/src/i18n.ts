import { computed, readonly, ref, type ComputedRef, type Ref } from 'vue';

/**
 * The shell's locale, and the one it hands micro apps through `appProps`.
 *
 * Only prose is translated. Technology names, API surface (`<MicroApp>`, `data-name`), loading
 * paths and package names stay as they are — translating them would make the demo harder to
 * match against the code it demonstrates, not easier.
 *
 * The storage key is shared with the React shell on purpose: on the deployed site the two are
 * one origin, so picking a language in one carries over to the other.
 */
export type Locale = 'en' | 'zh';

const STORAGE_KEY = 'qiankun-examples-locale';

function initial(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'zh') return stored;
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

const current = ref<Locale>(initial());
document.documentElement.lang = current.value === 'zh' ? 'zh-CN' : 'en';

export const locale: Readonly<Ref<Locale>> = readonly(current);

export function setLocale(next: Locale): void {
  if (next === current.value) return;
  current.value = next;
  window.localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
}

export function toggleLocale(): void {
  setLocale(current.value === 'en' ? 'zh' : 'en');
}

/** Spelled out rather than inferred, so a missing translation is a type error, not a silent gap. */
export interface Messages {
  /** what the switcher offers to switch *to* */
  localeName: string;
  localeSwitchLabel: string;
  shellSubtitle: string;
  introEyebrow: string;
  introTitle: string;
  introLede: string;
  containerIdle: string;
  mounting: string;
  mounted: string;
  failed: string;
  crossingBoundary: string;
  /** the non-covering loader tag: the streamed app must stay visible while it mounts */
  streamingIn: string;
  mountFailed: string;
  entry: string;
  mount: string;
  propsChannelNote: string;
  dashboard: string;
  dashboardSub: string;
  microApps: string;
  appRegistry: string;
  hostRealmCheck: string;
  /** `{code}` is replaced with the `window.__SANDBOX_PROBE__` code element */
  hostRealmBody: string;
  membraneHolds: string;
  sandboxBreached: string;
  isolated: string;
  live: string;
  trigramSandbox: string;
  trigramStyles: string;
  trigramMounted: string;
}

export const messages: Record<Locale, Messages> = {
  en: {
    localeName: '中文',
    localeSwitchLabel: 'Switch to Chinese',
    shellSubtitle: '@qiankunjs/vue',
    introEyebrow: '袖里乾坤 · vue host',
    introTitle: 'The same five apps, mounted from Vue.',
    introLede:
      'This shell is a plain Vue 3 app. It mounts the micro apps with <MicroApp> from @qiankunjs/vue — the binding we publish — and dresses its #loader and #error-boundary slots. Pick an app on the left; “Missing app” is unreachable on purpose, so the error slot has something to show.',
    containerIdle: 'container idle',
    mounting: 'mounting',
    mounted: 'mounted',
    failed: 'failed',
    crossingBoundary: 'crossing the sandbox boundary…',
    streamingIn: 'streaming the document in…',
    mountFailed: 'mount failed',
    entry: 'entry',
    mount: 'mount',
    propsChannelNote: 'every micro app exports an update lifecycle, so this reaches it live',
    dashboard: 'Dashboard',
    dashboardSub: 'host overview',
    microApps: 'Micro apps',
    appRegistry: 'App registry',
    hostRealmCheck: 'Host realm check',
    hostRealmBody:
      'Every micro app has a probe button that writes {code} inside its sandbox. The host window you are looking at reads:',
    membraneHolds: 'the membrane holds',
    sandboxBreached: 'sandbox breached',
    isolated: 'isolated',
    live: 'live',
    trigramSandbox: 'JS sandbox',
    trigramStyles: 'style isolation',
    trigramMounted: 'mounted',
  },
  zh: {
    localeName: 'EN',
    localeSwitchLabel: '切换到英文',
    shellSubtitle: '@qiankunjs/vue',
    introEyebrow: '袖里乾坤 · vue 主应用',
    introTitle: '同样的五个应用，这次由 Vue 挂载。',
    introLede:
      '这个主应用就是个普通的 Vue 3 应用。它用我们发布的 @qiankunjs/vue 里的 <MicroApp> 挂载微应用，并接管了 #loader 与 #error-boundary 两个插槽。左边随便选一个；“缺失的应用”是故意打不通的，好让错误插槽有东西可展示。',
    containerIdle: '容器空闲',
    mounting: '挂载中',
    mounted: '已挂载',
    failed: '已失败',
    crossingBoundary: '正在穿过沙箱边界…',
    streamingIn: '文档流式注入中…',
    mountFailed: '挂载失败',
    entry: '入口',
    mount: '第',
    propsChannelNote: '每个微应用都导出了 update 生命周期，所以这个变化会实时抵达',
    dashboard: '总览',
    dashboardSub: '主应用视角',
    microApps: '微应用',
    appRegistry: '微应用注册表',
    hostRealmCheck: '宿主 realm 检查',
    hostRealmBody: '每个微应用都有一个探针按钮，会在自己的沙箱里写入 {code}。而你正在看的这个宿主 window 读到的是：',
    membraneHolds: '隔离膜完好',
    sandboxBreached: '沙箱被击穿',
    isolated: '已隔离',
    live: '运行中',
    trigramSandbox: 'JS 沙箱',
    trigramStyles: '样式隔离',
    trigramMounted: '已挂载',
  },
};

export const t: ComputedRef<Messages> = computed(() => messages[current.value]);
