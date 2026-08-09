# 样式隔离

样式隔离用于限制微应用 CSS 的作用范围，防止其匹配应用容器之外的元素。该功能按应用启用，并依赖浏览器原生的 CSS `@scope` 能力。

样式隔离配置在 sandbox 对象内部：JavaScript 沙箱默认开启，而 `sandbox.styleIsolation` 的默认值为 `false`。CSS 隔离归入沙箱，是因为动态注入的样式依赖沙箱的 DOM 拦截——若关闭 JS 沙箱却开启 CSS 隔离，这些动态样式会静默泄漏。

## 作用域模型

开启 `sandbox: { styleIsolation: true }` 后，qiankun 会将应用的 CSS 规则限定在由应用名标识的容器中。其效果相当于：

```css
@scope ([data-name="catalog"]) {
  /* 微应用的规则 */
}
```

微应用仍位于主文档中，不会被移入 Shadow DOM。因此，原有的文档级集成方式仍然有效，但需要遵守下文所述的单向隔离边界。

## 覆盖哪些样式

| 样式来源 | 开启隔离后的行为 |
| --- | --- |
| 内联 `<style>` | 规则只在应用容器内生效。 |
| 外部 `<link rel="stylesheet">` | qiankun 读取样式表，限定作用域后再将其应用。 |
| 运行时插入的规则与常见 CSS-in-JS 产物 | 与应用关联的规则会在插入时限定作用域。 |

外链样式表中的相对资源地址以该样式表的 URL 为基准解析。内联 `<style>` 中的相对地址不会按微应用入口重新解析，因此主应用与微应用的文档基准不同时应使用绝对 URL。如果无法为某个样式表安全地限定作用域，qiankun 不会降级为全局加载未隔离的 CSS。

## 单向边界

样式隔离仅阻止微应用规则向容器**外部**生效，不会阻止主应用样式、继承属性、浏览器默认样式或共享 CSS 自定义属性影响微应用。

使用 Portal 时需要特别注意：如果菜单、弹窗或提示层渲染到 `document.body` 而非微应用容器，它们将位于作用域根节点之外，应用的隔离选择器无法匹配这些元素。应优先将 Portal 挂载节点放置在 `props.container` 中，或单独为外部浮层提供样式。

::: info
样式隔离按应用配置。启用和未启用隔离的应用可以共存，但未隔离应用的 CSS 仍可能影响整个页面。
:::

## 要求与限制

- **需要浏览器原生支持 `@scope`。** qiankun 不提供兼容实现（polyfill）或降级方案；启用前请确认目标浏览器均支持该特性。
- **跨域样式表需要 CORS。** qiankun 必须能够读取样式内容。无法获取的样式表会被丢弃，不会以未隔离的形式加载到全局。
- **`@font-face` 仍是全局的。** 请为不同应用使用不同的 font-family 名称，避免冲突。
- **CSS 中声明的关键帧名称会被隔离。** 通过 JavaScript 动态拼接的动画名称不一定能同步改写，可能导致匹配失败。
- **应用容器之外的内容不在作用域内。** 这包括 Portal，以及由应用代码移至容器外的节点。
- **作用域按应用名区分，而非按实例句柄区分。** 并发实例使用相同的 `name` 时会共享作用域选择器；如果实例之间也需要隔离 CSS，请为它们使用不同名称。

## 开启方式

在需要隔离的应用上设置选项：

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app');
if (!container) throw new Error('micro-app container not found');

const microApp = loadMicroApp(
  {
    name: 'catalog',
    entry: 'https://catalog.example.com',
    container,
  },
  {
    sandbox: { styleIsolation: true },
  },
);
```

完整操作与验证见[启用 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation)，选项定义见 [AppConfiguration](/zh-CN/api/configuration)。维护者可以继续阅读[样式隔离实现](/zh-CN/internals/style-isolation)。
