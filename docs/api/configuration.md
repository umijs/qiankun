# Configuration

qiankun provides flexible configuration options to customize the behavior of micro-frontend applications. This document covers all available configuration options for different use cases.

## 📋 Configuration Types

### AppConfiguration

Configuration for individual micro applications used with `loadMicroApp`.

```typescript
type AppConfiguration = {
  sandbox?: boolean | SandboxConfiguration;
  fetch?: Function;
  streamTransformer?: Function;
  nodeTransformer?: Function;
};
```

### SandboxConfiguration

The umbrella configuration for the JS sandbox. Structurally it is a public projection of `CompartmentOptions` plus two qiankun host extensions (`plugins` and `styleIsolation`).

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

Configuration for starting the qiankun framework used with `start()`.

```typescript
interface StartOpts {
  prefetch?: boolean | 'all' | string[] | ((apps: RegistrableApp[]) => { criticalAppNames: string[]; minorAppsName: string[] });
  sandbox?: boolean | SandboxConfiguration;
  singular?: boolean;
  urlRerouteOnly?: boolean;
  // ... other single-spa options
}
```

## ⚙️ App Configuration Options

### sandbox

**Type**: `boolean | SandboxConfiguration`

**Default**: `true`

**Description**: The single umbrella switch for the JS sandbox. `false` disables isolation entirely; `true` (the default) enables it with defaults; an object enables it and configures the underlying Compartment.

#### Basic Usage

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

#### Why Use Sandbox?

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

**Type**: `WindowProxy`  
**Default**: `window`  
**Description**: The host context that incubates the sandbox — the global the sandbox reads through for properties it has not shadowed. Named after the "incubator realm" of the ShadowRealm proposal; the Compartment spec has no equivalent because Compartments isolate by absence, while qiankun isolates by projection of a host context.

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

**Type**: `Record<string, unknown | PropertyDescriptor>`

**Default**: `{}`

**Description**: Values and descriptors installed on this application's compartment global without modifying the host `window`. The name follows the `globals` endowments of the Compartment spec.

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

Configured keys are available to both classic and ESM applications. See [Extending sandbox isolation](/cookbook/sandbox-plugins) for descriptor rules.

### sandbox.plugins

**Type**: `IsolationPlugin[]`

**Default**: `[]`

**Description**: Application isolation plugins appended after qiankun's built-in plugins.

`bootstrap` plugins run before application scripts. `mount` plugins run on every mount, and their returned `Free` functions participate in unmount cleanup and remount recovery. See [Extending sandbox isolation](/cookbook/sandbox-plugins) for the complete protocol and an external plugin example.

### sandbox.styleIsolation

**Type**: `boolean`

**Default**: `false`

**Description**: Enable runtime CSS isolation: every micro-app style is scoped to the app container via CSS `@scope`.

```typescript
loadMicroApp(app, {
  sandbox: {
    styleIsolation: true,
  },
});
```

Static entry styles are scoped by the loader transpiler, while dynamically injected styles ride on the sandbox's DOM interception — which is why CSS isolation lives inside the `sandbox` object and is only configurable while the JS sandbox is enabled. An isolated-CSS-without-sandbox combination would silently leak dynamic styles.

### Module hooks (`sandbox.modules` / `resolveHook` / `importHook` / `loadHook`)

**Type**: module-related `CompartmentOptions`

**Default**: `{}`

**Description**: Advanced module resolution and loading hooks for this application's Compartment, set directly on the `sandbox` object.

Use `modules`, `resolveHook`, `importHook`, or its `loadHook` alias to provide redirects, private protocols, or precompiled module sources. These hooks affect sandboxed ESM loading only.

### fetch

**Type**: `Function`  
**Default**: `window.fetch`  
**Description**: Custom fetch function for loading application resources.

#### Custom Headers

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

#### Request Transformation

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

#### Caching Strategy

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

**Type**: `Function`  
**Description**: Transform streaming HTML content during loading.

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

**Type**: `Function`  
**Description**: Transform DOM nodes during application loading.

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

## 🚀 Start Configuration Options

### prefetch

**Type**: `boolean | 'all' | string[] | Function`  
**Default**: `true`  
**Description**: Resource prefetching strategy for better performance.

#### Boolean Values

```typescript
// Disable prefetch
start({ prefetch: false });

// Enable default prefetch
start({ prefetch: true });
```

#### Prefetch All

```typescript
// Prefetch all registered micro apps
start({ prefetch: 'all' });
```

#### Selective Prefetch

```typescript
// Prefetch specific apps
start({ 
  prefetch: ['dashboard', 'user-profile', 'analytics'] 
});
```

#### Dynamic Prefetch Strategy

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

#### User-based Prefetch

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

**Type**: `boolean | SandboxConfiguration`

**Default**: `true`

**Description**: Framework-level sandbox configuration for all micro applications.

#### Basic Sandbox

```typescript
// Enable sandbox for all apps
start({ sandbox: true });

// Disable sandbox for all apps (not recommended)
start({ sandbox: false });
```

#### Advanced Sandbox Configuration

```typescript
start({
  sandbox: {
    styleIsolation: true,  // Scope every micro-app style to its container via CSS @scope
  }
});
```

#### Style Isolation

**styleIsolation**: Scopes all micro-app styles to the app container via CSS `@scope`
```typescript
start({
  sandbox: {
    styleIsolation: true,  // Good balance of isolation and compatibility
  }
});
```

### singular

**Type**: `boolean`  
**Default**: `true`  
**Description**: Whether only one micro app can be mounted at a time.

```typescript
// Only one app at a time (default)
start({ singular: true });

// Allow multiple apps simultaneously
start({ 
  singular: false  // Useful for dashboard-style applications
});
```

#### Use Cases for Multiple Apps

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

**Type**: `boolean`  
**Default**: `true`  
**Description**: Whether to trigger routing only on URL changes.

```typescript
// Only route on URL changes (default)
start({ urlRerouteOnly: true });

// Route on both URL and programmatic changes
start({ 
  urlRerouteOnly: false  // More responsive but potentially more performance overhead
});
```

## 🔧 Environment-based Configuration

### Development Configuration

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

### Production Configuration

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

### Mobile Configuration

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

## 🎯 Advanced Configuration Patterns

### 1. Feature Flag Integration

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

### 2. Performance-based Configuration

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

### 3. User Role-based Configuration

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

## ⚠️ Important Notes

### 1. Configuration Precedence

```typescript
// App-level configuration overrides framework-level configuration
start({
  sandbox: true,  // Framework-level setting
});

loadMicroApp({
  name: 'special-app',
  entry: '//localhost:8080',
  container: '#container',
}, {
  sandbox: false  // This overrides the framework-level setting for this app
});
```

The merge is a shallow spread (`{ ...frameworkConfiguration, ...appConfiguration }`): a per-app `sandbox` object replaces the framework-level one entirely — there is no deep merge of individual sandbox fields.

### 2. Performance Considerations

```typescript
// ❌ Bad: Heavy configuration that impacts performance
start({
  prefetch: 'all',                 // Might slow down initial load
  singular: false,                 // More memory usage
  urlRerouteOnly: false,          // More frequent route checks
});

// ✅ Good: Balanced configuration
start({
  prefetch: ['critical-app'],      // Only prefetch what's needed
  sandbox: {
    styleIsolation: true,          // Lightweight @scope-based CSS isolation
  },
  singular: true,                  // Stable performance
  urlRerouteOnly: true,           // Optimized routing
});
```

### 3. Debugging Configuration

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

## 🔗 Related APIs

- [start](/api/start) - Start qiankun with configuration
- [loadMicroApp](/api/load-micro-app) - Load app with configuration
- [registerMicroApps](/api/register-micro-apps) - Register apps
