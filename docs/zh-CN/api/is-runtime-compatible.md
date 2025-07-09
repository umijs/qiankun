# isRuntimeCompatible

检查当前浏览器环境是否与 qiankun 运行时特性兼容。

## 🎯 函数签名

```typescript
function isRuntimeCompatible(): boolean
```

## 📋 参数

此函数不接受任何参数。

## 🔄 返回值

- **类型**: `boolean`
- **描述**: 如果当前环境支持 qiankun 特性则返回 `true`，否则返回 `false`。

## 💡 使用示例

### 基础兼容性检查

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

### 带优雅降级

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

## 🔍 检查内容

`isRuntimeCompatible` 函数检查以下浏览器特性：

### 必需特性

1. **Proxy 支持**：用于 JavaScript 沙箱隔离
2. **Window.Proxy**：创建隔离执行上下文的必要条件
3. **Import Maps**（使用时）：用于动态模块加载
4. **Dynamic Import**：用于加载微应用

### 浏览器兼容性

| 浏览器 | 最低版本 | 支持程度 |
|---------|---------|---------|
| Chrome | 61+ | ✅ 完全支持 |
| Firefox | 60+ | ✅ 完全支持 |
| Safari | 11+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |
| IE | 任何版本 | ❌ 不支持 |

## 🚀 最佳实践

### 1. 早期检测

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

### 2. 渐进增强

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

### 3. 用户沟通

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

## 🔧 集成模式

### 1. 带特性标志

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

### 2. 带分析统计

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

### 3. 带动态加载

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

## ⚠️ 重要注意事项

### 1. 性能考虑

```typescript
// ✅ 正确：检查一次并缓存结果
const QIANKUN_COMPATIBLE = isRuntimeCompatible();

function someFunction() {
  if (QIANKUN_COMPATIBLE) {
    // Use cached result
  }
}

// ❌ 错误：多次检查
function someFunction() {
  if (isRuntimeCompatible()) { // Redundant check
    // ...
  }
}
```

### 2. SSR 考虑

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

### 3. 测试环境

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

## 🎯 常见场景

### 1. 企业环境

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

### 2. 公共网站

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

### 3. 移动应用 WebView

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

## 🔗 相关 API

- [start](/zh-CN/api/start) - 启动 qiankun（应在兼容性检查后调用）
- [registerMicroApps](/zh-CN/api/register-micro-apps) - 注册微应用
- [loadMicroApp](/zh-CN/api/load-micro-app) - 手动加载微应用 