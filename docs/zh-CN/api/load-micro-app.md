# loadMicroApp

手动加载微应用。这对于动态加载微应用或当微应用不与路由关联时很有用。

## 🎯 函数签名

```typescript
function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>
): MicroApp
```

## 📋 参数

### app

- **类型**: `LoadableApp<T>`
- **必填**: ✅
- **描述**: 微应用配置

#### LoadableApp 结构

```typescript
interface LoadableApp<T extends ObjectType> {
  name: string;                    // Micro app name, globally unique
  entry: string | EntryOpts;       // Micro app entry
  container: string | HTMLElement; // Container for the micro app
  props?: T;                       // Custom data passed to micro app
}
```

| 属性 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `name` | `string` | ✅ | 微应用名称，作为唯一标识符 |
| `entry` | `string \| EntryOpts` | ✅ | 微应用入口，可以是 URL 或资源配置 |
| `container` | `string \| HTMLElement` | ✅ | 容器节点选择器或 DOM 元素 |
| `props` | `T` | ❌ | 传递给微应用的自定义数据 |

### configuration

- **类型**: `AppConfiguration`
- **必填**: ❌
- **描述**: 高级配置选项

```typescript
interface AppConfiguration {
  sandbox?: boolean;               // Enable sandbox isolation
  globalContext?: WindowProxy;     // Global context for the micro app
  fetch?: Function;                // Custom fetch function
  streamTransformer?: Function;    // Stream transformer
  nodeTransformer?: Function;      // Node transformer
}
```

### lifeCycles

- **类型**: `LifeCycles<T>`
- **必填**: ❌
- **描述**: 此特定微应用的生命周期钩子

## 🔄 返回值

返回一个具有以下方法的 `MicroApp` 实例：

```typescript
interface MicroApp {
  mount(): Promise<void>;          // Mount the micro app
  unmount(): Promise<void>;        // Unmount the micro app
  update(props: any): Promise<void>; // Update micro app props
  getStatus(): string;             // Get current status
  loadPromise: Promise<void>;      // Loading promise
  mountPromise: Promise<void>;     // Mounting promise
  unmountPromise: Promise<void>;   // Unmounting promise
}
```

## 💡 使用示例

### 基础用法

```typescript
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp({
  name: 'manual-app',
  entry: '//localhost:8080',
  container: '#manual-container',
});

// The micro app will be automatically mounted
```

### 带自定义 Props

```typescript
const microApp = loadMicroApp({
  name: 'dashboard',
  entry: '//localhost:8080',
  container: '#dashboard-container',
  props: {
    token: localStorage.getItem('token'),
    userId: getCurrentUserId(),
    theme: 'dark'
  }
});
```

### 带配置

```typescript
const microApp = loadMicroApp({
  name: 'third-party-app',
  entry: '//external.example.com',
  container: '#external-container',
}, {
  sandbox: false, // Disable sandbox for legacy apps
  fetch: customFetch, // Use custom fetch
});
```

### 带生命周期钩子

```typescript
const microApp = loadMicroApp({
  name: 'monitored-app',
  entry: '//localhost:8080',
  container: '#monitored-container',
}, undefined, {
  beforeMount: (app) => {
    console.log('About to mount:', app.name);
    showLoadingSpinner();
  },
  afterMount: (app) => {
    console.log('Mounted successfully:', app.name);
    hideLoadingSpinner();
  },
  beforeUnmount: (app) => {
    console.log('About to unmount:', app.name);
    saveUserState();
  }
});
```

## 🔧 高级用法

### 条件动态加载

```typescript
async function loadAppConditionally(condition: boolean) {
  if (condition) {
    const microApp = loadMicroApp({
      name: 'conditional-app',
      entry: '//localhost:8080',
      container: '#conditional-container',
    });
    
    return microApp;
  }
  return null;
}
```

### 加载多个应用

```typescript
function loadMultipleApps() {
  const apps = [
    { name: 'app1', entry: '//localhost:8001', container: '#container1' },
    { name: 'app2', entry: '//localhost:8002', container: '#container2' },
    { name: 'app3', entry: '//localhost:8003', container: '#container3' },
  ];

  const microApps = apps.map(app => loadMicroApp(app));
  return microApps;
}
```

### 手动控制

```typescript
const microApp = loadMicroApp({
  name: 'controlled-app',
  entry: '//localhost:8080',
  container: '#controlled-container',
});

// Manual unmount
await microApp.unmount();

// Update props
await microApp.update({ newData: 'updated' });

// Check status
console.log(microApp.getStatus()); // 'MOUNTED', 'UNMOUNTED', etc.
```

## 🎭 用例场景

### 1. 模态框/对话框应用

```typescript
function openAppModal() {
  const modal = document.createElement('div');
  modal.id = 'app-modal';
  document.body.appendChild(modal);

  const microApp = loadMicroApp({
    name: 'modal-app',
    entry: '//localhost:8080',
    container: modal,
    props: { 
      onClose: () => {
        microApp.unmount().then(() => {
          document.body.removeChild(modal);
        });
      }
    }
  });

  return microApp;
}
```

### 2. 基于标签页的应用

```typescript
class TabManager {
  private activeTabs = new Map<string, MicroApp>();

  async switchTab(tabName: string, config: LoadableApp) {
    // Unmount current active tab
    const currentApp = this.activeTabs.get('active');
    if (currentApp) {
      await currentApp.unmount();
    }

    // Load new tab
    const newApp = loadMicroApp({
      ...config,
      container: '#tab-content'
    });

    this.activeTabs.set('active', newApp);
    this.activeTabs.set(tabName, newApp);
  }
}
```

### 3. 组件系统

```typescript
class WidgetSystem {
  loadWidget(widgetConfig: any) {
    return loadMicroApp({
      name: `widget-${widgetConfig.id}`,
      entry: widgetConfig.url,
      container: `#widget-${widgetConfig.id}`,
      props: widgetConfig.props
    }, {
      sandbox: true // Isolate widgets
    });
  }
}
```

## ⚠️ 重要注意事项

### 容器管理

```typescript
// ❌ 错误：在没有适当清理的情况下重用容器
loadMicroApp({ name: 'app1', entry: '//localhost:8001', container: '#shared' });
loadMicroApp({ name: 'app2', entry: '//localhost:8002', container: '#shared' }); // Conflict!

// ✅ 正确：使用唯一容器或适当清理
const app1 = loadMicroApp({ name: 'app1', entry: '//localhost:8001', container: '#container1' });
const app2 = loadMicroApp({ name: 'app2', entry: '//localhost:8002', container: '#container2' });
```

### 内存管理

```typescript
// ✅ 正确：适当清理
const microApp = loadMicroApp({...});

// When done, always unmount
window.addEventListener('beforeunload', () => {
  microApp.unmount();
});
```

### 错误处理

```typescript
try {
  const microApp = loadMicroApp({
    name: 'potentially-failing-app',
    entry: '//unreliable-server.com',
    container: '#container',
  });

  // Wait for load
  await microApp.loadPromise;
  console.log('App loaded successfully');
} catch (error) {
  console.error('Failed to load micro app:', error);
  // Handle error - show fallback UI, retry, etc.
}
```

## 🆚 对比 registerMicroApps

| 特性 | `loadMicroApp` | `registerMicroApps` |
|------|----------------|---------------------|
| **加载方式** | 手动，立即 | 自动，基于路由 |
| **用例** | 动态加载、组件、模态框 | 主导航、SPA 路由 |
| **生命周期** | 手动控制 | 路由自动控制 |
| **性能** | 按需加载 | 可以预加载 |

## 🚀 最佳实践

### 1. 资源管理

```typescript
class MicroAppManager {
  private apps = new Map<string, MicroApp>();

  async loadApp(config: LoadableApp) {
    // Check if already loaded
    if (this.apps.has(config.name)) {
      return this.apps.get(config.name);
    }

    const app = loadMicroApp(config);
    this.apps.set(config.name, app);
    
    // Auto cleanup on unmount
    app.unmountPromise.then(() => {
      this.apps.delete(config.name);
    });

    return app;
  }
}
```

### 2. Props 管理

```typescript
// ✅ 正确：响应式 props
function createReactiveMicroApp(baseConfig: LoadableApp) {
  let currentApp: MicroApp;

  return {
    async updateProps(newProps: any) {
      if (currentApp) {
        await currentApp.update(newProps);
      }
    },
    
    async reload(newConfig: LoadableApp) {
      if (currentApp) {
        await currentApp.unmount();
      }
      currentApp = loadMicroApp({
        ...baseConfig,
        ...newConfig
      });
    }
  };
}
```

### 3. 错误边界

```typescript
function loadMicroAppWithFallback(config: LoadableApp, fallbackHTML: string) {
  const microApp = loadMicroApp(config);
  
  microApp.loadPromise.catch((error) => {
    console.error('Micro app failed to load:', error);
    // Show fallback content
    const container = typeof config.container === 'string' 
      ? document.querySelector(config.container)
      : config.container;
    
    if (container) {
      container.innerHTML = fallbackHTML;
    }
  });

  return microApp;
}
```

## 🔗 相关 API

- [registerMicroApps](/zh-CN/api/register-micro-apps) - 基于路由的微应用加载
- [start](/zh-CN/api/start) - 启动 qiankun 框架
- [生命周期](/zh-CN/api/lifecycles) - 详细的生命周期文档 