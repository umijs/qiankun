# API Reference

qiankun provides a simple yet powerful API set for building micro-frontend applications. All APIs are fully typed with TypeScript definitions to ensure both developer experience and type safety.

## 📚 Core APIs

### Application Registration & Startup

| API | Description | Type |
|-----|-------------|------|
| [`registerMicroApps`](/api/register-micro-apps) | Register micro applications | `(apps: RegistrableApp[], lifeCycles?: LifeCycles) => void` |
| [`start`](/api/start) | Start qiankun framework | `(opts?: StartOpts) => void` |
| [`loadMicroApp`](/api/load-micro-app) | Manually load micro application | `(app: LoadableApp, configuration?: AppConfiguration, lifeCycles?: LifeCycles) => MicroApp` |

### Utility APIs

| API | Description | Type |
|-----|-------------|------|
| [`isRuntimeCompatible`](/api/is-runtime-compatible) | Check runtime compatibility | `() => boolean` |

## 🎯 Quick Navigation

### By Use Case

**Route-based Mode**
```typescript
import { registerMicroApps, start } from 'qiankun';

// 1. Register micro apps
registerMicroApps([...]);

// 2. Start framework
start();
```

**Manual Loading Mode**
```typescript
import { loadMicroApp } from 'qiankun';

// Manually load micro app
const microApp = loadMicroApp({...});
```

**Compatibility Check**
```typescript
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  // Start micro-frontend application
}
```

### By Functionality

| Category | Related APIs | Description |
|----------|--------------|-------------|
| **App Management** | `registerMicroApps`, `loadMicroApp` | Register and load micro applications |
| **Framework Control** | `start` | Framework startup and configuration |
| **Utilities** | `isRuntimeCompatible` | Helper utility methods |

## 🔧 Type Definitions

qiankun provides complete TypeScript type definitions:

```typescript
import type {
  RegistrableApp,
  LoadableApp,
  MicroApp,
  LifeCycles,
  AppConfiguration,
} from 'qiankun';
```

See [Type Definitions](/api/types) for detailed information.

## 📖 Detailed Documentation

### Core APIs
- [registerMicroApps](/api/register-micro-apps) - Register micro applications
- [start](/api/start) - Start qiankun framework
- [loadMicroApp](/api/load-micro-app) - Manually load micro applications
- [isRuntimeCompatible](/api/is-runtime-compatible) - Runtime compatibility check

### Reference Documentation
- [Lifecycles](/api/lifecycles) - Application lifecycle hooks
- [Configuration](/api/configuration) - Framework configuration options
- [Types](/api/types) - TypeScript type definitions

## 💡 Usage Recommendations

### Recommended API Usage Patterns

1. **Standard Route-based Mode** (Recommended)
   ```typescript
   registerMicroApps([...]) → start()
   ```

2. **Dynamic Loading Mode**
   ```typescript
   loadMicroApp({...}) 
   ```

3. **Hybrid Mode**
   ```typescript
   registerMicroApps([...]) → start() + loadMicroApp({...})
   ```

### Best Practices

- ✅ Use TypeScript for complete type support
- ✅ Register all micro apps before starting the framework
- ✅ Use lifecycle hooks appropriately for state management
- ✅ Configure proper error handling

- ❌ Avoid registering duplicate app names
- ❌ Avoid calling main app APIs from micro apps
- ❌ Avoid time-consuming operations in lifecycle hooks 