# React 绑定

qiankun 的官方 React 绑定提供了一种声明式的方式来将微应用集成到您的 React 主应用中。`@qiankunjs/react` 包提供了一个强大的 `<MicroApp />` 组件，内置加载状态、错误处理和完整的 TypeScript 类型。

## 📦 安装

```bash
npm install @qiankunjs/react
```

**要求：**

- React ≥ 16.9.0
- qiankun ≥ 3.0.0

## 🚀 快速开始

### 基本用法

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

function App() {
  return (
    <div className="main-app">
      <h1>主应用</h1>
      <MicroApp name="dashboard" entry="//localhost:8080" />
    </div>
  );
}

export default App;
```

### 带加载状态

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

function App() {
  return (
    <MicroApp
      name="dashboard"
      entry="//localhost:8080"
      autoSetLoading // 使用内置的加载态组件
    />
  );
}
```

微应用挂载完成（进入 `MOUNTED` 状态）或加载失败时，加载态都会结束。如果你更想自己画加载动画，直接传 `loader` 即可，不需要同时传 `autoSetLoading`（见下文「自定义加载组件」）。

### 带错误处理

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

function App() {
  return (
    <MicroApp
      name="dashboard"
      entry="//localhost:8080"
      autoSetLoading
      autoCaptureError // 使用内置的错误展示组件
    />
  );
}
```

### 配置沙箱与样式隔离

组件本身不定义沙箱相关的属性，该微应用的所有 qiankun 配置都通过 `settings` 传入：

```tsx
<MicroApp name="dashboard" entry="//localhost:8080" settings={{ sandbox: { styleIsolation: true } }} />
```

不传 `settings` 时 JS 沙箱默认开启、样式隔离默认关闭。`settings` 只在挂载时读取一次，挂载之后再修改它不会生效（见下文「动态切换微应用」）。完整选项见[配置](/zh-CN/api/configuration)与[样式隔离](/zh-CN/cookbook/style-isolation)。

## 🎯 组件 API

### 属性

| 属性               | 类型                                       | 必需 | 默认值      | 描述                                                                                     |
| ------------------ | ------------------------------------------ | ---- | ----------- | ---------------------------------------------------------------------------------------- |
| `name`             | `string`                                   | ✅   | -           | 微应用的唯一名称，也是组件判断「是否换了一个应用」的唯一依据                             |
| `entry`            | `string`                                   | ✅   | -           | 微应用的 HTML 入口地址，只在挂载时读取                                                   |
| `settings`         | `AppConfiguration`                         | ❌   | `undefined` | 该微应用的 qiankun 配置（沙箱、样式隔离、fetch 等），不传时按 `{}` 处理，只在挂载时读取   |
| `lifeCycles`       | `LifeCycles`                               | ❌   | `undefined` | 该微应用的生命周期钩子，只在挂载时读取，且不要闭包捕获组件状态（见下文）                  |
| `autoSetLoading`   | `boolean`                                  | ❌   | `false`     | 使用内置的加载态组件                                                                     |
| `loader`           | `(loading: boolean) => React.ReactNode`     | ❌   | `undefined` | 自定义加载态组件，可单独使用；与 `autoSetLoading` 同时传入时以它为准                      |
| `autoCaptureError` | `boolean`                                  | ❌   | `false`     | 使用内置的错误展示组件                                                                   |
| `errorBoundary`    | `(error: Error) => React.ReactNode`         | ❌   | `undefined` | 自定义错误展示组件，可单独使用；与 `autoCaptureError` 同时传入时以它为准                  |
| `className`        | `string`                                   | ❌   | `undefined` | 微应用容器的 CSS 类                                                                      |
| `wrapperClassName` | `string`                                   | ❌   | `undefined` | 包装器的 CSS 类（仅在启用了加载态或错误展示、即存在包装器时有效）                      |

组件自身的属性都有完整类型，传错类型会直接编译报错。

### 额外属性

除组件自身消费的属性之外，传递给 `<MicroApp />` 的任何额外属性都会作为 props 转发给微应用：

```tsx
<MicroApp
  name="user-profile"
  entry="//localhost:8080"
  // 这些属性会传递给微应用
  userId={user.id}
  theme="dark"
  permissions={user.permissions}
/>
```

以下属性由组件自己消费，**不会**转发给微应用：`name`、`entry`、`settings`、`lifeCycles`、`autoSetLoading`、`autoCaptureError`、`loader`、`errorBoundary`、`wrapperClassName`、`className`、`appProps`。其中 `appProps` 是 Vue 绑定给微应用 props 准备的通道，React 侧没有这个属性，传了也只会被丢弃——请把属性直接平铺在 `<MicroApp />` 上。

挂载完成后额外属性发生变化，会通过微应用的 `update` 生命周期送达。组件内部对这些属性做了深比较，值没变就不会触发更新。

### 渲染结构

启用了加载态或错误展示（`loader`、`autoSetLoading`、`errorBoundary`、`autoCaptureError` 任意一个）时，组件会多渲染一层包装器，渲染结果如下：

```tsx
<div style={{ position: 'relative' }} className={`${wrapperClassName} qiankun-micro-app-wrapper`}>
  <div className={`${className} qiankun-micro-app-container`} />
  {/* loader 返回的内容 */}
  {/* errorBoundary 返回的内容（仅在出错时渲染） */}
</div>
```

容器永远排在最前面：qiankun 以容器在 DOM 中的位置（XPath，会数它前面的同标签兄弟节点）作为每个容器的缓存键，如果条件渲染的 loader 排在容器之前，同一个应用会在两次挂载间被拆成两份缓存。也正因为插槽排在容器之后，它们天然覆盖在微应用之上，不需要 `z-index`；包装器自带 `position: relative`，插槽用 `position: absolute` 即可铺满。

都没启用时，只渲染容器本身：

```tsx
<div className={`${className} qiankun-micro-app-container`} />
```

## 🔄 生命周期管理

### 使用 Ref 访问微应用实例

```tsx
import React, { useRef } from 'react';
import { MicroApp, type MicroAppType } from '@qiankunjs/react';

function App() {
  const microAppRef = useRef<MicroAppType>(undefined);

  const handleCheckStatus = () => {
    // 获取微应用状态
    console.log(microAppRef.current?.getStatus());
  };

  return (
    <div>
      <button onClick={handleCheckStatus}>查看微应用状态</button>
      <MicroApp ref={microAppRef} name="dashboard" entry="//localhost:8080" />
    </div>
  );
}
```

几点说明：

- `MicroAppType` 由 `@qiankunjs/react` 直接导出；在 React 19 的类型下 `useRef<MicroAppType>()` 无法通过编译，必须显式写成 `useRef<MicroAppType>(undefined)`。
- ref 的值只在 React 渲染提交时刷新，因此在父组件的挂载副作用（`useEffect(..., [])`）里读到的仍然是 `undefined`，请在事件回调或后续渲染中读取。
- 卸载交给组件本身：条件渲染或路由切走时组件会自动卸载微应用。不要手动调用 `microAppRef.current.unmount()`，那会与组件内部的挂载/卸载串行链冲突。

### 生命周期钩子

`lifeCycles` 会原样交给 qiankun，作用于当前这个微应用：

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';
import { type LifeCycles } from 'qiankun';

// 在组件外定义：不要闭包捕获组件状态
const lifeCycles: LifeCycles<Record<string, unknown>> = {
  beforeLoad: async (app) => {
    console.log(`即将加载 ${app.name}`);
  },
  afterMount: async (app) => {
    console.log(`${app.name} 挂载完成`);
  },
  beforeUnmount: async (app) => {
    console.log(`${app.name} 即将卸载`);
  },
};

function App() {
  return <MicroApp name="dashboard" entry="//localhost:8080" lifeCycles={lifeCycles} />;
}
```

qiankun 以 `(name, 容器)` 为键缓存微应用的 parcel 配置，生命周期钩子也在其中。也就是说：**第一次加载进某个容器时捕获到的那组钩子，会一直被后续的挂载复用。** 所以钩子里不要闭包捕获组件状态（否则读到的永远是第一次挂载时的旧值），需要根据加载进度更新界面时请用 `loader` 插槽。可用钩子及其时机见[生命周期](/zh-CN/api/lifecycles)。

### 应用状态

微应用实例提供这些状态值：

- `NOT_LOADED` - 初始状态，尚未加载
- `LOADING_SOURCE_CODE` - 加载应用资源中
- `NOT_BOOTSTRAPPED` - 资源已加载，尚未引导
- `BOOTSTRAPPING` - 运行引导生命周期
- `NOT_MOUNTED` - 已引导但未挂载
- `MOUNTING` - 运行挂载生命周期
- `MOUNTED` - 成功挂载并运行
- `UPDATING` - 运行更新生命周期
- `UNMOUNTING` - 运行卸载生命周期
- `UNLOADING` - 清理资源

## 🎨 自定义

### 自定义加载组件

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';
import { Spin } from 'antd';

const CustomLoader: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, textAlign: 'center', padding: '50px' }}>
      <Spin size="large" />
      <p style={{ marginTop: '16px' }}>加载微应用中...</p>
    </div>
  );
};

function App() {
  return <MicroApp name="dashboard" entry="//localhost:8080" loader={(loading) => <CustomLoader loading={loading} />} />;
}
```

`loader` 的类型是 `(loading: boolean) => React.ReactNode`：`loading` 为 `true` 表示仍在加载，`false` 表示加载结束（挂载完成或出错）。它可以单独使用，不需要搭配 `autoSetLoading`。因为它渲染在容器之后，用 `position: absolute` 就能盖在微应用之上。

### 自定义错误边界

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';
import { Alert, Button } from 'antd';

const CustomErrorBoundary: React.FC<{ error: Error }> = ({ error }) => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px' }}>
      <Alert
        message="微应用错误"
        description={error.message}
        type="error"
        action={
          <Button size="small" danger onClick={handleRetry}>
            重试
          </Button>
        }
      />
    </div>
  );
};

function App() {
  return (
    <MicroApp
      name="dashboard"
      entry="//localhost:8080"
      errorBoundary={(error) => <CustomErrorBoundary error={error} />}
    />
  );
}
```

`errorBoundary` 的类型是 `(error: Error) => React.ReactNode`，同样可以单独使用，不需要搭配 `autoCaptureError`。

### 样式设置

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';
import './MicroApp.css';

function App() {
  return (
    <MicroApp
      name="dashboard"
      entry="//localhost:8080"
      className="micro-app-container"
      wrapperClassName="micro-app-wrapper"
      autoSetLoading
    />
  );
}
```

```css
/* MicroApp.css */
.micro-app-wrapper {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
}

.micro-app-container {
  min-height: 400px;
  background: #fafafa;
}
```

`className` 落在容器上，`wrapperClassName` 落在包装器上；两个类名都会与组件自带的 `qiankun-micro-app-container` / `qiankun-micro-app-wrapper` 合并，而只有启用了加载态或错误展示时才会有包装器。

## 🔧 高级用法

### 多个微应用

```tsx
import React, { useState } from 'react';
import { MicroApp } from '@qiankunjs/react';
import { Tabs } from 'antd';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const items = [
    {
      key: 'dashboard',
      label: '仪表盘',
      children: <MicroApp name="dashboard" entry="//localhost:8080" autoSetLoading />,
    },
    {
      key: 'analytics',
      label: '分析',
      children: <MicroApp name="analytics" entry="//localhost:8081" autoSetLoading />,
    },
    {
      key: 'settings',
      label: '设置',
      children: <MicroApp name="settings" entry="//localhost:8082" autoSetLoading />,
    },
  ];

  return (
    <div className="multi-app-container">
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
}
```

也可以只用一个 `<MicroApp />`，由路由决定 `name` 与 `entry`（仓库里的 `examples/main` 就是这么做的）：切走时组件卸载旧应用，切回来时再挂载，容器身份保持不变，可以命中 qiankun 的缓存。

### 条件加载

```tsx
import React, { useState } from 'react';
import { MicroApp } from '@qiankunjs/react';
import { getCurrentUser } from './auth';

function ConditionalApp() {
  const [showMicroApp, setShowMicroApp] = useState(false);
  const user = getCurrentUser();

  // 只有用户认证后才加载微应用
  if (!user) {
    return <div>请登录以继续</div>;
  }

  return (
    <div>
      <button onClick={() => setShowMicroApp(!showMicroApp)}>{showMicroApp ? '隐藏' : '显示'} 微应用</button>

      {showMicroApp && (
        <MicroApp
          name="protected-app"
          entry="//localhost:8080"
          userId={user.id}
          permissions={user.permissions}
          autoSetLoading
          autoCaptureError
        />
      )}
    </div>
  );
}
```

停止渲染 `<MicroApp />` 就等于卸载微应用：组件的清理逻辑会等正在进行的挂载结束后再执行卸载，宿主不需要额外处理。

### 动态切换微应用（name 与 entry）

`name` 是微应用的身份标识：组件只在 `name` 变化时卸载旧应用、挂载新应用；`entry`、`settings`、`lifeCycles` 都只在挂载时读取，也不会参与后续的 `update`。因此**只改 `entry`、保持 `name` 不变是没有任何效果的**——既不会重新挂载，新的 `entry` 也不会传给微应用。

要切换目标应用，请让 `name` 一起变化：

```tsx
import React, { useState } from 'react';
import { MicroApp } from '@qiankunjs/react';

const targets = {
  development: { name: 'dashboard-dev', entry: '//localhost:8080' },
  staging: { name: 'dashboard-staging', entry: '//staging.example.com' },
  production: { name: 'dashboard-prod', entry: '//app.example.com' },
};

type Env = keyof typeof targets;

function DynamicApp() {
  const [environment, setEnvironment] = useState<Env>('development');
  const target = targets[environment];

  return (
    <div>
      <select value={environment} onChange={(e) => setEnvironment(e.target.value as Env)}>
        <option value="development">开发环境</option>
        <option value="staging">测试环境</option>
        <option value="production">生产环境</option>
      </select>

      <MicroApp name={target.name} entry={target.entry} environment={environment} autoSetLoading />
    </div>
  );
}
```

如果 `name` 必须保持不变（例如微应用注册名固定），就用 `key` 让 React 重建元素，从而完整地走一遍卸载与挂载：

```tsx
<MicroApp key={entry} name="dashboard" entry={entry} autoSetLoading />
```

## 🎮 状态管理

### 使用 Context 共享状态

```tsx
import React, { createContext, useContext, useState } from 'react';
import { MicroApp } from '@qiankunjs/react';

interface SharedState {
  user: { id: number; name: string };
  theme: string;
}

// 创建共享状态的 Context
const AppContext = createContext<SharedState | null>(null);

function MainApp() {
  const [sharedState] = useState<SharedState>({
    user: { id: 1, name: 'John' },
    theme: 'dark',
  });

  return (
    <AppContext.Provider value={sharedState}>
      <div className="main-app">
        <MicroAppContainer />
      </div>
    </AppContext.Provider>
  );
}

function MicroAppContainer() {
  const shared = useContext(AppContext);
  if (!shared) return null;

  return (
    <MicroApp
      name="micro-app"
      entry="//localhost:8080"
      // 将 context 数据作为 props 传递
      user={shared.user}
      theme={shared.theme}
      autoSetLoading
    />
  );
}
```

共享状态变化后，新的 props 会通过微应用的 `update` 生命周期送达（前提是微应用导出了 `update`）。

### 应用间通信

```tsx
import React, { useEffect } from 'react';
import { MicroApp } from '@qiankunjs/react';

function CommunicatingApps() {
  useEffect(() => {
    // 监听消息
    const handleMessage = (event: Event) => {
      console.log('收到消息:', (event as CustomEvent).detail);
    };

    window.addEventListener('microAppMessage', handleMessage);

    return () => {
      window.removeEventListener('microAppMessage', handleMessage);
    };
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <MicroApp name="app1" entry="//localhost:8080" autoSetLoading />
      </div>
      <div style={{ flex: 1 }}>
        <MicroApp name="app2" entry="//localhost:8081" autoSetLoading />
      </div>
    </div>
  );
}
```

更直接的做法是把回调函数作为额外属性透传给微应用：除组件自己消费的那几个属性外，其余属性都会转发过去。

## 🔒 TypeScript 支持

### 类型化属性

组件自身的属性是完整声明的，写错类型会在编译期报错：

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

// ✅ 类型正确
<MicroApp
  name="user-profile"
  entry="//localhost:8080"
  settings={{ sandbox: { styleIsolation: true } }}
  loader={(loading) => (loading ? <Spinner /> : null)}
  errorBoundary={(error) => <ErrorPanel message={error.message} />}
/>;

// ❌ 编译报错：autoSetLoading 应为 boolean
<MicroApp name="user-profile" entry="//localhost:8080" autoSetLoading="yes" />;

// ❌ 编译报错：errorBoundary 的入参是 Error，没有 code 属性
<MicroApp name="user-profile" entry="//localhost:8080" errorBoundary={(error) => <span>{error.code}</span>} />;
```

透传给微应用的额外属性走的是索引签名，TypeScript 不会替你校验它们是否符合微应用的契约。想要类型保障，可以在宿主侧声明接口，再展开传入：

```tsx
interface UserProfileProps {
  userId: string;
  theme: 'light' | 'dark';
  permissions: string[];
}

function UserProfileApp() {
  const user = getCurrentUser();

  const microAppProps: UserProfileProps = {
    userId: user.id,
    theme: 'dark',
    permissions: user.permissions,
  };

  return <MicroApp name="user-profile" entry="//localhost:8080" {...microAppProps} autoSetLoading />;
}
```

### 微应用自定义 Hook

```tsx
import { useRef, useEffect, useState } from 'react';
import { MicroApp, type MicroAppType } from '@qiankunjs/react';

interface UseMicroAppOptions {
  onStatusChange?: (status: string) => void;
  onError?: (error: Error) => void;
}

export function useMicroApp(options: UseMicroAppOptions = {}) {
  const microAppRef = useRef<MicroAppType>(undefined);
  const [status, setStatus] = useState<string>('NOT_LOADED');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkStatus = () => {
      if (microAppRef.current) {
        const currentStatus = microAppRef.current.getStatus();
        if (currentStatus !== status) {
          setStatus(currentStatus);
          options.onStatusChange?.(currentStatus);
        }
      }
    };

    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, [status, options]);

  const handleError = (err: Error) => {
    setError(err);
    options.onError?.(err);
  };

  return {
    microAppRef,
    status,
    error,
    handleError,
  };
}

// 使用方式
function App() {
  const { microAppRef, status, error } = useMicroApp({
    onStatusChange: (status) => console.log('状态变化:', status),
    onError: (error) => console.error('应用错误:', error),
  });

  return (
    <div>
      <p>状态: {status}</p>
      {error && <p>错误: {error.message}</p>}
      <MicroApp ref={microAppRef} name="dashboard" entry="//localhost:8080" />
    </div>
  );
}
```

## 🚀 性能优化

### 懒加载

```tsx
import React, { Suspense, lazy } from 'react';

// 懒加载 MicroApp 组件
const LazyMicroApp = lazy(() => import('@qiankunjs/react').then((module) => ({ default: module.MicroApp })));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LazyMicroApp name="dashboard" entry="//localhost:8080" autoSetLoading />
    </Suspense>
  );
}
```

### 记忆化

```tsx
import React, { memo, useMemo } from 'react';
import { MicroApp } from '@qiankunjs/react';

const MemoizedMicroApp = memo(MicroApp);

function OptimizedApp({ user, preferences }) {
  const microAppProps = useMemo(
    () => ({
      userId: user.id,
      theme: preferences.theme,
      language: preferences.language,
    }),
    [user.id, preferences.theme, preferences.language],
  );

  return <MemoizedMicroApp name="optimized-app" entry="//localhost:8080" {...microAppProps} autoSetLoading />;
}
```

组件内部已经对透传的属性做了深比较，值没变不会触发微应用的 `update`。但函数类型的属性每次渲染都是新引用，一定会被判定为变化，需要用 `useCallback` 固化。`loader` 与 `errorBoundary` 属于组件自有属性、不参与转发，所以写成内联箭头函数不会引起微应用更新。

## 🐛 错误处理与调试

### 错误的去向

没有配置 `errorBoundary`、也没有开启 `autoCaptureError` 时，微应用加载或挂载抛出的异常会被重新抛出，需要由上层的 React 错误边界接住。配置了任意一个之后，异常会被渲染成对应内容，同时仍然通过 `console.error` 输出，不会被吞掉。

### 开发模式错误处理

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

function DevMicroApp() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleError = (error: Error) => {
    if (isDevelopment) {
      // 在开发环境显示详细错误
      return (
        <div style={{ padding: '20px', background: '#ffe6e6' }}>
          <h3>开发环境错误</h3>
          <pre>{error.stack}</pre>
          <button onClick={() => window.location.reload()}>重新加载应用</button>
        </div>
      );
    }

    // 在生产环境显示用户友好的错误
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>出现了一些问题，请稍后再试。</p>
      </div>
    );
  };

  return <MicroApp name="dashboard" entry="//localhost:8080" errorBoundary={handleError} autoSetLoading />;
}
```

### 开发环境的 StrictMode

React 的 StrictMode 会在开发环境把每个组件多挂载一次（挂载 → 卸载 → 再挂载）。组件把挂载与卸载串在同一条 Promise 链上，卸载会等待正在进行的挂载完成，因此 StrictMode 下不会残留没被卸载的微应用实例——不需要为 qiankun 关闭 StrictMode。

## 📚 最佳实践

### 1. 使用描述性名称

```tsx
// ✅ 好：描述性名称
<MicroApp name="user-dashboard" entry="//localhost:8080" />
<MicroApp name="order-management" entry="//localhost:8081" />

// ❌ 坏：通用名称
<MicroApp name="app1" entry="//localhost:8080" />
<MicroApp name="app2" entry="//localhost:8081" />
```

`name` 同时是 qiankun 缓存键的一部分，也是组件切换应用的唯一依据，值得取一个稳定且有含义的名字。

### 2. 始终处理加载状态

```tsx
// ✅ 好：自定义加载态，单独传 loader 即可
<MicroApp name="dashboard" entry="//localhost:8080" loader={(loading) => <CustomSpinner loading={loading} />} />

// ✅ 好：只想要内置样式时用 autoSetLoading
<MicroApp name="dashboard" entry="//localhost:8080" autoSetLoading />

// ❌ 坏：没有加载指示
<MicroApp name="dashboard" entry="//localhost:8080" />
```

### 3. 实现错误展示

```tsx
// ✅ 好：自定义错误展示，单独传 errorBoundary 即可
<MicroApp name="dashboard" entry="//localhost:8080" errorBoundary={(error) => <ErrorFallback error={error} />} />

// ✅ 好：内置错误展示
<MicroApp name="dashboard" entry="//localhost:8080" autoCaptureError />
```

### 4. 生命周期钩子保持无状态

```tsx
// ✅ 好：定义在组件外，只依赖入参
const lifeCycles = {
  afterMount: async (app) => reportMounted(app.name),
};

// ❌ 坏：闭包捕获组件状态；钩子只会在首次加载进该容器时被捕获，
//        后续挂载读到的永远是第一次的旧值
const statefulLifeCycles = {
  afterMount: async () => setMounted(currentTab),
};
```

界面需要跟随加载进度变化时，请用 `loader` 插槽，而不是在生命周期钩子里改组件状态。

### 5. 使用环境特定的配置

```tsx
// ✅ 好：环境感知（构建期常量，不涉及运行时切换 entry）
const config = {
  development: { entry: '//localhost:8080', debug: true },
  production: { entry: '//app.example.com', debug: false },
};

const { entry, debug } = config[process.env.NODE_ENV];

<MicroApp name="dashboard" entry={entry} debug={debug} />;
```

## 🔗 相关文档

- [Vue 绑定](/zh-CN/ecosystem/vue) - Vue UI 绑定
- [核心 API](/zh-CN/api/) - qiankun 核心 API
- [配置](/zh-CN/api/configuration) - 配置选项
- [生命周期](/zh-CN/api/lifecycles) - 生命周期钩子
- [样式隔离](/zh-CN/cookbook/style-isolation) - `settings.sandbox.styleIsolation` 的行为

仓库里有两个真实的宿主示例可以对照：`examples/main`（React 主应用外壳）与 `examples/vue-host`（Vue 主应用外壳）。两者都用一个 `<MicroApp />` 承载所有微应用，由自己的路由决定 `name` 与 `entry`，离开路由即卸载，并且没有使用 `key`——切换完全交给绑定处理。
