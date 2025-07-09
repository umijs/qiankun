# React Bindings

The official React bindings for qiankun provide a declarative way to integrate micro applications into your React main application. The `@qiankunjs/react` package offers a powerful `<MicroApp />` component with built-in loading states, error handling, and TypeScript support.

## 📦 Installation

```bash
npm install @qiankunjs/react
```

**Requirements:**
- React ≥ 16.9.0
- qiankun ≥ 3.0.0

## 🚀 Quick Start

### Basic Usage

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

function App() {
  return (
    <div className="main-app">
      <h1>Main Application</h1>
      <MicroApp 
        name="dashboard" 
        entry="//localhost:8080" 
      />
    </div>
  );
}

export default App;
```

### With Loading State

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

function App() {
  return (
    <MicroApp 
      name="dashboard" 
      entry="//localhost:8080" 
      autoSetLoading // Enable automatic loading state
    />
  );
}
```

### With Error Handling

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

function App() {
  return (
    <MicroApp 
      name="dashboard" 
      entry="//localhost:8080" 
      autoSetLoading
      autoCaptureError // Enable automatic error handling
    />
  );
}
```

## 🎯 Component API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `string` | ✅ | - | Unique name for the micro application |
| `entry` | `string` | ✅ | - | Entry URL of the micro application |
| `autoSetLoading` | `boolean` | ❌ | `false` | Automatically manage loading state |
| `autoCaptureError` | `boolean` | ❌ | `false` | Automatically handle errors |
| `loader` | `(loading: boolean) => React.ReactNode` | ❌ | `undefined` | Custom loading component |
| `errorBoundary` | `(error: any) => React.ReactNode` | ❌ | `undefined` | Custom error component |
| `className` | `string` | ❌ | `undefined` | CSS class for the micro app container |
| `wrapperClassName` | `string` | ❌ | `undefined` | CSS class for the wrapper (when using loader/errorBoundary) |
| `settings` | `AppConfiguration` | ❌ | `{}` | qiankun configuration options |
| `lifeCycles` | `LifeCycles` | ❌ | `undefined` | Lifecycle hooks |

### Additional Props

Any additional props passed to `<MicroApp />` will be forwarded to the micro application as props:

```tsx
<MicroApp
  name="user-profile"
  entry="//localhost:8080"
  // These props are passed to the micro app
  userId={user.id}
  theme="dark"
  permissions={user.permissions}
/>
```

## 🔄 Lifecycle Management

### Using Ref to Access Micro App Instance

```tsx
import React, { useRef, useEffect } from 'react';
import { MicroApp } from '@qiankunjs/react';

function App() {
  const microAppRef = useRef<any>();

  useEffect(() => {
    // Get micro app status
    console.log(microAppRef.current?.getStatus());
  }, []);

  const handleUnmount = () => {
    microAppRef.current?.unmount();
  };

  return (
    <div>
      <button onClick={handleUnmount}>Unmount Micro App</button>
      <MicroApp 
        ref={microAppRef}
        name="dashboard" 
        entry="//localhost:8080" 
      />
    </div>
  );
}
```

### App Status

The micro app instance provides these status values:

- `NOT_LOADED` - Initial state, not loaded yet
- `LOADING_SOURCE_CODE` - Loading application resources
- `NOT_BOOTSTRAPPED` - Resources loaded, not bootstrapped
- `BOOTSTRAPPING` - Running bootstrap lifecycle
- `NOT_MOUNTED` - Bootstrapped but not mounted
- `MOUNTING` - Running mount lifecycle
- `MOUNTED` - Successfully mounted and running
- `UPDATING` - Running update lifecycle
- `UNMOUNTING` - Running unmount lifecycle
- `UNLOADING` - Cleaning up resources

## 🎨 Customization

### Custom Loading Component

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';
import { Spin, Alert } from 'antd';

const CustomLoader: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" />
      <p style={{ marginTop: '16px' }}>Loading micro application...</p>
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

### Custom Error Boundary

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
        message="Micro Application Error"
        description={error.message}
        type="error"
        action={
          <Button size="small" danger onClick={handleRetry}>
            Retry
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

### Styling

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

## 🔧 Advanced Usage

### Multiple Micro Apps

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
        <TabPane tab="Dashboard" key="dashboard">
          <MicroApp 
            name="dashboard" 
            entry="//localhost:8080" 
            autoSetLoading
          />
        </TabPane>
        <TabPane tab="Analytics" key="analytics">
          <MicroApp 
            name="analytics" 
            entry="//localhost:8081" 
            autoSetLoading
          />
        </TabPane>
        <TabPane tab="Settings" key="settings">
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

### Conditional Loading

```tsx
import React, { useState } from 'react';
import { MicroApp } from '@qiankunjs/react';

function ConditionalApp() {
  const [showMicroApp, setShowMicroApp] = useState(false);
  const [user, setUser] = useState(null);

  // Only load micro app when user is authenticated
  if (!user) {
    return <div>Please log in to continue</div>;
  }

  return (
    <div>
      <button onClick={() => setShowMicroApp(!showMicroApp)}>
        {showMicroApp ? 'Hide' : 'Show'} Micro App
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

### Dynamic Entry URLs

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
        <option value="development">Development</option>
        <option value="staging">Staging</option>
        <option value="production">Production</option>
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

## 🎮 State Management

### Using Context to Share State

```tsx
import React, { createContext, useContext, useState } from 'react';
import { MicroApp } from '@qiankunjs/react';

// Create a context for shared state
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
      // Pass context data as props
      user={sharedState.user}
      theme={sharedState.theme}
      autoSetLoading
    />
  );
}
```

### Communication Between Apps

```tsx
import React, { useEffect, useRef } from 'react';
import { MicroApp } from '@qiankunjs/react';

function CommunicatingApps() {
  const microApp1Ref = useRef();
  const microApp2Ref = useRef();

  useEffect(() => {
    // Set up communication channel
    window.appCommunication = {
      sendMessage: (from, to, message) => {
        const event = new CustomEvent('microAppMessage', {
          detail: { from, to, message }
        });
        window.dispatchEvent(event);
      }
    };

    // Listen for messages
    const handleMessage = (event) => {
      console.log('Message received:', event.detail);
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

## 🔒 TypeScript Support

### Typed Props

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

interface UserProfileProps {
  userId: string;
  theme: 'light' | 'dark';
  permissions: string[];
}

// Type the additional props
const UserProfileApp: React.FC = () => {
  const user = getCurrentUser();
  
  return (
    <MicroApp 
      name="user-profile" 
      entry="//localhost:8080"
      // TypeScript will validate these props
      userId={user.id}
      theme="dark"
      permissions={user.permissions}
      autoSetLoading
    />
  );
};
```

### Custom Hook for Micro App

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

// Usage
function App() {
  const { microAppRef, status, error } = useMicroApp({
    onStatusChange: (status) => console.log('Status changed:', status),
    onError: (error) => console.error('App error:', error)
  });

  return (
    <div>
      <p>Status: {status}</p>
      {error && <p>Error: {error.message}</p>}
      <MicroApp 
        ref={microAppRef}
        name="dashboard" 
        entry="//localhost:8080" 
      />
    </div>
  );
}
```

## 🚀 Performance Optimization

### Lazy Loading

```tsx
import React, { Suspense, lazy } from 'react';

// Lazy load the MicroApp component
const LazyMicroApp = lazy(() => 
  import('@qiankunjs/react').then(module => ({ default: module.MicroApp }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyMicroApp 
        name="dashboard" 
        entry="//localhost:8080" 
        autoSetLoading
      />
    </Suspense>
  );
}
```

### Memoization

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

## 🐛 Error Handling & Debugging

### Development Mode Error Handling

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

function DevMicroApp() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleError = (error: Error) => {
    console.error('Micro app error:', error);
    
    if (isDevelopment) {
      // Show detailed error in development
      return (
        <div style={{ padding: '20px', background: '#ffe6e6' }}>
          <h3>Development Error</h3>
          <pre>{error.stack}</pre>
          <button onClick={() => window.location.reload()}>
            Reload App
          </button>
        </div>
      );
    }
    
    // Show user-friendly error in production
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Something went wrong. Please try again later.</p>
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

## 📚 Best Practices

### 1. Use Descriptive Names

```tsx
// ✅ Good: Descriptive names
<MicroApp name="user-dashboard" entry="//localhost:8080" />
<MicroApp name="order-management" entry="//localhost:8081" />

// ❌ Bad: Generic names
<MicroApp name="app1" entry="//localhost:8080" />
<MicroApp name="app2" entry="//localhost:8081" />
```

### 2. Always Handle Loading States

```tsx
// ✅ Good: Handle loading states
<MicroApp 
  name="dashboard" 
  entry="//localhost:8080" 
  autoSetLoading
  loader={(loading) => <CustomSpinner loading={loading} />}
/>

// ❌ Bad: No loading indication
<MicroApp name="dashboard" entry="//localhost:8080" />
```

### 3. Implement Error Boundaries

```tsx
// ✅ Good: Handle errors gracefully
<MicroApp 
  name="dashboard" 
  entry="//localhost:8080" 
  autoCaptureError
  errorBoundary={(error) => <ErrorFallback error={error} />}
/>
```

### 4. Use Environment-specific Configurations

```tsx
// ✅ Good: Environment-aware
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

## 🔗 Related Documentation

- [Vue Bindings](/ecosystem/vue) - Vue UI bindings
- [Core APIs](/api/) - qiankun core APIs
- [Configuration](/api/configuration) - Configuration options
- [Lifecycles](/api/lifecycles) - Lifecycle hooks 