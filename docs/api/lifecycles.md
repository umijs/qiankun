# Lifecycles

Lifecycle hooks allow you to perform custom logic at different stages of a micro application's lifecycle. These hooks are executed automatically by qiankun during application loading, mounting, and unmounting processes.

## 🎯 Type Definition

```typescript
export type LifeCycleFn<T extends ObjectType> = (
  app: LoadableApp<T>, 
  global: WindowProxy
) => Promise<void>;

export type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
```

## 📋 Available Lifecycle Hooks

### beforeLoad

**Timing**: Called before the micro application starts loading.

**Purpose**: Perform setup tasks before the application code is fetched and parsed.

```typescript
beforeLoad: async (app, global) => {
  console.log(`About to load ${app.name}`);
  // Setup global configurations
  global.__INITIAL_CONFIG__ = getInitialConfig();
}
```

### beforeMount

**Timing**: Called after the application is loaded but before it's mounted to the DOM.

**Purpose**: Perform final setup before the application becomes active.

```typescript
beforeMount: async (app, global) => {
  console.log(`About to mount ${app.name}`);
  // Initialize services
  await initializeServices();
  // Set loading state
  setLoadingState(false);
}
```

### afterMount

**Timing**: Called after the micro application has been successfully mounted.

**Purpose**: Perform post-mount operations like analytics, feature initialization.

```typescript
afterMount: async (app, global) => {
  console.log(`${app.name} mounted successfully`);
  // Track analytics
  analytics.track('micro_app_mounted', { appName: app.name });
  // Initialize features that depend on DOM
  initializeDOMDependentFeatures();
}
```

### beforeUnmount

**Timing**: Called before the micro application starts unmounting.

**Purpose**: Cleanup operations before the application is removed.

```typescript
beforeUnmount: async (app, global) => {
  console.log(`About to unmount ${app.name}`);
  // Save application state
  saveApplicationState(app.name);
  // Cleanup event listeners
  cleanupEventListeners();
}
```

### afterUnmount

**Timing**: Called after the micro application has been completely unmounted.

**Purpose**: Final cleanup and resource deallocation.

```typescript
afterUnmount: async (app, global) => {
  console.log(`${app.name} unmounted`);
  // Clear caches
  clearApplicationCache(app.name);
  // Reset global state
  resetGlobalState();
}
```

## 🔄 Lifecycle Flow

```mermaid
graph TD
    A[Start Loading] --> B[beforeLoad]
    B --> C[Load Application Code]
    C --> D[beforeMount]
    D --> E[Mount Application]
    E --> F[afterMount]
    F --> G[Application Running]
    G --> H[beforeUnmount]
    H --> I[Unmount Application]
    I --> J[afterUnmount]
    J --> K[Application Cleaned Up]
```

## 💡 Usage Examples

### Basic Usage with registerMicroApps

```typescript
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100',
    container: '#subapp-viewport',
    activeRule: '/react',
  }
], {
  beforeLoad: async (app) => {
    console.log('Loading app:', app.name);
  },
  afterMount: async (app) => {
    console.log('App mounted:', app.name);
  },
  beforeUnmount: async (app) => {
    console.log('Unmounting app:', app.name);
  }
});

start();
```

### With loadMicroApp

```typescript
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp({
  name: 'dashboard',
  entry: '//localhost:8080',
  container: '#dashboard-container',
}, undefined, {
  beforeLoad: async (app, global) => {
    // Setup dashboard-specific configurations
    global.DASHBOARD_CONFIG = getDashboardConfig();
  },
  afterMount: async (app) => {
    // Initialize dashboard widgets
    initializeDashboardWidgets();
  }
});
```

### Multiple Hooks

```typescript
// You can provide multiple hooks as an array
const lifecycles = {
  beforeMount: [
    async (app) => {
      await setupDatabase();
    },
    async (app) => {
      await setupAnalytics();
    },
    async (app) => {
      await setupFeatureFlags();
    }
  ],
  afterMount: [
    async (app) => {
      trackPageView(app.name);
    },
    async (app) => {
      initializeUserTracking();
    }
  ]
};
```

## 🔧 Advanced Patterns

### 1. State Management Integration

```typescript
import { store } from './store';

const lifecycles = {
  beforeLoad: async (app) => {
    // Set loading state
    store.dispatch({ type: 'SET_APP_LOADING', payload: { appName: app.name, loading: true } });
  },
  
  afterMount: async (app) => {
    // Update mounted apps list
    store.dispatch({ type: 'ADD_MOUNTED_APP', payload: app.name });
    store.dispatch({ type: 'SET_APP_LOADING', payload: { appName: app.name, loading: false } });
  },
  
  beforeUnmount: async (app) => {
    // Save app state before unmounting
    const appState = getAppState(app.name);
    store.dispatch({ type: 'SAVE_APP_STATE', payload: { appName: app.name, state: appState } });
  },
  
  afterUnmount: async (app) => {
    // Remove from mounted apps list
    store.dispatch({ type: 'REMOVE_MOUNTED_APP', payload: app.name });
  }
};
```

### 2. Error Handling

```typescript
const lifecycles = {
  beforeLoad: async (app) => {
    try {
      await performPreLoadChecks(app);
    } catch (error) {
      console.error(`Pre-load checks failed for ${app.name}:`, error);
      // Optionally prevent loading by throwing
      throw new Error(`Failed to initialize ${app.name}`);
    }
  },
  
  afterMount: async (app) => {
    try {
      await performPostMountTasks(app);
    } catch (error) {
      console.error(`Post-mount tasks failed for ${app.name}:`, error);
      // Log error but don't prevent the app from running
      reportError(error, { context: 'afterMount', appName: app.name });
    }
  }
};
```

### 3. Performance Monitoring

```typescript
const performanceTracker = new Map();

const lifecycles = {
  beforeLoad: async (app) => {
    performanceTracker.set(app.name, {
      loadStart: performance.now()
    });
  },
  
  beforeMount: async (app) => {
    const timing = performanceTracker.get(app.name);
    timing.loadEnd = performance.now();
    timing.mountStart = performance.now();
  },
  
  afterMount: async (app) => {
    const timing = performanceTracker.get(app.name);
    timing.mountEnd = performance.now();
    
    // Calculate and report metrics
    const loadTime = timing.loadEnd - timing.loadStart;
    const mountTime = timing.mountEnd - timing.mountStart;
    
    analytics.track('micro_app_performance', {
      appName: app.name,
      loadTime,
      mountTime,
      totalTime: loadTime + mountTime
    });
  }
};
```

### 4. Resource Management

```typescript
const resourceMap = new Map();

const lifecycles = {
  beforeMount: async (app) => {
    // Allocate resources
    const resources = await allocateResources(app.name);
    resourceMap.set(app.name, resources);
  },
  
  beforeUnmount: async (app) => {
    // Save critical data
    const resources = resourceMap.get(app.name);
    if (resources) {
      await saveCriticalData(app.name, resources);
    }
  },
  
  afterUnmount: async (app) => {
    // Release resources
    const resources = resourceMap.get(app.name);
    if (resources) {
      await releaseResources(resources);
      resourceMap.delete(app.name);
    }
  }
};
```

## 🎯 Common Use Cases

### 1. Loading States

```typescript
const loadingManager = {
  show: (appName) => {
    const loader = document.createElement('div');
    loader.id = `loader-${appName}`;
    loader.innerHTML = '<div class="spinner">Loading...</div>';
    document.body.appendChild(loader);
  },
  
  hide: (appName) => {
    const loader = document.getElementById(`loader-${appName}`);
    if (loader) loader.remove();
  }
};

const lifecycles = {
  beforeLoad: async (app) => {
    loadingManager.show(app.name);
  },
  
  afterMount: async (app) => {
    loadingManager.hide(app.name);
  }
};
```

### 2. Authentication Check

```typescript
const lifecycles = {
  beforeLoad: async (app) => {
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }
  },
  
  beforeMount: async (app, global) => {
    // Inject user context
    const userContext = await getUserContext();
    global.__USER_CONTEXT__ = userContext;
  }
};
```

### 3. Theme Synchronization

```typescript
const lifecycles = {
  beforeMount: async (app, global) => {
    // Sync theme with micro app
    const currentTheme = getCurrentTheme();
    global.__THEME__ = currentTheme;
    
    // Apply theme-specific styles
    applyThemeStyles(currentTheme);
  },
  
  afterUnmount: async (app) => {
    // Clean up theme styles
    removeThemeStyles(app.name);
  }
};
```

### 4. Feature Flag Management

```typescript
const lifecycles = {
  beforeLoad: async (app, global) => {
    // Load feature flags for the specific app
    const featureFlags = await getFeatureFlags(app.name);
    global.__FEATURE_FLAGS__ = featureFlags;
  },
  
  afterMount: async (app) => {
    // Track which features are enabled
    trackEnabledFeatures(app.name);
  }
};
```

## ⚠️ Important Notes

### 1. Hook Execution Order

```typescript
// Hooks are executed in this order:
// 1. beforeLoad (before app code is loaded)
// 2. beforeMount (after load, before DOM mount)
// 3. afterMount (after DOM mount)
// ... app is running ...
// 4. beforeUnmount (before DOM unmount)
// 5. afterUnmount (after DOM unmount)
```

### 2. Error Handling

```typescript
// ❌ Bad: Unhandled errors can break the lifecycle
beforeLoad: async (app) => {
  riskyOperation(); // This could throw
}

// ✅ Good: Always handle potential errors
beforeLoad: async (app) => {
  try {
    await riskyOperation();
  } catch (error) {
    console.error('Error in beforeLoad:', error);
    // Decide whether to throw or handle gracefully
  }
}
```

### 3. Async Operations

```typescript
// ✅ Good: All lifecycle hooks are async
beforeMount: async (app) => {
  await setupDatabase();
  await loadUserPreferences();
}

// ❌ Bad: Don't forget await for async operations
beforeMount: async (app) => {
  setupDatabase(); // Missing await!
  loadUserPreferences(); // Missing await!
}
```

### 4. Global Context

```typescript
// ✅ Good: Use the provided global context
beforeMount: async (app, global) => {
  global.MY_CONFIG = getConfig(); // Set on the isolated global
}

// ❌ Bad: Don't use window directly
beforeMount: async (app, global) => {
  window.MY_CONFIG = getConfig(); // Might affect other apps
}
```

## 🚀 Best Practices

### 1. Keep Hooks Lightweight

```typescript
// ✅ Good: Fast operations
beforeMount: async (app) => {
  setAppTheme(app.name);
  updateNavigationState();
}

// ❌ Bad: Heavy operations
beforeMount: async (app) => {
  await downloadLargeDataset(); // This will block mounting
  await processHeavyCalculations();
}
```

### 2. Use Hook Arrays for Organization

```typescript
const lifecycles = {
  beforeMount: [
    setupAuthentication,
    setupTheme,
    setupAnalytics,
    setupFeatureFlags
  ],
  afterMount: [
    trackPageView,
    initializeWidgets,
    preloadCriticalData
  ]
};
```

### 3. Consistent Error Logging

```typescript
const createSafeHook = (hookName, hookFn) => async (app, global) => {
  try {
    await hookFn(app, global);
  } catch (error) {
    console.error(`Error in ${hookName} for ${app.name}:`, error);
    // Report to error tracking service
    errorTracker.report(error, { hook: hookName, app: app.name });
  }
};

const lifecycles = {
  beforeLoad: createSafeHook('beforeLoad', async (app) => {
    // Your beforeLoad logic
  }),
  afterMount: createSafeHook('afterMount', async (app) => {
    // Your afterMount logic
  })
};
```

### 4. Resource Cleanup

```typescript
// Track resources in a way that survives app reloads
const globalResourceMap = window.__QIANKUN_RESOURCES__ || new Map();
window.__QIANKUN_RESOURCES__ = globalResourceMap;

const lifecycles = {
  beforeMount: async (app) => {
    const resources = await allocateResources();
    globalResourceMap.set(app.name, resources);
  },
  
  afterUnmount: async (app) => {
    const resources = globalResourceMap.get(app.name);
    if (resources) {
      await cleanupResources(resources);
      globalResourceMap.delete(app.name);
    }
  }
};
```

## 🔗 Related APIs

- [registerMicroApps](/api/register-micro-apps) - Using lifecycles with registered apps
- [loadMicroApp](/api/load-micro-app) - Using lifecycles with manually loaded apps
- [start](/api/start) - Framework startup configuration 