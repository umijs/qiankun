# registerMicroApps

注册微应用到 qiankun 中，这是构建微前端应用的核心 API。

## 🎯 函数签名

```typescript
function registerMicroApps<T extends ObjectType>(
  apps: Array<RegistrableApp<T>>, 
  lifeCycles?: LifeCycles<T>
): void
```

## 📋 参数

### apps

- **类型**: `Array<RegistrableApp<T>>`
- **必填**: ✅
- **描述**: 微应用注册信息数组

#### RegistrableApp 结构

```typescript
interface RegistrableApp<T extends ObjectType> {
  name: string;                    // 微应用名称，全局唯一
  entry: string | { scripts?: string[], styles?: string[] }; // 微应用入口
  container: string | HTMLElement; // 微应用容器节点
  activeRule: string | (location: Location) => boolean; // 激活规则
  props?: T;                       // 传递给微应用的数据
  loader?: (loading: boolean) => void; // 加载状态回调
  configuration?: AppConfiguration; // 覆盖当前应用的加载配置
}
```

| 属性 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `name` | `string` | ✅ | 微应用名称，作为微应用的唯一标识 |
| `entry` | `string \| EntryOpts` | ✅ | 微应用的入口，可以是 URL 或资源配置对象 |
| `container` | `string \| HTMLElement` | ✅ | 微应用的容器节点选择器或 DOM 节点 |
| `activeRule` | `string \| Function` | ✅ | 微应用的激活规则 |
| `props` | `T` | ❌ | 传递给微应用的自定义数据 |
| `loader` | `Function` | ❌ | 微应用加载状态改变时的回调函数 |
| `configuration` | `AppConfiguration` | ❌ | 当前应用的加载配置，覆盖框架级默认值 |

### lifeCycles

- **类型**: `LifeCycles<T>`
- **必填**: ❌
- **描述**: 全局生命周期钩子

```typescript
interface LifeCycles<T extends ObjectType> {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
}
```

## 💡 使用示例

### 基础用法

```typescript
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react16App',
    entry: '//localhost:7100',
    container: '#subapp-viewport',
    activeRule: '/react16',
  },
  {
    name: 'vue3App', 
    entry: '//localhost:7101',
    container: '#subapp-viewport',
    activeRule: '/vue3',
  }
]);

start();
```

### 高级配置

```typescript
registerMicroApps([
  {
    name: 'dashboard',
    entry: {
      scripts: [
        '//localhost:7100/static/js/main.js'
      ],
      styles: [
        '//localhost:7100/static/css/main.css'
      ]
    },
    container: '#dashboard-container',
    activeRule: (location) => location.pathname.startsWith('/dashboard'),
    props: {
      token: 'your-auth-token',
      userId: 123,
      theme: 'dark'
    },
    loader: (loading) => {
      console.log('Dashboard app loading:', loading);
      // 显示/隐藏 loading 状态
    },
    configuration: {
      sandbox: {
        styleIsolation: true, // 为该应用开启样式隔离
      },
    }
  }
], {
  beforeLoad: [
    app => console.log('Before load:', app.name),
    app => trackEvent('micro-app-loading', { name: app.name })
  ],
  beforeMount: app => console.log('Before mount:', app.name),
  afterMount: app => console.log('After mount:', app.name),
  beforeUnmount: app => console.log('Before unmount:', app.name),
  afterUnmount: app => console.log('After unmount:', app.name),
});
```

## ⚙️ Entry 配置详解

### URL 字符串

最简单的配置方式，qiankun 会通过这个 URL 获取微应用的 HTML：

```typescript
{
  name: 'app1',
  entry: '//localhost:8080',
  // ...
}
```

### 资源对象

精确控制微应用的资源加载：

```typescript
{
  name: 'app2',
  entry: {
    scripts: [
      '//localhost:8080/static/js/chunk.js',
      '//localhost:8080/static/js/main.js'
    ],
    styles: [
      '//localhost:8080/static/css/main.css'
    ]
  },
  // ...
}
```

## 🎯 ActiveRule 配置

### 字符串路径

```typescript
{
  activeRule: '/react16'  // 匹配 /react16/xxx 路径
}
```

### 函数判断

```typescript
{
  activeRule: (location) => {
    // 自定义激活逻辑
    return location.pathname.startsWith('/admin') && 
           location.search.includes('module=dashboard');
  }
}
```

### 常见模式

```typescript
// 1. 精确匹配
activeRule: (location) => location.pathname === '/exact-path'

// 2. 多路径匹配
activeRule: (location) => ['/path1', '/path2'].some(path => 
  location.pathname.startsWith(path)
)

// 3. 带参数匹配
activeRule: (location) => /^\/user\/\d+/.test(location.pathname)

// 4. 查询参数匹配
activeRule: (location) => new URLSearchParams(location.search).get('app') === 'module1'
```

## 🔧 Container 配置

### CSS 选择器

```typescript
{
  container: '#micro-app-container'
}
```

### DOM 节点

```typescript
{
  container: document.querySelector('#container')
}
```

## 📨 Props 数据传递

微应用可以通过 props 参数接收主应用传递的数据：

```typescript
// 主应用
registerMicroApps([{
  name: 'child-app',
  // ...
  props: {
    data: { user: 'john' },
    methods: {
      onGlobalStateChange: (state) => console.log(state),
      setGlobalState: (state) => updateGlobalState(state)
    }
  }
}]);
```

```typescript
// 微应用
export async function mount(props) {
  console.log(props.data);     // { user: 'john' }
  console.log(props.methods);  // { onGlobalStateChange, setGlobalState }
}
```

## ⚠️ 注意事项

### 应用名称唯一性

```typescript
// ❌ 错误：重复的应用名称
registerMicroApps([
  { name: 'app1', entry: '//localhost:8080', /*...*/ },
  { name: 'app1', entry: '//localhost:8081', /*...*/ }, // 重复！
]);

// ✅ 正确：唯一的应用名称
registerMicroApps([
  { name: 'app1', entry: '//localhost:8080', /*...*/ },
  { name: 'app2', entry: '//localhost:8081', /*...*/ },
]);
```

### 容器节点存在性

```typescript
// ❌ 错误：容器节点不存在
registerMicroApps([{
  container: '#non-existent-container', // DOM 中不存在
  // ...
}]);

// ✅ 正确：确保容器节点存在
registerMicroApps([{
  container: '#app-container', // 确保 DOM 中存在
  // ...
}]);
```

### 重复注册

```typescript
// ❌ 错误：重复注册会导致应用重复加载
registerMicroApps([...]);
registerMicroApps([...]); // 重复注册

// ✅ 正确：只注册一次
registerMicroApps([...]);
```

## 🚀 最佳实践

### 1. 应用配置管理

```typescript
// 推荐：将应用配置抽取为单独文件
const microApps = [
  {
    name: 'order-management',
    entry: getAppEntry('order'),
    container: '#subapp-container',
    activeRule: '/order',
    props: getAppProps('order')
  },
  // ...
];

registerMicroApps(microApps, {
  beforeLoad: [initLoadingUI],
  afterMount: [removeLoadingUI],
});
```

### 2. 环境配置

```typescript
const getAppEntry = (name: string) => {
  const entries = {
    development: {
      order: '//localhost:8001',
      user: '//localhost:8002'
    },
    production: {
      order: '//order.example.com',
      user: '//user.example.com'
    }
  };
  
  return entries[process.env.NODE_ENV][name];
};
```

### 3. 统一错误处理

```typescript
registerMicroApps(microApps, {
  beforeLoad: (app) => {
    console.log(`Loading ${app.name}...`);
  },
  afterMount: (app) => {
    console.log(`${app.name} mounted successfully`);
  },
  beforeUnmount: (app) => {
    // 清理全局状态
    cleanupGlobalState(app.name);
  }
});
```

## 🔗 相关 API

- [start](/api/start) - 启动 qiankun
- [loadMicroApp](/api/load-micro-app) - 手动加载微应用
- [生命周期](/api/lifecycles) - 详细的生命周期说明
