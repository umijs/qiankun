# Qiankun E2E 测试可行性分析报告

## 项目概况

### 项目基本信息
- **项目名称**: qiankun (乾坤)
- **项目类型**: 微前端框架
- **技术栈**: TypeScript + Monorepo (pnpm workspace)
- **分支**: next (3.0.0-rc.19)
- **测试框架**: Vitest (单元测试)
- **构建工具**: Father + Webpack

### 当前测试状态
- ✅ **单元测试**: 已实现，使用 Vitest
  - `packages/shared`: 10个测试用例
  - `packages/webpack-plugin`: 2个测试用例
- ❌ **集成测试**: 未实现
- ❌ **E2E测试**: 未实现

## 项目架构分析

### Monorepo 结构
```
qiankun/
├── packages/                    # 核心包
│   ├── qiankun/                # 主包 - 核心API
│   ├── loader/                 # 资源加载器
│   ├── sandbox/                # JS沙箱
│   ├── shared/                 # 共享工具
│   ├── webpack-plugin/         # Webpack插件
│   └── ui-bindings/           # UI框架绑定 (React/Vue)
└── examples/                   # 示例应用
    ├── main/                  # 主应用
    ├── react15/               # React 15 微应用
    ├── react16/               # React 16 微应用
    ├── vue/                   # Vue 2 微应用
    ├── vue3/                  # Vue 3 微应用
    ├── angular9/              # Angular 9 微应用
    ├── vite/                  # Vite 微应用
    └── purehtml/              # 纯HTML微应用
```

### 核心功能特性
1. **微应用加载**: `loadMicroApp`, `registerMicroApps`
2. **沙箱隔离**: JS沙箱、样式隔离
3. **资源预加载**: prefetch 机制
4. **生命周期管理**: bootstrap, mount, unmount
5. **多技术栈支持**: React, Vue, Angular, Pure HTML
6. **路由系统**: 基于 single-spa 的路由管理

## E2E 测试场景设计

### 1. 核心功能测试

#### 1.1 微应用生命周期测试
```typescript
// 测试场景
describe('微应用生命周期', () => {
  test('应用正常加载和卸载', async () => {
    // 导航到微应用
    // 验证应用加载完成
    // 切换到其他应用
    // 验证应用正确卸载
  });
  
  test('应用重复加载', async () => {
    // 多次加载同一应用
    // 验证不会重复初始化
  });
});
```

#### 1.2 多应用切换测试
```typescript
describe('多应用切换', () => {
  test('React <-> Vue 应用切换', async () => {
    // 加载React应用
    // 切换到Vue应用
    // 验证状态隔离
    // 验证样式隔离
  });
  
  test('并发加载多个应用', async () => {
    // 同时加载多个微应用
    // 验证资源加载正确性
  });
});
```

#### 1.3 沙箱隔离测试
```typescript
describe('沙箱隔离', () => {
  test('JS全局变量隔离', async () => {
    // 在微应用中设置全局变量
    // 切换应用后验证隔离性
  });
  
  test('CSS样式隔离', async () => {
    // 验证不同应用的样式不相互影响
  });
});
```

### 2. 技术栈兼容性测试

#### 2.1 框架兼容性
- React 15/16/18 微应用
- Vue 2/3 微应用
- Angular 9+ 微应用
- 纯 HTML/JS 应用
- Vite 构建的应用

#### 2.2 路由系统测试
```typescript
describe('路由系统', () => {
  test('History模式路由', async () => {
    // 测试历史路由导航
    // 验证URL同步
  });
  
  test('Hash模式路由', async () => {
    // 测试Hash路由
  });
});
```

### 3. 性能测试

#### 3.1 加载性能
```typescript
describe('性能测试', () => {
  test('首次加载时间', async () => {
    // 测量应用首次加载时间
  });
  
  test('资源预加载效果', async () => {
    // 验证prefetch机制
  });
});
```

#### 3.2 内存泄漏测试
```typescript
describe('内存管理', () => {
  test('应用卸载后内存释放', async () => {
    // 监控内存使用情况
    // 验证应用卸载后内存回收
  });
});
```

### 4. 错误处理测试

#### 4.1 网络错误
```typescript
describe('错误处理', () => {
  test('微应用加载失败', async () => {
    // 模拟网络错误
    // 验证错误处理机制
  });
  
  test('微应用运行时错误', async () => {
    // 模拟运行时错误
    // 验证错误隔离
  });
});
```

## 技术可行性分析

### 1. Playwright 适配性 ⭐⭐⭐⭐⭐

#### 优势
- ✅ **多浏览器支持**: Chromium, Firefox, WebKit
- ✅ **现代Web特性**: 支持SPA、动态加载
- ✅ **并发测试**: 支持多个浏览器上下文
- ✅ **网络拦截**: 可模拟各种网络状况
- ✅ **移动端测试**: 支持移动设备模拟
- ✅ **视觉测试**: 截图对比
- ✅ **调试支持**: 录制、回放、调试工具

#### 微前端特性支持
- ✅ **动态脚本加载**: 支持监听动态script标签
- ✅ **iframe替代方案**: 支持测试非iframe微前端
- ✅ **跨域测试**: 支持跨域场景测试
- ✅ **沙箱环境**: 可验证JS沙箱隔离效果

### 2. 项目集成难度 ⭐⭐⭐⭐

#### 当前优势
- ✅ **Monorepo结构**: 便于统一管理
- ✅ **示例应用完整**: 有现成的测试环境
- ✅ **TypeScript**: 类型安全
- ✅ **现代构建工具**: 支持ES模块

#### 集成挑战
- ⚠️ **依赖管理**: 需要管理多个示例应用的启动
- ⚠️ **端口管理**: 多个应用需要不同端口
- ⚠️ **测试数据**: 需要准备测试数据和状态

### 3. 测试环境复杂度 ⭐⭐⭐

#### 环境要求
- 需要同时运行主应用和多个微应用
- 不同技术栈的应用需要不同的启动方式
- 需要模拟真实的网络环境

#### 示例应用分析
当前已有的示例应用：
```bash
# 主应用 (端口未知)
examples/main/

# 微应用
examples/react15/     # 端口 7102
examples/react16/     # 端口 7100  
examples/vue/         # Vue 2
examples/vue3/        # Vue 3
examples/angular9/    # Angular 9
examples/vite/        # Vite应用
examples/purehtml/    # 纯HTML
```

## 实施方案

### 1. 项目结构设计

```
qiankun/
├── e2e/                        # E2E测试目录
│   ├── tests/                  # 测试用例
│   │   ├── core/              # 核心功能测试
│   │   ├── compatibility/     # 兼容性测试
│   │   ├── performance/       # 性能测试
│   │   └── integration/       # 集成测试
│   ├── fixtures/              # 测试夹具
│   ├── utils/                 # 测试工具
│   ├── playwright.config.ts   # Playwright配置
│   └── setup/                 # 测试环境设置
├── scripts/                   # 脚本目录
│   ├── start-test-apps.js     # 启动测试应用脚本
│   └── e2e-setup.js          # E2E环境配置
```

### 2. 依赖配置

#### 2.1 根目录 package.json 更新
```json
{
  "devDependencies": {
    "@playwright/test": "^1.42.0",
    "concurrently": "^8.2.0",
    "wait-on": "^7.2.0"
  },
  "scripts": {
    "e2e": "playwright test",
    "e2e:headed": "playwright test --headed",
    "e2e:debug": "playwright test --debug",
    "test:all": "pnpm test && pnpm e2e",
    "start:test-env": "node scripts/start-test-apps.js"
  }
}
```

#### 2.2 Playwright 配置
```typescript
// e2e/playwright.config.ts
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:7099',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm start:test-env',
    port: 7099,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. 测试环境管理

#### 3.1 应用启动脚本
```javascript
// scripts/start-test-apps.js
const concurrently = require('concurrently');

const apps = [
  {
    name: 'main',
    command: 'cd examples/main && npm start',
    port: 7099
  },
  {
    name: 'react16',
    command: 'cd examples/react16 && npm start',
    port: 7100
  },
  {
    name: 'react15',
    command: 'cd examples/react15 && npm start',
    port: 7102
  },
  // ... 其他应用
];

concurrently(
  apps.map(app => ({
    command: app.command,
    name: app.name,
    prefixColor: 'auto'
  })),
  {
    killOthers: ['failure', 'success'],
    restartTries: 3,
  }
);
```

### 4. 测试用例实现示例

#### 4.1 基础测试用例
```typescript
// e2e/tests/core/basic-loading.spec.ts
import { test, expect } from '@playwright/test';

test.describe('微应用基础加载', () => {
  test('主应用正常启动', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('QianKun');
    await expect(page.locator('.mainapp-sidemenu')).toBeVisible();
  });

  test('React16 微应用加载', async ({ page }) => {
    await page.goto('/');
    
    // 点击React16菜单
    await page.click('[data-value="react16"]');
    
    // 等待微应用加载
    await page.waitForSelector('#subapp-container [data-testid="react16-app"]');
    
    // 验证应用内容
    await expect(page.locator('#subapp-container')).toContainText('React 16 App');
  });

  test('应用切换功能', async ({ page }) => {
    await page.goto('/');
    
    // 加载React16应用
    await page.click('[data-value="react16"]');
    await page.waitForSelector('#subapp-container [data-testid="react16-app"]');
    
    // 切换到React15应用
    await page.click('[data-value="react15"]');
    await page.waitForSelector('#subapp-container [data-testid="react15-app"]');
    
    // 验证React16应用已卸载
    await expect(page.locator('[data-testid="react16-app"]')).toHaveCount(0);
  });
});
```

#### 4.2 沙箱隔离测试
```typescript
// e2e/tests/core/sandbox.spec.ts
import { test, expect } from '@playwright/test';

test.describe('沙箱隔离测试', () => {
  test('全局变量隔离', async ({ page }) => {
    await page.goto('/');
    
    // 在React16中设置全局变量
    await page.click('[data-value="react16"]');
    await page.waitForSelector('[data-testid="react16-app"]');
    
    await page.evaluate(() => {
      (window as any).testVar = 'react16-value';
    });
    
    // 切换到React15
    await page.click('[data-value="react15"]');
    await page.waitForSelector('[data-testid="react15-app"]');
    
    // 验证全局变量隔离
    const globalVar = await page.evaluate(() => (window as any).testVar);
    expect(globalVar).toBeUndefined();
  });

  test('CSS样式隔离', async ({ page }) => {
    await page.goto('/');
    
    // 测试不同应用的样式不相互影响
    await page.click('[data-value="react16"]');
    await page.waitForSelector('[data-testid="react16-app"]');
    
    const react16Style = await page.locator('[data-testid="react16-app"]').evaluate(
      el => getComputedStyle(el).color
    );
    
    await page.click('[data-value="react15"]');
    await page.waitForSelector('[data-testid="react15-app"]');
    
    const react15Style = await page.locator('[data-testid="react15-app"]').evaluate(
      el => getComputedStyle(el).color
    );
    
    expect(react16Style).not.toBe(react15Style);
  });
});
```

#### 4.3 性能测试
```typescript
// e2e/tests/performance/loading.spec.ts
import { test, expect } from '@playwright/test';

test.describe('性能测试', () => {
  test('首次加载性能', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.click('[data-value="react16"]');
    await page.waitForSelector('[data-testid="react16-app"]');
    
    const loadTime = Date.now() - startTime;
    
    // 验证加载时间在合理范围内（5秒内）
    expect(loadTime).toBeLessThan(5000);
  });

  test('内存使用监控', async ({ page, context }) => {
    await page.goto('/');
    
    // 获取初始内存使用
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    // 加载多个应用
    await page.click('[data-value="react16"]');
    await page.waitForSelector('[data-testid="react16-app"]');
    
    await page.click('[data-value="react15"]');
    await page.waitForSelector('[data-testid="react15-app"]');
    
    // 检查内存使用是否在合理范围
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });
    
    const memoryIncrease = finalMemory - initialMemory;
    console.log(`Memory increase: ${memoryIncrease} bytes`);
    
    // 内存增长应该在合理范围内（例如50MB）
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });
});
```

### 5. CI/CD 集成

#### 5.1 GitHub Actions 更新
```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  pull_request:
  push:
    branches: [main, next]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 'lts/*'
          cache: 'pnpm'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Build packages
        run: pnpm build
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run E2E tests
        run: pnpm e2e
        
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: e2e/playwright-report/
```

## 成本效益分析

### 1. 开发成本 💰💰💰

#### 人力成本
- **初期开发**: 2-3人周 (设置环境、基础测试)
- **完整实现**: 4-6人周 (全面测试用例)
- **维护成本**: 0.5-1人周/月

#### 技术成本
- Playwright 依赖包: ~200MB
- CI 运行时间增加: +10-15分钟
- 额外存储需求: 测试报告、截图等

### 2. 收益分析 📈📈📈📈📈

#### 直接收益
- ✅ **回归测试自动化**: 减少手动测试时间80%
- ✅ **发布质量提升**: 减少线上bug 60-70%
- ✅ **开发信心**: 重构和新功能开发更安全
- ✅ **文档价值**: 测试用例即活文档

#### 间接收益
- ✅ **品牌价值**: 提升开源项目的专业形象
- ✅ **社区贡献**: 为微前端E2E测试提供最佳实践
- ✅ **开发体验**: 提前发现集成问题

### 3. 风险评估 ⚠️

#### 技术风险
- 🔶 **环境复杂性**: 多应用启动可能不稳定
- 🔶 **测试脆弱性**: 微前端动态加载可能导致测试不稳定
- 🔶 **维护负担**: 测试用例需要跟随功能更新

#### 缓解措施
- ✅ **重试机制**: Playwright自带重试
- ✅ **并发控制**: CI环境限制并发数
- ✅ **测试分层**: 分为冒烟测试和完整测试

## 实施建议

### 1. 分阶段实施 🎯

#### 第一阶段 (1-2周): 基础设施
- [ ] 配置 Playwright 环境
- [ ] 实现测试应用启动脚本
- [ ] 创建基础测试用例 (3-5个)
- [ ] 集成到 CI/CD

#### 第二阶段 (2-3周): 核心功能
- [ ] 微应用生命周期测试
- [ ] 多应用切换测试
- [ ] 沙箱隔离测试
- [ ] 基础性能测试

#### 第三阶段 (1-2周): 扩展功能
- [ ] 多技术栈兼容性测试
- [ ] 错误处理测试
- [ ] 高级性能测试
- [ ] 可视化回归测试

### 2. 优先级排序 📋

#### 高优先级 🔴
1. 基本的应用加载和切换测试
2. 沙箱隔离核心功能测试
3. React/Vue 主要技术栈测试

#### 中优先级 🟡
1. 性能测试
2. 错误处理测试
3. Angular 应用测试

#### 低优先级 🟢
1. 视觉回归测试
2. 移动端适配测试
3. 极端边界情况测试

### 3. 团队配置建议 👥

#### 理想团队构成
- **项目负责人**: 1人 (整体规划和协调)
- **前端测试工程师**: 1-2人 (测试用例开发)
- **DevOps工程师**: 0.5人 (CI/CD集成)

#### 技能要求
- Playwright 测试框架经验
- 微前端架构理解
- TypeScript/JavaScript 熟练
- CI/CD 配置经验

## 结论

### 可行性评估: ⭐⭐⭐⭐⭐ (强烈推荐)

qiankun 项目具备了实施 Playwright E2E 测试的优秀条件：

1. **技术匹配度高**: Playwright 完美支持微前端测试场景
2. **项目基础良好**: Monorepo结构、完整示例应用、TypeScript
3. **测试价值巨大**: 微前端的复杂性需要E2E测试保障
4. **实施成本可控**: 预计4-6人周可完成完整实施

### 关键成功因素

1. **环境稳定性**: 确保测试环境的稳定性和可复现性
2. **测试策略**: 合理的测试分层和优先级划分
3. **团队技能**: 团队具备相关技术栈经验
4. **持续维护**: 建立测试用例的维护机制

### 建议行动

**强烈建议立即启动 E2E 测试项目**，作为 qiankun 3.0 版本的重要质量保障措施。建议从基础功能测试开始，逐步扩展到完整的测试覆盖。

这不仅能提升 qiankun 的代码质量，还能为整个微前端社区提供 E2E 测试的最佳实践参考。