# TypeScript 类型

qiankun 提供了全面的 TypeScript 类型定义，确保类型安全和出色的开发者体验。本文档涵盖了所有可用的类型和接口。

## 📋 核心类型

### ObjectType

**描述**：通用对象结构的基础类型。

```typescript
export type ObjectType = Record<string, unknown>;
```

**用法**：
```typescript
// 用作泛型类型的约束
function processApp<T extends ObjectType>(props: T): void {
  // T 可以是任何对象类型
}
```

### HTMLEntry

**描述**：微应用入口点的类型。

```typescript
export type HTMLEntry = string;
```

**用法**：
```typescript
const appEntry: HTMLEntry = '//localhost:8080';
const appEntryWithPath: HTMLEntry = '//localhost:8080/micro-app';
```

## 🏗️ 应用类型

### AppMetadata

**描述**：微应用的基础元数据。

```typescript
type AppMetadata = {
  name: string;    // 唯一的应用名称
  entry: HTMLEntry; // 应用入口 URL
};
```

### LoadableApp\<T\>

**描述**：手动加载微应用的配置。

```typescript
export type LoadableApp<T extends ObjectType> = AppMetadata & {
  container: HTMLElement;  // DOM 容器元素
  props?: T;              // 传递给应用的自定义属性
};
```

**用法**：
```typescript
// 基础用法
const app: LoadableApp<{}> = {
  name: 'my-app',
  entry: '//localhost:8080',
  container: document.getElementById('app-container')!,
};

// 带自定义属性
interface MyAppProps {
  theme: 'light' | 'dark';
  userId: string;
}

const appWithProps: LoadableApp<MyAppProps> = {
  name: 'themed-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!,
  props: {
    theme: 'dark',
    userId: '123'
  }
};
```

### RegistrableApp\<T\>

**描述**：基于路由的微应用配置。

```typescript
export type RegistrableApp<T extends ObjectType> = LoadableApp<T> & {
  loader?: (loading: boolean) => void;                    // 加载状态回调
  activeRule: RegisterApplicationConfig['activeWhen'];    // 路由激活规则
};
```

**用法**：
```typescript
import { registerMicroApps } from 'qiankun';

interface UserAppProps {
  currentUser: { id: string; name: string };
}

const apps: RegistrableApp<UserAppProps>[] = [
  {
    name: 'user-dashboard',
    entry: '//localhost:8001',
    container: '#subapp-viewport',
    activeRule: '/dashboard',
    props: {
      currentUser: { id: '123', name: 'John' }
    },
    loader: (loading) => {
      if (loading) {
        showLoadingSpinner();
      } else {
        hideLoadingSpinner();
      }
    }
  }
];

registerMicroApps(apps);
```

## ⚙️ 配置类型

### AppConfiguration

**描述**：单个微应用的配置选项。

```typescript
export type AppConfiguration = Partial<Pick<LoaderOpts, 'fetch' | 'streamTransformer' | 'nodeTransformer'>> & {
  sandbox?: boolean;        // 启用沙箱隔离
  globalContext?: WindowProxy; // 自定义全局上下文
};
```

**用法**：
```typescript
import { loadMicroApp } from 'qiankun';

const customConfig: AppConfiguration = {
  sandbox: true,
  globalContext: window,
  fetch: async (url, options) => {
    // 自定义 fetch 实现
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': 'Bearer token'
      }
    });
  },
  nodeTransformer: (node, opts) => {
    // 转换 DOM 节点
    if (node.tagName === 'SCRIPT') {
      node.setAttribute('data-app', 'my-app');
    }
    return node;
  }
};

loadMicroApp({
  name: 'configured-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!
}, customConfig);
```

## 🔄 生命周期类型

### LifeCycleFn\<T\>

**描述**：生命周期钩子函数的类型。

```typescript
export type LifeCycleFn<T extends ObjectType> = (
  app: LoadableApp<T>, 
  global: WindowProxy
) => Promise<void>;
```

**用法**：
```typescript
const beforeLoadHook: LifeCycleFn<{ theme: string }> = async (app, global) => {
  console.log(`正在加载应用: ${app.name}`);
  global.__APP_THEME__ = app.props?.theme || 'default';
};

const afterMountHook: LifeCycleFn<any> = async (app, global) => {
  console.log(`应用 ${app.name} 挂载成功`);
  // 跟踪分析
  analytics.track('app_mounted', { appName: app.name });
};
```

### LifeCycles\<T\>

**描述**：完整的生命周期钩子配置。

```typescript
export type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
```

**用法**：
```typescript
interface AppProps {
  userId: string;
  permissions: string[];
}

const lifecycles: LifeCycles<AppProps> = {
  beforeLoad: async (app, global) => {
    // 加载前设置
    global.__USER_ID__ = app.props?.userId;
  },
  
  beforeMount: [
    async (app, global) => {
      // 多个钩子作为数组
      await setupAuthentication(app.props?.userId);
    },
    async (app, global) => {
      await loadUserPermissions(app.props?.permissions);
    }
  ],
  
  afterMount: async (app) => {
    console.log(`${app.name} 已准备就绪`);
  },
  
  beforeUnmount: async (app) => {
    // 卸载前清理
    await saveUserState(app.name);
  },
  
  afterUnmount: async (app) => {
    // 最终清理
    await clearUserData(app.name);
  }
};
```

## 🎯 微应用类型

### MicroApp

**描述**：已加载微应用的实例。

```typescript
export type MicroApp = Parcel;
```

`MicroApp` 类型扩展了 single-spa 的 `Parcel` 接口，包含以下方法：

```typescript
interface MicroApp {
  mount(): Promise<void>;           // 挂载应用
  unmount(): Promise<void>;         // 卸载应用
  update(props: any): Promise<void>; // 更新应用属性
  getStatus(): string;              // 获取当前状态
  loadPromise: Promise<void>;       // 加载完成时解析的 Promise
  mountPromise: Promise<void>;      // 挂载完成时解析的 Promise
  unmountPromise: Promise<void>;    // 卸载完成时解析的 Promise
}
```

**用法**：
```typescript
import { loadMicroApp } from 'qiankun';

const microApp: MicroApp = loadMicroApp({
  name: 'my-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!
});

// 检查状态
console.log(microApp.getStatus()); // 'LOADING', 'MOUNTED', 'UNMOUNTED', 等

// 等待挂载
await microApp.mountPromise;
console.log('应用已挂载');

// 更新属性
await microApp.update({ newTheme: 'dark' });

// 完成后卸载
await microApp.unmount();
```

### MicroAppLifeCycles

**描述**：qiankun 使用的内部生命周期类型。

```typescript
export type MicroAppLifeCycles = FlattenArrayValue<ParcelLifeCycles<ExtraProps>>;
```

这个类型主要用于内部使用，表示微应用必须导出的扁平化生命周期函数。

## 🌐 全局类型

### Window 扩展

qiankun 为全局 `Window` 接口添加了特殊属性：

```typescript
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;           // 指示应用运行在 qiankun 中
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string; // 注入的公共路径
    __QIANKUN_DEVELOPMENT__?: boolean;          // 开发模式标志
    Zone?: CallableFunction;                    // Zone.js 兼容性
    __zone_symbol__setTimeout?: Window['setTimeout']; // Zone.js 超时
  }
}
```

**在微应用中的用法**：
```typescript
// 检查是否在 qiankun 中运行
if (window.__POWERED_BY_QIANKUN__) {
  console.log('作为微应用运行');
  
  // 使用注入的公共路径
  const publicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/';
  
  // 相应地配置你的应用
  setupApp({ publicPath });
} else {
  console.log('独立运行');
  setupApp({ publicPath: '/' });
}
```

## 🎨 工具类型

### 自定义类型守卫

为更好的类型安全创建类型守卫：

```typescript
// LoadableApp 的类型守卫
function isLoadableApp<T extends ObjectType>(
  app: any
): app is LoadableApp<T> {
  return (
    typeof app === 'object' &&
    typeof app.name === 'string' &&
    typeof app.entry === 'string' &&
    app.container instanceof HTMLElement
  );
}

// RegistrableApp 的类型守卫
function isRegistrableApp<T extends ObjectType>(
  app: any
): app is RegistrableApp<T> {
  return (
    isLoadableApp(app) &&
    (typeof app.activeRule === 'string' || typeof app.activeRule === 'function')
  );
}

// 用法
function processApp(app: unknown) {
  if (isRegistrableApp(app)) {
    // TypeScript 在这里知道 app 是 RegistrableApp
    console.log(`注册应用: ${app.name}，规则: ${app.activeRule}`);
  } else if (isLoadableApp(app)) {
    // TypeScript 在这里知道 app 是 LoadableApp
    console.log(`加载应用: ${app.name}`);
  }
}
```

### 通用辅助类型

为常见模式创建可重用的泛型类型：

```typescript
// 支持主题的属性
type ThemedProps<T = {}> = T & {
  theme?: 'light' | 'dark';
};

// 带用户上下文的属性
type UserAwareProps<T = {}> = T & {
  currentUser?: {
    id: string;
    name: string;
    role: string;
  };
};

// 组合属性
type AppProps<T = {}> = ThemedProps<UserAwareProps<T>>;

// 用法
const app: LoadableApp<AppProps<{ customData: string }>> = {
  name: 'themed-user-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!,
  props: {
    theme: 'dark',
    currentUser: { id: '123', name: 'John', role: 'admin' },
    customData: '自定义值'
  }
};
```

## 📖 高级类型模式

### 基于配置的条件类型

```typescript
// 基于环境的配置
type EnvironmentConfig<T extends 'development' | 'production'> = T extends 'development'
  ? {
      sandbox: false;
      prefetch: false;
      strictStyleIsolation: false;
    }
  : {
      sandbox: true;
      prefetch: 'all';
      strictStyleIsolation: true;
    };

// 与环境检测一起使用
declare const NODE_ENV: 'development' | 'production';
type CurrentConfig = EnvironmentConfig<typeof NODE_ENV>;
```

### 应用名称的品牌类型

```typescript
// 为应用名称创建品牌类型以防止混淆
type AppName = string & { readonly __brand: unique symbol };

function createAppName(name: string): AppName {
  return name as AppName;
}

// 带品牌名称的增强 LoadableApp
type SafeLoadableApp<T extends ObjectType> = Omit<LoadableApp<T>, 'name'> & {
  name: AppName;
};

// 用法
const appName = createAppName('my-secure-app');
const app: SafeLoadableApp<{}> = {
  name: appName, // 类型安全的应用名称
  entry: '//localhost:8080',
  container: document.getElementById('container')!
};
```

### 生命周期事件类型

```typescript
// 带事件数据的增强生命周期
type LifeCycleEvent<T extends ObjectType> = {
  app: LoadableApp<T>;
  global: WindowProxy;
  timestamp: number;
  phase: 'beforeLoad' | 'beforeMount' | 'afterMount' | 'beforeUnmount' | 'afterUnmount';
};

type EnhancedLifeCycleFn<T extends ObjectType> = (event: LifeCycleEvent<T>) => Promise<void>;

// 用法
const enhancedHook: EnhancedLifeCycleFn<{ userId: string }> = async (event) => {
  console.log(`阶段: ${event.phase}，应用: ${event.app.name}，时间: ${event.timestamp}`);
  
  if (event.phase === 'beforeMount') {
    // 设置用户上下文
    event.global.__USER_ID__ = event.app.props?.userId;
  }
};
```

## 🔍 类型推断示例

### 自动属性类型推断

```typescript
// 带自动类型推断的辅助函数
function createTypedApp<T extends ObjectType>(
  config: {
    name: string;
    entry: string;
    container: HTMLElement;
    props: T;
  }
): LoadableApp<T> {
  return config; // TypeScript 推断正确的类型
}

// 用法 - TypeScript 自动推断属性类型
const app = createTypedApp({
  name: 'inferred-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!,
  props: {
    theme: 'dark',
    userId: '123',
    features: ['feature1', 'feature2']
  }
  // TypeScript 知道 props 类型是 { theme: string; userId: string; features: string[] }
});
```

### 生命周期类型推断

```typescript
// 创建类型化生命周期的辅助函数
function createLifecycles<T extends ObjectType>(
  lifecycles: LifeCycles<T>
): LifeCycles<T> {
  return lifecycles;
}

// 带推断的用法
const typedLifecycles = createLifecycles({
  beforeMount: async (app) => {
    // TypeScript 根据用法推断 app.props 类型
    console.log(app.props?.theme); // TypeScript 知道这可能是 undefined
  }
});
```

## ⚡ 最佳实践

### 1. 使用严格类型

```typescript
// ✅ 好：严格类型
interface StrictAppProps {
  readonly userId: string;
  readonly theme: 'light' | 'dark';
  readonly permissions: readonly string[];
}

const app: LoadableApp<StrictAppProps> = {
  name: 'strict-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!,
  props: {
    userId: '123',
    theme: 'dark',
    permissions: ['read', 'write']
  }
};

// ❌ 坏：松散类型
const looseApp: LoadableApp<any> = {
  name: 'loose-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!,
  props: { anything: 'goes' } // 没有类型安全
};
```

### 2. 创建领域特定类型

```typescript
// 为你的领域创建特定类型
interface ECommerceAppProps {
  cartId: string;
  currency: 'USD' | 'EUR' | 'GBP';
  customerSegment: 'premium' | 'standard';
  features: {
    wishlist: boolean;
    recommendations: boolean;
    reviews: boolean;
  };
}

type ECommerceApp = LoadableApp<ECommerceAppProps>;
type ECommerceLifecycles = LifeCycles<ECommerceAppProps>;
```

### 3. 使用泛型约束

```typescript
// 为更好的类型安全约束泛型类型
interface BaseAppProps {
  version: string;
  environment: 'development' | 'staging' | 'production';
}

function createApp<T extends BaseAppProps>(
  config: Omit<LoadableApp<T>, 'container'> & {
    containerId: string;
  }
): LoadableApp<T> {
  const container = document.getElementById(config.containerId);
  if (!container) {
    throw new Error(`容器 ${config.containerId} 未找到`);
  }
  
  return {
    ...config,
    container
  };
}
```

## 🔗 相关文档

- [API 参考](/zh-CN/api/) - 主要 API 文档
- [生命周期](/zh-CN/api/lifecycles) - 详细的生命周期文档
- [配置选项](/zh-CN/api/configuration) - 配置选项 