# React 绑定

qiankun 的官方 React 绑定提供了一种声明式的方式来将微应用集成到您的 React 主应用中。`@qiankunjs/react` 包提供了一个强大的 `<MicroApp />` 组件，内置加载状态、错误处理和 TypeScript 支持。

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
      <MicroApp 
        name="dashboard" 
        entry="//localhost:8080" 
      />
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
      autoSetLoading // 启用自动加载状态
    />
  );
}
```

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
      autoCaptureError // 启用自动错误处理
    />
  );
}
```

## 🎯 组件 API

### 属性

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `name` | `string` | ✅ | - | 微应用的唯一名称 |
| `entry` | `string` | ✅ | - | 微应用的入口 URL |
| `autoSetLoading` | `boolean` | ❌ | `false` | 自动管理加载状态 |
| `autoCaptureError` | `boolean` | ❌ | `false` | 自动处理错误 |
| `loader` | `(loading: boolean) => React.ReactNode` | ❌ | `undefined` | 自定义加载组件 |
| `errorBoundary` | `(error: any) => React.ReactNode` | ❌ | `undefined` | 自定义错误组件 |
| `className` | `string` | ❌ | `undefined` | 微应用容器的 CSS 类 |
| `wrapperClassName` | `string` | ❌ | `undefined` | 包装器的 CSS 类（使用 loader/errorBoundary 时） |
| `settings` | `AppConfiguration` | ❌ | `{}` | qiankun 配置选项 |
| `lifeCycles` | `LifeCycles` | ❌ | `undefined` | 生命周期钩子 |

### 额外属性

传递给 `<MicroApp />` 的任何额外属性都会转发给微应用作为 props：

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

## 🔄 生命周期管理

### 使用 Ref 访问微应用实例

```tsx
import React, { useRef, useEffect } from 'react';
import { MicroApp } from '@qiankunjs/react';

function App() {
  const microAppRef = useRef<any>();

  useEffect(() => {
    // 获取微应用状态
    console.log(microAppRef.current?.getStatus());
  }, []);

  const handleUnmount = () => {
    microAppRef.current?.unmount();
  };

  return (
    <div>
      <button onClick={handleUnmount}>卸载微应用</button>
      <MicroApp 
        ref={microAppRef}
        name="dashboard" 
        entry="//localhost:8080" 
      />
    </div>
  );
}
```

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
import { Spin, Alert } from 'antd';

const CustomLoader: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" />
      <p style={{ marginTop: '16px' }}>加载微应用中...</p>
    </div>
  );
};

function App() {
  return (
    <MicroApp 
      name="dashboard" 
      entry="//localhost:8080" 
      loader={(loading) => <CustomLoader loading={loading} />}
    />
  );
}
```

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

## 🔧 高级用法

### 多个微应用

```tsx
import React, { useState } from 'react';
import { MicroApp } from '@qiankunjs/react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="multi-app-container">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="仪表盘" key="dashboard">
          <MicroApp 
            name="dashboard" 
            entry="//localhost:8080" 
            autoSetLoading
          />
        </TabPane>
        <TabPane tab="分析" key="analytics">
          <MicroApp 
            name="analytics" 
            entry="//localhost:8081" 
            autoSetLoading
          />
        </TabPane>
        <TabPane tab="设置" key="settings">
          <MicroApp 
            name="settings" 
            entry="//localhost:8082" 
            autoSetLoading
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
```

### 条件加载

```tsx
import React, { useState } from 'react';
import { MicroApp } from '@qiankunjs/react';

function ConditionalApp() {
  const [showMicroApp, setShowMicroApp] = useState(false);
  const [user, setUser] = useState(null);

  // 只有用户认证后才加载微应用
  if (!user) {
    return <div>请登录以继续</div>;
  }

  return (
    <div>
      <button onClick={() => setShowMicroApp(!showMicroApp)}>
        {showMicroApp ? '隐藏' : '显示'} 微应用
      </button>
      
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

### 动态入口 URL

```tsx
import React, { useState } from 'react';
import { MicroApp } from '@qiankunjs/react';

function DynamicApp() {
  const [environment, setEnvironment] = useState('development');
  
  const entryUrls = {
    development: '//localhost:8080',
    staging: '//staging.example.com',
    production: '//app.example.com'
  };

  return (
    <div>
      <select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
        <option value="development">开发环境</option>
        <option value="staging">测试环境</option>
        <option value="production">生产环境</option>
      </select>
      
      <MicroApp 
        name="dynamic-app" 
        entry={entryUrls[environment]} 
        environment={environment}
        autoSetLoading
      />
    </div>
  );
}
```

## 🎮 状态管理

### 使用 Context 共享状态

```tsx
import React, { createContext, useContext, useState } from 'react';
import { MicroApp } from '@qiankunjs/react';

// 创建共享状态的 Context
const AppContext = createContext();

function MainApp() {
  const [sharedState, setSharedState] = useState({
    user: { id: 1, name: 'John' },
    theme: 'dark'
  });

  return (
    <AppContext.Provider value={{ sharedState, setSharedState }}>
      <div className="main-app">
        <Navigation />
        <MicroAppContainer />
      </div>
    </AppContext.Provider>
  );
}

function MicroAppContainer() {
  const { sharedState } = useContext(AppContext);
  
  return (
    <MicroApp 
      name="micro-app" 
      entry="//localhost:8080" 
      // 将 context 数据作为 props 传递
      user={sharedState.user}
      theme={sharedState.theme}
      autoSetLoading
    />
  );
}
```

### 应用间通信

```tsx
import React, { useEffect, useRef } from 'react';
import { MicroApp } from '@qiankunjs/react';

function CommunicatingApps() {
  const microApp1Ref = useRef();
  const microApp2Ref = useRef();

  useEffect(() => {
    // 设置通信渠道
    window.appCommunication = {
      sendMessage: (from, to, message) => {
        const event = new CustomEvent('microAppMessage', {
          detail: { from, to, message }
        });
        window.dispatchEvent(event);
      }
    };

    // 监听消息
    const handleMessage = (event) => {
      console.log('收到消息:', event.detail);
    };

    window.addEventListener('microAppMessage', handleMessage);

    return () => {
      window.removeEventListener('microAppMessage', handleMessage);
      delete window.appCommunication;
    };
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <MicroApp 
          ref={microApp1Ref}
          name="app1" 
          entry="//localhost:8080" 
          autoSetLoading
        />
      </div>
      <div style={{ flex: 1 }}>
        <MicroApp 
          ref={microApp2Ref}
          name="app2" 
          entry="//localhost:8081" 
          autoSetLoading
        />
      </div>
    </div>
  );
}
```

## 🔒 TypeScript 支持

### 类型化属性

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

interface UserProfileProps {
  userId: string;
  theme: 'light' | 'dark';
  permissions: string[];
}

// 为额外属性添加类型
const UserProfileApp: React.FC = () => {
  const user = getCurrentUser();
  
  return (
    <MicroApp 
      name="user-profile" 
      entry="//localhost:8080"
      // TypeScript 会验证这些属性
      userId={user.id}
      theme="dark"
      permissions={user.permissions}
      autoSetLoading
    />
  );
};
```

### 微应用自定义 Hook

```tsx
import { useRef, useEffect, useState } from 'react';
import type { MicroApp as MicroAppType } from 'qiankun';

interface UseMicroAppOptions {
  onStatusChange?: (status: string) => void;
  onError?: (error: Error) => void;
}

export function useMicroApp(options: UseMicroAppOptions = {}) {
  const microAppRef = useRef<MicroAppType>();
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
    handleError
  };
}

// 使用方式
function App() {
  const { microAppRef, status, error } = useMicroApp({
    onStatusChange: (status) => console.log('状态变化:', status),
    onError: (error) => console.error('应用错误:', error)
  });

  return (
    <div>
      <p>状态: {status}</p>
      {error && <p>错误: {error.message}</p>}
      <MicroApp 
        ref={microAppRef}
        name="dashboard" 
        entry="//localhost:8080" 
      />
    </div>
  );
}
```

## 🚀 性能优化

### 懒加载

```tsx
import React, { Suspense, lazy } from 'react';

// 懒加载 MicroApp 组件
const LazyMicroApp = lazy(() => 
  import('@qiankunjs/react').then(module => ({ default: module.MicroApp }))
);

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LazyMicroApp 
        name="dashboard" 
        entry="//localhost:8080" 
        autoSetLoading
      />
    </Suspense>
  );
}
```

### 记忆化

```tsx
import React, { memo, useMemo } from 'react';
import { MicroApp } from '@qiankunjs/react';

const MemoizedMicroApp = memo(MicroApp);

function OptimizedApp({ user, settings }) {
  const microAppProps = useMemo(() => ({
    userId: user.id,
    theme: settings.theme,
    language: settings.language
  }), [user.id, settings.theme, settings.language]);

  return (
    <MemoizedMicroApp 
      name="optimized-app" 
      entry="//localhost:8080" 
      {...microAppProps}
      autoSetLoading
    />
  );
}
```

## 🐛 错误处理与调试

### 开发模式错误处理

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

function DevMicroApp() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleError = (error: Error) => {
    console.error('微应用错误:', error);
    
    if (isDevelopment) {
      // 在开发环境显示详细错误
      return (
        <div style={{ padding: '20px', background: '#ffe6e6' }}>
          <h3>开发环境错误</h3>
          <pre>{error.stack}</pre>
          <button onClick={() => window.location.reload()}>
            重新加载应用
          </button>
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

  return (
    <MicroApp 
      name="dashboard" 
      entry="//localhost:8080" 
      errorBoundary={handleError}
      autoSetLoading
    />
  );
}
```

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

### 2. 始终处理加载状态

```tsx
// ✅ 好：处理加载状态
<MicroApp 
  name="dashboard" 
  entry="//localhost:8080" 
  autoSetLoading
  loader={(loading) => <CustomSpinner loading={loading} />}
/>

// ❌ 坏：没有加载指示
<MicroApp name="dashboard" entry="//localhost:8080" />
```

### 3. 实现错误边界

```tsx
// ✅ 好：优雅地处理错误
<MicroApp 
  name="dashboard" 
  entry="//localhost:8080" 
  autoCaptureError
  errorBoundary={(error) => <ErrorFallback error={error} />}
/>
```

### 4. 使用环境特定的配置

```tsx
// ✅ 好：环境感知
const config = {
  development: { entry: '//localhost:8080', debug: true },
  production: { entry: '//app.example.com', debug: false }
};

<MicroApp 
  name="dashboard" 
  entry={config[process.env.NODE_ENV].entry}
  debug={config[process.env.NODE_ENV].debug}
/>
```

## 🔗 相关文档

- [Vue 绑定](/zh-CN/ecosystem/vue) - Vue UI 绑定
- [核心 API](/zh-CN/api/) - qiankun 核心 API
- [配置](/zh-CN/api/configuration) - 配置选项
- [生命周期](/zh-CN/api/lifecycles) - 生命周期钩子 