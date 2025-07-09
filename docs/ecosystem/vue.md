# Vue Bindings

The official Vue bindings for qiankun provide a declarative way to integrate micro applications into your Vue main application. The `@qiankunjs/vue` package offers a powerful `<MicroApp />` component with Vue 2/3 compatibility, composition API support, and slot-based customization.

## 📦 Installation

```bash
npm install @qiankunjs/vue
```

**Requirements:**
- Vue 2.0+ or Vue 3.0+ 
- qiankun ≥ 3.0.0
- For Vue 2, you may need `@vue/composition-api`

## 🚀 Quick Start

### Vue 3 with Composition API

```vue
<template>
  <div class="main-app">
    <h1>Main Application</h1>
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

### Vue 2 with Options API

```vue
<template>
  <div class="main-app">
    <h1>Main Application</h1>
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

### With Loading State

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

### With Error Handling

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

## 🎯 Component API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `string` | ✅ | - | Unique name for the micro application |
| `entry` | `string` | ✅ | - | Entry URL of the micro application |
| `autoSetLoading` | `boolean` | ❌ | `false` | Automatically manage loading state |
| `autoCaptureError` | `boolean` | ❌ | `false` | Automatically handle errors |
| `className` | `string` | ❌ | `undefined` | CSS class for the micro app container |
| `wrapperClassName` | `string` | ❌ | `undefined` | CSS class for the wrapper (when using slots) |
| `appProps` | `Record<string, any>` | ❌ | `undefined` | Props passed to the micro application |
| `settings` | `AppConfiguration` | ❌ | `{}` | qiankun configuration options |
| `lifeCycles` | `LifeCycles` | ❌ | `undefined` | Lifecycle hooks |

### Slots

| Slot | Description | Parameters |
|------|-------------|------------|
| `loader` | Custom loading component | `{ loading: boolean }` |
| `errorBoundary` | Custom error component | `{ error: Error }` |

## 🎨 Customization

### Custom Loading with Slots

```vue
<template>
  <MicroApp name="dashboard" entry="//localhost:8080">
    <template #loader="{ loading }">
      <div v-if="loading" class="custom-loader">
        <div class="spinner"></div>
        <p>Loading micro application...</p>
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

### Custom Error Boundary

```vue
<template>
  <MicroApp name="dashboard" entry="//localhost:8080">
    <template #error-boundary="{ error }">
      <div class="error-container">
        <h3>🚨 Application Error</h3>
        <p>{{ error.message }}</p>
        <button @click="handleRetry">Retry</button>
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

### Styling

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

## 🔧 Advanced Usage

### Multiple Micro Apps with Tabs

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
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'settings', label: 'Settings' }
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

### Conditional Loading

```vue
<template>
  <div>
    <div v-if="!user">
      <p>Please log in to continue</p>
      <button @click="login">Login</button>
    </div>
    
    <div v-else>
      <button @click="toggleMicroApp">
        {{ showMicroApp ? 'Hide' : 'Show' }} Micro App
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

### Dynamic Entry URLs

```vue
<template>
  <div>
    <select v-model="environment">
      <option value="development">Development</option>
      <option value="staging">Staging</option>
      <option value="production">Production</option>
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

## 🎮 State Management

### Using Pinia for State Sharing

```vue
<!-- Main App -->
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
    language: 'en'
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
<!-- MicroApp Container -->
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

### Communication Between Apps

```vue
<template>
  <div class="app-communication">
    <div class="app-container">
      <h3>App 1</h3>
      <MicroApp 
        ref="microApp1"
        name="app1" 
        entry="//localhost:8080" 
        auto-set-loading
      />
    </div>
    
    <div class="app-container">
      <h3>App 2</h3>
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
  // Set up global communication channel
  window.appCommunication = {
    sendMessage: (from, to, message) => {
      const event = new CustomEvent('microAppMessage', {
        detail: { from, to, message }
      });
      window.dispatchEvent(event);
    }
  };

  // Listen for messages
  const handleMessage = (event) => {
    console.log('Message received:', event.detail);
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

## 🔒 TypeScript Support

### Typed Props with Vue 3

```vue
<template>
  <MicroApp 
    name="user-profile" 
    entry="//localhost:8080"
    :app-props="userProps"
    auto-set-loading
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MicroApp } from '@qiankunjs/vue';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserProfileProps {
  userId: string;
  theme: 'light' | 'dark';
  permissions: string[];
}

const user: User = getCurrentUser();

const userProps = computed<UserProfileProps>(() => ({
  userId: user.id,
  theme: 'dark',
  permissions: user.permissions || []
}));
</script>
```

### Custom Composable for Micro App

```typescript
// composables/useMicroApp.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import type { MicroApp as MicroAppType } from 'qiankun';

interface UseMicroAppOptions {
  onStatusChange?: (status: string) => void;
  onError?: (error: Error) => void;
}

export function useMicroApp(options: UseMicroAppOptions = {}) {
  const microAppRef: Ref<any> = ref();
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
    <p>Status: {{ status }}</p>
    <p v-if="error">Error: {{ error.message }}</p>
    
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
  onStatusChange: (status) => console.log('Status changed:', status),
  onError: (error) => console.error('App error:', error)
});
</script>
```

## 🚀 Performance Optimization

### Lazy Loading with Suspense

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
      <div>Loading component...</div>
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

### Memoization with computed

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

### Keep-alive for Route-based Micro Apps

```vue
<template>
  <div>
    <nav>
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/analytics">Analytics</router-link>
    </nav>
    
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script setup>
// Routes configuration
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

## 🐛 Error Handling & Debugging

### Development Mode Error Handling

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
      <h3>🚨 Development Error</h3>
      <pre>{{ error.stack }}</pre>
      <button @click="reload">Reload App</button>
    </div>
    
    <div v-else class="prod-error">
      <h3>Something went wrong</h3>
      <p>Please try again later.</p>
      <button @click="reload">Retry</button>
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

## 📚 Vue 2 Compatibility

### Using with Vue 2

```vue
<template>
  <div class="main-app">
    <h1>Vue 2 Main Application</h1>
    <micro-app 
      name="dashboard" 
      entry="//localhost:8080" 
      :app-props="appProps"
      auto-set-loading
    >
      <template v-slot:loader="{ loading }">
        <div v-if="loading">Loading...</div>
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

### With Composition API in Vue 2

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

## 📚 Best Practices

### 1. Use Descriptive Names

```vue
<!-- ✅ Good: Descriptive names -->
<MicroApp name="user-dashboard" entry="//localhost:8080" />
<MicroApp name="order-management" entry="//localhost:8081" />

<!-- ❌ Bad: Generic names -->
<MicroApp name="app1" entry="//localhost:8080" />
<MicroApp name="app2" entry="//localhost:8081" />
```

### 2. Always Handle Loading States

```vue
<!-- ✅ Good: Handle loading states -->
<MicroApp 
  name="dashboard" 
  entry="//localhost:8080" 
  auto-set-loading
>
  <template #loader="{ loading }">
    <CustomSpinner v-if="loading" />
  </template>
</MicroApp>

<!-- ❌ Bad: No loading indication -->
<MicroApp name="dashboard" entry="//localhost:8080" />
```

### 3. Implement Error Boundaries

```vue
<!-- ✅ Good: Handle errors gracefully -->
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

### 4. Use Reactive Props

```vue
<!-- ✅ Good: Reactive props -->
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

### 5. Environment-specific Configurations

```vue
<!-- ✅ Good: Environment-aware -->
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

## 🔗 Related Documentation

- [React Bindings](/ecosystem/react) - React UI bindings
- [Core APIs](/api/) - qiankun core APIs
- [Configuration](/api/configuration) - Configuration options
- [Lifecycles](/api/lifecycles) - Lifecycle hooks 