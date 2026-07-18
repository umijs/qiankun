# start

启动 qiankun 框架。此函数初始化微前端系统并启用基于路由的微应用自动加载。

## 🎯 函数签名

```typescript
function start(opts?: StartOpts): void
```

## 📋 参数

### opts

- **类型**: `StartOpts`
- **必填**: ❌
- **描述**: 启动配置选项

```typescript
interface StartOpts {
  prefetch?: boolean | 'all' | string[] | ((apps: RegistrableApp[]) => { criticalAppNames: string[]; minorAppsName: string[] });
  sandbox?: boolean | SandboxConfiguration;
  singular?: boolean;
  urlRerouteOnly?: boolean;
  // ... 其他 single-spa 启动选项
}
```

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `prefetch` | `boolean \| 'all' \| string[] \| Function` | `true` | 资源预取策略 |
| `sandbox` | `boolean \| SandboxConfiguration` | `true` | 沙箱隔离配置 |
| `singular` | `boolean` | `true` | 是否同时只能挂载一个微应用 |
| `urlRerouteOnly` | `boolean` | `true` | 是否仅在 URL 变化时触发路由 |

## 💡 使用示例

### 基础用法

```typescript
import { registerMicroApps, start } from 'qiankun';

// 先注册微应用
registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100',
    container: '#subapp-viewport',
    activeRule: '/react',
  },
  {
    name: 'vue-app',
    entry: '//localhost:7101',
    container: '#subapp-viewport',
    activeRule: '/vue',
  },
]);

// 启动 qiankun
start();
```

### 带配置的用法

```typescript
start({
  prefetch: false,          // 禁用预取
  sandbox: true,           // 启用沙箱
  singular: true,          // 同时只能有一个应用
  urlRerouteOnly: true,    // 仅在 URL 变化时路由
});
```

### 高级沙箱配置

```typescript
start({
  sandbox: {
    styleIsolation: true, // 通过 CSS @scope 把每个微应用的样式收敛到其容器内
  }
});
```

### 自定义预取策略

```typescript
start({
  prefetch: 'all', // 预取所有微应用
});

// 或者预取指定应用
start({
  prefetch: ['react-app', 'vue-app'], // 只预取这些应用
});

// 或者自定义预取函数
start({
  prefetch: (apps) => ({
    criticalAppNames: ['dashboard', 'user-center'], // 关键应用立即预取
    minorAppsName: ['analytics', 'settings'],       // 次要应用稍后预取
  })
});
```

## ⚙️ 配置选项

### 预取策略

#### 1. 布尔值

```typescript
// 完全禁用预取
start({ prefetch: false });

// 启用默认预取行为
start({ prefetch: true });
```

#### 2. 预取所有

```typescript
// 预取所有已注册的微应用
start({ prefetch: 'all' });
```

#### 3. 选择性预取

```typescript
// 只预取指定的应用
start({ 
  prefetch: ['critical-app1', 'critical-app2'] 
});
```

#### 4. 动态预取策略

```typescript
start({
  prefetch: (apps) => {
    // 自定义逻辑决定预取哪些应用
    const criticalApps = apps
      .filter(app => app.name.includes('critical'))
      .map(app => app.name);
    
    const minorApps = apps
      .filter(app => !app.name.includes('critical'))
      .map(app => app.name);

    return {
      criticalAppNames: criticalApps,  // 立即预取
      minorAppsName: minorApps,        // 空闲时预取
    };
  }
});
```

### 沙箱配置

#### 1. 布尔型沙箱

```typescript
// 启用基础沙箱
start({ sandbox: true });

// 禁用沙箱（不推荐）
start({ sandbox: false });
```

#### 2. 高级沙箱

```typescript
start({
  sandbox: {
    styleIsolation: true, // 基于 CSS @scope 的样式隔离
  }
});
```

### 性能选项

```typescript
start({
  singular: false,        // 允许多个应用同时挂载
  urlRerouteOnly: false,  // 在 URL 和编程式变化时都触发路由
});
```

## 🚀 最佳实践

### 1. 在注册后调用

```typescript
// ✅ 正确的顺序
registerMicroApps([...]);
start();

// ❌ 错误的顺序
start();
registerMicroApps([...]); // 这样不会正常工作
```

### 2. 基于环境的配置

```typescript
const startOpts = {
  prefetch: process.env.NODE_ENV === 'production' ? 'all' : false,
  sandbox: {
    styleIsolation: process.env.NODE_ENV === 'production',
  },
};

start(startOpts);
```

### 3. 性能优化

```typescript
// 在生产环境中获得更好的性能
start({
  prefetch: (apps) => ({
    criticalAppNames: ['dashboard'], // 只预取关键应用
    minorAppsName: [], // 不预取次要应用
  }),
  singular: true, // 防止内存问题
  sandbox: {
    styleIsolation: true, // 基于 @scope 的轻量级样式隔离
  },
});
```

### 4. 开发环境 vs 生产环境

```typescript
if (process.env.NODE_ENV === 'development') {
  start({
    prefetch: false,    // 更快的开发重载
    sandbox: false,     // 更容易调试
    singular: false,    // 更灵活的开发
  });
} else {
  start({
    prefetch: 'all',    // 更好的用户体验
    sandbox: true,      // 更好的隔离
    singular: true,     // 稳定的性能
  });
}
```

## 🔧 集成模式

### 1. 带加载状态

```typescript
import { registerMicroApps, start } from 'qiankun';

let isQiankunStarted = false;

function startQiankunWithLoading() {
  if (isQiankunStarted) return;

  showGlobalLoading();

  registerMicroApps([...], {
    beforeLoad: (app) => {
      console.log(`Loading ${app.name}...`);
    },
    afterMount: (app) => {
      console.log(`${app.name} mounted`);
      hideGlobalLoading();
    },
  });

  start({
    prefetch: 'all',
    sandbox: true,
  });

  isQiankunStarted = true;
}
```

### 2. 带错误处理

```typescript
function startQiankunSafely() {
  try {
    registerMicroApps([...]);
    
    start({
      prefetch: 'all',
      sandbox: true,
    });

    console.log('Qiankun started successfully');
  } catch (error) {
    console.error('Failed to start qiankun:', error);
    // 回退到传统路由或显示错误页面
    window.location.href = '/fallback';
  }
}
```

### 3. 带特性检测

```typescript
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  registerMicroApps([...]);
  start();
} else {
  console.warn('Browser not compatible with qiankun');
  // 回退实现
  initTraditionalRouting();
}
```

## ⚠️ 重要注意事项

### 1. 只调用一次

```typescript
// ❌ 错误：多次调用
start();
start(); // 这个调用会被忽略

// ✅ 正确：单次调用
start();
```

### 2. 顺序很重要

```typescript
// ✅ 正确顺序
registerMicroApps([...]);  // 1. 先注册应用
start();                   // 2. 然后启动

// ❌ 错误顺序 - 应用不会被正确注册
start();
registerMicroApps([...]);
```

### 3. 预取注意事项

```typescript
// ⚠️ 在大型应用中要小心使用 'all'
start({ prefetch: 'all' }); // 可能影响初始加载性能

// ✅ 更好：选择性预取
start({ 
  prefetch: ['critical-app1', 'critical-app2'] 
});
```

## 🎯 常见用例

### 1. 电商平台

```typescript
registerMicroApps([
  { name: 'product-catalog', entry: '//catalog.example.com', activeRule: '/products' },
  { name: 'shopping-cart', entry: '//cart.example.com', activeRule: '/cart' },
  { name: 'user-account', entry: '//account.example.com', activeRule: '/account' },
]);

start({
  prefetch: (apps) => ({
    criticalAppNames: ['shopping-cart'], // 总是预取购物车
    minorAppsName: ['user-account'],     // 空闲时预取账户
  }),
  sandbox: true,
  singular: true,
});
```

### 2. 管理后台

```typescript
start({
  prefetch: false,  // 不预取 - 管理工具按需使用
  sandbox: {
    styleIsolation: true, // 防止管理工具间的样式冲突
  },
  singular: false,  // 允许多个管理工具同时打开
});
```

### 3. 多租户平台

```typescript
const tenantId = getCurrentTenantId();

start({
  prefetch: [`tenant-${tenantId}-dashboard`], // 只预取当前租户的应用
  sandbox: true, // 隔离租户数据
  singular: true,
});
```

## 🔗 相关 API

- [registerMicroApps](/zh-CN/api/register-micro-apps) - 注册微应用
- [loadMicroApp](/zh-CN/api/load-micro-app) - 手动加载微应用
- [isRuntimeCompatible](/zh-CN/api/is-runtime-compatible) - 检查浏览器兼容性 