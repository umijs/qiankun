# API 参考

qiankun 提供了简洁而强大的 API 来构建微前端应用。所有 API 都提供了完整的 TypeScript 类型定义，确保开发体验和类型安全。

## 📚 核心 API

### 应用注册与启动

| API | 描述 | 类型 |
|-----|------|------|
| [`registerMicroApps`](/zh-CN/api/register-micro-apps) | 注册微应用 | `(apps: RegistrableApp[], lifeCycles?: LifeCycles) => void` |
| [`start`](/zh-CN/api/start) | 启动 qiankun 框架 | `(opts?: StartOpts) => void` |
| [`loadMicroApp`](/zh-CN/api/load-micro-app) | 手动加载微应用 | `(app: LoadableApp, configuration?: AppConfiguration, lifeCycles?: LifeCycles) => MicroApp` |

### 工具 API

| API | 描述 | 类型 |
|-----|------|------|
| [`isRuntimeCompatible`](/zh-CN/api/is-runtime-compatible) | 检查运行时兼容性 | `() => boolean` |

## 🎯 快速导航

### 按使用场景

**路由模式**
```typescript
import { registerMicroApps, start } from 'qiankun';

// 1. 注册微应用
registerMicroApps([...]);

// 2. 启动框架
start();
```

**手动加载模式**
```typescript
import { loadMicroApp } from 'qiankun';

// 手动加载微应用
const microApp = loadMicroApp({...});
```

**兼容性检查**
```typescript
import { isRuntimeCompatible } from 'qiankun';

if (isRuntimeCompatible()) {
  // 启动微前端应用
}
```

### 按功能分类

| 分类 | 相关 API | 描述 |
|------|----------|------|
| **应用管理** | `registerMicroApps`, `loadMicroApp` | 注册和加载微应用 |
| **框架控制** | `start` | 框架启动和配置 |
| **工具函数** | `isRuntimeCompatible` | 辅助工具方法 |

## 🔧 类型定义

qiankun 提供了完整的 TypeScript 类型定义：

```typescript
import type {
  RegistrableApp,
  LoadableApp,
  MicroApp,
  LifeCycles,
  AppConfiguration,
} from 'qiankun';
```

详细信息请参考 [类型定义](/zh-CN/api/types)。

## 📖 详细文档

### 核心 API
- [registerMicroApps](/zh-CN/api/register-micro-apps) - 注册微应用
- [start](/zh-CN/api/start) - 启动 qiankun 框架
- [loadMicroApp](/zh-CN/api/load-micro-app) - 手动加载微应用
- [isRuntimeCompatible](/zh-CN/api/is-runtime-compatible) - 运行时兼容性检查

### 参考文档
- [生命周期](/zh-CN/api/lifecycles) - 应用生命周期钩子
- [配置选项](/zh-CN/api/configuration) - 框架配置选项
- [类型定义](/zh-CN/api/types) - TypeScript 类型定义

## 💡 使用建议

### 推荐的 API 使用模式

1. **标准路由模式**（推荐）
   ```typescript
   registerMicroApps([...]) → start()
   ```

2. **动态加载模式**
   ```typescript
   loadMicroApp({...}) 
   ```

3. **混合模式**
   ```typescript
   registerMicroApps([...]) → start() + loadMicroApp({...})
   ```

### 最佳实践

- ✅ 使用 TypeScript 获得完整的类型支持
- ✅ 在启动框架前注册所有微应用
- ✅ 适当使用生命周期钩子进行状态管理
- ✅ 配置适当的错误处理

- ❌ 避免注册重复的应用名称
- ❌ 避免在微应用中调用主应用 API
- ❌ 避免在生命周期钩子中执行耗时操作 