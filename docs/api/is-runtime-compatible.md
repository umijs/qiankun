# isRuntimeCompatible

Check if the current browser environment is compatible with qiankun runtime features.

## 🎯 Function Signature

```typescript
function isRuntimeCompatible(): boolean
```

## 📋 Parameters

This function takes no parameters.

## 🔄 Return Value

- **Type**: `boolean`
- **Description**: Returns `true` if the current environment supports qiankun features, `false` otherwise.

## 💡 Usage Examples

### Basic Compatibility Check

```typescript
import { isRuntimeCompatible, registerMicroApps, start } from 'qiankun';

if (isRuntimeCompatible()) {
  // Environment supports qiankun
  registerMicroApps([...]);
  start();
} else {
  // Fallback for unsupported browsers
  console.warn('Current browser does not support qiankun');
  initFallbackRouting();
}
```

### With Graceful Degradation

```typescript
function initApplication() {
  if (isRuntimeCompatible()) {
    // Use qiankun micro-frontend architecture
    initMicroFrontend();
  } else {
    // Fall back to traditional SPA
    initTraditionalSPA();
  }
}

function initMicroFrontend() {
  registerMicroApps([
    {
      name: 'module-a',
      entry: '//localhost:8001',
      container: '#container',
      activeRule: '/module-a',
    }
  ]);
  start();
}

function initTraditionalSPA() {
  // Traditional routing setup
  import('./traditional-router').then(router => {
    router.init();
  });
}
```

## 🔍 What It Checks

The `isRuntimeCompatible` function checks for the following browser features:

### Required Features

1. **Proxy Support**: For JavaScript sandbox isolation
2. **Window.Proxy**: Essential for creating isolated execution contexts
3. **Import Maps** (when used): For dynamic module loading
4. **Dynamic Import**: For loading micro applications

### Browser Compatibility

| Browser | Minimum Version | Support |
|---------|----------------|---------|
| Chrome | 61+ | ✅ Full |
| Firefox | 60+ | ✅ Full |
| Safari | 11+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| IE | Any | ❌ Not Supported |

## 🚀 Best Practices

### 1. Early Detection

```typescript
// Check compatibility before any qiankun setup
function bootstrap() {
  if (!isRuntimeCompatible()) {
    showUnsupportedBrowserMessage();
    return;
  }

  // Safe to proceed with qiankun
  setupMicroFrontend();
}
```

### 2. Progressive Enhancement

```typescript
class ApplicationBootstrap {
  private isQiankunSupported = isRuntimeCompatible();

  init() {
    if (this.isQiankunSupported) {
      this.initWithMicroFrontend();
    } else {
      this.initWithoutMicroFrontend();
    }
  }

  private initWithMicroFrontend() {
    // Full micro-frontend experience
    registerMicroApps([...]);
    start();
  }

  private initWithoutMicroFrontend() {
    // Simplified experience for unsupported browsers
    this.loadAllModulesDirectly();
  }
}
```

### 3. User Communication

```typescript
if (!isRuntimeCompatible()) {
  // Show user-friendly message
  const banner = document.createElement('div');
  banner.innerHTML = `
    <div style="background: #fff3cd; padding: 12px; border: 1px solid #ffeaa7; margin: 10px;">
      <strong>Browser Compatibility Notice:</strong>
      For the best experience, please use a modern browser like Chrome, Firefox, or Safari.
      Some features may be limited in your current browser.
    </div>
  `;
  document.body.insertBefore(banner, document.body.firstChild);
}
```

## 🔧 Integration Patterns

### 1. With Feature Flags

```typescript
const featureFlags = {
  useMicroFrontend: isRuntimeCompatible() && process.env.ENABLE_MICRO_FRONTEND,
  useAdvancedFeatures: isRuntimeCompatible(),
};

if (featureFlags.useMicroFrontend) {
  // Full micro-frontend setup
  registerMicroApps([...]);
  start();
} else {
  // Traditional setup
  initTraditionalApp();
}
```

### 2. With Analytics

```typescript
// Track browser compatibility for analytics
const compatible = isRuntimeCompatible();

// Send analytics event
analytics.track('browser_compatibility_check', {
  compatible,
  userAgent: navigator.userAgent,
  timestamp: Date.now(),
});

if (compatible) {
  initQiankunApp();
} else {
  initFallbackApp();
}
```

### 3. With Dynamic Loading

```typescript
async function loadApplicationFramework() {
  if (isRuntimeCompatible()) {
    // Load qiankun and micro-frontend modules
    const [qiankun, microApps] = await Promise.all([
      import('qiankun'),
      import('./micro-apps-config'),
    ]);
    
    qiankun.registerMicroApps(microApps.default);
    qiankun.start();
  } else {
    // Load traditional SPA modules
    const traditionalApp = await import('./traditional-app');
    traditionalApp.init();
  }
}
```

## ⚠️ Important Notes

### 1. Performance Consideration

```typescript
// ✅ Good: Check once and cache the result
const QIANKUN_COMPATIBLE = isRuntimeCompatible();

function someFunction() {
  if (QIANKUN_COMPATIBLE) {
    // Use cached result
  }
}

// ❌ Bad: Check multiple times
function someFunction() {
  if (isRuntimeCompatible()) { // Redundant check
    // ...
  }
}
```

### 2. SSR Considerations

```typescript
// In SSR environments, check if window is available
function safeCompatibilityCheck() {
  if (typeof window === 'undefined') {
    // SSR environment - assume compatible
    return true;
  }
  
  return isRuntimeCompatible();
}
```

### 3. Testing Environment

```typescript
// For testing, you might want to mock the compatibility
if (process.env.NODE_ENV === 'test') {
  // Mock for testing
  global.mockQiankunCompatible = true;
}

function checkCompatibility() {
  if (process.env.NODE_ENV === 'test' && global.mockQiankunCompatible !== undefined) {
    return global.mockQiankunCompatible;
  }
  
  return isRuntimeCompatible();
}
```

## 🎯 Common Scenarios

### 1. Corporate Environment

```typescript
// Corporate environments might have older browsers
function initCorporateApp() {
  const compatible = isRuntimeCompatible();
  
  if (!compatible) {
    // Inform IT department about browser requirements
    logToAdminConsole('User browser incompatible with micro-frontend features');
  }
  
  return compatible ? initMicroFrontend() : initLegacyApp();
}
```

### 2. Public Website

```typescript
// Public websites need to support a wider range of browsers
function initPublicSite() {
  if (isRuntimeCompatible()) {
    // Enhanced experience with micro-frontends
    loadAdvancedFeatures();
  } else {
    // Basic experience that works everywhere
    loadBasicFeatures();
  }
}
```

### 3. Mobile App WebView

```typescript
// Mobile WebViews might have different compatibility
function initMobileWebView() {
  const compatible = isRuntimeCompatible();
  
  // Log for mobile app developers
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'qiankun_compatibility',
      compatible,
    }));
  }
  
  return compatible ? initMicroFrontend() : initSimplifiedView();
}
```

## 🔗 Related APIs

- [start](/api/start) - Start qiankun (should be called after compatibility check)
- [registerMicroApps](/api/register-micro-apps) - Register micro applications
- [loadMicroApp](/api/load-micro-app) - Manually load micro applications 