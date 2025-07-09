# loadMicroApp

Manually load a micro application. This is useful for loading micro applications dynamically or when they are not associated with routing.

## 🎯 Function Signature

```typescript
function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>
): MicroApp
```

## 📋 Parameters

### app

- **Type**: `LoadableApp<T>`
- **Required**: ✅
- **Description**: Micro application configuration

#### LoadableApp Structure

```typescript
interface LoadableApp<T extends ObjectType> {
  name: string;                    // Micro app name, globally unique
  entry: string | EntryOpts;       // Micro app entry
  container: string | HTMLElement; // Container for the micro app
  props?: T;                       // Custom data passed to micro app
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | ✅ | Micro application name, used as unique identifier |
| `entry` | `string \| EntryOpts` | ✅ | Micro application entry, can be URL or resource configuration |
| `container` | `string \| HTMLElement` | ✅ | Container node selector or DOM element |
| `props` | `T` | ❌ | Custom data passed to the micro application |

### configuration

- **Type**: `AppConfiguration`
- **Required**: ❌
- **Description**: Advanced configuration options

```typescript
interface AppConfiguration {
  sandbox?: boolean;               // Enable sandbox isolation
  globalContext?: WindowProxy;     // Global context for the micro app
  fetch?: Function;                // Custom fetch function
  streamTransformer?: Function;    // Stream transformer
  nodeTransformer?: Function;      // Node transformer
}
```

### lifeCycles

- **Type**: `LifeCycles<T>`
- **Required**: ❌
- **Description**: Lifecycle hooks for this specific micro application

## 🔄 Return Value

Returns a `MicroApp` instance with the following methods:

```typescript
interface MicroApp {
  mount(): Promise<void>;          // Mount the micro app
  unmount(): Promise<void>;        // Unmount the micro app
  update(props: any): Promise<void>; // Update micro app props
  getStatus(): string;             // Get current status
  loadPromise: Promise<void>;      // Loading promise
  mountPromise: Promise<void>;     // Mounting promise
  unmountPromise: Promise<void>;   // Unmounting promise
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp({
  name: 'manual-app',
  entry: '//localhost:8080',
  container: '#manual-container',
});

// The micro app will be automatically mounted
```

### With Custom Props

```typescript
const microApp = loadMicroApp({
  name: 'dashboard',
  entry: '//localhost:8080',
  container: '#dashboard-container',
  props: {
    token: localStorage.getItem('token'),
    userId: getCurrentUserId(),
    theme: 'dark'
  }
});
```

### With Configuration

```typescript
const microApp = loadMicroApp({
  name: 'third-party-app',
  entry: '//external.example.com',
  container: '#external-container',
}, {
  sandbox: false, // Disable sandbox for legacy apps
  fetch: customFetch, // Use custom fetch
});
```

### With Lifecycle Hooks

```typescript
const microApp = loadMicroApp({
  name: 'monitored-app',
  entry: '//localhost:8080',
  container: '#monitored-container',
}, undefined, {
  beforeMount: (app) => {
    console.log('About to mount:', app.name);
    showLoadingSpinner();
  },
  afterMount: (app) => {
    console.log('Mounted successfully:', app.name);
    hideLoadingSpinner();
  },
  beforeUnmount: (app) => {
    console.log('About to unmount:', app.name);
    saveUserState();
  }
});
```

## 🔧 Advanced Usage

### Dynamic Loading with Conditions

```typescript
async function loadAppConditionally(condition: boolean) {
  if (condition) {
    const microApp = loadMicroApp({
      name: 'conditional-app',
      entry: '//localhost:8080',
      container: '#conditional-container',
    });
    
    return microApp;
  }
  return null;
}
```

### Loading Multiple Apps

```typescript
function loadMultipleApps() {
  const apps = [
    { name: 'app1', entry: '//localhost:8001', container: '#container1' },
    { name: 'app2', entry: '//localhost:8002', container: '#container2' },
    { name: 'app3', entry: '//localhost:8003', container: '#container3' },
  ];

  const microApps = apps.map(app => loadMicroApp(app));
  return microApps;
}
```

### Manual Control

```typescript
const microApp = loadMicroApp({
  name: 'controlled-app',
  entry: '//localhost:8080',
  container: '#controlled-container',
});

// Manual unmount
await microApp.unmount();

// Update props
await microApp.update({ newData: 'updated' });

// Check status
console.log(microApp.getStatus()); // 'MOUNTED', 'UNMOUNTED', etc.
```

## 🎭 Use Cases

### 1. Modal/Dialog Applications

```typescript
function openAppModal() {
  const modal = document.createElement('div');
  modal.id = 'app-modal';
  document.body.appendChild(modal);

  const microApp = loadMicroApp({
    name: 'modal-app',
    entry: '//localhost:8080',
    container: modal,
    props: { 
      onClose: () => {
        microApp.unmount().then(() => {
          document.body.removeChild(modal);
        });
      }
    }
  });

  return microApp;
}
```

### 2. Tab-based Applications

```typescript
class TabManager {
  private activeTabs = new Map<string, MicroApp>();

  async switchTab(tabName: string, config: LoadableApp) {
    // Unmount current active tab
    const currentApp = this.activeTabs.get('active');
    if (currentApp) {
      await currentApp.unmount();
    }

    // Load new tab
    const newApp = loadMicroApp({
      ...config,
      container: '#tab-content'
    });

    this.activeTabs.set('active', newApp);
    this.activeTabs.set(tabName, newApp);
  }
}
```

### 3. Widget System

```typescript
class WidgetSystem {
  loadWidget(widgetConfig: any) {
    return loadMicroApp({
      name: `widget-${widgetConfig.id}`,
      entry: widgetConfig.url,
      container: `#widget-${widgetConfig.id}`,
      props: widgetConfig.props
    }, {
      sandbox: true // Isolate widgets
    });
  }
}
```

## ⚠️ Important Notes

### Container Management

```typescript
// ❌ Bad: Reusing containers without proper cleanup
loadMicroApp({ name: 'app1', entry: '//localhost:8001', container: '#shared' });
loadMicroApp({ name: 'app2', entry: '//localhost:8002', container: '#shared' }); // Conflict!

// ✅ Good: Use unique containers or proper cleanup
const app1 = loadMicroApp({ name: 'app1', entry: '//localhost:8001', container: '#container1' });
const app2 = loadMicroApp({ name: 'app2', entry: '//localhost:8002', container: '#container2' });
```

### Memory Management

```typescript
// ✅ Good: Proper cleanup
const microApp = loadMicroApp({...});

// When done, always unmount
window.addEventListener('beforeunload', () => {
  microApp.unmount();
});
```

### Error Handling

```typescript
try {
  const microApp = loadMicroApp({
    name: 'potentially-failing-app',
    entry: '//unreliable-server.com',
    container: '#container',
  });

  // Wait for load
  await microApp.loadPromise;
  console.log('App loaded successfully');
} catch (error) {
  console.error('Failed to load micro app:', error);
  // Handle error - show fallback UI, retry, etc.
}
```

## 🆚 vs registerMicroApps

| Feature | `loadMicroApp` | `registerMicroApps` |
|---------|----------------|---------------------|
| **Loading** | Manual, immediate | Automatic, route-based |
| **Use Case** | Dynamic loading, widgets, modals | Main navigation, SPA routing |
| **Lifecycle** | Manual control | Automatic by routing |
| **Performance** | Load on demand | Can preload |

## 🚀 Best Practices

### 1. Resource Management

```typescript
class MicroAppManager {
  private apps = new Map<string, MicroApp>();

  async loadApp(config: LoadableApp) {
    // Check if already loaded
    if (this.apps.has(config.name)) {
      return this.apps.get(config.name);
    }

    const app = loadMicroApp(config);
    this.apps.set(config.name, app);
    
    // Auto cleanup on unmount
    app.unmountPromise.then(() => {
      this.apps.delete(config.name);
    });

    return app;
  }
}
```

### 2. Props Management

```typescript
// ✅ Good: Reactive props
function createReactiveMicroApp(baseConfig: LoadableApp) {
  let currentApp: MicroApp;

  return {
    async updateProps(newProps: any) {
      if (currentApp) {
        await currentApp.update(newProps);
      }
    },
    
    async reload(newConfig: LoadableApp) {
      if (currentApp) {
        await currentApp.unmount();
      }
      currentApp = loadMicroApp({
        ...baseConfig,
        ...newConfig
      });
    }
  };
}
```

### 3. Error Boundaries

```typescript
function loadMicroAppWithFallback(config: LoadableApp, fallbackHTML: string) {
  const microApp = loadMicroApp(config);
  
  microApp.loadPromise.catch((error) => {
    console.error('Micro app failed to load:', error);
    // Show fallback content
    const container = typeof config.container === 'string' 
      ? document.querySelector(config.container)
      : config.container;
    
    if (container) {
      container.innerHTML = fallbackHTML;
    }
  });

  return microApp;
}
```

## 🔗 Related APIs

- [registerMicroApps](/api/register-micro-apps) - For route-based micro app loading
- [start](/api/start) - Start qiankun framework
- [Lifecycles](/api/lifecycles) - Detailed lifecycle documentation 