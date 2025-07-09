# Frequently Asked Questions

This FAQ covers the most common questions and issues encountered when working with qiankun. If you can't find the answer you're looking for, please check our [GitHub Issues](https://github.com/umijs/qiankun/issues) or join our community discussions.

## 🚀 Getting Started

### Q: What is qiankun and when should I use it?

**A:** qiankun is a micro-frontend framework based on single-spa that enables you to build large-scale frontend applications by composing multiple smaller, independent applications. You should consider qiankun when:

- Your team is growing and you need to scale development across multiple teams
- You have legacy applications that need to coexist with new features
- You want to use different frameworks (React, Vue, Angular) in one application
- You need independent deployment capabilities for different parts of your app

### Q: How does qiankun differ from other micro-frontend solutions?

**A:** qiankun provides several key advantages:

- **Production-ready**: Built and tested by Ant Financial (now Ant Group) in large-scale applications
- **Framework agnostic**: Works with React, Vue, Angular, and vanilla JavaScript
- **Powerful sandboxing**: JavaScript and CSS isolation out of the box
- **HTML entry**: Simple configuration using HTML files as entry points
- **Rich ecosystem**: UI bindings, CLI tools, and webpack plugins

### Q: Can I use qiankun with existing applications?

**A:** Yes! qiankun is designed to work with existing applications. You can:

1. **Wrap existing apps**: Turn your current app into a qiankun main application
2. **Incremental migration**: Gradually extract features into micro applications
3. **Legacy integration**: Run legacy apps alongside new micro apps
4. **Framework migration**: Migrate from one framework to another progressively

## 🔧 Installation and Setup

### Q: I'm getting CORS errors when loading micro applications. How do I fix this?

**A:** CORS errors are common in development. Here are solutions:

**For webpack dev server:**
```javascript
// webpack.config.js or vue.config.js
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

**For Create React App (using CRACO):**
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

**For production, configure your server:**
```nginx
# nginx.conf
location / {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
}
```

### Q: My micro application won't load. What should I check?

**A:** Follow this troubleshooting checklist:

1. **Check the network tab**: Are there 404 errors for your micro app resources?
2. **Verify CORS**: Are there CORS errors in the console?
3. **Check the entry point**: Is your HTML entry file accessible?
4. **Validate the export**: Does your micro app export the required lifecycle methods?
5. **Check the container**: Is the container element present in the DOM?

**Example of correct micro app export:**
```javascript
// Micro app entry file
export async function bootstrap() {
  console.log('micro app bootstrapped');
}

export async function mount(props) {
  console.log('micro app mounted', props);
  // Your app mounting logic
}

export async function unmount(props) {
  console.log('micro app unmounted', props);
  // Your app cleanup logic
}
```

### Q: How do I handle different base paths for my micro applications?

**A:** Configure the public path in your micro applications:

**For webpack:**
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

**For runtime configuration:**
```javascript
// public-path.js in your micro app
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

## 🏗️ Architecture and Design

### Q: How should I structure my micro-frontend architecture?

**A:** Follow these architectural principles:

**1. Domain-driven design:**
```
Main App (Shell)
├── User Management (HR Domain)
├── Product Catalog (Commerce Domain)
├── Analytics Dashboard (BI Domain)
└── Settings (System Domain)
```

**2. Shared vs. Independent:**
- **Shared**: Authentication, navigation, design system
- **Independent**: Business logic, data fetching, internal state

**3. Communication patterns:**
```javascript
// Event-driven communication
window.dispatchEvent(new CustomEvent('user-updated', { 
  detail: { userId: 123 } 
}));

// Props-based communication
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

### Q: How do I share dependencies between micro applications?

**A:** Several approaches work well:

**1. External dependencies (recommended):**
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

**2. Module Federation:**
```javascript
// Main app webpack config
new ModuleFederationPlugin({
  name: 'shell',
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
});
```

**3. CDN approach:**
```html
<!-- Load shared libraries from CDN -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

### Q: Can micro applications communicate with each other?

**A:** Yes, here are the recommended patterns:

**1. Event-driven communication:**
```javascript
// Micro app A
const notifyOtherApps = (data) => {
  window.dispatchEvent(new CustomEvent('app-a-event', { detail: data }));
};

// Micro app B
window.addEventListener('app-a-event', (event) => {
  console.log('Received from app A:', event.detail);
});
```

**2. Shared state management:**
```javascript
// Global store
window.__SHARED_STORE__ = {
  user: null,
  subscribe: [],
  updateUser: (user) => {
    window.__SHARED_STORE__.user = user;
    window.__SHARED_STORE__.subscribers.forEach(callback => callback(user));
  }
};
```

**3. Props from main app:**
```javascript
// Main app coordinates communication
const handleDataChange = (data) => {
  // Update props for all relevant micro apps
  updateMicroAppProps('app-a', { sharedData: data });
  updateMicroAppProps('app-b', { sharedData: data });
};
```

## 🎨 Styling and CSS

### Q: My CSS styles are conflicting between micro applications. How do I fix this?

**A:** Use qiankun's built-in style isolation:

**1. Strict style isolation (Shadow DOM):**
```javascript
import { start } from 'qiankun';

start({
  sandbox: {
    strictStyleIsolation: true
  }
});
```

**2. Experimental style isolation (CSS scoping):**
```javascript
start({
  sandbox: {
    experimentalStyleIsolation: true
  }
});
```

**3. Manual CSS scoping:**
```css
/* Prefix all your styles */
.my-micro-app .button {
  background: blue;
}

.my-micro-app .container {
  padding: 20px;
}
```

See our [Style Isolation Guide](/cookbook/style-isolation) for comprehensive solutions.

### Q: Can I use CSS-in-JS libraries with qiankun?

**A:** Absolutely! CSS-in-JS libraries work great with qiankun:

**Styled Components:**
```jsx
import styled from 'styled-components';

const Button = styled.button`
  background: blue;
  color: white;
`;
```

**Emotion:**
```jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const buttonStyle = css`
  background: blue;
  color: white;
`;
```

CSS-in-JS provides natural isolation since styles are scoped to components.

## 🔄 Routing and Navigation

### Q: How do I handle routing in a micro-frontend setup?

**A:** qiankun supports multiple routing strategies:

**1. Route-based micro apps (recommended):**
```javascript
registerMicroApps([
  {
    name: 'user-management',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/users' // Loads when route starts with /users
  },
  {
    name: 'product-catalog',
    entry: '//localhost:8081', 
    container: '#container',
    activeRule: ['/products', '/categories'] // Multiple routes
  }
]);
```

**2. Programmatic routing:**
```javascript
// Navigate between micro apps
import { navigateToUrl } from 'single-spa';

const navigateToUsers = () => {
  navigateToUrl('/users');
};
```

**3. Hash routing:**
```javascript
registerMicroApps([
  {
    name: 'hash-app',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '#/app' // Hash-based routing
  }
]);
```

### Q: Can micro applications have their own internal routing?

**A:** Yes! Each micro application can have its own internal router:

**React Router example:**
```jsx
// In your micro app
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

## 🚀 Performance

### Q: My micro-frontend app is loading slowly. How can I improve performance?

**A:** Follow these optimization strategies:

**1. Enable prefetching:**
```javascript
start({
  prefetch: true // or 'all' or specific app names
});
```

**2. Use code splitting:**
```javascript
// Dynamic imports in micro apps
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

**3. Optimize bundle sizes:**
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

See our [Performance Optimization Guide](/cookbook/performance) for detailed strategies.

### Q: How do I prevent memory leaks in micro applications?

**A:** Implement proper cleanup:

```javascript
// Micro app lifecycle
export async function unmount() {
  // Clear timers
  clearInterval(myInterval);
  
  // Remove event listeners
  window.removeEventListener('resize', handleResize);
  
  // Clean up subscriptions
  subscription.unsubscribe();
  
  // Clear caches
  cache.clear();
}
```

## 🛠️ Development and Debugging

### Q: How do I debug micro applications in development?

**A:** Use these debugging strategies:

**1. Enable source maps:**
```javascript
// webpack.config.js
module.exports = {
  devtool: 'source-map'
};
```

**2. Use browser dev tools:**
- Network tab: Check resource loading
- Console: View error messages
- Elements: Inspect DOM structure
- Sources: Debug JavaScript with breakpoints

**3. qiankun debugging:**
```javascript
// Enable detailed logging
localStorage.setItem('qiankun:debug', true);
```

### Q: Can I use hot reload with micro applications?

**A:** Yes, with some configuration:

**For webpack dev server:**
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

**Note**: Hot reload works within each micro app, but changes to the main app may require a full refresh.

## 🔒 Security

### Q: How do I handle authentication across micro applications?

**A:** Centralize authentication in the main application:

**1. Token-based authentication:**
```javascript
// Main app handles auth
const userToken = await authenticate(credentials);
localStorage.setItem('token', userToken);

// Pass token to micro apps
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

**2. Shared authentication state:**
```javascript
// Global auth state
window.__AUTH_STATE__ = {
  user: currentUser,
  token: userToken,
  isAuthenticated: true
};
```

### Q: Are there security concerns with micro-frontends?

**A:** Be aware of these security considerations:

**1. Content Security Policy (CSP):**
```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' https://trusted-cdn.com;">
```

**2. CORS configuration:**
- Only allow trusted origins
- Validate requests properly
- Use HTTPS in production

**3. Dependency security:**
- Regularly audit dependencies
- Use tools like `npm audit`
- Keep dependencies updated

## 📱 Mobile and Browser Support

### Q: Does qiankun work on mobile devices?

**A:** Yes, qiankun works on mobile with considerations:

**1. Touch event optimization:**
```javascript
// Use passive listeners
element.addEventListener('touchstart', handler, { passive: true });
```

**2. Viewport management:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**3. Performance optimization:**
- Reduce bundle sizes
- Use lazy loading
- Optimize images and assets

### Q: Which browsers does qiankun support?

**A:** qiankun supports modern browsers:

- **Chrome**: 49+
- **Firefox**: 45+
- **Safari**: 10+
- **Edge**: 79+
- **IE**: Not supported

For older browsers, consider polyfills:
```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
```

## 🚢 Deployment

### Q: How do I deploy micro-frontend applications?

**A:** Use independent deployment strategy:

**1. Separate builds:**
```bash
# Build each app independently
cd main-app && npm run build
cd micro-app-1 && npm run build  
cd micro-app-2 && npm run build
```

**2. CDN deployment:**
```javascript
// Configure different CDNs for each app
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

### Q: How do I handle versioning and updates?

**A:** Implement version management:

**1. Semantic versioning:**
```javascript
// Package.json for each micro app
{
  "name": "user-management-app",
  "version": "1.2.3"
}
```

**2. Runtime version checking:**
```javascript
const requiredVersion = '1.2.0';
const currentVersion = window.__MICRO_APP_VERSION__;

if (!semver.gte(currentVersion, requiredVersion)) {
  console.warn('Micro app version compatibility issue');
}
```

## 🔗 Integration

### Q: Can I use qiankun with Server-Side Rendering (SSR)?

**A:** SSR with micro-frontends is complex but possible:

**1. Static rendering:**
- Render micro apps on the server
- Hydrate on the client

**2. Considerations:**
- Each micro app needs SSR support
- Coordination between apps is challenging
- Performance implications

**Alternative approaches:**
- Use edge-side includes (ESI)
- Implement micro-frontends at the page level
- Consider client-side rendering with fast initial loads

### Q: How do I integrate qiankun with existing build tools?

**A:** qiankun works with various build tools:

**Webpack:** Use `@qiankunjs/webpack-plugin`
**Vite:** Use `vite-plugin-qiankun`
**Rollup:** Manual configuration
**Parcel:** Manual configuration

See our [Ecosystem](/ecosystem/) section for specific integrations.

## 🤝 Community and Support

### Q: Where can I get help if I'm stuck?

**A:** Multiple support channels are available:

1. **GitHub Issues**: [umijs/qiankun](https://github.com/umijs/qiankun/issues)
2. **Discussions**: GitHub Discussions for questions
3. **Stack Overflow**: Tag questions with `qiankun`
4. **Discord/Slack**: Community chat rooms

### Q: How can I contribute to qiankun?

**A:** We welcome contributions:

1. **Bug reports**: Submit detailed issue reports
2. **Feature requests**: Propose new features
3. **Code contributions**: Submit pull requests
4. **Documentation**: Improve docs and examples
5. **Community**: Help answer questions

See our [Contributing Guide](https://github.com/umijs/qiankun/blob/master/CONTRIBUTING.md) for details.

---

## 📚 Additional Resources

- [Complete API Reference](/api/)
- [Best Practices Guide](/cookbook/)
- [Ecosystem Tools](/ecosystem/)
- [GitHub Repository](https://github.com/umijs/qiankun)
- [Example Applications](https://github.com/umijs/qiankun/tree/master/examples)

**Can't find what you're looking for?** Please [open an issue](https://github.com/umijs/qiankun/issues/new) or start a [discussion](https://github.com/umijs/qiankun/discussions) - we're here to help! 