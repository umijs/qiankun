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

### 沙箱与样式隔离

微应用的 qiankun 配置走 `settings`，类型即核心 API 的 `AppConfiguration`：

```vue
<template>
  <MicroApp name="dashboard" entry="//localhost:8080" :settings="settings" />
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';

// settings 只在挂载该微应用时读取一次，用一个稳定的对象即可
const settings = { sandbox: { styleIsolation: true } };
</script>
```

`settings` 的默认值是 `{ sandbox: true }`，即默认开启 JS 沙箱、不做样式隔离；样式隔离需要像上面这样显式打开。

## 🎯 组件 API

### 属性

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `name` | `string` | ✅ | - | 微应用的唯一名称，也是组件判定「换了一个微应用」的依据 |
| `entry` | `string` | ✅ | - | 微应用的入口 URL，只在挂载该 `name` 时读取一次 |
| `settings` | `AppConfiguration` | ❌ | `{ sandbox: true }` | 该微应用的 qiankun 配置：沙箱、样式隔离、fetch 等 |
| `lifeCycles` | `LifeCycles` | ❌ | `undefined` | 该微应用的 qiankun 生命周期钩子，见下方说明 |
| `autoSetLoading` | `boolean` | ❌ | `false` | 不写 `loader` 插槽时，使用内置的加载状态组件 |
| `autoCaptureError` | `boolean` | ❌ | `false` | 不写 `error-boundary` 插槽时，使用内置的错误捕获组件 |
| `className` | `string` | ❌ | `undefined` | 微应用容器的 CSS 类 |
| `wrapperClassName` | `string` | ❌ | `undefined` | 包装器的 CSS 类（仅在启用加载状态或错误捕获时才有包装器） |
| `appProps` | `Record<string, unknown>` | ❌ | `undefined` | 传给微应用的 props，见下方说明 |

**以上属性都由组件自身消费，不会转发给微应用**：微应用的 props 只走 `appProps` 这一个通道。写在组件上的其他属性也不会传给微应用——它们和普通的透传属性一样，落在根元素上成了 HTML 属性。

**`lifeCycles` 不要闭包组件状态：** qiankun 会按 (name, container) 缓存一份 parcel 配置，生命周期钩子也在其中——同一个容器里首次加载时捕获到的那份钩子，才是后续一直生效的那份。所以钩子里不要引用会变化的组件状态（否则读到的永远是首次挂载时的值），需要跟随状态变化的 UI 请交给 `loader` / `error-boundary` 插槽表达。

### 微应用 props

`appProps` 的内容会被展开后传给微应用；`appProps` 这个包装对象本身不会传下去。它变化时，组件会调用微应用的 `update` 生命周期（微应用需要导出 `update`，否则这次变更无处可落）：

```vue
<template>
  <div>
    <MicroApp name="dashboard" entry="//localhost:8080" :app-props="appProps" />
    <button @click="appProps.theme = 'dark'">切换主题</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { MicroApp } from '@qiankunjs/vue';

// 就地修改而不是整体替换：深度监听只在内容真正变化时才触发一次 update
const appProps = reactive({ theme: 'light' });
</script>
```

建议用 `reactive` 或 `computed` 保持 `appProps` 的引用稳定。模板里写内联字面量（`:app-props="{ theme }"`）会让每次重渲染都产出一个新对象，从而触发一次多余的 `update`。

### 插槽

| 插槽 | 描述 | 参数 |
|------|------|------|
| `loader` | 自定义加载状态组件 | `{ loading: boolean }` |
| `error-boundary` | 自定义错误捕获组件 | `{ error: Error }` |

插槽参数是一个对象，所以写法是 `#loader="{ loading }"` 和 `#error-boundary="{ error }"`。错误插槽的两种拼写 `#error-boundary` 与 `#errorBoundary` 都被接受。

**插槽与开关是二选一的关系**：写了 `loader` 插槽就不必再传 `autoSetLoading`——微应用挂载完成后，插槽拿到的 `loading` 一样会变成 `false`；同理写了 `error-boundary` 插槽也不必再传 `autoCaptureError`。这两个开关的含义只是「没写插槽时，使用内置的默认样式」。

### 渲染结构

只传 `name` / `entry` 时，组件只渲染一个微应用容器。启用了加载状态或错误捕获（无论是插槽还是开关）时，会多出一层包装器：

```vue
<div :class="`${wrapperClassName} qiankun-micro-app-wrapper`">
  <div :class="`${className} qiankun-micro-app-container`" />
  <!-- #loader 插槽，或内置的 MicroAppLoader；始终渲染，加载结束由 loading 变为 false 表达 -->
  <!-- #error-boundary 插槽，或内置的 ErrorBoundary；仅在捕获到错误时渲染 -->
</div>
```

容器排在最前面是有意的：qiankun 按容器的 XPath 索引它的容器级缓存，而 XPath 会数上同标签的前置兄弟节点，所以容器的位置不能随插槽的出现与消失而漂移。也正因为插槽排在容器之后，它们天然盖在微应用上方，不需要 `z-index`。

Vue 绑定的包装器自身没有定位，如果你的插槽是覆盖式的浮层，请通过 `wrapperClassName` 给它加上 `position: relative`。

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
  /* 包装器自身没有定位，覆盖式的加载/错误浮层需要它成为定位上下文 */
  position: relative;
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
        :app-props="appProps"
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

// 用 computed 而不是模板里的内联字面量，避免每次重渲染都触发一次 update
const appProps = computed(() => ({
  userId: user.value?.id,
  permissions: user.value?.permissions
}));

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

### 切换微应用与 entry 的更新时机

组件以 `name` 作为微应用的身份：`name` 变化时，组件会先卸载上一个微应用、再挂载新的；其他属性变化不会重新挂载。

因此**只改 `entry`、`name` 保持不变是无效的**——`entry` 只在挂载时读取一次，也不会随后续的 props 更新下发。要换 entry，让 `name` 跟着一起变（路由驱动时天然如此）：

```vue
<template>
  <div>
    <select v-model="environment">
      <option value="development">开发环境</option>
      <option value="staging">测试环境</option>
      <option value="production">生产环境</option>
    </select>

    <!-- name 跟着环境一起变，组件才会卸载旧的微应用、用新的 entry 挂载 -->
    <MicroApp :name="`dynamic-app-${environment}`" :entry="entryUrls[environment]" auto-set-loading />
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

如果微应用的 `name` 必须保持不变（例如它被别处依赖），就用 `:key` 让整个组件重建：

```vue
<template>
  <MicroApp :key="entryUrls[environment]" name="dynamic-app" :entry="entryUrls[environment]" auto-set-loading />
</template>
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
import Navigation from '@/components/Navigation.vue';
import MicroAppContainer from '@/components/MicroAppContainer.vue';
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

`settings` 与 `lifeCycles` 的类型来自 qiankun 本身：`import type { AppConfiguration, LifeCycles } from 'qiankun'`。

组件的模板 ref 上暴露了 `microApp`，也就是 `loadMicroApp` 返回的那个微应用实例（类型为 qiankun 的 `MicroApp`）。它是异步填上的：微应用挂载动作在组件 mounted 之后才发起，所以在宿主的 `onMounted` 里读它还是 `undefined`。

### 自定义 Composable

```typescript
// composables/useMicroApp.ts
import { ref, onMounted, onUnmounted } from 'vue';
import type { MicroApp } from 'qiankun';

interface UseMicroAppOptions {
  onStatusChange?: (status: string) => void;
  onError?: (error: Error) => void;
}

export function useMicroApp(options: UseMicroAppOptions = {}) {
  // 组件实例上暴露的 microApp 就是微应用实例
  const microAppRef = ref<{ microApp?: MicroApp } | null>(null);
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

### 路由驱动：复用同一个 `<MicroApp>`

多个微应用共用一个 `<MicroApp>`、由路由决定挂哪一个，是最省事也最划算的写法：`name` 变化时组件自己串行地完成「卸载旧的 → 挂载新的」，离开路由则卸载；组件实例不变意味着容器身份也不变，qiankun 按 (name, container) 建立的缓存因此得以复用。**不要加 `:key`**，加了就等于每次切换都重建组件与容器，白白丢掉这些。

```vue
<template>
  <nav>
    <RouterLink v-for="app in microApps" :key="app.name" :to="app.path">{{ app.label }}</RouterLink>
  </nav>

  <!-- 有意不加 :key：切换交给绑定组件自己串行地卸载、挂载 -->
  <MicroApp
    v-if="activeApp"
    :name="activeApp.name"
    :entry="activeApp.entry"
    :settings="settings"
    wrapper-class-name="stage"
  >
    <template #loader="{ loading }">
      <StageVeil :loading="loading" />
    </template>
    <template #error-boundary="{ error }">
      <StageFailure :error="error" />
    </template>
  </MicroApp>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { MicroApp } from '@qiankunjs/vue';
import StageVeil from '@/components/StageVeil.vue';
import StageFailure from '@/components/StageFailure.vue';

const settings = { sandbox: { styleIsolation: true } };

const microApps = [
  { name: 'react', label: 'React', path: '/react', entry: '//localhost:7100' },
  { name: 'vue', label: 'Vue', path: '/vue', entry: '//localhost:7101' }
];

const route = useRoute();
const activeApp = computed(() => microApps.find((app) => route.path.startsWith(app.path)));
</script>
```

仓库里的 [`examples/vue-host`](https://github.com/umijs/qiankun/tree/next/examples/vue-host) 就是这个写法的完整可运行版本（React 版本见 [`examples/main`](https://github.com/umijs/qiankun/tree/next/examples/main)）。

需要注意 `<keep-alive>` 并不适合缓存微应用：失活只会让组件停用、并不会触发卸载，微应用会带着一个被移出文档的容器继续运行。基于路由的微应用请让组件真正卸载。

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
<!-- ✅ 好：自定义加载状态（插槽自己就够，不需要再加 auto-set-loading） -->
<MicroApp name="dashboard" entry="//localhost:8080">
  <template #loader="{ loading }">
    <CustomSpinner v-if="loading" />
  </template>
</MicroApp>

<!-- ✅ 好：内置加载状态 -->
<MicroApp name="dashboard" entry="//localhost:8080" auto-set-loading />

<!-- ❌ 坏：没有加载指示 -->
<MicroApp name="dashboard" entry="//localhost:8080" />
```

### 3. 实现错误边界

```vue
<!-- ✅ 好：优雅地处理错误（插槽自己就够，不需要再加 auto-capture-error） -->
<MicroApp name="dashboard" entry="//localhost:8080">
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
<!-- ✅ 好：环境感知；entry 由构建期环境决定，运行时不会再变 -->
<!-- 运行时切换 entry 请看「切换微应用与 entry 的更新时机」 -->
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
- [`examples/vue-host`](https://github.com/umijs/qiankun/tree/next/examples/vue-host) - 用本绑定承载四个微应用的 Vue 主应用示例
- [`examples/main`](https://github.com/umijs/qiankun/tree/next/examples/main) - 同一批微应用的 React 主应用示例
