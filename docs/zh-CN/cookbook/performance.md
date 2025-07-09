# 性能优化

对于微前端应用来说，性能至关重要。由于多个应用同时加载和运行，优化资源加载、运行时性能和用户体验非常重要。本指南涵盖了优化基于 qiankun 的微前端应用的综合策略。

## 🎯 性能概述

### 常见性能挑战

微前端架构引入了独特的性能考虑因素：

- **多包加载**：每个微应用都加载自己的 JavaScript 和 CSS
- **资源重复**：共享依赖被多次加载
- **运行时开销**：多个应用实例同时运行
- **网络延迟**：每个微应用的额外 HTTP 请求
- **内存使用**：多个应用导致内存消耗增加

### 需要监控的性能指标

```javascript
// 微前端性能的关键指标
const performanceMetrics = {
  // 加载性能
  timeToFirstByte: 'TTFB',
  firstContentfulPaint: 'FCP',
  largestContentfulPaint: 'LCP',
  
  // 交互性
  firstInputDelay: 'FID',
  timeToInteractive: 'TTI',
  
  // 微前端特定
  microAppLoadTime: '自定义指标',
  microAppMountTime: '自定义指标',
  totalBundleSize: '自定义指标'
};
```

## 🚀 资源加载优化

### 预取策略

qiankun 提供了几种预取选项来改善加载性能：

#### 基础预取

```javascript
import { start } from 'qiankun';

start({
  prefetch: true // 启用默认预取
});
```

#### 选择性预取

```javascript
start({
  prefetch: ['critical-app-1', 'critical-app-2'] // 只预取特定应用
});
```

#### 智能预取

```javascript
start({
  prefetch: (apps) => {
    // 基于用户行为、时间或网络条件的自定义预取逻辑
    const now = new Date().getHours();
    const isBusinessHours = now >= 9 && now <= 17;
    
    if (isBusinessHours) {
      return {
        criticalAppNames: ['dashboard', 'user-management'],
        minorAppsName: ['analytics']
      };
    }
    
    return {
      criticalAppNames: ['dashboard'],
      minorAppsName: []
    };
  }
});
```

#### 网络感知预取

```javascript
// 基于网络条件的高级预取
const networkAwarePrefetch = (apps) => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) {
    // 未知连接的默认行为
    return { criticalAppNames: apps.slice(0, 2), minorAppsName: [] };
  }
  
  const effectiveType = connection.effectiveType;
  const saveData = connection.saveData;
  
  if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
    // 慢速连接的最小预取
    return { criticalAppNames: [], minorAppsName: [] };
  }
  
  if (effectiveType === '3g') {
    // 3G 的适度预取
    return { criticalAppNames: apps.slice(0, 1), minorAppsName: [] };
  }
  
  // 4G 及以上的积极预取
  return {
    criticalAppNames: apps.slice(0, 3),
    minorAppsName: apps.slice(3)
  };
};

start({
  prefetch: networkAwarePrefetch
});
```

### 懒加载

#### 基于路由的懒加载

```javascript
// 只在访问路由时加载微应用
registerMicroApps([
  {
    name: 'user-management',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/users',
    // 应用只在访问 /users 路由时加载
  },
  {
    name: 'analytics',
    entry: '//localhost:8081',
    container: '#container',
    activeRule: '/analytics',
    // 按需加载
  }
]);
```

#### 条件加载

```javascript
// 基于用户权限或功能加载微应用
const userPermissions = getCurrentUserPermissions();

const microApps = [
  {
    name: 'dashboard',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/dashboard'
  }
];

// 有条件地添加管理应用
if (userPermissions.includes('admin')) {
  microApps.push({
    name: 'admin-panel',
    entry: '//localhost:8082',
    container: '#container',
    activeRule: '/admin'
  });
}

registerMicroApps(microApps);
```

#### 使用 Intersection Observer 进行懒加载

```javascript
// 当微应用进入视口时加载
const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const appName = entry.target.dataset.app;
      loadMicroApp({
        name: appName,
        entry: entry.target.dataset.entry,
        container: entry.target
      });
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(observerCallback, {
  threshold: 0.1
});

document.querySelectorAll('[data-lazy-app]').forEach(el => {
  observer.observe(el);
});
```

## 📦 打包优化

### 代码分割

#### 微应用级别分割

```javascript
// 微应用的 webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5
        }
      }
    }
  }
};
```

#### 微应用中的动态导入

```javascript
// 带动态导入的 React 组件
import React, { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function MyMicroApp() {
  return (
    <div>
      <h1>微应用</h1>
      <Suspense fallback={<div>加载重组件中...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

### 共享依赖

#### 外部依赖

```javascript
// webpack.config.js - 外部化共享库
module.exports = {
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'lodash': '_',
    'moment': 'moment'
  }
};
```

#### 模块联邦

```javascript
// 主应用的 webpack.config.js
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.0.0'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.0.0'
        }
      }
    })
  ]
};

// 微应用的 webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'microApp',
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.0.0'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.0.0'
        }
      }
    })
  ]
};
```

## 🏎️ 运行时性能

### 内存管理

#### 卸载时清理

```javascript
// 生命周期钩子中的适当清理
const lifeCycles = {
  async afterUnmount(app) {
    // 清除定时器
    if (window.microAppTimers) {
      window.microAppTimers.forEach(timer => clearInterval(timer));
      window.microAppTimers = [];
    }
    
    // 移除事件监听器
    if (window.microAppListeners) {
      window.microAppListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      window.microAppListeners = [];
    }
    
    // 清除缓存
    if (window.microAppCache) {
      window.microAppCache.clear();
    }
    
    // 强制垃圾回收（如果可用）
    if (window.gc) {
      window.gc();
    }
  }
};
```

#### 内存泄漏检测

```javascript
// 监控内存使用情况
const memoryMonitor = {
  baseline: null,
  
  measureBaseline() {
    this.baseline = performance.memory ? {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize
    } : null;
  },
  
  checkForLeaks(appName) {
    if (!performance.memory || !this.baseline) return;
    
    const current = {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize
    };
    
    const growth = current.usedJSHeapSize - this.baseline.usedJSHeapSize;
    const growthMB = growth / (1024 * 1024);
    
    if (growthMB > 50) { // 如果内存增长超过50MB则警告
      console.warn(`${appName} 中可能存在内存泄漏: ${growthMB.toFixed(2)}MB 增长`);
    }
  }
};
```

### 虚拟 DOM 优化

#### React 优化

```javascript
// 优化 React 微应用
import React, { memo, useMemo, useCallback } from 'react';

const OptimizedComponent = memo(({ data, onUpdate }) => {
  // 记忆化昂贵的计算
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      calculated: expensiveCalculation(item)
    }));
  }, [data]);
  
  // 记忆化事件处理器
  const handleUpdate = useCallback((id, newValue) => {
    onUpdate(id, newValue);
  }, [onUpdate]);
  
  return (
    <div>
      {processedData.map(item => (
        <Item 
          key={item.id} 
          data={item} 
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
});
```

#### Vue 优化

```vue
<template>
  <div>
    <virtual-list
      :items="largeDataSet"
      :item-height="50"
      :visible-count="20"
    >
      <template #default="{ item }">
        <item-component :data="item" />
      </template>
    </virtual-list>
  </div>
</template>

<script>
import VirtualList from './VirtualList.vue';

export default {
  components: {
    VirtualList
  },
  computed: {
    largeDataSet() {
      // 使用计算属性进行昂贵操作
      return this.rawData.map(item => this.processItem(item));
    }
  }
};
</script>
```

## 🗄️ 缓存策略

### HTTP 缓存

#### 微应用资源

```javascript
// 为微应用资源配置缓存头
// nginx.conf
server {
  location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
  }
  
  location /api/ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }
}
```

#### Service Worker 缓存

```javascript
// sw.js - 微应用缓存的 Service Worker
const CACHE_NAME = 'micro-app-cache-v1';
const MICRO_APP_URLS = [
  '/micro-app-1/static/js/main.js',
  '/micro-app-1/static/css/main.css',
  '/micro-app-2/static/js/main.js',
  '/micro-app-2/static/css/main.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(MICRO_APP_URLS))
  );
});

self.addEventListener('fetch', event => {
  if (MICRO_APP_URLS.some(url => event.request.url.includes(url))) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
```

### 应用级缓存

#### 智能应用缓存

```javascript
// 缓存微应用实例以便更快地重新挂载
class MicroAppCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 5;
  }
  
  set(appName, appInstance) {
    if (this.cache.size >= this.maxSize) {
      // 移除最少使用的应用
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(appName, {
      instance: appInstance,
      timestamp: Date.now()
    });
  }
  
  get(appName) {
    const cached = this.cache.get(appName);
    if (cached) {
      // 移动到末尾（标记为最近使用）
      this.cache.delete(appName);
      this.cache.set(appName, cached);
      return cached.instance;
    }
    return null;
  }
  
  has(appName) {
    return this.cache.has(appName);
  }
  
  clear() {
    this.cache.clear();
  }
}

const appCache = new MicroAppCache();
```

## ⚡ 网络优化

### 连接优化

#### HTTP/2 推送

```javascript
// 带有微应用资源 HTTP/2 推送的 Express.js 服务器
const express = require('express');
const spdy = require('spdy');

const app = express();

app.get('/main-app', (req, res) => {
  // 推送关键微应用资源
  res.push('/micro-app-1/static/js/main.js');
  res.push('/micro-app-1/static/css/main.css');
  
  res.sendFile(__dirname + '/index.html');
});

const server = spdy.createServer(options, app);
```

#### 资源提示

```html
<!-- 在主应用 HTML 中 -->
<head>
  <!-- 微应用域名的 DNS 预取 -->
  <link rel="dns-prefetch" href="//micro-app-1.example.com">
  <link rel="dns-prefetch" href="//micro-app-2.example.com">
  
  <!-- 预连接到关键微应用源 -->
  <link rel="preconnect" href="//micro-app-1.example.com" crossorigin>
  
  <!-- 预加载关键微应用资源 -->
  <link rel="preload" href="//micro-app-1.example.com/static/js/main.js" as="script">
  <link rel="preload" href="//micro-app-1.example.com/static/css/main.css" as="style">
</head>
```

### CDN 策略

#### 多 CDN 设置

```javascript
// 基于性能的智能 CDN 选择
class CDNManager {
  constructor() {
    this.cdns = [
      'https://cdn1.example.com',
      'https://cdn2.example.com',
      'https://cdn3.example.com'
    ];
    this.performanceCache = new Map();
  }
  
  async getBestCDN() {
    if (this.performanceCache.size === 0) {
      await this.measureCDNPerformance();
    }
    
    // 返回最快的 CDN
    return [...this.performanceCache.entries()]
      .sort((a, b) => a[1] - b[1])[0][0];
  }
  
  async measureCDNPerformance() {
    const promises = this.cdns.map(async (cdn) => {
      const start = performance.now();
      try {
        await fetch(`${cdn}/health-check`);
        const latency = performance.now() - start;
        this.performanceCache.set(cdn, latency);
      } catch (error) {
        this.performanceCache.set(cdn, Infinity);
      }
    });
    
    await Promise.all(promises);
  }
}
```

## 📊 性能监控

### 实时指标

#### Performance Observer

```javascript
// 监控微应用加载性能
class MicroAppPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.initObservers();
  }
  
  initObservers() {
    // 监控加载性能
    if ('PerformanceObserver' in window) {
      const loadObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('micro-app')) {
            this.recordLoadTime(entry);
          }
        }
      });
      
      loadObserver.observe({ entryTypes: ['navigation', 'resource'] });
      
      // 监控布局偏移
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            this.recordLayoutShift(entry);
          }
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }
  
  recordLoadTime(entry) {
    const appName = this.extractAppName(entry.name);
    this.metrics.set(`${appName}_load_time`, entry.loadEnd - entry.loadStart);
  }
  
  recordLayoutShift(entry) {
    const currentCLS = this.metrics.get('cumulative_layout_shift') || 0;
    this.metrics.set('cumulative_layout_shift', currentCLS + entry.value);
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}
```

#### 自定义计时 API

```javascript
// 微应用生命周期的自定义计时
class MicroAppTiming {
  static mark(name) {
    performance.mark(name);
  }
  
  static measure(name, startMark, endMark) {
    performance.measure(name, startMark, endMark);
    
    // 发送到分析服务
    const measure = performance.getEntriesByName(name)[0];
    this.sendToAnalytics({
      metric: name,
      duration: measure.duration,
      timestamp: Date.now()
    });
  }
  
  static sendToAnalytics(data) {
    // 发送到你的分析服务
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}

// 微应用生命周期中的使用
const lifeCycles = {
  async beforeLoad(app) {
    MicroAppTiming.mark(`${app.name}_load_start`);
  },
  
  async afterMount(app) {
    MicroAppTiming.mark(`${app.name}_mount_end`);
    MicroAppTiming.measure(
      `${app.name}_total_time`,
      `${app.name}_load_start`,
      `${app.name}_mount_end`
    );
  }
};
```

### 性能分析

#### 用户体验指标

```javascript
// 跟踪微应用的用户体验指标
class UXMetrics {
  constructor() {
    this.metrics = {};
    this.initTracking();
  }
  
  initTracking() {
    // 微应用的可交互时间
    this.trackTimeToInteractive();
    
    // 用户参与度指标
    this.trackUserEngagement();
    
    // 错误率
    this.trackErrorRates();
  }
  
  trackTimeToInteractive() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name.includes('tti')) {
          this.metrics.timeToInteractive = entry.duration;
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }
  
  trackUserEngagement() {
    let interactions = 0;
    
    ['click', 'scroll', 'keydown'].forEach(event => {
      document.addEventListener(event, () => {
        interactions++;
        this.metrics.interactions = interactions;
      });
    });
  }
  
  trackErrorRates() {
    window.addEventListener('error', (event) => {
      const appName = this.getAppFromError(event);
      this.metrics.errors = this.metrics.errors || {};
      this.metrics.errors[appName] = (this.metrics.errors[appName] || 0) + 1;
    });
  }
}
```

## 🎨 UI/UX 性能

### 加载状态

#### 骨架屏加载

```jsx
// 微应用加载的 React 骨架屏组件
import React from 'react';

const MicroAppSkeleton = ({ appName }) => {
  return (
    <div className="micro-app-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-nav"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-sidebar"></div>
        <div className="skeleton-main">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    </div>
  );
};

// 微应用加载使用示例
function MicroAppContainer({ appName, entry }) {
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(null);
  
  useEffect(() => {
    loadMicroApp({
      name: appName,
      entry,
      container: '#micro-app-container'
    }).then(() => {
      setLoading(false);
    });
  }, [appName, entry]);
  
  if (loading) {
    return <MicroAppSkeleton appName={appName} />;
  }
  
  return <div id="micro-app-container" />;
}
```

#### 渐进式增强

```javascript
// 微应用的渐进式增强
class ProgressiveLoader {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.loadingStates = ['initial', 'skeleton', 'partial', 'complete'];
    this.currentState = 'initial';
  }
  
  async load() {
    // 显示初始加载状态
    this.setState('skeleton');
    this.renderSkeleton();
    
    try {
      // 首先加载关键 CSS
      await this.loadCriticalCSS();
      
      // 显示部分内容
      this.setState('partial');
      await this.loadCriticalJS();
      
      // 加载剩余资源
      await this.loadRemainingAssets();
      
      // 完成加载
      this.setState('complete');
      this.mountApp();
      
    } catch (error) {
      this.handleLoadError(error);
    }
  }
  
  renderSkeleton() {
    this.container.innerHTML = this.config.skeletonHTML;
  }
  
  async loadCriticalCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${this.config.entry}/critical.css`;
    
    return new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }
}
```

### 动画性能

#### 硬件加速

```css
/* 优化微应用过渡动画 */
.micro-app-transition {
  /* 使用 transform 而不是改变布局属性 */
  transform: translateX(0);
  transition: transform 0.3s ease-out;
  
  /* 启用硬件加速 */
  will-change: transform;
  
  /* 使用 GPU 合成 */
  transform: translateZ(0);
}

.micro-app-enter {
  transform: translateX(100%);
}

.micro-app-enter-active {
  transform: translateX(0);
}

.micro-app-exit {
  transform: translateX(0);
}

.micro-app-exit-active {
  transform: translateX(-100%);
}
```

#### 使用 Intersection Observer 进行动画

```javascript
// 使用 Intersection Observer 高效触发动画
class AnimationManager {
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: 0.1 }
    );
  }
  
  observe(element) {
    this.observer.observe(element);
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.triggerAnimation(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  triggerAnimation(element) {
    // 使用 CSS 类进行硬件加速动画
    element.classList.add('animate-in');
    
    // 或使用 Web Animations API 进行复杂动画
    element.animate([
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
  }
}
```

## 📱 移动端性能

### 移动端特定优化

#### 触摸事件优化

```javascript
// 优化移动端微应用的触摸事件
class TouchOptimizer {
  constructor() {
    this.setupPassiveListeners();
    this.optimizeTouchHandling();
  }
  
  setupPassiveListeners() {
    // 使用被动监听器提高滚动性能
    document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
  }
  
  optimizeTouchHandling() {
    // 防抖触摸事件
    let touchTimeout;
    
    document.addEventListener('touchend', () => {
      clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => {
        // 延迟处理触摸结束以防止意外双击
      }, 300);
    });
  }
  
  handleTouchStart(event) {
    // 触摸开始时的最小处理
  }
  
  handleTouchMove(event) {
    // 使用 requestAnimationFrame 进行平滑滚动
    requestAnimationFrame(() => {
      // 处理触摸移动
    });
  }
}
```

#### 视口管理

```javascript
// 为不同微应用优化视口
class ViewportManager {
  constructor() {
    this.defaultViewport = 'width=device-width, initial-scale=1.0';
    this.viewportMeta = document.querySelector('meta[name="viewport"]');
  }
  
  setViewportForApp(appName) {
    const appViewports = {
      'mobile-first-app': 'width=device-width, initial-scale=1.0, user-scalable=no',
      'desktop-app': 'width=1024, initial-scale=0.5',
      'responsive-app': 'width=device-width, initial-scale=1.0'
    };
    
    const viewport = appViewports[appName] || this.defaultViewport;
    this.viewportMeta.setAttribute('content', viewport);
  }
  
  resetViewport() {
    this.viewportMeta.setAttribute('content', this.defaultViewport);
  }
}
```

## 🔧 开发环境 vs 生产环境优化

### 环境特定配置

#### 开发环境优化

```javascript
// 微应用的 webpack.config.dev.js
module.exports = {
  mode: 'development',
  
  optimization: {
    // 禁用压缩以加快构建速度
    minimize: false,
    
    // 分割块以便更好地调试
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  
  devServer: {
    // 启用热重载
    hot: true,
    
    // 为开发优化
    liveReload: true,
    
    // 微应用通信的 CORS
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
};
```

#### 生产环境优化

```javascript
// 微应用的 webpack.config.prod.js
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',
  
  optimization: {
    // 启用所有优化
    minimize: true,
    sideEffects: false,
    
    // 高级块分割
    splitChunks: {
      chunks: 'all',
      maxSize: 244000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5
        }
      }
    }
  },
  
  plugins: [
    // Gzip 压缩
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8
    }),
    
    // 包分析（可选）
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
};
```

## 🎯 性能最佳实践总结

### ✅ 应该做的

1. **为关键微应用实施预取**
2. **在微应用内使用代码分割**
3. **在多个级别利用缓存**
4. **持续监控性能**
5. **优化移动端体验**
6. **对非关键功能使用懒加载**
7. **在卸载钩子中实施适当清理**
8. **高效共享依赖**
9. **使用 Service Worker 进行缓存**
10. **使用硬件加速优化动画**

### ❌ 不应该做的

1. **不要一次加载所有微应用**
2. **不要忽略包大小**
3. **不要重复大型依赖**
4. **不要忘记内存清理**
5. **不要阻塞主线程**
6. **不要忽略移动端性能**
7. **不要在慢速连接上过度预取**
8. **不要使用同步操作**
9. **不要忽略错误边界**
10. **不要跳过性能监控**

### 📊 性能检查清单

```javascript
// 微应用性能审计检查清单
const performanceChecklist = {
  loading: {
    prefetchStrategy: '✓ 已实施智能预取',
    bundleSize: '✓ 包大小小于250KB gzipped',
    codesplitting: '✓ 关键路径已分离',
    caching: '✓ 启用积极缓存'
  },
  
  runtime: {
    memoryLeaks: '✓ 已实施清理',
    animationPerf: '✓ 使用硬件加速',
    eventOptimization: '✓ 使用被动监听器',
    lazyLoading: '✓ 非关键功能懒加载'
  },
  
  monitoring: {
    coreWebVitals: '✓ 监控 LCP、FID、CLS',
    customMetrics: '✓ 跟踪应用特定指标',
    errorTracking: '✓ 记录性能错误',
    analytics: '✓ 测量用户体验'
  }
};
```

## 🔗 相关文档

- [样式隔离](/cookbook/style-isolation) - CSS 性能和隔离
- [错误处理](/cookbook/error-handling) - 错误的性能影响
- [配置](/api/configuration) - 性能相关配置
- [调试](/cookbook/debugging) - 性能调试技术 