# 错误处理

在同一上下文中运行多个独立应用的微前端应用程序中，健壮的错误处理至关重要。本指南涵盖了处理错误、实现优雅降级以及在基于 qiankun 的微前端系统中维护应用程序稳定性的综合策略。

## 🎯 微前端中的错误类型

### 常见错误类别

微前端应用面临独特的错误场景：

- **加载错误**：无法获取或解析微应用资源
- **运行时错误**：微应用内的 JavaScript 错误
- **通信错误**：应用间通信失败
- **网络错误**：API 调用和资源加载失败
- **沙箱错误**：JavaScript 和 CSS 隔离问题
- **生命周期错误**：mount/unmount 过程中的问题
- **版本冲突**：依赖版本不匹配

### 错误影响评估

```javascript
// 微前端应用的错误严重程度级别
const ERROR_LEVELS = {
  CRITICAL: 'critical',    // 主应用或核心功能受影响
  HIGH: 'high',           // 主要微应用功能丢失
  MEDIUM: 'medium',       // 部分微应用功能受影响
  LOW: 'low',            // 轻微功能或视觉问题
  INFO: 'info'           // 非阻塞性信息问题
};

const ErrorClassifier = {
  classify(error, appName, context) {
    // 严重：主应用崩溃或核心导航失败
    if (appName === 'main' || context.includes('navigation')) {
      return ERROR_LEVELS.CRITICAL;
    }
    
    // 高：用户无法完成主要工作流程
    if (context.includes('checkout') || context.includes('auth')) {
      return ERROR_LEVELS.HIGH;
    }
    
    // 中等：功能降级但应用仍可使用
    if (error.name === 'ChunkLoadError' || error.name === 'TypeError') {
      return ERROR_LEVELS.MEDIUM;
    }
    
    // 其他错误默认为低级别
    return ERROR_LEVELS.LOW;
  }
};
```

## 🛡️ qiankun 错误边界

### 全局错误处理

为整个微前端生态系统设置全局错误处理器：

```javascript
import { addGlobalUncaughtErrorHandler, removeGlobalUncaughtErrorHandler } from 'qiankun';

// 所有微应用的全局错误处理器
const globalErrorHandler = (event) => {
  const { error, appName, lifecycleName } = event;
  
  console.error(`微应用 "${appName}" 在 "${lifecycleName}" 阶段发生错误:`, error);
  
  // 上报到错误跟踪服务
  reportError({
    error,
    appName,
    lifecycle: lifecycleName,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
  
  // 实施恢复策略
  handleMicroAppError(appName, error, lifecycleName);
};

// 注册全局错误处理器
addGlobalUncaughtErrorHandler(globalErrorHandler);

// 清理时移除（例如在应用卸载时）
// removeGlobalUncaughtErrorHandler(globalErrorHandler);
```

### 生命周期特定错误处理

```javascript
// 生命周期钩子中的错误处理
const errorHandlingLifecycles = {
  async beforeLoad(app) {
    try {
      // 预加载检查
      const healthCheck = await fetch(`${app.entry}/health`);
      if (!healthCheck.ok) {
        throw new Error(`${app.name} 健康检查失败`);
      }
    } catch (error) {
      console.warn(`${app.name} 预加载健康检查失败:`, error);
      // 继续加载但标记为可能不稳定
      markAppAsUnstable(app.name);
    }
  },

  async beforeMount(app) {
    try {
      // 验证应用要求
      validateAppRequirements(app);
    } catch (error) {
      // 尝试修复常见问题
      await attemptAutoFix(app, error);
    }
  },

  async afterMount(app) {
    // 验证挂载成功
    setTimeout(() => {
      const container = document.querySelector(app.container);
      if (!container || container.children.length === 0) {
        console.error(`${app.name} 挂载验证失败`);
        showFallbackContent(app.container, app.name);
      }
    }, 1000);
  },

  async beforeUnmount(app) {
    try {
      // 清理资源
      cleanupAppResources(app.name);
    } catch (error) {
      console.warn(`${app.name} 清理错误:`, error);
      // 强制清理
      forceCleanup(app.name);
    }
  }
};
```

## 🚨 框架特定错误边界

### React 错误边界

```jsx
// React 微应用错误边界
import React from 'react';

class MicroAppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastRetry: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // 上报错误
    this.reportError(error, errorInfo);

    // 尝试自动恢复
    this.attemptRecovery(error);
  }

  reportError = (error, errorInfo) => {
    const errorReport = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo,
      appName: this.props.appName,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      retryCount: this.state.retryCount
    };

    // 发送到错误跟踪服务
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport)
    }).catch(err => console.error('上报错误失败:', err));
  };

  attemptRecovery = (error) => {
    const { retryCount, lastRetry } = this.state;
    const now = Date.now();
    
    // 防止过于频繁的重试
    if (lastRetry && now - lastRetry < 5000) {
      return;
    }
    
    // 限制重试次数
    if (retryCount >= 3) {
      console.error(`${this.props.appName} 已达到最大重试次数`);
      return;
    }

    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
        lastRetry: now
      });
    }, 2000 * Math.pow(2, retryCount)); // 指数退避
  };

  render() {
    if (this.state.hasError) {
      const { appName, fallbackComponent: FallbackComponent } = this.props;
      
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            appName={appName}
            onRetry={() => this.attemptRecovery(this.state.error)}
          />
        );
      }

      return (
        <div className="micro-app-error">
          <h3>应用错误</h3>
          <p>{appName} 应用遇到了错误。</p>
          <button onClick={() => this.attemptRecovery(this.state.error)}>
            重试 ({this.state.retryCount}/3)
          </button>
          <details style={{ marginTop: '1rem' }}>
            <summary>错误详情</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// 微应用使用示例
function MicroAppContainer({ appName, entry }) {
  return (
    <MicroAppErrorBoundary 
      appName={appName}
      fallbackComponent={CustomErrorFallback}
    >
      <div id={`${appName}-container`} />
    </MicroAppErrorBoundary>
  );
}
```

### Vue 错误处理

```javascript
// Vue 微应用全局错误处理器
const app = createApp(MainApp);

app.config.errorHandler = (err, instance, info) => {
  const appName = instance?.$root?.$options?.name || 'unknown';
  
  console.error(`Vue 错误在 ${appName}:`, err, info);
  
  // 上报错误
  reportVueError({
    error: err,
    appName,
    info,
    timestamp: Date.now()
  });
  
  // 尝试恢复
  if (instance && typeof instance.$forceUpdate === 'function') {
    instance.$forceUpdate();
  }
};

// Vue 2 错误边界组件
Vue.component('ErrorBoundary', {
  data() {
    return {
      hasError: false,
      error: null
    };
  },
  
  errorCaptured(err, instance, info) {
    this.hasError = true;
    this.error = err;
    
    // 上报错误
    this.reportError(err, info);
    
    // 阻止错误继续传播
    return false;
  },
  
  methods: {
    reportError(error, info) {
      // 错误上报逻辑
    },
    
    retry() {
      this.hasError = false;
      this.error = null;
      this.$forceUpdate();
    }
  },
  
  render(h) {
    if (this.hasError) {
      return h('div', { class: 'error-boundary' }, [
        h('h3', '出现了错误'),
        h('button', { on: { click: this.retry } }, '重试'),
        h('pre', this.error?.message)
      ]);
    }
    
    return this.$slots.default;
  }
});
```

## 🔄 优雅降级策略

### 渐进式增强

```javascript
// 带回退的渐进式功能加载
class FeatureLoader {
  constructor() {
    this.features = new Map();
    this.fallbacks = new Map();
  }
  
  register(featureName, loader, fallback) {
    this.features.set(featureName, loader);
    this.fallbacks.set(featureName, fallback);
  }
  
  async load(featureName) {
    try {
      const loader = this.features.get(featureName);
      if (!loader) {
        throw new Error(`功能 "${featureName}" 未注册`);
      }
      
      const feature = await loader();
      return feature;
      
    } catch (error) {
      console.warn(`加载功能 "${featureName}" 失败:`, error);
      
      const fallback = this.fallbacks.get(featureName);
      if (fallback) {
        return await fallback();
      }
      
      throw error;
    }
  }
}

// 使用示例
const featureLoader = new FeatureLoader();

// 注册高级仪表板和回退
featureLoader.register(
  'advanced-dashboard',
  () => import('./AdvancedDashboard'),
  () => import('./BasicDashboard')
);

// 注册图表组件和静态回退
featureLoader.register(
  'interactive-charts',
  () => import('./InteractiveCharts'),
  () => Promise.resolve(() => '<div>图表不可用</div>')
);
```

### 回退 UI 组件

```jsx
// 综合回退组件
const ErrorFallbacks = {
  // 网络错误回退
  NetworkError: ({ onRetry, appName }) => (
    <div className="error-fallback network-error">
      <div className="error-icon">🌐</div>
      <h3>连接问题</h3>
      <p>无法加载 {appName}。请检查您的网络连接。</p>
      <div className="error-actions">
        <button onClick={onRetry} className="retry-button">
          重试
        </button>
        <button onClick={() => window.location.reload()}>
          刷新页面
        </button>
      </div>
    </div>
  ),

  // JavaScript 错误回退
  JavaScriptError: ({ error, appName, onRetry }) => (
    <div className="error-fallback js-error">
      <div className="error-icon">⚠️</div>
      <h3>应用错误</h3>
      <p>{appName} 应用遇到技术问题。</p>
      <div className="error-actions">
        <button onClick={onRetry} className="retry-button">
          重新加载应用
        </button>
        <button onClick={() => reportIssue(error, appName)}>
          报告问题
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="error-details">
          <summary>技术详情</summary>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
  ),

  // 加载超时回退
  LoadingTimeout: ({ appName, onRetry }) => (
    <div className="error-fallback loading-timeout">
      <div className="error-icon">⏱️</div>
      <h3>加载超时</h3>
      <p>{appName} 加载时间超出预期。</p>
      <div className="error-actions">
        <button onClick={onRetry} className="retry-button">
          重试
        </button>
        <button onClick={() => loadBasicVersion(appName)}>
          加载基础版本
        </button>
      </div>
    </div>
  ),

  // 通用回退
  Generic: ({ error, appName, onRetry }) => (
    <div className="error-fallback generic">
      <div className="error-icon">🔧</div>
      <h3>临时问题</h3>
      <p>我们正在处理 {appName} 的技术困难。</p>
      <div className="error-actions">
        <button onClick={onRetry} className="retry-button">
          重试
        </button>
      </div>
    </div>
  )
};
```

### 熔断器模式

```javascript
// 微应用加载的熔断器
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000, monitor = 30000) {
    this.failureThreshold = threshold;
    this.timeout = timeout;
    this.monitoringPeriod = monitor;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }

  async execute(operation, appName) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error(`${appName} 的熔断器是 OPEN 状态`);
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.timeout;
    }
  }

  getState() {
    return this.state;
  }
}

// 使用熔断器加载微应用
const circuitBreakers = new Map();

const loadMicroAppWithCircuitBreaker = async (appConfig) => {
  const { name } = appConfig;
  
  if (!circuitBreakers.has(name)) {
    circuitBreakers.set(name, new CircuitBreaker());
  }
  
  const breaker = circuitBreakers.get(name);
  
  try {
    return await breaker.execute(() => loadMicroApp(appConfig), name);
  } catch (error) {
    console.error(`熔断器阻止了 ${name} 的加载:`, error);
    throw error;
  }
};
```

## 📊 错误监控和上报

### 综合错误跟踪

```javascript
// 高级错误跟踪系统
class ErrorTracker {
  constructor(config) {
    this.config = {
      endpoint: '/api/errors',
      batchSize: 10,
      batchTimeout: 5000,
      maxRetries: 3,
      ...config
    };
    
    this.errorQueue = [];
    this.batchTimeout = null;
    this.retryCount = new Map();
  }

  track(error, context = {}) {
    const errorData = this.serializeError(error, context);
    
    // 添加到队列
    this.errorQueue.push(errorData);
    
    // 如果队列已满则处理批次
    if (this.errorQueue.length >= this.config.batchSize) {
      this.processBatch();
    } else {
      // 设置批次处理超时
      this.scheduleBatchProcessing();
    }
  }

  serializeError(error, context) {
    return {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        fileName: error.fileName,
        lineNumber: error.lineNumber,
        columnNumber: error.columnNumber
      },
      context: {
        appName: context.appName || 'unknown',
        userId: context.userId,
        sessionId: this.getSessionId(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        ...context
      },
      environment: {
        isDevelopment: process.env.NODE_ENV === 'development',
        timestamp: Date.now(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };
  }

  scheduleBatchProcessing() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
    
    this.batchTimeout = setTimeout(() => {
      this.processBatch();
    }, this.config.batchTimeout);
  }

  async processBatch() {
    if (this.errorQueue.length === 0) return;
    
    const batch = this.errorQueue.splice(0, this.config.batchSize);
    
    try {
      await this.sendErrors(batch);
      
      // 成功时清除重试计数
      batch.forEach(error => {
        this.retryCount.delete(error.id);
      });
      
    } catch (error) {
      console.error('发送错误批次失败:', error);
      
      // 重试逻辑
      batch.forEach(errorData => {
        const retries = this.retryCount.get(errorData.id) || 0;
        if (retries < this.config.maxRetries) {
          this.retryCount.set(errorData.id, retries + 1);
          this.errorQueue.unshift(errorData); // 添加回队列前端
        }
      });
    }
  }

  async sendErrors(errors) {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ errors })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId() {
    // 获取/生成会话ID的实现
    return sessionStorage.getItem('sessionId') || 'anonymous';
  }
}

// 初始化全局错误跟踪器
const errorTracker = new ErrorTracker();

// 跟踪未处理的错误
window.addEventListener('error', (event) => {
  errorTracker.track(event.error, {
    type: 'unhandled_error',
    source: 'window.onerror'
  });
});

// 跟踪未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', (event) => {
  errorTracker.track(event.reason, {
    type: 'unhandled_rejection',
    source: 'unhandledrejection'
  });
});
```

### 性能影响监控

```javascript
// 监控错误对性能的影响
class ErrorImpactMonitor {
  constructor() {
    this.errorImpacts = new Map();
    this.performanceBaseline = this.measureBaseline();
  }

  measureBaseline() {
    return {
      loadTime: performance.now(),
      memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0,
      timing: performance.timing
    };
  }

  recordErrorImpact(errorId, appName) {
    const impact = {
      errorId,
      appName,
      timestamp: Date.now(),
      performance: {
        loadTime: performance.now(),
        memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0,
        timing: performance.timing
      },
      userExperience: {
        pageVisible: !document.hidden,
        userActive: this.isUserActive(),
        scrollPosition: window.scrollY
      }
    };

    this.errorImpacts.set(errorId, impact);
    this.analyzeImpact(impact);
  }

  analyzeImpact(impact) {
    const { performance: current } = impact;
    const baseline = this.performanceBaseline;

    const memoryIncrease = current.memoryUsage - baseline.memoryUsage;
    const loadTimeIncrease = current.loadTime - baseline.loadTime;

    if (memoryIncrease > 50 * 1024 * 1024) { // 50MB
      console.warn('错误后检测到高内存影响:', impact);
    }

    if (loadTimeIncrease > 5000) { // 5秒
      console.warn('错误后性能显著降级:', impact);
    }
  }

  isUserActive() {
    // 简单用户活动检测
    return Date.now() - this.lastUserActivity < 30000;
  }
}
```

## 🔧 恢复机制

### 自动恢复策略

```javascript
// 综合恢复系统
class RecoveryManager {
  constructor() {
    this.recoveryStrategies = new Map();
    this.setupDefaultStrategies();
  }

  setupDefaultStrategies() {
    // 网络错误恢复
    this.register('NetworkError', async (error, context) => {
      await this.waitForConnection();
      return this.reloadMicroApp(context.appName);
    });

    // 块加载错误恢复
    this.register('ChunkLoadError', async (error, context) => {
      // 清除 webpack 缓存
      if (window.__webpack_require__ && window.__webpack_require__.cache) {
        delete window.__webpack_require__.cache[error.request];
      }
      
      // 使用缓存破坏重新加载
      return this.reloadWithCacheBust(context.appName);
    });

    // 脚本错误恢复
    this.register('TypeError', async (error, context) => {
      // 尝试重新加载依赖
      await this.reloadDependencies(context.appName);
      return this.remountMicroApp(context.appName);
    });

    // 内存错误恢复
    this.register('RangeError', async (error, context) => {
      // 强制垃圾回收
      if (window.gc) window.gc();
      
      // 减少内存占用
      await this.reducememoryFootprint(context.appName);
      return this.reloadMicroApp(context.appName);
    });
  }

  register(errorType, strategy) {
    this.recoveryStrategies.set(errorType, strategy);
  }

  async recover(error, context) {
    const strategy = this.recoveryStrategies.get(error.name);
    
    if (strategy) {
      try {
        console.log(`尝试恢复 ${context.appName} 中的 ${error.name}`);
        const result = await strategy(error, context);
        console.log(`${context.appName} 恢复成功`);
        return result;
      } catch (recoveryError) {
        console.error(`${context.appName} 恢复失败:`, recoveryError);
        return this.fallbackRecovery(context);
      }
    }
    
    return this.fallbackRecovery(context);
  }

  async waitForConnection() {
    return new Promise((resolve) => {
      if (navigator.onLine) {
        resolve();
      } else {
        const handleOnline = () => {
          window.removeEventListener('online', handleOnline);
          resolve();
        };
        window.addEventListener('online', handleOnline);
      }
    });
  }

  async reloadMicroApp(appName) {
    // 卸载当前实例
    try {
      await unmountMicroApp(appName);
    } catch (error) {
      console.warn(`卸载 ${appName} 失败:`, error);
    }

    // 重新加载微应用
    const appConfig = getAppConfig(appName);
    return loadMicroApp(appConfig);
  }

  async reloadWithCacheBust(appName) {
    const appConfig = getAppConfig(appName);
    const cacheBustEntry = `${appConfig.entry}?t=${Date.now()}`;
    
    return loadMicroApp({
      ...appConfig,
      entry: cacheBustEntry
    });
  }

  async fallbackRecovery(context) {
    console.log(`使用 ${context.appName} 的回退恢复`);
    
    // 显示回退 UI
    showFallbackUI(context.appName);
    
    // 报告恢复失败
    reportRecoveryFailure(context);
    
    return null;
  }
}
```

### 用户发起的恢复

```jsx
// 用户控制的恢复界面
const RecoveryPanel = ({ appName, error, onRecover, onDismiss }) => {
  const [recovering, setRecovering] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(null);

  const handleRecover = async (strategy) => {
    setRecovering(true);
    setLastAttempt(Date.now());
    
    try {
      await onRecover(strategy);
    } catch (error) {
      console.error('用户发起的恢复失败:', error);
    } finally {
      setRecovering(false);
    }
  };

  const recoveryOptions = [
    {
      key: 'reload',
      label: '重新加载应用',
      description: '从头重启应用',
      action: () => handleRecover('reload')
    },
    {
      key: 'reset',
      label: '重置为默认',
      description: '清除所有数据并重新加载',
      action: () => handleRecover('reset')
    },
    {
      key: 'safe-mode',
      label: '安全模式',
      description: '以最小功能加载',
      action: () => handleRecover('safe-mode')
    }
  ];

  return (
    <div className="recovery-panel">
      <div className="recovery-header">
        <h3>{appName} 的恢复选项</h3>
        <button onClick={onDismiss} className="close-button">×</button>
      </div>
      
      <div className="error-summary">
        <p><strong>错误:</strong> {error.message}</p>
        {lastAttempt && (
          <p><small>上次尝试: {new Date(lastAttempt).toLocaleTimeString()}</small></p>
        )}
      </div>
      
      <div className="recovery-options">
        {recoveryOptions.map(option => (
          <button
            key={option.key}
            onClick={option.action}
            disabled={recovering}
            className="recovery-option"
          >
            <div className="option-label">{option.label}</div>
            <div className="option-description">{option.description}</div>
          </button>
        ))}
      </div>
      
      {recovering && (
        <div className="recovery-progress">
          <div className="spinner" />
          <span>正在尝试恢复...</span>
        </div>
      )}
    </div>
  );
};
```

## 🎯 最佳实践总结

### ✅ 错误处理要做的

1. **实施全局错误处理器**进行全面覆盖
2. **在每个微应用中使用错误边界**
3. **为用户提供有意义的错误消息**
4. **实施带回退 UI 的优雅降级**
5. **系统性地监控和跟踪错误**
6. **在开发过程中测试错误场景**
7. **在可能的地方实施自动恢复**
8. **在报告中清除错误上下文**
9. **优雅地处理网络故障**
10. **提供用户恢复选项**

### ❌ 错误处理不要做的

1. **不要忽略错误**或静默失败
2. **不要向最终用户显示技术细节**
3. **不要无限制地重试**
4. **不要因为一个微应用错误阻塞整个应用**
5. **不要忘记在错误后清理**
6. **不要完全依赖自动恢复**
7. **不要用错误消息让用户不知所措**
8. **不要忘记错误场景中的内存泄漏**
9. **不要跳过生产环境类似环境的错误测试**
10. **不要忽略用户关于错误的反馈**

### 🔄 错误恢复检查清单

```javascript
// 综合错误处理检查清单
const errorHandlingChecklist = {
  prevention: {
    validation: '✓ 已实施输入验证',
    typeChecking: '✓ 使用 TypeScript 或 PropTypes',
    testing: '✓ 已测试错误场景',
    monitoring: '✓ 健康检查已就位'
  },
  
  detection: {
    globalHandlers: '✓ 已设置全局错误处理器',
    boundaries: '✓ 已实施错误边界',
    logging: '✓ 全面错误日志记录',
    alerting: '✓ 实时错误警报'
  },
  
  recovery: {
    gracefulDegradation: '✓ 已实施回退 UI',
    automaticRecovery: '✓ 自动恢复策略',
    userRecovery: '✓ 用户发起的恢复选项',
    resourceCleanup: '✓ 错误时适当清理'
  },
  
  learning: {
    errorTracking: '✓ 错误分析已就位',
    trendAnalysis: '✓ 错误趋势监控',
    rootCauseAnalysis: '✓ RCA 流程已定义',
    continuousImprovement: '✓ 定期错误审查会议'
  }
};
```

## 🔗 相关文档

- [性能优化](/cookbook/performance) - 错误对性能的影响
- [调试](/cookbook/debugging) - 错误调试技术
- [样式隔离](/cookbook/style-isolation) - CSS 错误处理
- [配置](/api/configuration) - 错误相关配置 