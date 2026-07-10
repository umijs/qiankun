# 样式隔离

样式隔离用于阻止微应用声明的 CSS 匹配应用容器之外的元素。它按应用选择性开启，依赖浏览器原生的 CSS `@scope` 能力。

它和 JavaScript 隔离是两套独立机制：JS 沙箱默认开启，而 `styleIsolation` 默认是 `false`。

## 心智模型

开启 `styleIsolation: true` 后，qiankun 会把应用规则限制在由应用名标识的容器里。概念上相当于：

```css
@scope ([data-name="catalog"]) {
  /* 微应用的规则 */
}
```

微应用仍然位于主文档中，并不会被移进 Shadow DOM。因此原有的文档级集成仍可以工作，但会受到下文所说的单向边界约束。

## 覆盖哪些样式

| 样式来源 | 开启隔离后的行为 |
| --- | --- |
| 内联 `<style>` | 规则只在应用容器内生效。 |
| 外部 `<link rel="stylesheet">` | qiankun 读取样式表并限定作用域后再应用。 |
| 运行时插入的规则与常见 CSS-in-JS 产物 | 与应用关联的规则会在插入时限定作用域。 |

相对资源地址仍以样式表来源为基准解析。如果一张样式表无法被安全地限定作用域，qiankun 不会退回到让未隔离 CSS 全局生效。

## 单向边界

样式隔离阻止的是微应用规则向**外**泄漏。它不会阻止主应用样式、继承属性、浏览器默认样式或共享 CSS 自定义属性进入微应用。

Portal 需要特别留意。菜单、弹窗或提示层如果渲染到 `document.body`，而不是微应用容器中，它就位于 scope 根之外，应用的隔离选择器不会匹配它。应优先把 portal root 放进 `props.container`，或者显式为外部浮层提供样式。

::: info
隔离按应用配置。开启隔离和未开启隔离的应用可以共存，但未隔离应用的 CSS 仍可能影响整个页面。
:::

## 要求与限制

- **需要浏览器原生支持 `@scope`。** qiankun 不提供 polyfill 或回退方案；开启前请核对目标浏览器矩阵。
- **跨域样式表需要 CORS。** qiankun 必须能够读取其中的 CSS。无法抓取的样式表会被丢弃，而不会以未隔离的形式泄漏到全局。
- **`@font-face` 仍是全局的。** 请为不同应用使用不同的 font-family 名称，避免冲突。
- **CSS 中声明的 keyframe 名称会被隔离。** JavaScript 动态拼接出来的动画名无法总是同步修改，可能匹配失败。
- **应用容器之外的内容不在作用域内。** 这包括 portal，以及应用代码主动移动出去的节点。
- **作用域按应用名区分，而不是按实例句柄区分。** 并发实例复用同一个 `name` 时会共享作用域选择器；如果它们的 CSS 也必须彼此隔离，请使用不同名称。

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
    styleIsolation: true,
  },
);
```

完整操作与验证见[开启 CSS 样式隔离](/zh-CN/cookbook/enable-style-isolation)，选项定义见 [AppConfiguration](/zh-CN/api/configuration)。维护者可以继续阅读[样式隔离实现](/zh-CN/internals/style-isolation)。
