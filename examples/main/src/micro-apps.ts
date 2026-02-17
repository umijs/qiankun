import type { LifeCycles, MicroApp as MicroAppType } from 'qiankun';

export interface MicroAppConfig {
  name: string;
  entry: string;
  container: string;
  activeRule: string;
  props?: Record<string, unknown>;
}

// 子应用配置列表
export const microApps: MicroAppConfig[] = [
  {
    name: 'react16',
    entry: '//localhost:7100',
    container: '#micro-app-container',
    activeRule: '/react16',
  },
  {
    name: 'react15',
    entry: '//localhost:7101',
    container: '#micro-app-container',
    activeRule: '/react15',
  },
  {
    name: 'vue2',
    entry: '//localhost:7102',
    container: '#micro-app-container',
    activeRule: '/vue2',
  },
  {
    name: 'vue3',
    entry: '//localhost:7103',
    container: '#micro-app-container',
    activeRule: '/vue3',
  },
  {
    name: 'angular9',
    entry: '//localhost:7104',
    container: '#micro-app-container',
    activeRule: '/angular9',
  },
  {
    name: 'purehtml',
    entry: '//localhost:7105',
    container: '#micro-app-container',
    activeRule: '/purehtml',
  },
  {
    name: 'vite',
    entry: '//localhost:7106',
    container: '#micro-app-container',
    activeRule: '/vite',
  },
];

// 当前加载的微应用实例
let currentApp: MicroAppType | null = null;

// 加载微应用
export async function loadMicroApp(
  appName: string,
  containerElement: HTMLElement,
  lifeCycles?: LifeCycles<object>
): Promise<MicroAppType | null> {
  const { loadMicroApp: qiankunLoadMicroApp } = await import('qiankun');

  const appConfig = microApps.find((app) => app.name.toLowerCase() === appName.toLowerCase());

  if (!appConfig) {
    console.error(`Micro app "${appName}" not found`);
    return null;
  }

  // 先卸载当前应用
  if (currentApp) {
    await currentApp.unmount();
    currentApp = null;
  }

  // 清空容器
  containerElement.innerHTML = '';

  // 创建微应用容器
  const microContainer = document.createElement('div');
  microContainer.id = 'micro-app-container';
  microContainer.style.width = '100%';
  microContainer.style.height = '100%';
  containerElement.appendChild(microContainer);

  // 加载微应用
  currentApp = qiankunLoadMicroApp(
    {
      name: appConfig.name,
      entry: appConfig.entry,
      container: '#micro-app-container',
      props: appConfig.props,
    },
    lifeCycles
  );

  return currentApp;
}

// 卸载当前微应用
export async function unmountMicroApp(): Promise<void> {
  if (currentApp) {
    await currentApp.unmount();
    currentApp = null;
  }
}
