# 常见问题

本 FAQ 涵盖了使用 qiankun 时遇到的最常见问题和问题。如果您找不到所需的答案，请查看我们的 [GitHub Issues](https://github.com/umijs/qiankun/issues) 或加入我们的社区讨论。

## 🚀 入门指南

### 问：什么是 qiankun，什么时候应该使用它？

**答：** qiankun 是一个基于 single-spa 的微前端框架，通过组合多个较小的独立应用来构建大规模前端应用。在以下情况下应该考虑使用 qiankun：

- 团队在不断壮大，需要跨多个团队扩展开发
- 有需要与新功能共存的遗留应用
- 希望在一个应用中使用不同的框架（React、Vue、Angular）
- 需要为应用的不同部分提供独立部署能力

### 问：qiankun 与其他微前端解决方案有何不同？

**答：** qiankun 提供了几个关键优势：

- **生产就绪**：由蚂蚁集团在大规模应用中构建和测试
- **框架无关**：适用于 React、Vue、Angular 和原生 JavaScript
- **强大的沙箱**：开箱即用的 JavaScript 和 CSS 隔离
- **HTML 入口**：使用 HTML 文件作为入口点的简单配置
- **丰富的生态系统**：UI 绑定、CLI 工具和 webpack 插件

### 问：我可以在现有应用中使用 qiankun 吗？

**答：** 可以！qiankun 旨在与现有应用一起工作。您可以：

1. **包装现有应用**：将当前应用转换为 qiankun 主应用
2. **增量迁移**：逐步将功能提取到微应用中
3. **遗留集成**：在新微应用旁边运行遗留应用
4. **框架迁移**：逐步从一个框架迁移到另一个框架

## 🔧 安装和设置

### 问：加载微应用时遇到 CORS 错误，如何修复？

**答：** CORS 错误在开发中很常见。以下是解决方案：

**对于 webpack dev server：**
```javascript
// webpack.config.js 或 vue.config.js
module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  }
};
```

**对于 Create React App（使用 CRACO）：**
```javascript
// craco.config.js
module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
};
```

**对于生产环境，配置您的服务器：**
```nginx
# nginx.conf
location / {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
}
```

### 问：我的微应用无法加载，应该检查什么？

**答：** 按照此故障排除清单：

1. **检查网络选项卡**：微应用资源是否有 404 错误？
2. **验证 CORS**：控制台中是否有 CORS 错误？
3. **检查入口点**：HTML 入口文件是否可访问？
4. **验证导出**：微应用是否导出了必需的生命周期方法？
5. **检查容器**：DOM 中是否存在容器元素？

**正确的微应用导出示例：**
```javascript
// 微应用入口文件
export async function bootstrap() {
  console.log('micro app bootstrapped');
}

export async function mount(props) {
  console.log('micro app mounted', props);
  // 您的应用挂载逻辑
}

export async function unmount(props) {
  console.log('micro app unmounted', props);
  // 您的应用清理逻辑
}
```

### 问：如何处理微应用的不同基础路径？

**答：** 在微应用中配置公共路径：

**对于 webpack：**
```javascript
// webpack.config.js
module.exports = {
  output: {
    publicPath: process.env.NODE_ENV === 'production' 
      ? 'https://mycdn.com/micro-app/' 
      : 'http://localhost:8080/'
  }
};
```

**对于运行时配置：**
```javascript
// 微应用中的 public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

## 🏗️ 架构和设计

### 问：我应该如何构建微前端架构？

**答：** 遵循以下架构原则：

**1. 领域驱动设计：**
```
主应用（Shell）
├── 用户管理（HR 领域）
├── 产品目录（商务领域）
├── 分析仪表板（BI 领域）
└── 设置（系统领域）
```

**2. 共享与独立：**
- **共享**：身份验证、导航、设计系统
- **独立**：业务逻辑、数据获取、内部状态

**3. 通信模式：**
```javascript
// 事件驱动通信
window.dispatchEvent(new CustomEvent('user-updated', { 
  detail: { userId: 123 } 
}));

// 基于属性的通信
registerMicroApps([{
  name: 'user-app',
  entry: '//localhost:8080',
  container: '#container',
  activeRule: '/users',
  props: { 
    userPermissions: currentUser.permissions,
    onUserUpdate: handleUserUpdate
  }
}]);
```

### 问：如何在微应用之间共享依赖？

**答：** 几种方法效果很好：

**1. 外部依赖（推荐）：**
```javascript
// webpack.config.js
module.exports = {
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'lodash': '_'
  }
};
```

**2. 模块联邦：**
```javascript
// 主应用 webpack 配置
new ModuleFederationPlugin({
  name: 'shell',
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
});
```

**3. CDN 方法：**
```html
<!-- 从 CDN 加载共享库 -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

### 问：微应用可以相互通信吗？

**答：** 可以，以下是推荐的模式：

**1. 事件驱动通信：**
```javascript
// 微应用 A
const notifyOtherApps = (data) => {
  window.dispatchEvent(new CustomEvent('app-a-event', { detail: data }));
};

// 微应用 B
window.addEventListener('app-a-event', (event) => {
  console.log('从应用 A 接收到:', event.detail);
});
```

**2. 共享状态管理：**
```javascript
// 全局存储
window.__SHARED_STORE__ = {
  user: null,
  subscribers: [],
  updateUser: (user) => {
    window.__SHARED_STORE__.user = user;
    window.__SHARED_STORE__.subscribers.forEach(callback => callback(user));
  }
};
```

**3. 来自主应用的属性：**
```javascript
// 主应用协调通信
const handleDataChange = (data) => {
  // 更新所有相关微应用的属性
  updateMicroAppProps('app-a', { sharedData: data });
  updateMicroAppProps('app-b', { sharedData: data });
};
```

## 🎨 样式和 CSS

### 问：微应用之间的 CSS 样式发生冲突，如何修复？

**答：** 使用 qiankun 的内置样式隔离：

**1. 内置样式隔离（CSS `@scope`）：**
```javascript
import { loadMicroApp } from 'qiankun';

loadMicroApp(app, {
  sandbox: {
    styleIsolation: true
  }
});
```

或者在注册应用时按应用配置：
```javascript
registerMicroApps([
  {
    name: 'my-app',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/my-app',
    configuration: {
      sandbox: {
        styleIsolation: true
      }
    }
  }
]);
```

**2. 手动 CSS 作用域：**
```css
/* 为所有样式添加前缀 */
.my-micro-app .button {
  background: blue;
}

.my-micro-app .container {
  padding: 20px;
}
```

查看我们的[样式隔离指南](/cookbook/style-isolation)获取全面的解决方案。

### 问：我可以在 qiankun 中使用 CSS-in-JS 库吗？

**答：** 当然可以！CSS-in-JS 库与 qiankun 配合得很好：

**Styled Components：**
```jsx
import styled from 'styled-components';

const Button = styled.button`
  background: blue;
  color: white;
`;
```

**Emotion：**
```jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const buttonStyle = css`
  background: blue;
  color: white;
`;
```

CSS-in-JS 提供天然隔离，因为样式作用域限定在组件中。

## 🔄 路由和导航

### 问：如何在微前端设置中处理路由？

**答：** qiankun 支持多种路由策略：

**1. 基于路由的微应用（推荐）：**
```javascript
registerMicroApps([
  {
    name: 'user-management',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/users' // 当路由以 /users 开头时加载
  },
  {
    name: 'product-catalog',
    entry: '//localhost:8081', 
    container: '#container',
    activeRule: ['/products', '/categories'] // 多个路由
  }
]);
```

**2. 编程式路由：**
```javascript
// 在微应用之间导航
import { navigateToUrl } from 'single-spa';

const navigateToUsers = () => {
  navigateToUrl('/users');
};
```

**3. 哈希路由：**
```javascript
registerMicroApps([
  {
    name: 'hash-app',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '#/app' // 基于哈希的路由
  }
]);
```

### 问：微应用可以有自己的内部路由吗？

**答：** 可以！每个微应用都可以有自己的内部路由器：

**React Router 示例：**
```jsx
// 在您的微应用中
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const basename = window.__POWERED_BY_QIANKUN__ ? '/users' : '/';
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<UserSettings />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 🚀 性能

### 问：我的微前端应用加载缓慢，如何提高性能？

**答：** 遵循这些优化策略：

**1. 启用预取：**
```javascript
start({
  prefetch: true // 或 'all' 或特定应用名称
});
```

**2. 使用代码分割：**
```javascript
// 微应用中的动态导入
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

**3. 优化包大小：**
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

查看我们的[性能优化指南](/cookbook/performance)获取详细策略。

### 问：如何防止微应用中的内存泄漏？

**答：** 实施适当的清理：

```javascript
// 微应用生命周期
export async function unmount() {
  // 清除定时器
  clearInterval(myInterval);
  
  // 移除事件监听器
  window.removeEventListener('resize', handleResize);
  
  // 清理订阅
  subscription.unsubscribe();
  
  // 清除缓存
  cache.clear();
}
```

## 🛠️ 开发和调试

### 问：如何在开发中调试微应用？

**答：** 使用这些调试策略：

**1. 启用源映射：**
```javascript
// webpack.config.js
module.exports = {
  devtool: 'source-map'
};
```

**2. 使用浏览器开发工具：**
- 网络选项卡：检查资源加载
- 控制台：查看错误消息
- 元素：检查 DOM 结构
- 源码：使用断点调试 JavaScript

**3. qiankun 调试：**
```javascript
// 启用详细日志
localStorage.setItem('qiankun:debug', true);
```

### 问：我可以在微应用中使用热重载吗？

**答：** 可以，需要一些配置：

**对于 webpack dev server：**
```javascript
// webpack.config.js
module.exports = {
  devServer: {
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
};
```

**注意**：热重载在每个微应用内工作，但主应用的更改可能需要完全刷新。

## 🔒 安全

### 问：如何处理跨微应用的身份验证？

**答：** 在主应用中集中身份验证：

**1. 基于令牌的身份验证：**
```javascript
// 主应用处理身份验证
const userToken = await authenticate(credentials);
localStorage.setItem('token', userToken);

// 将令牌传递给微应用
registerMicroApps([{
  name: 'secure-app',
  entry: '//localhost:8080',
  container: '#container',
  activeRule: '/secure',
  props: {
    token: userToken,
    user: currentUser
  }
}]);
```

**2. 共享身份验证状态：**
```javascript
// 全局身份验证状态
window.__AUTH_STATE__ = {
  user: currentUser,
  token: userToken,
  isAuthenticated: true
};
```

### 问：微前端是否存在安全问题？

**答：** 请注意这些安全考虑：

**1. 内容安全策略（CSP）：**
```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' https://trusted-cdn.com;">
```

**2. CORS 配置：**
- 只允许受信任的来源
- 正确验证请求
- 在生产中使用 HTTPS

**3. 依赖安全：**
- 定期审计依赖
- 使用 `npm audit` 等工具
- 保持依赖更新

## 📱 移动端和浏览器支持

### 问：qiankun 在移动设备上工作吗？

**答：** 可以，qiankun 在移动端工作，需要考虑：

**1. 触摸事件优化：**
```javascript
// 使用被动监听器
element.addEventListener('touchstart', handler, { passive: true });
```

**2. 视口管理：**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**3. 性能优化：**
- 减少包大小
- 使用懒加载
- 优化图片和资源

### 问：qiankun 支持哪些浏览器？

**答：** qiankun 支持现代浏览器：

- **Chrome**：49+
- **Firefox**：45+
- **Safari**：10+
- **Edge**：79+
- **IE**：不支持

对于较旧的浏览器，考虑使用 polyfill：
```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
```

## 🚢 部署

### 问：如何部署微前端应用？

**答：** 使用独立部署策略：

**1. 分别构建：**
```bash
# 独立构建每个应用
cd main-app && npm run build
cd micro-app-1 && npm run build  
cd micro-app-2 && npm run build
```

**2. CDN 部署：**
```javascript
// 为每个应用配置不同的 CDN
const microApps = [
  {
    name: 'app-1',
    entry: 'https://cdn1.example.com/app-1/',
    container: '#container',
    activeRule: '/app-1'
  },
  {
    name: 'app-2', 
    entry: 'https://cdn2.example.com/app-2/',
    container: '#container',
    activeRule: '/app-2'
  }
];
```

### 问：如何处理版本控制和更新？

**答：** 实施版本管理：

**1. 语义化版本：**
```javascript
// 每个微应用的 package.json
{
  "name": "user-management-app",
  "version": "1.2.3"
}
```

**2. 运行时版本检查：**
```javascript
const requiredVersion = '1.2.0';
const currentVersion = window.__MICRO_APP_VERSION__;

if (!semver.gte(currentVersion, requiredVersion)) {
  console.warn('微应用版本兼容性问题');
}
```

## 🔗 集成

### 问：我可以在服务端渲染（SSR）中使用 qiankun 吗？

**答：** 微前端的 SSR 很复杂但是可能的：

**1. 静态渲染：**
- 在服务器上渲染微应用
- 在客户端进行水合

**2. 考虑因素：**
- 每个微应用都需要 SSR 支持
- 应用之间的协调具有挑战性
- 性能影响

**替代方法：**
- 使用边缘侧包含（ESI）
- 在页面级别实施微前端
- 考虑客户端渲染与快速初始加载

### 问：如何将 qiankun 与现有构建工具集成？

**答：** qiankun 与各种构建工具配合使用：

**Webpack：** 使用 `@qiankunjs/webpack-plugin`
**Vite：** 使用 `vite-plugin-qiankun`
**Rollup：** 手动配置
**Parcel：** 手动配置

查看我们的[生态系统](/ecosystem/)部分了解特定集成。

## 🤝 社区和支持

### 问：如果我遇到困难，在哪里可以获得帮助？

**答：** 有多个支持渠道可用：

1. **GitHub Issues**：[umijs/qiankun](https://github.com/umijs/qiankun/issues)
2. **讨论**：GitHub 讨论用于提问
3. **Stack Overflow**：用 `qiankun` 标签提问
4. **Discord/Slack**：社区聊天室

### 问：我如何为 qiankun 做贡献？

**答：** 我们欢迎贡献：

1. **错误报告**：提交详细的问题报告
2. **功能请求**：提议新功能
3. **代码贡献**：提交拉取请求
4. **文档**：改进文档和示例
5. **社区**：帮助回答问题

查看我们的[贡献指南](https://github.com/umijs/qiankun/blob/master/CONTRIBUTING.md)了解详情。

---

## 📚 其他资源

- [完整 API 参考](/api/)
- [最佳实践指南](/cookbook/)
- [生态系统工具](/ecosystem/)
- [GitHub 仓库](https://github.com/umijs/qiankun)
- [示例应用](https://github.com/umijs/qiankun/tree/master/examples)

**找不到您要找的内容？** 请[提交问题](https://github.com/umijs/qiankun/issues/new)或开始[讨论](https://github.com/umijs/qiankun/discussions) - 我们在这里帮助您！ 