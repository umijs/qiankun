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
| `autoSetLoading` | `boolean` | ❌ | `false` | Render the built-in loading indicator |
| `autoCaptureError` | `boolean` | ❌ | `false` | Render the built-in error panel |
| `loader` | `(loading: boolean) => React.ReactNode` | ❌ | `undefined` | Custom loading slot. It works on its own — `autoSetLoading` is not needed alongside it, and a custom slot takes precedence over the built-in one |
| `errorBoundary` | `(error: Error) => React.ReactNode` | ❌ | `undefined` | Custom error slot. Same rule: it works on its own and takes precedence over `autoCaptureError` |
| `className` | `string` | ❌ | `undefined` | CSS class for the micro app container |
| `wrapperClassName` | `string` | ❌ | `undefined` | CSS class for the wrapper, which only exists when a loading or error slot is active |
| `settings` | `AppConfiguration` | ❌ | `undefined` | qiankun configuration for this micro app — sandbox, style isolation, fetch, … Nothing is defaulted on your behalf |
| `lifeCycles` | `LifeCycles` | ❌ | `undefined` | qiankun lifecycle hooks for this micro app, see [Lifecycle Hooks](#lifecycle-hooks) |

Every prop above is fully typed, so a wrong value — `entry={8080}`, a `loader` with the wrong signature — is a compile error rather than a runtime surprise.

If neither `errorBoundary` nor `autoCaptureError` is set, the component renders nothing for a failure: it re-throws the error, which surfaces as an unhandled rejection in the console. Pass one of the two props whenever a load or mount failure should be visible in the UI.

### Additional Props

Any prop the component does not own itself is forwarded to the micro application as a prop:

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

The component-owned props — `name`, `entry`, `settings`, `lifeCycles`, `autoSetLoading`, `autoCaptureError`, `loader`, `errorBoundary`, `wrapperClassName` and `className` — are consumed by the component and never reach the micro app.

Forwarded props are deep-compared between renders; when they actually change, the new values are pushed to the micro app's `update` lifecycle in order, after its mount has finished.

### Sandbox and Style Isolation

Per-app qiankun configuration travels through `settings`:

```tsx
<MicroApp name="dashboard" entry="//localhost:8080" settings={{ sandbox: { styleIsolation: true } }} />
```

`settings` is the same `AppConfiguration` object `loadMicroApp` accepts, so every option in [Configuration](/api/configuration) is available here — sandbox mode, style isolation, `fetch`, and so on.

## 🔄 Lifecycle Management

### Using Ref to Access Micro App Instance

```tsx
import React, { useRef } from 'react';
import { MicroApp, type MicroAppType } from '@qiankunjs/react';

function App() {
  const microAppRef = useRef<MicroAppType>(undefined);

  const handleLogStatus = () => {
    // Get micro app status
    console.log(microAppRef.current?.getStatus());
  };

  return (
    <div>
      <button onClick={handleLogStatus}>Log Micro App Status</button>
      <MicroApp ref={microAppRef} name="dashboard" entry="//localhost:8080" />
    </div>
  );
}
```

`MicroAppType` is re-exported from `@qiankunjs/react`. React 19's types require `useRef` to be given an initial value, hence `useRef<MicroAppType>(undefined)`.

The ref payload is refreshed on render, so it is still `undefined` while the parent's own mount effect runs. Read it from an event handler or from an effect that runs after the app is up, not from a `useEffect(…, [])`.

The component owns the app's lifetime: it mounts on `name` and unmounts on cleanup, so unmount a micro app by no longer rendering its `<MicroApp />` rather than by calling `unmount()` on the instance.

### Lifecycle Hooks

`lifeCycles` is handed to qiankun as-is and runs around the micro app's own lifecycles:

```tsx
<MicroApp
  name="dashboard"
  entry="//localhost:8080"
  lifeCycles={{
    beforeMount: async (app) => console.log('before mount', app.name),
    afterMount: async (app) => console.log('after mount', app.name),
    afterUnmount: async (app) => console.log('after unmount', app.name),
  }}
/>
```

qiankun caches one parcel configuration per (name, container) pair, lifecycle hooks included, so the hooks captured on the **first** load of an app into a given container are the ones that keep running there. Write them as stable, self-contained functions — a hook closing over component state would keep reading the values it saw on that first load. When a hook only exists to drive UI state, use the `loader` or `errorBoundary` slot instead: those are read on every render.

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

A custom `loader` is all you need — it is called with `true` while the app is loading and with `false` once the app reaches `MOUNTED` (or fails). `autoSetLoading` only selects the built-in indicator, so it is redundant next to a `loader`.

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

When a loading or error slot is active, the component wraps the micro app container in one extra element, and the rendered result looks like this:

```tsx
<div style={{ position: 'relative' }} className={`${wrapperClassName} qiankun-micro-app-wrapper`}>
  <div className={`${className} qiankun-micro-app-container`} />
  {loader(loading)}
  {error && errorBoundary(error)}
</div>
```

The container is rendered first so its position never shifts as the loader and error slots come and go — qiankun keys its per-container caches on that position. Because the slots come after it, they paint above the micro app without needing a `z-index`, and the wrapper's inline `position: relative` gives an absolutely positioned overlay something to anchor to.

Without a loading or error slot there is no wrapper: the component renders the container element on its own, and `wrapperClassName` has nothing to apply to.

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

### Switching Apps at Runtime

`name` is the mounted app's identity: changing it unmounts the current app and mounts the new one into the same container. Changing `entry` while `name` stays the same is a no-op — `entry` is only read when an app is mounted, and it is not among the props forwarded to a running app.

So drive one `<MicroApp />` from your router, passing the `name` and `entry` the route selected:

```tsx
import { MicroApp } from '@qiankunjs/react';

interface AppMeta {
  name: string;
  entry: string;
}

// The route decides which app lives in the stage; the component handles the switch,
// and leaving the route unmounts the app. No `key` needed.
function Stage({ app }: { app: AppMeta }) {
  return (
    <MicroApp
      name={app.name}
      entry={app.entry}
      settings={{ sandbox: { styleIsolation: true } }}
      autoSetLoading
    />
  );
}
```

If you really need to point the same `name` at a different `entry` — switching environments at runtime, for instance — give the component a `key` so React re-creates it, or change the `name` along with the `entry`:

```tsx
const entryUrls = {
  development: '//localhost:8080',
  staging: '//staging.example.com',
  production: '//app.example.com',
};

// `key` re-creates the component, which unmounts the old app and mounts the new entry
<MicroApp
  key={environment}
  name="dynamic-app"
  entry={entryUrls[environment]}
  environment={environment}
  autoSetLoading
/>;
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
import { MicroApp, type MicroAppType } from '@qiankunjs/react';

function CommunicatingApps() {
  const microApp1Ref = useRef<MicroAppType>(undefined);
  const microApp2Ref = useRef<MicroAppType>(undefined);

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

The component's own props are fully typed, so TypeScript checks them at the call site:

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

const TypedApp: React.FC = () => (
  <MicroApp
    name="user-profile"
    entry="//localhost:8080"
    settings={{ sandbox: { styleIsolation: true } }}
    // loading is inferred as boolean, error as Error
    loader={(loading) => (loading ? <Spinner /> : null)}
    errorBoundary={(error) => <ErrorPanel message={error.message} />}
  />
);

// ❌ Compile errors
<MicroApp name="user-profile" entry={8080} />; // entry must be a string
<MicroApp name="user-profile" entry="//localhost:8080" autoSetLoading="yes" />; // autoSetLoading must be a boolean
```

Props forwarded to the micro app are intentionally untyped (`Record<string, unknown>`), because only the micro app knows their shape. Wrap the component if you want them checked where they are passed:

```tsx
import React from 'react';
import { MicroApp } from '@qiankunjs/react';

interface UserProfileProps {
  userId: string;
  theme: 'light' | 'dark';
  permissions: string[];
}

// Type the additional props by owning the call site
export const UserProfileApp: React.FC<UserProfileProps> = (props) => (
  <MicroApp name="user-profile" entry="//localhost:8080" {...props} autoSetLoading />
);
```

### Custom Hook for Micro App

```tsx
import { useRef, useEffect, useState } from 'react';
import { type MicroAppType } from '@qiankunjs/react';

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
// ✅ Good: the built-in indicator
<MicroApp name="dashboard" entry="//localhost:8080" autoSetLoading />

// ✅ Good: your own loading slot, which needs no flag next to it
<MicroApp 
  name="dashboard" 
  entry="//localhost:8080" 
  loader={(loading) => <CustomSpinner loading={loading} />}
/>

// ❌ Bad: No loading indication
<MicroApp name="dashboard" entry="//localhost:8080" />
```

### 3. Implement Error Boundaries

```tsx
// ✅ Good: render failures instead of letting them escape the component
<MicroApp 
  name="dashboard" 
  entry="//localhost:8080" 
  errorBoundary={(error) => <ErrorFallback error={error} />}
/>

// ✅ Good: the built-in error panel
<MicroApp name="dashboard" entry="//localhost:8080" autoCaptureError />
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

## 🧪 Working Examples

Both shells in this repository drive a single `<MicroApp />` from their own router — the route picks `name` and `entry`, leaving the route unmounts the app, and no `key` is involved:

- [`examples/main`](https://github.com/umijs/qiankun/tree/next/examples/main) - the React shell, including loader and error slots used as overlays
- [`examples/vue-host`](https://github.com/umijs/qiankun/tree/next/examples/vue-host) - the same stage built with the Vue bindings
