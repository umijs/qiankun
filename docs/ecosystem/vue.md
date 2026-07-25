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

`autoSetLoading` renders the binding's built-in loading indicator. It is only needed for that indicator — a `loader` slot drives the loading state on its own, without the flag.

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

Same story for errors: `autoCaptureError` renders the built-in error panel, and an `error-boundary` slot replaces it without the flag. With neither of them configured, a load or mount failure is thrown instead of being swallowed.

## 🎯 Component API

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `string` | ✅ | - | Unique name for the micro application. Changing it switches the mounted app |
| `entry` | `string` | ✅ | - | Entry URL of the micro application. Read when the app mounts — see [Dynamic Entry URLs](#dynamic-entry-urls) |
| `autoSetLoading` | `boolean` | ❌ | `false` | Render the built-in loading indicator |
| `autoCaptureError` | `boolean` | ❌ | `false` | Render the built-in error panel |
| `className` | `string` | ❌ | `undefined` | CSS class for the micro app container |
| `wrapperClassName` | `string` | ❌ | `undefined` | CSS class for the wrapper, which only exists when a loading or error view is enabled |
| `appProps` | `Record<string, any>` | ❌ | `undefined` | The micro application's own props: the *contents* of this object are forwarded, the object itself is not |
| `settings` | `AppConfiguration` | ❌ | `{ sandbox: true }` | qiankun configuration for this micro app — sandbox, style isolation, fetch, … |
| `lifeCycles` | `LifeCycles` | ❌ | `undefined` | qiankun lifecycle hooks for this micro app. They are captured on the first load into a given container, so avoid closing over component state in them |

### Passing Props to the Micro Application

`appProps` is the channel to the micro application. Every prop the component declares for itself — `name`, `entry`, `settings`, `lifeCycles`, `autoSetLoading`, `autoCaptureError`, `wrapperClassName`, `className` and `appProps` itself — is consumed by the binding and never reaches the micro app. Attributes the component does not declare are not forwarded either: Vue puts them on the rendered element as plain DOM attributes.

Every change to `appProps` — whether you mutate it in place or hand over a new object — is passed to the micro app's `update` lifecycle, starting with the first change after mount. Apps that export no `update` lifecycle simply have nowhere for it to land.

### Slots

| Slot | Description | Slot props |
|------|-------------|------------|
| `loader` | Custom loading view | `{ loading: boolean }` |
| `error-boundary` | Custom error view | `{ error: Error }` |

Slot props arrive as an object, so destructure them: `#loader="{ loading }"` and `#error-boundary="{ error }"`. Vue does not normalize slot names, so the error slot is accepted under both spellings — `#error-boundary` and `#errorBoundary`.

### Rendered Structure

With a loading or error view enabled the component wraps the micro app container in an extra element:

```vue
<div :class="`${wrapperClassName} qiankun-micro-app-wrapper`">
  <div :class="`${className} qiankun-micro-app-container`" />
  <!-- the loader slot, or <MicroAppLoader /> when autoSetLoading is on -->
  <!-- the error-boundary slot, or <ErrorBoundary /> when autoCaptureError is on -->
</div>
```

The container is rendered first so its position never shifts as the loading and error views come and go — qiankun keys its per-container caches on that position. Because the two views come after the container, they paint above the micro app without needing a `z-index`. With neither view configured the component renders the container alone, without a wrapper.

The wrapper carries no inline positioning, so if your loading or error view is an overlay, make the wrapper a containing block yourself through the class you pass as `wrapperClassName`:

```vue
<style scoped>
:deep(.micro-app-wrapper) {
  position: relative;
}
</style>
```

## 🎨 Customization

### Custom Loading with Slots

The slot receives the binding's own loading state, which ends as soon as the micro app reaches `MOUNTED`. Nothing else is needed to turn it off:

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
  /* the wrapper is not positioned by the binding, so overlay views need this */
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

Both classes are additive: the binding always keeps `qiankun-micro-app-wrapper` on the wrapper and `qiankun-micro-app-container` on the container, so you can also style or query those directly.

## 🔧 Advanced Usage

### Sandbox and Style Isolation

Everything qiankun itself can be configured with travels through `settings`: the JS sandbox, style isolation, `fetch`, … The default is `{ sandbox: true }` — JS sandbox on, style isolation off.

```vue
<template>
  <MicroApp 
    name="dashboard" 
    entry="//localhost:8080" 
    :settings="settings"
  />
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';

// a stable object, defined outside the render
const settings = { sandbox: { styleIsolation: true } };
</script>
```

`settings` is read when the app mounts, so a later change only takes effect on the next mount. See [Configuration](/api/configuration) for the full set of options.

### Lifecycle Hooks

`lifeCycles` are handed to qiankun as-is, for this micro app only:

```vue
<template>
  <MicroApp 
    name="dashboard" 
    entry="//localhost:8080" 
    :life-cycles="lifeCycles"
  />
</template>

<script setup>
import { MicroApp } from '@qiankunjs/vue';

const lifeCycles = {
  beforeLoad: async (app) => console.log('before load', app.name),
  afterMount: async (app) => console.log('mounted', app.name),
  beforeUnmount: async (app) => console.log('before unmount', app.name)
};
</script>
```

qiankun caches what it loaded — lifecycle hooks included — per micro app name and container, so the hooks captured on the first load into a given container are the ones that keep running for later mounts into it. Keep them free of component state: drive your UI from the `loader` and `error-boundary` slots instead of closing over reactive state in a hook.

### Multiple Micro Apps with Tabs

One component serves every tab. Changing `name` unmounts the previous app and mounts the next one — the two are serialized, so rapid clicking cannot race two apps into the same container, and no `key` is needed:

```vue
<template>
  <div class="multi-app-container">
    <div class="tabs">
      <button 
        v-for="app in apps" 
        :key="app.name"
        :class="{ active: active === app.name }"
        @click="active = app.name"
      >
        {{ app.label }}
      </button>
    </div>
    
    <div class="tab-content">
      <MicroApp 
        :name="activeApp.name" 
        :entry="activeApp.entry" 
        auto-set-loading
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { MicroApp } from '@qiankunjs/vue';

const apps = [
  { name: 'dashboard', label: 'Dashboard', entry: '//localhost:8080' },
  { name: 'analytics', label: 'Analytics', entry: '//localhost:8081' },
  { name: 'settings', label: 'Settings', entry: '//localhost:8082' }
];

const active = ref('dashboard');
const activeApp = computed(() => apps.find((app) => app.name === active.value) ?? apps[0]);
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

`entry` is read when the app mounts, and the component only mounts a new app when `name` changes. Pointing `entry` at another URL while `name` stays the same therefore does nothing. Make the identity carry the variant, and the switch works:

```vue
<template>
  <div>
    <select v-model="environment">
      <option value="development">Development</option>
      <option value="staging">Staging</option>
      <option value="production">Production</option>
    </select>
    
    <MicroApp 
      :name="`dynamic-app-${environment}`" 
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

Re-creating the component with a `:key` is not a substitute: qiankun caches the loaded app per name **and** container position, so a re-created component with the same name in the same place is served the code of the entry that was loaded first. One name per entry is the rule.

If the entry has to be discovered at runtime, resolve it before you render the component — for example behind a `v-if` — so the value is final by the time the app mounts.

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

A `computed` keeps the object identity stable until the values it depends on really change, so the micro app's `update` lifecycle runs once per change instead of once per re-render.

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

The component instance exposes the loaded app as `microApp`, and the binding only assigns it once the mount settles — it is still `undefined` synchronously inside `onMounted`. So track the reference instead of reading it once:

```typescript
// composables/useMicroApp.ts
import { ref, watch, type Ref } from 'vue';
import type { MicroApp as MicroAppType } from 'qiankun';

type MicroAppInstance = { microApp?: MicroAppType } | null;

export function useMicroApp(instance: Ref<MicroAppInstance>) {
  const status = ref('NOT_LOADED');

  const refresh = () => {
    status.value = instance.value?.microApp?.getStatus() ?? 'NOT_LOADED';
  };

  // fires as soon as the app is handed over, and again whenever the app is swapped
  watch(() => instance.value?.microApp, refresh);

  return { status, refresh };
}
```

```vue
<template>
  <div>
    <p>Status: {{ status }}</p>
    <button @click="refresh">Refresh status</button>
    
    <MicroApp 
      ref="stage"
      name="dashboard" 
      entry="//localhost:8080" 
      auto-set-loading
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MicroApp } from '@qiankunjs/vue';
import { useMicroApp } from '@/composables/useMicroApp';

const stage = ref(null);
const { status, refresh } = useMicroApp(stage);
</script>
```

Later transitions of the same instance — `MOUNTED` → `UNMOUNTING`, say — leave the reference untouched, which is what `refresh` is for. If all you need is "is this app up yet", read the `loader` slot's `loading` instead.

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

`appProps` is watched deeply, so an inline object literal — a fresh object on every render — asks the micro app to `update` on every render. A `computed` (or a `reactive` object you mutate in place) narrows that down to real changes; in development the binding warns when updates arrive less than 200 ms apart.

### Route-based Micro Apps

Drive one component from your router instead of one per route: the route picks `name` and `entry`, leaving the route unmounts the component and with it the micro app. Because the container element stays in the same place, qiankun can take its warm remount path when the visitor comes back.

```vue
<template>
  <!-- no `key`: the binding unmounts the previous app before mounting the next -->
  <MicroApp 
    v-if="app"
    :name="app.name" 
    :entry="app.entry" 
    :settings="settings"
    auto-set-loading
  />
  <p v-else>Pick a micro app.</p>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { MicroApp } from '@qiankunjs/vue';

const microApps = [
  { name: 'dashboard', path: '/dashboard', entry: '//localhost:8080' },
  { name: 'analytics', path: '/analytics', entry: '//localhost:8081' }
];

const route = useRoute();
const app = computed(() => microApps.find((item) => route.path.startsWith(item.path)));

const settings = { sandbox: { styleIsolation: true } };
</script>
```

`<keep-alive>` is not a way to suspend a micro app: the binding unmounts on the component's own unmount, which a cached route never reaches, so a kept-alive micro app keeps running in detached DOM. Let the route unmount the component.

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
<!-- ✅ Good: the built-in indicator -->
<MicroApp name="dashboard" entry="//localhost:8080" auto-set-loading />

<!-- ✅ Good: your own, no flag needed -->
<MicroApp name="dashboard" entry="//localhost:8080">
  <template #loader="{ loading }">
    <CustomSpinner v-if="loading" />
  </template>
</MicroApp>

<!-- ❌ Bad: No loading indication -->
<MicroApp name="dashboard" entry="//localhost:8080" />
```

### 3. Implement Error Boundaries

```vue
<!-- ✅ Good: the built-in panel -->
<MicroApp name="dashboard" entry="//localhost:8080" auto-capture-error />

<!-- ✅ Good: your own, no flag needed -->
<MicroApp name="dashboard" entry="//localhost:8080">
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

The mode is fixed for the lifetime of the page, so this resolves before the app mounts. Switching entries while the page is running is a different problem — see [Dynamic Entry URLs](#dynamic-entry-urls).

## 📂 Working Examples

Two shells in the repository host the same micro apps, each driving a single `<MicroApp />` from its own router — the route picks `name` and `entry`, leaving the route unmounts the app, and no `key` is involved:

- `examples/vue-host` — the Vue shell: `settings`, `appProps` and both slots, with the wrapper positioned by the host, plus a deliberately unreachable route that shows the error slot (`examples/vue-host/src/Stage.vue`)
- `examples/main` — the same stage built with the React bindings (`examples/main/src/components/Stage.tsx`)

Run them with `pnpm run start:example` from the repository root.

## 🔗 Related Documentation

- [React Bindings](/ecosystem/react) - React UI bindings
- [Core APIs](/api/) - qiankun core APIs
- [Configuration](/api/configuration) - Configuration options
- [Lifecycles](/api/lifecycles) - Lifecycle hooks