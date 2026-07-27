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
  mountFailed: string;
  jsSandbox: string;
  noSandbox: string;
  styleIsolation: string;
  noStyleIsolation: string;
  entry: string;
  mount: string;
  propsChannelNote: string;
}

export const messages: Record<Locale, Messages> = {
  en: {
    localeName: '中文',
    localeSwitchLabel: 'Switch to Chinese',
    shellSubtitle: 'vue host · @qiankunjs/vue',
    introEyebrow: '袖里乾坤 · vue host',
    introTitle: 'The same four apps, mounted from Vue.',
    introLede:
      'This shell is a plain Vue 3 app. It mounts the micro apps with <MicroApp> from @qiankunjs/vue — the binding we publish — and dresses its #loader and #error-boundary slots. Pick an app on the left; “Missing app” is unreachable on purpose, so the error slot has something to show.',
    containerIdle: 'container idle',
    mounting: 'mounting',
    mounted: 'mounted',
    failed: 'failed',
    crossingBoundary: 'crossing the sandbox boundary…',
    mountFailed: 'mount failed',
    jsSandbox: 'js sandbox',
    noSandbox: 'no sandbox',
    styleIsolation: 'style isolation',
    noStyleIsolation: 'no style isolation',
    entry: 'entry',
    mount: 'mount',
    propsChannelNote: 'every micro app exports an update lifecycle, so this reaches it live',
  },
  zh: {
    localeName: 'EN',
    localeSwitchLabel: '切换到英文',
    shellSubtitle: 'vue 主应用 · @qiankunjs/vue',
    introEyebrow: '袖里乾坤 · vue 主应用',
    introTitle: '同样的四个应用，这次由 Vue 挂载。',
    introLede:
      '这个主应用就是个普通的 Vue 3 应用。它用我们发布的 @qiankunjs/vue 里的 <MicroApp> 挂载微应用，并接管了 #loader 与 #error-boundary 两个插槽。左边随便选一个；“缺失的应用”是故意打不通的，好让错误插槽有东西可展示。',
    containerIdle: '容器空闲',
    mounting: '挂载中',
    mounted: '已挂载',
    failed: '已失败',
    crossingBoundary: '正在穿过沙箱边界…',
    mountFailed: '挂载失败',
    jsSandbox: 'JS 沙箱',
    noSandbox: '无沙箱',
    styleIsolation: '样式隔离',
    noStyleIsolation: '无样式隔离',
    entry: '入口',
    mount: '第',
    propsChannelNote: '每个微应用都导出了 update 生命周期，所以这个变化会实时抵达',
  },
};

export const t: ComputedRef<Messages> = computed(() => messages[current.value]);
