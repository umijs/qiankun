# Performance Optimization

Performance is crucial for micro-frontend applications. With multiple applications loading and running simultaneously, it's essential to optimize resource loading, runtime performance, and user experience. This guide covers comprehensive strategies for optimizing qiankun-based micro-frontend applications.

## 🎯 Performance Overview

### Common Performance Challenges

Micro-frontend architectures introduce unique performance considerations:

- **Multiple Bundle Loading**: Each micro app loads its own JavaScript and CSS
- **Resource Duplication**: Shared dependencies loaded multiple times
- **Runtime Overhead**: Multiple application instances running simultaneously
- **Network Latency**: Additional HTTP requests for each micro app
- **Memory Usage**: Increased memory consumption from multiple apps

### Performance Metrics to Monitor

```javascript
// Key metrics for micro-frontend performance
const performanceMetrics = {
  // Loading Performance
  timeToFirstByte: 'TTFB',
  firstContentfulPaint: 'FCP',
  largestContentfulPaint: 'LCP',
  
  // Interactivity
  firstInputDelay: 'FID',
  timeToInteractive: 'TTI',
  
  // Micro-frontend Specific
  microAppLoadTime: 'Custom metric',
  microAppMountTime: 'Custom metric',
  totalBundleSize: 'Custom metric'
};
```

## 🚀 Resource Loading Optimization

### Prefetching Strategies

qiankun provides several prefetching options to improve loading performance:

#### Basic Prefetching

```javascript
import { start } from 'qiankun';

start({
  prefetch: true // Enable default prefetching
});
```

#### Selective Prefetching

```javascript
start({
  prefetch: ['critical-app-1', 'critical-app-2'] // Only prefetch specific apps
});
```

#### Smart Prefetching

```javascript
start({
  prefetch: (apps) => {
    // Custom prefetch logic based on user behavior, time, or network conditions
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

#### Network-Aware Prefetching

```javascript
// Advanced prefetching based on network conditions
const networkAwarePrefetch = (apps) => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) {
    // Default behavior for unknown connection
    return { criticalAppNames: apps.slice(0, 2), minorAppsName: [] };
  }
  
  const effectiveType = connection.effectiveType;
  const saveData = connection.saveData;
  
  if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
    // Minimal prefetching for slow connections
    return { criticalAppNames: [], minorAppsName: [] };
  }
  
  if (effectiveType === '3g') {
    // Moderate prefetching for 3G
    return { criticalAppNames: apps.slice(0, 1), minorAppsName: [] };
  }
  
  // Aggressive prefetching for 4G and above
  return {
    criticalAppNames: apps.slice(0, 3),
    minorAppsName: apps.slice(3)
  };
};

start({
  prefetch: networkAwarePrefetch
});
```

### Lazy Loading

#### Route-Based Lazy Loading

```javascript
// Only load micro apps when their routes are accessed
registerMicroApps([
  {
    name: 'user-management',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/users',
    // App will only load when /users route is accessed
  },
  {
    name: 'analytics',
    entry: '//localhost:8081',
    container: '#container',
    activeRule: '/analytics',
    // Loaded on demand
  }
]);
```

#### Conditional Loading

```javascript
// Load micro apps based on user permissions or features
const userPermissions = getCurrentUserPermissions();

const microApps = [
  {
    name: 'dashboard',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/dashboard'
  }
];

// Conditionally add admin app
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

#### Intersection Observer for Lazy Loading

```javascript
// Load micro apps when they come into viewport
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

## 📦 Bundle Optimization

### Code Splitting

#### Micro App Level Splitting

```javascript
// webpack.config.js for micro applications
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

#### Dynamic Imports in Micro Apps

```javascript
// React component with dynamic import
import React, { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function MyMicroApp() {
  return (
    <div>
      <h1>Micro App</h1>
      <Suspense fallback={<div>Loading heavy component...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

### Shared Dependencies

#### External Dependencies

```javascript
// webpack.config.js - Externalize shared libraries
module.exports = {
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'lodash': '_',
    'moment': 'moment'
  }
};
```

#### Module Federation

```javascript
// webpack.config.js for main application
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

// webpack.config.js for micro application
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

## 🏎️ Runtime Performance

### Memory Management

#### Cleanup on Unmount

```javascript
// Proper cleanup in lifecycle hooks
const lifeCycles = {
  async afterUnmount(app) {
    // Clear timers
    if (window.microAppTimers) {
      window.microAppTimers.forEach(timer => clearInterval(timer));
      window.microAppTimers = [];
    }
    
    // Remove event listeners
    if (window.microAppListeners) {
      window.microAppListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      window.microAppListeners = [];
    }
    
    // Clear caches
    if (window.microAppCache) {
      window.microAppCache.clear();
    }
    
    // Force garbage collection (if available)
    if (window.gc) {
      window.gc();
    }
  }
};
```

#### Memory Leak Detection

```javascript
// Monitor memory usage
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
    
    if (growthMB > 50) { // Alert if memory grew by more than 50MB
      console.warn(`Potential memory leak in ${appName}: ${growthMB.toFixed(2)}MB growth`);
    }
  }
};
```

### Virtual DOM Optimization

#### React Optimization

```javascript
// Optimize React micro apps
import React, { memo, useMemo, useCallback } from 'react';

const OptimizedComponent = memo(({ data, onUpdate }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      calculated: expensiveCalculation(item)
    }));
  }, [data]);
  
  // Memoize event handlers
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

#### Vue Optimization

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
      // Use computed for expensive operations
      return this.rawData.map(item => this.processItem(item));
    }
  }
};
</script>
```

## 🗄️ Caching Strategies

### HTTP Caching

#### Micro App Assets

```javascript
// Configure caching headers for micro app assets
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

#### Service Worker Caching

```javascript
// sw.js - Service worker for micro app caching
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

### Application-Level Caching

#### Intelligent App Caching

```javascript
// Cache micro app instances for faster remounting
class MicroAppCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 5;
  }
  
  set(appName, appInstance) {
    if (this.cache.size >= this.maxSize) {
      // Remove least recently used app
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
      // Move to end (mark as recently used)
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

## ⚡ Network Optimization

### Connection Optimizations

#### HTTP/2 Push

```javascript
// Express.js server with HTTP/2 push for micro app assets
const express = require('express');
const spdy = require('spdy');

const app = express();

app.get('/main-app', (req, res) => {
  // Push critical micro app resources
  res.push('/micro-app-1/static/js/main.js');
  res.push('/micro-app-1/static/css/main.css');
  
  res.sendFile(__dirname + '/index.html');
});

const server = spdy.createServer(options, app);
```

#### Resource Hints

```html
<!-- In main application HTML -->
<head>
  <!-- DNS prefetch for micro app domains -->
  <link rel="dns-prefetch" href="//micro-app-1.example.com">
  <link rel="dns-prefetch" href="//micro-app-2.example.com">
  
  <!-- Preconnect to critical micro app origins -->
  <link rel="preconnect" href="//micro-app-1.example.com" crossorigin>
  
  <!-- Preload critical micro app resources -->
  <link rel="preload" href="//micro-app-1.example.com/static/js/main.js" as="script">
  <link rel="preload" href="//micro-app-1.example.com/static/css/main.css" as="style">
</head>
```

### CDN Strategy

#### Multi-CDN Setup

```javascript
// Intelligent CDN selection based on performance
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
    
    // Return fastest CDN
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

## 📊 Performance Monitoring

### Real-Time Metrics

#### Performance Observer

```javascript
// Monitor micro app loading performance
class MicroAppPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.initObservers();
  }
  
  initObservers() {
    // Monitor loading performance
    if ('PerformanceObserver' in window) {
      const loadObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('micro-app')) {
            this.recordLoadTime(entry);
          }
        }
      });
      
      loadObserver.observe({ entryTypes: ['navigation', 'resource'] });
      
      // Monitor layout shifts
      const cls Observer = new PerformanceObserver((list) => {
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

#### Custom Timing API

```javascript
// Custom timing for micro app lifecycle
class MicroAppTiming {
  static mark(name) {
    performance.mark(name);
  }
  
  static measure(name, startMark, endMark) {
    performance.measure(name, startMark, endMark);
    
    // Send to analytics
    const measure = performance.getEntriesByName(name)[0];
    this.sendToAnalytics({
      metric: name,
      duration: measure.duration,
      timestamp: Date.now()
    });
  }
  
  static sendToAnalytics(data) {
    // Send to your analytics service
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}

// Usage in micro app lifecycle
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

### Performance Analytics

#### User Experience Metrics

```javascript
// Track user experience metrics for micro apps
class UXMetrics {
  constructor() {
    this.metrics = {};
    this.initTracking();
  }
  
  initTracking() {
    // Time to Interactive for micro apps
    this.trackTimeToInteractive();
    
    // User engagement metrics
    this.trackUserEngagement();
    
    // Error rates
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

## 🎨 UI/UX Performance

### Loading States

#### Skeleton Loading

```jsx
// React skeleton component for micro app loading
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

// Usage with micro app loading
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

#### Progressive Enhancement

```javascript
// Progressive enhancement for micro apps
class ProgressiveLoader {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.loadingStates = ['initial', 'skeleton', 'partial', 'complete'];
    this.currentState = 'initial';
  }
  
  async load() {
    // Show initial loading state
    this.setState('skeleton');
    this.renderSkeleton();
    
    try {
      // Load critical CSS first
      await this.loadCriticalCSS();
      
      // Show partial content
      this.setState('partial');
      await this.loadCriticalJS();
      
      // Load remaining resources
      await this.loadRemainingAssets();
      
      // Complete loading
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

### Animation Performance

#### Hardware Acceleration

```css
/* Optimize animations for micro app transitions */
.micro-app-transition {
  /* Use transform instead of changing layout properties */
  transform: translateX(0);
  transition: transform 0.3s ease-out;
  
  /* Enable hardware acceleration */
  will-change: transform;
  
  /* Use GPU compositing */
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

#### Intersection Observer for Animations

```javascript
// Efficient animation triggering using Intersection Observer
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
    // Use CSS classes for hardware-accelerated animations
    element.classList.add('animate-in');
    
    // Or use Web Animations API for complex animations
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

## 📱 Mobile Performance

### Mobile-Specific Optimizations

#### Touch Event Optimization

```javascript
// Optimize touch events for mobile micro apps
class TouchOptimizer {
  constructor() {
    this.setupPassiveListeners();
    this.optimizeTouchHandling();
  }
  
  setupPassiveListeners() {
    // Use passive listeners for scroll performance
    document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
  }
  
  optimizeTouchHandling() {
    // Debounce touch events
    let touchTimeout;
    
    document.addEventListener('touchend', () => {
      clearTimeout(touchTimeout);
      touchTimeout = setTimeout(() => {
        // Handle touch end with delay to prevent accidental double taps
      }, 300);
    });
  }
  
  handleTouchStart(event) {
    // Minimal processing in touch start
  }
  
  handleTouchMove(event) {
    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      // Handle touch move
    });
  }
}
```

#### Viewport Management

```javascript
// Optimize viewport for different micro apps
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

## 🔧 Development vs Production Optimization

### Environment-Specific Configurations

#### Development Optimizations

```javascript
// webpack.config.dev.js for micro apps
module.exports = {
  mode: 'development',
  
  optimization: {
    // Disable minification for faster builds
    minimize: false,
    
    // Split chunks for better debugging
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
    // Enable hot reloading
    hot: true,
    
    // Optimize for development
    liveReload: true,
    
    // CORS for micro app communication
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
};
```

#### Production Optimizations

```javascript
// webpack.config.prod.js for micro apps
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',
  
  optimization: {
    // Enable all optimizations
    minimize: true,
    sideEffects: false,
    
    // Advanced chunk splitting
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
    // Gzip compression
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8
    }),
    
    // Bundle analysis (optional)
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
};
```

## 🎯 Performance Best Practices Summary

### ✅ Do's

1. **Implement prefetching** for critical micro apps
2. **Use code splitting** within micro applications
3. **Leverage caching** at multiple levels
4. **Monitor performance** continuously
5. **Optimize for mobile** experiences
6. **Use lazy loading** for non-critical features
7. **Implement proper cleanup** in unmount hooks
8. **Share dependencies** efficiently
9. **Use service workers** for caching
10. **Optimize animations** with hardware acceleration

### ❌ Don'ts

1. **Don't load all micro apps** at once
2. **Don't ignore bundle sizes** 
3. **Don't duplicate large dependencies**
4. **Don't forget memory cleanup**
5. **Don't block the main thread**
6. **Don't ignore mobile performance**
7. **Don't over-prefetch** on slow connections
8. **Don't use synchronous operations**
9. **Don't ignore error boundaries**
10. **Don't skip performance monitoring**

### 📊 Performance Checklist

```javascript
// Performance audit checklist for micro apps
const performanceChecklist = {
  loading: {
    prefetchStrategy: '✓ Implemented smart prefetching',
    bundleSize: '✓ Bundles under 250KB gzipped',
    codesplitting: '✓ Critical path separated',
    caching: '✓ Aggressive caching enabled'
  },
  
  runtime: {
    memoryLeaks: '✓ Cleanup implemented',
    animationPerf: '✓ Hardware acceleration used',
    eventOptimization: '✓ Passive listeners used',
    lazyLoading: '✓ Non-critical features lazy loaded'
  },
  
  monitoring: {
    coreWebVitals: '✓ LCP, FID, CLS monitored',
    customMetrics: '✓ App-specific metrics tracked',
    errorTracking: '✓ Performance errors logged',
    analytics: '✓ User experience measured'
  }
};
```

## 🔗 Related Documentation

- [Style Isolation](/cookbook/style-isolation) - CSS performance and isolation
- [Error Handling](/cookbook/error-handling) - Performance impact of errors
- [Configuration](/api/configuration) - Performance-related configurations
- [Debugging](/cookbook/debugging) - Performance debugging techniques 