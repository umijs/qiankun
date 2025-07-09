# Vue 绑定

qiankun 的官方 Vue 绑定提供了一种声明式的方式来将微应用集成到您的 Vue 主应用中。`@qiankunjs/vue` 包提供了一个强大的 `<MicroApp />` 组件，支持 Vue 2/3 兼容性、Composition API 和基于插槽的自定义。

## 📦 安装

```bash
npm install @qiankunjs/vue
```

**要求：**
- Vue 2.0+ 或 Vue 3.0+ 
- qiankun ≥ 3.0.0
- 对于 Vue 2，您可能需要 `@vue/composition-api`

## 🚀 快速开始

### Vue 3 与 Composition API

```vue
<template>
  <div class="main-app">
    <h1>主应用</h1>
    <MicroApp 
      name="dashboard" 
      entry="//localhost:8080" 
    />
  </div>
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';
</script>
```

### Vue 2 与 Options API

```vue
<template>
  <div class="main-app">
    <h1>主应用</h1>
    <micro-app 
      name="dashboard" 
      entry="//localhost:8080" 
    />
  </div>
</template>

<script>
import { MicroApp } from '@qiankunjs/vue';

export default {
  components: {
    MicroApp
  }
}
</script>
```

### 带加载状态

```vue
<template>
  <MicroApp 
    name="dashboard" 
    entry="//localhost:8080" 
    auto-set-loading
  />
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';
</script>
```

### 带错误处理

```vue
<template>
  <MicroApp 
    name="dashboard" 
    entry="//localhost:8080" 
    auto-set-loading
    auto-capture-error
  />
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';
</script>
```

## 🎯 组件 API

### 属性

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `name` | `string` | ✅ | - | 微应用的唯一名称 |
| `entry` | `string` | ✅ | - | 微应用的入口 URL |
| `autoSetLoading` | `boolean` | ❌ | `false` | 自动管理加载状态 |
| `autoCaptureError` | `boolean` | ❌ | `false` | 自动处理错误 |
| `className` | `string` | ❌ | `undefined` | 微应用容器的 CSS 类 |
| `wrapperClassName` | `string` | ❌ | `undefined` | 包装器的 CSS 类（使用插槽时） |
| `appProps` | `Record<string, any>` | ❌ | `undefined` | 传递给微应用的属性 |
| `settings` | `AppConfiguration` | ❌ | `{}` | qiankun 配置选项 |
| `lifeCycles` | `LifeCycles` | ❌ | `undefined` | 生命周期钩子 |

### 插槽

| 插槽 | 描述 | 参数 |
|------|------|------|
| `loader` | 自定义加载组件 | `{ loading: boolean }` |
| `errorBoundary` | 自定义错误组件 | `{ error: Error }` |

## 🎨 自定义

### 使用插槽自定义加载

```vue
<template>
  <MicroApp name="dashboard" entry="//localhost:8080">
    <template #loader="{ loading }">
      <div v-if="loading" class="custom-loader">
        <div class="spinner"></div>
        <p>加载微应用中...</p>
      </div>
    </template>
  </MicroApp>
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';
</script>

<style scoped>
.custom-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
```

### 自定义错误边界

```vue
<template>
  <MicroApp name="dashboard" entry="//localhost:8080">
    <template #error-boundary="{ error }">
      <div class="error-container">
        <h3>🚨 应用错误</h3>
        <p>{{ error.message }}</p>
        <button @click="handleRetry">重试</button>
      </div>
    </template>
  </MicroApp>
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';

const handleRetry = () => {
  window.location.reload();
};
</script>

<style scoped>
.error-container {
  padding: 20px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  text-align: center;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### 样式设置

```vue
<template>
  <MicroApp 
    name="dashboard" 
    entry="//localhost:8080" 
    class-name="micro-app-container"
    wrapper-class-name="micro-app-wrapper"
    auto-set-loading
  />
</template>

<style scoped>
:deep(.micro-app-wrapper) {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
}

:deep(.micro-app-container) {
  min-height: 400px;
  background: #fafafa;
}
</style>
```

## 🔧 高级用法

### 带标签页的多个微应用

```vue
<template>
  <div class="multi-app-container">
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="tab-content">
      <MicroApp 
        v-if="activeTab === 'dashboard'"
        name="dashboard" 
        entry="//localhost:8080" 
        auto-set-loading
      />
      <MicroApp 
        v-else-if="activeTab === 'analytics'"
        name="analytics" 
        entry="//localhost:8081" 
        auto-set-loading
      />
      <MicroApp 
        v-else-if="activeTab === 'settings'"
        name="settings" 
        entry="//localhost:8082" 
        auto-set-loading
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MicroApp } from '@qiankunjs/vue';

const activeTab = ref('dashboard');

const tabs = [
  { key: 'dashboard', label: '仪表盘' },
  { key: 'analytics', label: '分析' },
  { key: 'settings', label: '设置' }
];
</script>

<style scoped>
.tabs {
  display: flex;
  border-bottom: 1px solid #ccc;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
}

.tabs button.active {
  background: #007bff;
  color: white;
}

.tab-content {
  padding: 20px 0;
}
</style>
```

### 条件加载

```vue
<template>
  <div>
    <div v-if="!user">
      <p>请登录以继续</p>
      <button @click="login">登录</button>
    </div>
    
    <div v-else>
      <button @click="toggleMicroApp">
        {{ showMicroApp ? '隐藏' : '显示' }} 微应用
      </button>
      
      <MicroApp 
        v-if="showMicroApp"
        name="protected-app" 
        entry="//localhost:8080" 
        :app-props="{
          userId: user.id,
          permissions: user.permissions
        }"
        auto-set-loading
        auto-capture-error
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { MicroApp } from '@qiankunjs/vue';

const user = ref(null);
const showMicroApp = ref(false);

const login = () => {
  user.value = {
    id: '123',
    name: 'John Doe',
    permissions: ['read', 'write']
  };
};

const toggleMicroApp = () => {
  showMicroApp.value = !showMicroApp.value;
};
</script>
```

### 动态入口 URL

```vue
<template>
  <div>
    <select v-model="environment">
      <option value="development">开发环境</option>
      <option value="staging">测试环境</option>
      <option value="production">生产环境</option>
    </select>
    
    <MicroApp 
      name="dynamic-app" 
      :entry="entryUrls[environment]" 
      :app-props="{ environment }"
      auto-set-loading
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MicroApp } from '@qiankunjs/vue';

const environment = ref('development');

const entryUrls = {
  development: '//localhost:8080',
  staging: '//staging.example.com',
  production: '//app.example.com'
};
</script>
```

## 🎮 状态管理

### 使用 Pinia 进行状态共享

```vue
<!-- 主应用 -->
<template>
  <div class="main-app">
    <Navigation />
    <MicroAppContainer />
  </div>
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';
import { useAppStore } from '@/stores/app';

const store = useAppStore();
</script>
```

```typescript
// stores/app.ts
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null,
    theme: 'dark',
    language: 'zh-CN'
  }),
  
  actions: {
    setUser(user) {
      this.user = user;
    },
    
    setTheme(theme) {
      this.theme = theme;
    }
  }
});
```

```vue
<!-- 微应用容器 -->
<template>
  <MicroApp 
    name="micro-app" 
    entry="//localhost:8080" 
    :app-props="appProps"
    auto-set-loading
  />
</template>

<script setup>
import { computed } from 'vue';
import { MicroApp } from '@qiankunjs/vue';
import { useAppStore } from '@/stores/app';

const store = useAppStore();

const appProps = computed(() => ({
  user: store.user,
  theme: store.theme,
  language: store.language
}));
</script>
```

### 应用间通信

```vue
<template>
  <div class="app-communication">
    <div class="app-container">
      <h3>应用 1</h3>
      <MicroApp 
        ref="microApp1"
        name="app1" 
        entry="//localhost:8080" 
        auto-set-loading
      />
    </div>
    
    <div class="app-container">
      <h3>应用 2</h3>
      <MicroApp 
        ref="microApp2"
        name="app2" 
        entry="//localhost:8081" 
        auto-set-loading
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { MicroApp } from '@qiankunjs/vue';

const microApp1 = ref();
const microApp2 = ref();

const setupCommunication = () => {
  // 设置全局通信渠道
  window.appCommunication = {
    sendMessage: (from, to, message) => {
      const event = new CustomEvent('microAppMessage', {
        detail: { from, to, message }
      });
      window.dispatchEvent(event);
    }
  };

  // 监听消息
  const handleMessage = (event) => {
    console.log('收到消息:', event.detail);
  };

  window.addEventListener('microAppMessage', handleMessage);

  return () => {
    window.removeEventListener('microAppMessage', handleMessage);
    delete window.appCommunication;
  };
};

onMounted(() => {
  const cleanup = setupCommunication();
  
  onUnmounted(() => {
    cleanup();
  });
});
</script>

<style scoped>
.app-communication {
  display: flex;
  gap: 20px;
}

.app-container {
  flex: 1;
  border: 1px solid #ccc;
  padding: 20px;
}
</style>
```

## 🔒 TypeScript 支持

### 自定义 Composable

```typescript
// composables/useMicroApp.ts
import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

interface UseMicroAppOptions {
  onStatusChange?: (status: string) => void;
  onError?: (error: Error) => void;
}

export function useMicroApp(options: UseMicroAppOptions = {}) {
  const microAppRef: Ref = ref();
  const status = ref<string>('NOT_LOADED');
  const error = ref<Error | null>(null);

  const checkStatus = () => {
    if (microAppRef.value?.microApp) {
      const currentStatus = microAppRef.value.microApp.getStatus();
      if (currentStatus !== status.value) {
        status.value = currentStatus;
        options.onStatusChange?.(currentStatus);
      }
    }
  };

  const handleError = (err: Error) => {
    error.value = err;
    options.onError?.(err);
  };

  let interval: number;

  onMounted(() => {
    interval = window.setInterval(checkStatus, 1000);
  });

  onUnmounted(() => {
    if (interval) {
      clearInterval(interval);
    }
  });

  return {
    microAppRef,
    status,
    error,
    handleError
  };
}
```

```vue
<template>
  <div>
    <p>状态: {{ status }}</p>
    <p v-if="error">错误: {{ error.message }}</p>
    
    <MicroApp 
      ref="microAppRef"
      name="dashboard" 
      entry="//localhost:8080" 
      auto-set-loading
    />
  </div>
</template>

<script setup lang="ts">
import { MicroApp } from '@qiankunjs/vue';
import { useMicroApp } from '@/composables/useMicroApp';

const { microAppRef, status, error } = useMicroApp({
  onStatusChange: (status) => console.log('状态变化:', status),
  onError: (error) => console.error('应用错误:', error)
});
</script>
```

## 🚀 性能优化

### 使用 Suspense 进行懒加载

```vue
<template>
  <Suspense>
    <template #default>
      <LazyMicroApp 
        name="dashboard" 
        entry="//localhost:8080" 
        auto-set-loading
      />
    </template>
    <template #fallback>
      <div>加载组件中...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const LazyMicroApp = defineAsyncComponent(() =>
  import('@qiankunjs/vue').then(module => module.MicroApp)
);
</script>
```

### 使用 computed 进行记忆化

```vue
<template>
  <MicroApp 
    name="optimized-app" 
    entry="//localhost:8080" 
    :app-props="memoizedProps"
    auto-set-loading
  />
</template>

<script setup>
import { computed } from 'vue';
import { MicroApp } from '@qiankunjs/vue';

const props = defineProps(['user', 'settings']);

const memoizedProps = computed(() => ({
  userId: props.user?.id,
  theme: props.settings?.theme,
  language: props.settings?.language
}));
</script>
```

### 基于路由的微应用使用 Keep-alive

```vue
<template>
  <div>
    <nav>
      <router-link to="/dashboard">仪表盘</router-link>
      <router-link to="/analytics">分析</router-link>
    </nav>
    
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script setup>
// 路由配置
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/DashboardView.vue')
  },
  {
    path: '/analytics',
    component: () => import('@/views/AnalyticsView.vue')
  }
];
</script>
```

```vue
<!-- DashboardView.vue -->
<template>
  <MicroApp 
    name="dashboard" 
    entry="//localhost:8080" 
    auto-set-loading
  />
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';
</script>
```

## 🐛 错误处理与调试

### 开发模式错误处理

```vue
<template>
  <MicroApp 
    name="dashboard" 
    entry="//localhost:8080" 
    auto-set-loading
  >
    <template #error-boundary="{ error }">
      <ErrorDisplay :error="error" :is-development="isDevelopment" />
    </template>
  </MicroApp>
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';

const isDevelopment = process.env.NODE_ENV === 'development';
</script>
```

```vue
<!-- ErrorDisplay.vue -->
<template>
  <div class="error-container">
    <div v-if="isDevelopment" class="dev-error">
      <h3>🚨 开发环境错误</h3>
      <pre>{{ error.stack }}</pre>
      <button @click="reload">重新加载应用</button>
    </div>
    
    <div v-else class="prod-error">
      <h3>出现了一些问题</h3>
      <p>请稍后再试。</p>
      <button @click="reload">重试</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['error', 'isDevelopment']);

const reload = () => {
  window.location.reload();
};
</script>

<style scoped>
.error-container {
  padding: 20px;
  text-align: center;
}

.dev-error {
  background: #ffe6e6;
  border: 1px solid #ff9999;
}

.prod-error {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}

pre {
  text-align: left;
  background: #f5f5f5;
  padding: 10px;
  overflow: auto;
}
</style>
```

## 📚 Vue 2 兼容性

### 在 Vue 2 中使用

```vue
<template>
  <div class="main-app">
    <h1>Vue 2 主应用</h1>
    <micro-app 
      name="dashboard" 
      entry="//localhost:8080" 
      :app-props="appProps"
      auto-set-loading
    >
      <template v-slot:loader="{ loading }">
        <div v-if="loading">加载中...</div>
      </template>
    </micro-app>
  </div>
</template>

<script>
import { MicroApp } from '@qiankunjs/vue';

export default {
  name: 'MainApp',
  components: {
    MicroApp
  },
  data() {
    return {
      user: {
        id: '123',
        name: 'John'
      }
    };
  },
  computed: {
    appProps() {
      return {
        userId: this.user.id,
        userName: this.user.name
      };
    }
  }
};
</script>
```

### 在 Vue 2 中使用 Composition API

```vue
<template>
  <micro-app 
    name="dashboard" 
    entry="//localhost:8080" 
    :app-props="appProps"
    auto-set-loading
  />
</template>

<script>
import { defineComponent, ref, computed } from '@vue/composition-api';
import { MicroApp } from '@qiankunjs/vue';

export default defineComponent({
  components: {
    MicroApp
  },
  setup() {
    const user = ref({
      id: '123',
      name: 'John'
    });

    const appProps = computed(() => ({
      userId: user.value.id,
      userName: user.value.name
    }));

    return {
      appProps
    };
  }
});
</script>
```

## 📚 最佳实践

### 1. 使用描述性名称

```vue
<!-- ✅ 好：描述性名称 -->
<MicroApp name="user-dashboard" entry="//localhost:8080" />
<MicroApp name="order-management" entry="//localhost:8081" />

<!-- ❌ 坏：通用名称 -->
<MicroApp name="app1" entry="//localhost:8080" />
<MicroApp name="app2" entry="//localhost:8081" />
```

### 2. 始终处理加载状态

```vue
<!-- ✅ 好：处理加载状态 -->
<MicroApp 
  name="dashboard" 
  entry="//localhost:8080" 
  auto-set-loading
>
  <template #loader="{ loading }">
    <CustomSpinner v-if="loading" />
  </template>
</MicroApp>

<!-- ❌ 坏：没有加载指示 -->
<MicroApp name="dashboard" entry="//localhost:8080" />
```

### 3. 实现错误边界

```vue
<!-- ✅ 好：优雅地处理错误 -->
<MicroApp 
  name="dashboard" 
  entry="//localhost:8080" 
  auto-capture-error
>
  <template #error-boundary="{ error }">
    <ErrorFallback :error="error" />
  </template>
</MicroApp>
```

### 4. 使用响应式属性

```vue
<!-- ✅ 好：响应式属性 -->
<MicroApp 
  name="dashboard" 
  entry="//localhost:8080" 
  :app-props="reactiveProps"
/>

<script setup>
import { computed } from 'vue';

const reactiveProps = computed(() => ({
  theme: store.theme,
  user: store.user
}));
</script>
```

### 5. 环境特定的配置

```vue
<!-- ✅ 好：环境感知 -->
<template>
  <MicroApp 
    name="dashboard" 
    :entry="config.entry"
    :app-props="config.props"
  />
</template>

<script setup>
import { computed } from 'vue';

const config = computed(() => {
  const env = import.meta.env.MODE;
  
  return {
    development: { 
      entry: '//localhost:8080', 
      props: { debug: true } 
    },
    production: { 
      entry: '//app.example.com', 
      props: { debug: false } 
    }
  }[env];
});
</script>
```

## 🔗 相关文档

- [React 绑定](/zh-CN/ecosystem/react) - React UI 绑定
- [核心 API](/zh-CN/api/) - qiankun 核心 API
- [配置](/zh-CN/api/configuration) - 配置选项
- [生命周期](/zh-CN/api/lifecycles) - 生命周期钩子 