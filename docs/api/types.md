# TypeScript Types

qiankun provides comprehensive TypeScript type definitions to ensure type safety and excellent developer experience. This document covers all available types and interfaces.

## 📋 Core Types

### ObjectType

**Description**: Base type for generic object structures.

```typescript
export type ObjectType = Record<string, unknown>;
```

**Usage**:
```typescript
// Used as a constraint for generic types
function processApp<T extends ObjectType>(props: T): void {
  // T can be any object type
}
```

### HTMLEntry

**Description**: Type for micro application entry points.

```typescript
export type HTMLEntry = string;
```

**Usage**:
```typescript
const appEntry: HTMLEntry = '//localhost:8080';
const appEntryWithPath: HTMLEntry = '//localhost:8080/micro-app';
```

## 🏗️ Application Types

### AppMetadata

**Description**: Base metadata for micro applications.

```typescript
type AppMetadata = {
  name: string;    // Unique application name
  entry: HTMLEntry; // Application entry URL
};
```

### LoadableApp\<T\>

**Description**: Configuration for manually loaded micro applications.

```typescript
export type LoadableApp<T extends ObjectType> = AppMetadata & {
  container: HTMLElement;  // DOM container element
  props?: T;              // Custom properties passed to the app
};
```

**Usage**:
```typescript
// Basic usage
const app: LoadableApp<{}> = {
  name: 'my-app',
  entry: '//localhost:8080',
  container: document.getElementById('app-container')!,
};

// With custom props
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

**Description**: Configuration for route-based micro applications.

```typescript
export type RegistrableApp<T extends ObjectType> = LoadableApp<T> & {
  loader?: (loading: boolean) => void;                    // Loading state callback
  activeRule: RegisterApplicationConfig['activeWhen'];    // Routing activation rule
};
```

**Usage**:
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

## ⚙️ Configuration Types

### AppConfiguration

**Description**: Configuration options for individual micro applications.

```typescript
export type AppConfiguration = Partial<Pick<LoaderOpts, 'fetch' | 'streamTransformer' | 'nodeTransformer'>> & {
  sandbox?: boolean;        // Enable sandbox isolation
  globalContext?: WindowProxy; // Custom global context
};
```

**Usage**:
```typescript
import { loadMicroApp } from 'qiankun';

const customConfig: AppConfiguration = {
  sandbox: true,
  globalContext: window,
  fetch: async (url, options) => {
    // Custom fetch implementation
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': 'Bearer token'
      }
    });
  },
  nodeTransformer: (node, opts) => {
    // Transform DOM nodes
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

## 🔄 Lifecycle Types

### LifeCycleFn\<T\>

**Description**: Type for lifecycle hook functions.

```typescript
export type LifeCycleFn<T extends ObjectType> = (
  app: LoadableApp<T>, 
  global: WindowProxy
) => Promise<void>;
```

**Usage**:
```typescript
const beforeLoadHook: LifeCycleFn<{ theme: string }> = async (app, global) => {
  console.log(`Loading app: ${app.name}`);
  global.__APP_THEME__ = app.props?.theme || 'default';
};

const afterMountHook: LifeCycleFn<any> = async (app, global) => {
  console.log(`App ${app.name} mounted successfully`);
  // Track analytics
  analytics.track('app_mounted', { appName: app.name });
};
```

### LifeCycles\<T\>

**Description**: Complete lifecycle hooks configuration.

```typescript
export type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
```

**Usage**:
```typescript
interface AppProps {
  userId: string;
  permissions: string[];
}

const lifecycles: LifeCycles<AppProps> = {
  beforeLoad: async (app, global) => {
    // Setup before loading
    global.__USER_ID__ = app.props?.userId;
  },
  
  beforeMount: [
    async (app, global) => {
      // Multiple hooks as array
      await setupAuthentication(app.props?.userId);
    },
    async (app, global) => {
      await loadUserPermissions(app.props?.permissions);
    }
  ],
  
  afterMount: async (app) => {
    console.log(`${app.name} is ready`);
  },
  
  beforeUnmount: async (app) => {
    // Cleanup before unmounting
    await saveUserState(app.name);
  },
  
  afterUnmount: async (app) => {
    // Final cleanup
    await clearUserData(app.name);
  }
};
```

## 🎯 Micro App Types

### MicroApp

**Description**: Instance of a loaded micro application.

```typescript
export type MicroApp = Parcel;
```

The `MicroApp` type extends the single-spa `Parcel` interface with these methods:

```typescript
interface MicroApp {
  mount(): Promise<void>;           // Mount the application
  unmount(): Promise<void>;         // Unmount the application  
  update(props: any): Promise<void>; // Update application props
  getStatus(): string;              // Get current status
  loadPromise: Promise<void>;       // Promise that resolves when loaded
  mountPromise: Promise<void>;      // Promise that resolves when mounted
  unmountPromise: Promise<void>;    // Promise that resolves when unmounted
}
```

**Usage**:
```typescript
import { loadMicroApp } from 'qiankun';

const microApp: MicroApp = loadMicroApp({
  name: 'my-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!
});

// Check status
console.log(microApp.getStatus()); // 'LOADING', 'MOUNTED', 'UNMOUNTED', etc.

// Wait for mounting
await microApp.mountPromise;
console.log('App is mounted');

// Update props
await microApp.update({ newTheme: 'dark' });

// Unmount when done
await microApp.unmount();
```

### MicroAppLifeCycles

**Description**: Internal lifecycle type used by qiankun.

```typescript
export type MicroAppLifeCycles = FlattenArrayValue<ParcelLifeCycles<ExtraProps>>;
```

This type is primarily for internal use and represents the flattened lifecycle functions that micro applications must export.

## 🌐 Global Types

### Window Extensions

qiankun extends the global `Window` interface with special properties:

```typescript
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;           // Indicates app is running in qiankun
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string; // Injected public path
    __QIANKUN_DEVELOPMENT__?: boolean;          // Development mode flag
    Zone?: CallableFunction;                    // Zone.js compatibility
    __zone_symbol__setTimeout?: Window['setTimeout']; // Zone.js timeout
  }
}
```

**Usage in Micro Applications**:
```typescript
// Check if running in qiankun
if (window.__POWERED_BY_QIANKUN__) {
  console.log('Running as a micro app');
  
  // Use injected public path
  const publicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/';
  
  // Configure your app accordingly
  setupApp({ publicPath });
} else {
  console.log('Running standalone');
  setupApp({ publicPath: '/' });
}
```

## 🎨 Utility Types

### Custom Type Guards

Create type guards for better type safety:

```typescript
// Type guard for LoadableApp
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

// Type guard for RegistrableApp
function isRegistrableApp<T extends ObjectType>(
  app: any
): app is RegistrableApp<T> {
  return (
    isLoadableApp(app) &&
    (typeof app.activeRule === 'string' || typeof app.activeRule === 'function')
  );
}

// Usage
function processApp(app: unknown) {
  if (isRegistrableApp(app)) {
    // TypeScript knows app is RegistrableApp here
    console.log(`Registering app: ${app.name} with rule: ${app.activeRule}`);
  } else if (isLoadableApp(app)) {
    // TypeScript knows app is LoadableApp here
    console.log(`Loading app: ${app.name}`);
  }
}
```

### Generic Helper Types

Create reusable generic types for common patterns:

```typescript
// Props with theme support
type ThemedProps<T = {}> = T & {
  theme?: 'light' | 'dark';
};

// Props with user context
type UserAwareProps<T = {}> = T & {
  currentUser?: {
    id: string;
    name: string;
    role: string;
  };
};

// Combined props
type AppProps<T = {}> = ThemedProps<UserAwareProps<T>>;

// Usage
const app: LoadableApp<AppProps<{ customData: string }>> = {
  name: 'themed-user-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!,
  props: {
    theme: 'dark',
    currentUser: { id: '123', name: 'John', role: 'admin' },
    customData: 'custom value'
  }
};
```

## 📖 Advanced Type Patterns

### Conditional Types for Configuration

```typescript
// Configuration based on environment
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

// Usage with environment detection
declare const NODE_ENV: 'development' | 'production';
type CurrentConfig = EnvironmentConfig<typeof NODE_ENV>;
```

### Branded Types for App Names

```typescript
// Create branded type for app names to prevent mix-ups
type AppName = string & { readonly __brand: unique symbol };

function createAppName(name: string): AppName {
  return name as AppName;
}

// Enhanced LoadableApp with branded name
type SafeLoadableApp<T extends ObjectType> = Omit<LoadableApp<T>, 'name'> & {
  name: AppName;
};

// Usage
const appName = createAppName('my-secure-app');
const app: SafeLoadableApp<{}> = {
  name: appName, // Type-safe app name
  entry: '//localhost:8080',
  container: document.getElementById('container')!
};
```

### Lifecycle Event Types

```typescript
// Enhanced lifecycle with event data
type LifeCycleEvent<T extends ObjectType> = {
  app: LoadableApp<T>;
  global: WindowProxy;
  timestamp: number;
  phase: 'beforeLoad' | 'beforeMount' | 'afterMount' | 'beforeUnmount' | 'afterUnmount';
};

type EnhancedLifeCycleFn<T extends ObjectType> = (event: LifeCycleEvent<T>) => Promise<void>;

// Usage
const enhancedHook: EnhancedLifeCycleFn<{ userId: string }> = async (event) => {
  console.log(`Phase: ${event.phase}, App: ${event.app.name}, Time: ${event.timestamp}`);
  
  if (event.phase === 'beforeMount') {
    // Setup user context
    event.global.__USER_ID__ = event.app.props?.userId;
  }
};
```

## 🔍 Type Inference Examples

### Automatic Props Type Inference

```typescript
// Helper function with automatic type inference
function createTypedApp<T extends ObjectType>(
  config: {
    name: string;
    entry: string;
    container: HTMLElement;
    props: T;
  }
): LoadableApp<T> {
  return config; // TypeScript infers the correct type
}

// Usage - TypeScript automatically infers the props type
const app = createTypedApp({
  name: 'inferred-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!,
  props: {
    theme: 'dark',
    userId: '123',
    features: ['feature1', 'feature2']
  }
  // TypeScript knows props type is { theme: string; userId: string; features: string[] }
});
```

### Lifecycle Type Inference

```typescript
// Helper for creating typed lifecycles
function createLifecycles<T extends ObjectType>(
  lifecycles: LifeCycles<T>
): LifeCycles<T> {
  return lifecycles;
}

// Usage with inference
const typedLifecycles = createLifecycles({
  beforeMount: async (app) => {
    // TypeScript infers app.props type based on usage
    console.log(app.props?.theme); // TypeScript knows this might be undefined
  }
});
```

## ⚡ Best Practices

### 1. Use Strict Types

```typescript
// ✅ Good: Strict typing
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

// ❌ Bad: Loose typing
const looseApp: LoadableApp<any> = {
  name: 'loose-app',
  entry: '//localhost:8080',
  container: document.getElementById('container')!,
  props: { anything: 'goes' } // No type safety
};
```

### 2. Create Domain-Specific Types

```typescript
// Create types specific to your domain
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

### 3. Use Generic Constraints

```typescript
// Constrain generic types for better type safety
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
    throw new Error(`Container ${config.containerId} not found`);
  }
  
  return {
    ...config,
    container
  };
}
```

## 🔗 Related Documentation

- [API Reference](/api/) - Main API documentation
- [Lifecycles](/api/lifecycles) - Detailed lifecycle documentation
- [Configuration](/api/configuration) - Configuration options 