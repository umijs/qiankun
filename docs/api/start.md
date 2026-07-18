# start

Start the qiankun framework. This function initializes the micro-frontend system and enables automatic routing-based micro application loading.

## 🎯 Function Signature

```typescript
function start(opts?: StartOpts): void
```

## 📋 Parameters

### opts

- **Type**: `StartOpts`
- **Required**: ❌
- **Description**: Startup configuration options

```typescript
interface StartOpts {
  prefetch?: boolean | 'all' | string[] | ((apps: RegistrableApp[]) => { criticalAppNames: string[]; minorAppsName: string[] });
  sandbox?: boolean | SandboxConfiguration;
  singular?: boolean;
  urlRerouteOnly?: boolean;
  // ... other single-spa start options
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prefetch` | `boolean \| 'all' \| string[] \| Function` | `true` | Resource prefetch strategy |
| `sandbox` | `boolean \| SandboxConfiguration` | `true` | Sandbox isolation configuration |
| `singular` | `boolean` | `true` | Whether only one micro app can be mounted at a time |
| `urlRerouteOnly` | `boolean` | `true` | Whether to trigger routing only on URL changes |

## 💡 Usage Examples

### Basic Usage

```typescript
import { registerMicroApps, start } from 'qiankun';

// Register micro apps first
registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100',
    container: '#subapp-viewport',
    activeRule: '/react',
  },
  {
    name: 'vue-app',
    entry: '//localhost:7101',
    container: '#subapp-viewport',
    activeRule: '/vue',
  },
]);

// Start qiankun
start();
```

### With Configuration

```typescript
start({
  prefetch: false,          // Disable prefetch
  sandbox: true,           // Enable sandbox
  singular: true,          // Only one app at a time
  urlRerouteOnly: true,    // Route only on URL changes
});
```

### Advanced Sandbox Configuration

```typescript
start({
  sandbox: {
    styleIsolation: true, // Scope every micro-app style to its container via CSS @scope
  }
});
```

### Custom Prefetch Strategy

```typescript
start({
  prefetch: 'all', // Prefetch all micro apps
});

// Or prefetch specific apps
start({
  prefetch: ['react-app', 'vue-app'], // Only prefetch these apps
});

// Or custom prefetch function
start({
  prefetch: (apps) => ({
    criticalAppNames: ['dashboard', 'user-center'], // Critical apps to prefetch immediately
    minorAppsName: ['analytics', 'settings'],       // Minor apps to prefetch later
  })
});
```

## ⚙️ Configuration Options

### Prefetch Strategies

#### 1. Boolean Values

```typescript
// Disable prefetch completely
start({ prefetch: false });

// Enable default prefetch behavior
start({ prefetch: true });
```

#### 2. Prefetch All

```typescript
// Prefetch all registered micro apps
start({ prefetch: 'all' });
```

#### 3. Selective Prefetch

```typescript
// Prefetch only specified apps
start({ 
  prefetch: ['critical-app1', 'critical-app2'] 
});
```

#### 4. Dynamic Prefetch Strategy

```typescript
start({
  prefetch: (apps) => {
    // Custom logic to determine which apps to prefetch
    const criticalApps = apps
      .filter(app => app.name.includes('critical'))
      .map(app => app.name);
    
    const minorApps = apps
      .filter(app => !app.name.includes('critical'))
      .map(app => app.name);

    return {
      criticalAppNames: criticalApps,  // Prefetch immediately
      minorAppsName: minorApps,        // Prefetch when idle
    };
  }
});
```

### Sandbox Configuration

#### 1. Boolean Sandbox

```typescript
// Enable basic sandbox
start({ sandbox: true });

// Disable sandbox (not recommended)
start({ sandbox: false });
```

#### 2. Advanced Sandbox

```typescript
start({
  sandbox: {
    styleIsolation: true, // CSS @scope based style isolation
  }
});
```

### Performance Options

```typescript
start({
  singular: false,        // Allow multiple apps to mount simultaneously
  urlRerouteOnly: false,  // Trigger routing on both URL and programmatic changes
});
```

## 🚀 Best Practices

### 1. Call After Registration

```typescript
// ✅ Correct order
registerMicroApps([...]);
start();

// ❌ Wrong order
start();
registerMicroApps([...]); // This won't work properly
```

### 2. Environment-based Configuration

```typescript
const startOpts = {
  prefetch: process.env.NODE_ENV === 'production' ? 'all' : false,
  sandbox: {
    styleIsolation: process.env.NODE_ENV === 'production',
  },
};

start(startOpts);
```

### 3. Performance Optimization

```typescript
// For better performance in production
start({
  prefetch: (apps) => ({
    criticalAppNames: ['dashboard'], // Only prefetch critical apps
    minorAppsName: [], // Don't prefetch minor apps
  }),
  singular: true, // Prevent memory issues
  sandbox: {
    styleIsolation: true, // Lightweight @scope-based style isolation
  },
});
```

### 4. Development vs Production

```typescript
if (process.env.NODE_ENV === 'development') {
  start({
    prefetch: false,    // Faster development reload
    sandbox: false,     // Easier debugging
    singular: false,    // More flexible development
  });
} else {
  start({
    prefetch: 'all',    // Better user experience
    sandbox: true,      // Better isolation
    singular: true,     // Stable performance
  });
}
```

## 🔧 Integration Patterns

### 1. With Loading States

```typescript
import { registerMicroApps, start } from 'qiankun';

let isQiankunStarted = false;

function startQiankunWithLoading() {
  if (isQiankunStarted) return;

  showGlobalLoading();

  registerMicroApps([...], {
    beforeLoad: (app) => {
      console.log(`Loading ${app.name}...`);
    },
    afterMount: (app) => {
      console.log(`${app.name} mounted`);
      hideGlobalLoading();
    },
  });

  start({
    prefetch: 'all',
    sandbox: true,
  });

  isQiankunStarted = true;
}
```

### 2. With Error Handling

```typescript
function startQiankunSafely() {
  try {
    registerMicroApps([...]);
    
    start({
      prefetch: 'all',
      sandbox: true,
    });

    console.log('Qiankun started successfully');
  } catch (error) {
    console.error('Failed to start qiankun:', error);
    // Fallback to traditional routing or show error page
    window.location.href = '/fallback';
  }
}
```

### 3. With Feature Detection

```typescript
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  registerMicroApps([...]);
  start();
} else {
  console.warn('Browser not compatible with qiankun');
  // Fallback implementation
  initTraditionalRouting();
}
```

## ⚠️ Important Notes

### 1. Call Only Once

```typescript
// ❌ Bad: Multiple calls
start();
start(); // This will be ignored

// ✅ Good: Single call
start();
```

### 2. Order Matters

```typescript
// ✅ Correct order
registerMicroApps([...]);  // 1. Register apps first
start();                   // 2. Then start

// ❌ Wrong order - apps won't be registered properly
start();
registerMicroApps([...]);
```

### 3. Prefetch Considerations

```typescript
// ⚠️ Be careful with 'all' in large applications
start({ prefetch: 'all' }); // Might impact initial load performance

// ✅ Better: Selective prefetch
start({ 
  prefetch: ['critical-app1', 'critical-app2'] 
});
```

## 🎯 Common Use Cases

### 1. E-commerce Platform

```typescript
registerMicroApps([
  { name: 'product-catalog', entry: '//catalog.example.com', activeRule: '/products' },
  { name: 'shopping-cart', entry: '//cart.example.com', activeRule: '/cart' },
  { name: 'user-account', entry: '//account.example.com', activeRule: '/account' },
]);

start({
  prefetch: (apps) => ({
    criticalAppNames: ['shopping-cart'], // Always prefetch cart
    minorAppsName: ['user-account'],     // Prefetch account when idle
  }),
  sandbox: true,
  singular: true,
});
```

### 2. Admin Dashboard

```typescript
start({
  prefetch: false,  // Don't prefetch - admin tools are used on demand
  sandbox: {
    styleIsolation: true, // Prevent style conflicts between admin tools
  },
  singular: false,  // Allow multiple admin tools open simultaneously
});
```

### 3. Multi-tenant Platform

```typescript
const tenantId = getCurrentTenantId();

start({
  prefetch: [`tenant-${tenantId}-dashboard`], // Only prefetch current tenant's apps
  sandbox: true, // Isolate tenant data
  singular: true,
});
```

## 🔗 Related APIs

- [registerMicroApps](/api/register-micro-apps) - Register micro applications
- [loadMicroApp](/api/load-micro-app) - Manually load micro applications
- [isRuntimeCompatible](/api/is-runtime-compatible) - Check browser compatibility 