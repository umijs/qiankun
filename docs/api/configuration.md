# Configuration

qiankun provides flexible configuration options to customize the behavior of micro-frontend applications. This document covers all available configuration options for different use cases.

## 📋 Configuration Types

### AppConfiguration

Configuration for individual micro applications used with `loadMicroApp`.

```typescript
type AppConfiguration = {
  sandbox?: boolean;
  globalContext?: WindowProxy;
  fetch?: Function;
  streamTransformer?: Function;
  nodeTransformer?: Function;
};
```

### StartOpts

Configuration for starting the qiankun framework used with `start()`.

```typescript
interface StartOpts {
  prefetch?: boolean | 'all' | string[] | ((apps: RegistrableApp[]) => { criticalAppNames: string[]; minorAppsName: string[] });
  sandbox?: boolean | { strictStyleIsolation?: boolean; experimentalStyleIsolation?: boolean; };
  singular?: boolean;
  urlRerouteOnly?: boolean;
  // ... other single-spa options
}
```

## ⚙️ App Configuration Options

### sandbox

**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable sandbox isolation for the micro application.

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

### globalContext

**Type**: `WindowProxy`  
**Default**: `window`  
**Description**: Custom global context for the micro application.

```typescript
// Create a custom global context
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
  globalContext: customGlobal
});
```

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

**Type**: `boolean | SandboxConfig`  
**Default**: `true`  
**Description**: Global sandbox configuration for all micro applications.

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
    strictStyleIsolation: true,        // Enable Shadow DOM style isolation
    experimentalStyleIsolation: true,  // Enable scoped CSS style isolation
  }
});
```

#### Style Isolation Options

**strictStyleIsolation**: Uses Shadow DOM to completely isolate styles
```typescript
start({
  sandbox: {
    strictStyleIsolation: true,  // Strongest isolation but may break some UI libraries
  }
});
```

**experimentalStyleIsolation**: Uses scoped CSS to isolate styles
```typescript
start({
  sandbox: {
    experimentalStyleIsolation: true,  // Good balance of isolation and compatibility
  }
});
```

#### Combined Style Isolation

```typescript
start({
  sandbox: {
    strictStyleIsolation: false,       // Disable Shadow DOM
    experimentalStyleIsolation: true,  // Enable scoped CSS
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
    strictStyleIsolation: false,      // Easier debugging
    experimentalStyleIsolation: true,
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
    strictStyleIsolation: true,       // Better isolation
    experimentalStyleIsolation: false,
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
    // Lighter sandbox for mobile performance
    strictStyleIsolation: false,
    experimentalStyleIsolation: true,
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
      strictStyleIsolation: featureFlags.strictIsolation,
      experimentalStyleIsolation: !featureFlags.strictIsolation,
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
      sandbox: {
        strictStyleIsolation: false,
        experimentalStyleIsolation: true,
      },
      singular: true,
    };
  }
  
  return {
    prefetch: 'all',
    sandbox: {
      strictStyleIsolation: true,
      experimentalStyleIsolation: false,
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

### 2. Performance Considerations

```typescript
// ❌ Bad: Heavy configuration that impacts performance
start({
  prefetch: 'all',                 // Might slow down initial load
  sandbox: {
    strictStyleIsolation: true,    // More overhead
  },
  singular: false,                 // More memory usage
  urlRerouteOnly: false,          // More frequent route checks
});

// ✅ Good: Balanced configuration
start({
  prefetch: ['critical-app'],      // Only prefetch what's needed
  sandbox: {
    experimentalStyleIsolation: true, // Good balance
  },
  singular: true,                  // Stable performance
  urlRerouteOnly: true,           // Optimized routing
});
```

### 3. Debugging Configuration

```typescript
const debugConfig = {
  sandbox: {
    strictStyleIsolation: false,   // Easier to inspect styles
    experimentalStyleIsolation: true,
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