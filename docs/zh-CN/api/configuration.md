# Configuration

qiankun 提供灵活的配置选项来自定义微前端应用的行为。本文档涵盖了不同用例的所有可用配置选项。

## 📋 配置类型

### AppConfiguration

与 `loadMicroApp` 一起使用的单个微应用配置。

```typescript
type AppConfiguration = {
  sandbox?: boolean | SandboxConfiguration;
  fetch?: Function;
  streamTransformer?: Function;
  nodeTransformer?: Function;
};
```

### SandboxConfiguration

JS 沙箱的总配置。它在结构上是 `CompartmentOptions` 的公开投影，再加上两个 qiankun 宿主扩展（`plugins` 和 `styleIsolation`）。

```typescript
type SandboxConfiguration = Pick<
  CompartmentOptions,
  'globals' | 'incubatorContext' | 'modules' | 'resolveHook' | 'importHook' | 'loadHook'
> & {
  plugins?: readonly IsolationPlugin[];
  styleIsolation?: boolean;
};
```

### StartOpts

与 `start()` 一起使用的启动 qiankun 框架的配置。

```typescript
interface StartOpts {
  prefetch?: boolean | 'all' | string[] | ((apps: RegistrableApp[]) => { criticalAppNames: string[]; minorAppsName: string[] });
  sandbox?: boolean | SandboxConfiguration;
  singular?: boolean;
  urlRerouteOnly?: boolean;
  // ... other single-spa options
}
```

## ⚙️ 应用配置选项

### sandbox

**类型**: `boolean | SandboxConfiguration`

**默认值**: `true`

**描述**: JS 沙箱的总开关：`false` 完全关闭隔离；`true`（默认值）以默认配置启用；传入对象则在启用的同时配置底层 Compartment。

#### 基础用法

```typescript
// Enable sandbox (default)
loadMicroApp({
  name: 'my-app',
  entry: '//localhost:8080',
  container: '#container',
}, {
  sandbox: true
});

// Disable sandbox (not recommended)
loadMicroApp({
  name: 'legacy-app',
  entry: '//localhost:8080',
  container: '#container',
}, {
  sandbox: false
});

// Enable and configure sandbox
loadMicroApp({
  name: 'configured-app',
  entry: '//localhost:8080',
  container: '#container',
}, {
  sandbox: {
    styleIsolation: true,
    globals: { FEATURE_FLAG: true },
  }
});
```

#### 为什么使用沙箱？

```typescript
// With sandbox enabled, global variables are isolated
loadMicroApp({
  name: 'app1',
  entry: '//localhost:8001',
  container: '#container1',
}, {
  sandbox: true  // app1 gets its own global scope
});

loadMicroApp({
  name: 'app2', 
  entry: '//localhost:8002',
  container: '#container2',
}, {
  sandbox: true  // app2 gets its own isolated global scope
});
```

### sandbox.incubatorContext

**类型**: `WindowProxy`  
**默认值**: `window`  
**描述**: 孵化沙箱的宿主上下文——沙箱中未被遮蔽的属性都会透过它读取。命名取自 ShadowRealm 提案中的「incubator realm」；Compartment 规范没有对应概念，因为 Compartment 靠「默认没有」实现隔离，而 qiankun 靠对宿主上下文的投影实现隔离。

```typescript
// Create a custom incubator context
const customGlobal = new Proxy(window, {
  get(target, prop) {
    // Custom logic for property access
    if (prop === 'customAPI') {
      return { version: '1.0' };
    }
    return target[prop];
  }
});

loadMicroApp({
  name: 'custom-app',
  entry: '//localhost:8080',
  container: '#container',
}, {
  sandbox: {
    incubatorContext: customGlobal
  }
});
```

### sandbox.globals

**类型**：`Record<string, unknown | PropertyDescriptor>`

**默认值**：`{}`

**说明**：向当前应用的全局对象补充值或属性描述符，不会改动主应用的 `window`。命名沿用 Compartment 规范中的 `globals` endowments。

```typescript
loadMicroApp(app, {
  sandbox: {
    globals: {
      tenantId: 'acme',
      featureClient: { value: createFeatureClient(), writable: false },
    },
  },
});
```

经典脚本和 ESM 脚本都能读取这些变量。属性描述符的判定规则见[扩展沙箱隔离能力](/zh-CN/cookbook/sandbox-plugins)。

### sandbox.plugins

**类型**：`IsolationPlugin[]`

**默认值**：`[]`

**说明**：为当前应用注册隔离插件。用户插件排在 qiankun 内置插件之后。

`bootstrap` 插件一定早于子应用脚本；`mount` 插件每次挂载都会执行。插件返回的 `Free` 会参与卸载清理和再次挂载时的副作用恢复。完整协议及独立插件示例见[扩展沙箱隔离能力](/zh-CN/cookbook/sandbox-plugins)。

### sandbox.styleIsolation

**类型**：`boolean`

**默认值**：`false`

**说明**：启用运行时 CSS 隔离：所有微应用样式都会通过 CSS `@scope` 被限定在应用容器内。

```typescript
loadMicroApp(app, {
  sandbox: {
    styleIsolation: true,
  },
});
```

入口 HTML 中的静态样式由加载器转译时完成 scoped，而动态注入的样式依赖沙箱的 DOM 拦截——这正是 CSS 隔离归属于 `sandbox` 配置、只有 JS 沙箱开启时才可配置的原因。如果允许「只隔离 CSS 而不开沙箱」，动态样式会悄无声息地泄漏。

### 模块 hook（`sandbox.modules` / `resolveHook` / `importHook` / `loadHook`）

**类型**：`CompartmentOptions` 中与模块相关的配置

**默认值**：`{}`

**说明**：为当前应用的 Compartment 自定义 ESM 解析和加载流程，直接写在 `sandbox` 对象上。

可通过 `modules`、`resolveHook`、`importHook` 或其别名 `loadHook` 提供模块重定向、私有协议或预编译源码。这些配置只影响沙箱内的 ESM 加载。

### fetch

**类型**: `Function`  
**默认值**: `window.fetch`  
**描述**: 用于加载应用资源的自定义 fetch 函数。

#### 自定义头部

```typescript
const customFetch = async (url, options) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${getToken()}`,
      'X-Custom-Header': 'custom-value'
    }
  });
};

loadMicroApp({
  name: 'authenticated-app',
  entry: '//localhost:8080',
  container: '#container',
}, {
  fetch: customFetch
});
```

#### 请求转换

```typescript
const transformFetch = async (url, options) => {
  // Transform URLs
  const transformedUrl = url.replace('//localhost', '//production-domain');
  
  // Add custom logic
  console.log(`Fetching: ${transformedUrl}`);
  
  const response = await fetch(transformedUrl, options);
  
  // Transform response
  if (!response.ok) {
    throw new Error(`Failed to fetch ${transformedUrl}: ${response.status}`);
  }
  
  return response;
};
```

#### 缓存策略

```typescript
const cache = new Map();

const cachingFetch = async (url, options) => {
  const cacheKey = `${url}${JSON.stringify(options)}`;
  
  if (cache.has(cacheKey)) {
    console.log(`Cache hit for ${url}`);
    return cache.get(cacheKey);
  }
  
  const response = await fetch(url, options);
  cache.set(cacheKey, response.clone());
  
  return response;
};
```

### streamTransformer

**类型**: `Function`  
**描述**: 在加载过程中转换流式 HTML 内容。

```typescript
const customStreamTransformer = (stream) => {
  return stream.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      // Transform HTML chunks
      const transformedChunk = chunk
        .replace(/old-api/g, 'new-api')
        .replace(/deprecated-feature/g, 'updated-feature');
      
      controller.enqueue(transformedChunk);
    }
  }));
};

loadMicroApp({
  name: 'streaming-app',
  entry: '//localhost:8080',
  container: '#container',
}, {
  streamTransformer: customStreamTransformer
});
```

### nodeTransformer

**类型**: `Function`  
**描述**: 在应用加载过程中转换 DOM 节点。

```typescript
const customNodeTransformer = (node, options) => {
  // Transform script tags
  if (node.tagName === 'SCRIPT') {
    // Add custom attributes
    node.setAttribute('data-app', 'my-app');
    
    // Modify script source
    if (node.src) {
      node.src = node.src.replace('localhost', 'production-domain');
    }
  }
  
  // Transform style tags
  if (node.tagName === 'STYLE') {
    // Add CSS scope
    node.textContent = `.app-scope { ${node.textContent} }`;
  }
  
  return node;
};

loadMicroApp({
  name: 'transformed-app',
  entry: '//localhost:8080',
  container: '#container',
}, {
  nodeTransformer: customNodeTransformer
});
```

## 🚀 启动配置选项

### prefetch

**类型**: `boolean | 'all' | string[] | Function`  
**默认值**: `true`  
**描述**: 用于提升性能的资源预取策略。

#### 布尔值

```typescript
// Disable prefetch
start({ prefetch: false });

// Enable default prefetch
start({ prefetch: true });
```

#### 预取所有

```typescript
// Prefetch all registered micro apps
start({ prefetch: 'all' });
```

#### 选择性预取

```typescript
// Prefetch specific apps
start({ 
  prefetch: ['dashboard', 'user-profile', 'analytics'] 
});
```

#### 动态预取策略

```typescript
start({
  prefetch: (apps) => {
    // Business logic to determine prefetch strategy
    const currentTime = new Date().getHours();
    const isBusinessHours = currentTime >= 9 && currentTime <= 17;
    
    if (isBusinessHours) {
      // Prefetch business-critical apps during business hours
      return {
        criticalAppNames: ['dashboard', 'crm', 'finance'],
        minorAppsName: ['reporting', 'settings']
      };
    } else {
      // Minimal prefetch during off-hours
      return {
        criticalAppNames: ['dashboard'],
        minorAppsName: []
      };
    }
  }
});
```

#### 基于用户的预取

```typescript
start({
  prefetch: (apps) => {
    const userRole = getCurrentUserRole();
    
    switch (userRole) {
      case 'admin':
        return {
          criticalAppNames: ['admin-panel', 'user-management', 'system-monitor'],
          minorAppsName: ['reports', 'settings']
        };
      case 'user':
        return {
          criticalAppNames: ['dashboard', 'profile'],
          minorAppsName: ['help', 'feedback']
        };
      default:
        return {
          criticalAppNames: ['dashboard'],
          minorAppsName: []
        };
    }
  }
});
```

### sandbox

**类型**: `boolean | SandboxConfiguration`

**默认值**: `true`

**描述**: 所有微应用的框架级沙箱配置。

#### 基础沙箱

```typescript
// Enable sandbox for all apps
start({ sandbox: true });

// Disable sandbox for all apps (not recommended)
start({ sandbox: false });
```

#### 高级沙箱配置

```typescript
start({
  sandbox: {
    styleIsolation: true,  // Scope every micro-app style to its container via CSS @scope
  }
});
```

#### 样式隔离

**styleIsolation**: 通过 CSS `@scope` 把所有微应用样式限定在应用容器内
```typescript
start({
  sandbox: {
    styleIsolation: true,  // Good balance of isolation and compatibility
  }
});
```

### singular

**类型**: `boolean`  
**默认值**: `true`  
**描述**: 是否同时只能挂载一个微应用。

```typescript
// Only one app at a time (default)
start({ singular: true });

// Allow multiple apps simultaneously
start({ 
  singular: false  // Useful for dashboard-style applications
});
```

#### 多应用用例

```typescript
// Dashboard with multiple widgets
start({ 
  singular: false,
  // Other configurations
});

// Register widget-style micro apps
registerMicroApps([
  { name: 'widget-weather', entry: '//localhost:8001', container: '#widget-1', activeRule: '/dashboard' },
  { name: 'widget-stocks', entry: '//localhost:8002', container: '#widget-2', activeRule: '/dashboard' },
  { name: 'widget-news', entry: '//localhost:8003', container: '#widget-3', activeRule: '/dashboard' },
]);
```

### urlRerouteOnly

**类型**: `boolean`  
**默认值**: `true`  
**描述**: 是否仅在 URL 变化时触发路由。

```typescript
// Only route on URL changes (default)
start({ urlRerouteOnly: true });

// Route on both URL and programmatic changes
start({ 
  urlRerouteOnly: false  // More responsive but potentially more performance overhead
});
```

## 🔧 基于环境的配置

### 开发配置

```typescript
const developmentConfig = {
  prefetch: false,                    // Faster rebuilds
  sandbox: {
    styleIsolation: false,            // Unscoped styles are easier to debug
  },
  singular: false,                    // More flexible development
  urlRerouteOnly: false,             // More responsive navigation
};

if (process.env.NODE_ENV === 'development') {
  start(developmentConfig);
}
```

### 生产配置

```typescript
const productionConfig = {
  prefetch: 'all',                    // Better user experience
  sandbox: {
    styleIsolation: true,             // Scope styles to each app container
  },
  singular: true,                     // Stable performance
  urlRerouteOnly: true,              // Optimized routing
};

if (process.env.NODE_ENV === 'production') {
  start(productionConfig);
}
```

### 移动端配置

```typescript
const mobileConfig = {
  prefetch: (apps) => ({
    // Conservative prefetch on mobile
    criticalAppNames: ['home'],
    minorAppsName: []
  }),
  sandbox: {
    // @scope-based style isolation stays lightweight on mobile
    styleIsolation: true,
  },
  singular: true,                     // Better for mobile UX
};

const isMobile = window.innerWidth < 768;
if (isMobile) {
  start(mobileConfig);
}
```

## 🎯 高级配置模式

### 1. 特性标志集成

```typescript
const getConfigWithFeatureFlags = async () => {
  const featureFlags = await getFeatureFlags();
  
  return {
    prefetch: featureFlags.enablePrefetch ? 'all' : false,
    sandbox: {
      styleIsolation: featureFlags.styleIsolation,
    },
    singular: featureFlags.allowMultipleApps ? false : true,
  };
};

getConfigWithFeatureFlags().then(config => start(config));
```

### 2. 基于性能的配置

```typescript
const getPerformanceConfig = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
  
  if (isSlowConnection) {
    return {
      prefetch: false,              // No prefetch on slow connections
      sandbox: true,                // Default isolation, no extra work
      singular: true,
    };
  }
  
  return {
    prefetch: 'all',
    sandbox: {
      styleIsolation: true,
    },
    singular: false,
  };
};

start(getPerformanceConfig());
```

### 3. 基于用户角色的配置

```typescript
const getRoleBasedConfig = (userRole) => {
  const baseConfig = {
    sandbox: true,
    singular: true,
  };
  
  switch (userRole) {
    case 'admin':
      return {
        ...baseConfig,
        prefetch: 'all',              // Admins get all features
        singular: false,              // Can use multiple admin tools
      };
    case 'poweruser':
      return {
        ...baseConfig,
        prefetch: ['dashboard', 'analytics', 'reports'],
        singular: false,
      };
    default:
      return {
        ...baseConfig,
        prefetch: ['dashboard'],      // Basic users get minimal prefetch
        singular: true,
      };
  }
};

const userRole = getCurrentUserRole();
start(getRoleBasedConfig(userRole));
```

## ⚠️ 重要注意事项

### 1. 配置优先级

```typescript
// App-level configuration overrides global configuration
start({
  sandbox: true,  // Global setting
});

loadMicroApp({
  name: 'special-app',
  entry: '//localhost:8080',
  container: '#container',
}, {
  sandbox: false  // This overrides the global setting for this app
});
```

### 2. 性能考虑

```typescript
// ❌ 错误：影响性能的重配置
start({
  prefetch: 'all',                 // Might slow down initial load
  singular: false,                 // More memory usage
  urlRerouteOnly: false,          // More frequent route checks
});

// ✅ 正确：平衡的配置
start({
  prefetch: ['critical-app'],      // Only prefetch what's needed
  sandbox: {
    styleIsolation: true,          // Lightweight @scope-based CSS isolation
  },
  singular: true,                  // Stable performance
  urlRerouteOnly: true,           // Optimized routing
});
```

### 3. 调试配置

```typescript
const debugConfig = {
  sandbox: {
    styleIsolation: false,         // Unscoped styles are easier to inspect
  },
  // Custom fetch for logging
  fetch: async (url, options) => {
    console.log(`[DEBUG] Fetching: ${url}`);
    const response = await fetch(url, options);
    console.log(`[DEBUG] Response: ${response.status}`);
    return response;
  },
  // Custom node transformer for debugging
  nodeTransformer: (node, options) => {
    if (node.tagName === 'SCRIPT') {
      console.log(`[DEBUG] Processing script: ${node.src || 'inline'}`);
    }
    return node;
  }
};
```

## 🔗 相关 API

- [start](/zh-CN/api/start) - 使用配置启动 qiankun
- [loadMicroApp](/zh-CN/api/load-micro-app) - 使用配置加载应用
- [registerMicroApps](/zh-CN/api/register-micro-apps) - 注册应用
