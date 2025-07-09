# Style Isolation

Style isolation is one of the most critical aspects of micro-frontend architecture. When multiple applications run in the same browser context, CSS conflicts can cause visual inconsistencies and broken layouts. This guide covers various strategies to achieve effective style isolation in qiankun applications.

## 🎯 Understanding the Problem

### CSS Conflicts in Micro-Frontends

When multiple micro applications are loaded into the same page, they share the same global CSS namespace. This can lead to:

- **Style Overriding**: Later-loaded applications overriding earlier styles
- **Selector Conflicts**: Same class names causing unintended styling
- **Global Pollution**: Micro apps affecting main application styles
- **Layout Breaks**: Unexpected layout changes due to conflicting styles

### Example of a CSS Conflict

```css
/* Main Application */
.button {
  background: blue;
  padding: 10px;
}

/* Micro Application */
.button {
  background: red; /* This will override main app styles! */
  border: none;
}
```

## 🛡️ qiankun's Built-in Style Isolation

qiankun provides several built-in style isolation mechanisms that you can enable through configuration.

### Strict Style Isolation

The most robust isolation method using Shadow DOM:

```javascript
import { start } from 'qiankun';

start({
  sandbox: {
    strictStyleIsolation: true
  }
});
```

**How it works:**
- Creates a Shadow DOM for each micro application
- Completely isolates styles between applications
- Prevents any style leakage

**Pros:**
- Complete style isolation
- No CSS conflicts possible
- Easy to implement

**Cons:**
- Some third-party libraries may not work properly
- Debugging can be more complex
- Performance overhead for large applications

### Experimental Style Isolation

A less intrusive approach using CSS scoping:

```javascript
import { start } from 'qiankun';

start({
  sandbox: {
    experimentalStyleIsolation: true
  }
});
```

**How it works:**
- Adds unique prefixes to CSS selectors
- Scopes styles to micro application containers
- Maintains DOM structure

**Pros:**
- Better third-party library compatibility
- Easier debugging
- Less performance overhead

**Cons:**
- Not as robust as strict isolation
- Some edge cases may still cause conflicts

## 🎨 CSS-in-JS Solutions

CSS-in-JS libraries provide natural style isolation by generating unique class names.

### Styled Components

```jsx
// Micro Application using Styled Components
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'grey'};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  
  &:hover {
    opacity: 0.8;
  }
`;

function MyComponent() {
  return (
    <div>
      <Button primary>Primary Button</Button>
      <Button>Secondary Button</Button>
    </div>
  );
}
```

### Emotion

```jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const buttonStyle = css`
  background: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  
  &:hover {
    background: darkblue;
  }
`;

function MyComponent() {
  return <button css={buttonStyle}>Click me</button>;
}
```

### CSS Modules with Dynamic Imports

```css
/* Button.module.css */
.button {
  background: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

.button:hover {
  background: darkblue;
}
```

```jsx
// Button.jsx
import styles from './Button.module.css';

function Button({ children, ...props }) {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
}
```

## 🏗️ CSS Scoping Strategies

### BEM Methodology

Use Block, Element, Modifier naming convention to avoid conflicts:

```css
/* Main Application */
.main-app__button {
  background: blue;
}

.main-app__button--primary {
  background: darkblue;
}

/* Micro Application */
.micro-app__button {
  background: red;
}

.micro-app__button--large {
  padding: 15px 30px;
}
```

### Namespace Prefixing

Add unique prefixes to all CSS classes:

```css
/* User Management Micro App */
.user-mgmt-container { }
.user-mgmt-header { }
.user-mgmt-button { }

/* Product Catalog Micro App */
.product-cat-container { }
.product-cat-header { }
.product-cat-button { }
```

### CSS Custom Properties (Variables)

Use CSS variables for consistent theming without conflicts:

```css
/* Main Application - Define theme variables */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
}

/* Micro Application - Use theme variables */
.micro-app-button {
  background: var(--primary-color);
  color: white;
}
```

## 🎭 Runtime Style Management

### Dynamic CSS Loading

Load CSS dynamically when micro applications mount:

```javascript
// Lifecycle hooks for dynamic CSS loading
const lifeCycles = {
  async beforeMount(app) {
    // Load micro app specific CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${app.entry}/static/css/main.css`;
    link.id = `${app.name}-styles`;
    document.head.appendChild(link);
  },
  
  async afterUnmount(app) {
    // Remove micro app CSS
    const link = document.getElementById(`${app.name}-styles`);
    if (link) {
      document.head.removeChild(link);
    }
  }
};

registerMicroApps([
  {
    name: 'micro-app',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/micro-app'
  }
], lifeCycles);
```

### CSS Scoping with PostCSS

Use PostCSS plugins to automatically scope CSS:

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-prefixwrap')('.micro-app-container')
  ]
};
```

**Input CSS:**
```css
.button {
  background: blue;
}
```

**Output CSS:**
```css
.micro-app-container .button {
  background: blue;
}
```

## 🔧 Framework-Specific Solutions

### React Applications

#### Using CSS Modules with Create React App

```javascript
// Button.module.css
.button {
  background: blue;
  color: white;
}

// Button.jsx
import styles from './Button.module.css';

function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

#### Custom CSS Prefix Hook

```javascript
import { useMemo } from 'react';

function useCSSPrefix(prefix) {
  return useMemo(() => {
    return (className) => `${prefix}-${className}`;
  }, [prefix]);
}

// Usage
function MyComponent() {
  const cx = useCSSPrefix('user-mgmt');
  
  return (
    <div className={cx('container')}>
      <button className={cx('button')}>Click me</button>
    </div>
  );
}
```

### Vue Applications

#### Scoped Styles

```vue
<template>
  <div class="component">
    <button class="button">Click me</button>
  </div>
</template>

<style scoped>
.component {
  padding: 20px;
}

.button {
  background: blue;
  color: white;
}
</style>
```

#### CSS Modules in Vue

```vue
<template>
  <div :class="$style.component">
    <button :class="$style.button">Click me</button>
  </div>
</template>

<style module>
.component {
  padding: 20px;
}

.button {
  background: blue;
  color: white;
}
</style>
```

### Angular Applications

#### ViewEncapsulation

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `
    <div class="component">
      <button class="button">Click me</button>
    </div>
  `,
  styles: [`
    .component {
      padding: 20px;
    }
    .button {
      background: blue;
      color: white;
    }
  `],
  encapsulation: ViewEncapsulation.Emulated // Default
})
export class MyComponent { }
```

## 🎪 Component Library Strategies

### Design System Approach

Create a shared design system that all micro applications consume:

```javascript
// shared-design-system/Button.js
export const Button = ({ variant = 'primary', size = 'medium', children, ...props }) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary'
  };
  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  };
  
  const className = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size]
  ].join(' ');
  
  return <button className={className} {...props}>{children}</button>;
};
```

### CSS Custom Properties for Theming

```css
/* Design system CSS */
:root {
  --btn-primary-bg: #007bff;
  --btn-primary-color: white;
  --btn-secondary-bg: #6c757d;
  --btn-secondary-color: white;
  --btn-padding-sm: 8px 12px;
  --btn-padding-md: 10px 16px;
  --btn-padding-lg: 12px 20px;
}

.btn {
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
}

.btn-primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-color);
}

.btn-secondary {
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-color);
}

.btn-sm { padding: var(--btn-padding-sm); }
.btn-md { padding: var(--btn-padding-md); }
.btn-lg { padding: var(--btn-padding-lg); }
```

## 🚫 Third-Party Library Handling

### Isolating Third-Party Styles

When using third-party libraries that inject global styles:

```javascript
// Load third-party CSS in isolation
const loadLibraryStyles = (libraryName, cssUrl) => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument;
    const link = iframeDoc.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    link.onload = () => {
      // Extract and scope the CSS
      const styles = Array.from(iframeDoc.styleSheets[0].cssRules)
        .map(rule => rule.cssText)
        .join('\n');
      
      const scopedStyles = scopeCSS(styles, `.${libraryName}-container`);
      
      const style = document.createElement('style');
      style.textContent = scopedStyles;
      style.id = `${libraryName}-scoped-styles`;
      document.head.appendChild(style);
      
      document.body.removeChild(iframe);
      resolve();
    };
    iframeDoc.head.appendChild(link);
  });
};
```

### CSS-in-JS for Third-Party Integration

```javascript
import { createGlobalStyle } from 'styled-components';

// Scope third-party styles to specific container
const AntdStyles = createGlobalStyle`
  .micro-app-container {
    .ant-btn {
      /* Override Ant Design button styles specifically for this micro app */
      border-radius: 8px;
    }
    
    .ant-table {
      /* Override Ant Design table styles */
      border: 1px solid #f0f0f0;
    }
  }
`;

function MicroApp() {
  return (
    <div className="micro-app-container">
      <AntdStyles />
      {/* Your micro app content */}
    </div>
  );
}
```

## 🔍 Debugging Style Conflicts

### Development Tools

#### Style Inspection Script

```javascript
// Add to browser console for debugging
const findStyleConflicts = (selector) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((el, index) => {
    const styles = window.getComputedStyle(el);
    const rules = [];
    
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        const cssRules = sheet.cssRules || sheet.rules;
        
        for (let j = 0; j < cssRules.length; j++) {
          if (el.matches(cssRules[j].selectorText)) {
            rules.push({
              selector: cssRules[j].selectorText,
              rule: cssRules[j].cssText,
              sheet: sheet.href || 'inline'
            });
          }
        }
      } catch (e) {
        // Cross-origin stylesheet
      }
    }
    
    console.log(`Element ${index + 1}:`, el);
    console.log('Applied styles:', rules);
  });
};

// Usage: findStyleConflicts('.button');
```

#### Style Source Tracker

```javascript
// Track which micro app loaded which styles
const styleTracker = {
  styles: new Map(),
  
  track(appName, styleElement) {
    if (!this.styles.has(appName)) {
      this.styles.set(appName, []);
    }
    this.styles.get(appName).push(styleElement);
  },
  
  getByApp(appName) {
    return this.styles.get(appName) || [];
  },
  
  getConflicts() {
    const allSelectors = new Map();
    
    this.styles.forEach((styles, appName) => {
      styles.forEach(style => {
        // Parse CSS and check for selector conflicts
        // Implementation depends on CSS parser
      });
    });
    
    return allSelectors;
  }
};
```

### Runtime Conflict Detection

```javascript
// Detect style conflicts at runtime
const detectStyleConflicts = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'STYLE' || node.tagName === 'LINK') {
            checkForConflicts(node);
          }
        });
      }
    });
  });
  
  observer.observe(document.head, { childList: true });
};

const checkForConflicts = (styleNode) => {
  // Implementation to check for CSS selector conflicts
  console.warn('New style node added:', styleNode);
};
```

## 📊 Performance Considerations

### CSS Loading Performance

```javascript
// Optimize CSS loading for micro applications
const optimizedCSSLoader = {
  cache: new Map(),
  
  async loadCSS(url, appName) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }
    
    const response = await fetch(url);
    const css = await response.text();
    const optimizedCSS = this.optimizeCSS(css, appName);
    
    this.cache.set(url, optimizedCSS);
    return optimizedCSS;
  },
  
  optimizeCSS(css, appName) {
    // Remove unused selectors
    // Add app-specific prefixes
    // Minify if needed
    return css.replace(/(\.[a-zA-Z-_]+)/g, `.${appName}-$1`);
  }
};
```

### Bundle Splitting for Styles

```javascript
// webpack.config.js - Split CSS by micro app
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
};
```

## 🎯 Best Practices Summary

### ✅ Do's

1. **Use qiankun's built-in isolation** when possible
2. **Implement consistent naming conventions** (BEM, namespacing)
3. **Use CSS-in-JS** for automatic isolation
4. **Create a shared design system** for consistency
5. **Test style isolation** in development
6. **Monitor for conflicts** in production
7. **Document style guidelines** for your team

### ❌ Don'ts

1. **Don't rely on global CSS** in micro applications
2. **Don't use overly generic class names** (.button, .container)
3. **Don't forget to clean up styles** when unmounting
4. **Don't ignore third-party library styles**
5. **Don't skip testing** style isolation
6. **Don't use !important** unless absolutely necessary

### 🎪 Real-World Example

Here's a complete example of a well-isolated micro application:

```jsx
// MicroApp.jsx
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// Global styles scoped to this micro app
const GlobalStyles = createGlobalStyle`
  .user-management-app {
    font-family: 'Inter', sans-serif;
    
    * {
      box-sizing: border-box;
    }
  }
`;

// Styled components with isolation
const Container = styled.div`
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.h1`
  color: #343a40;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

function UserManagementApp() {
  return (
    <div className="user-management-app">
      <GlobalStyles />
      <Container>
        <Header>User Management</Header>
        <Button primary>Add User</Button>
        <Button>Cancel</Button>
      </Container>
    </div>
  );
}

export default UserManagementApp;
```

## 🔗 Related Documentation

- [Performance Optimization](/cookbook/performance) - Optimize loading and runtime performance
- [Error Handling](/cookbook/error-handling) - Handle CSS-related errors
- [Configuration](/api/configuration) - Configure style isolation options
- [Debugging](/cookbook/debugging) - Debug style conflicts 