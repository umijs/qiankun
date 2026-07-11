# 运行时实现

本节介绍 qiankun v3 的内部实现，供贡献者、维护者以及需要排查公共 API 未覆盖行为的读者参考。

接入微应用无需预先阅读本节。使用者应从[加载一个微应用实例](/zh-CN/concepts/architecture)开始，再通过[使用指南](/zh-CN/cookbook/)和 [API 参考](/zh-CN/api/)了解受支持的功能与行为。

## 内容

- [运行时编排](/zh-CN/internals/runtime-orchestration)：公共加载 API 如何组织加载器、沙箱和生命周期。
- [生命周期解析](/zh-CN/internals/lifecycle-resolution)：Classic 与 ESM 导出如何成为生命周期对象。
- [HTML 入口流式加载](/zh-CN/internals/streaming-html-entry)：响应流、DOM 提交、`<head>` 虚拟化和资源转换。
- [JavaScript 沙箱](/zh-CN/internals/js-sandbox)：隔离膜、隔间、补丁模块（patcher）和多实例隔离。
- [样式隔离](/zh-CN/internals/style-isolation)：CSS 转换、外链样式和运行时 CSSOM 处理。
- [ESM 沙箱](/zh-CN/internals/esm-sandbox)：模块改写、运行时 `import map`、执行顺序和 Realm 清理。

## 稳定性

本节涉及的名称、源码路径和控制流程均属于实现细节，可能在不发布公共 API 废弃通知的情况下变化。应用集成应仅依赖文档明确说明的 API 和行为，不应依赖内部实现。

需要长期保留的设计决策记录在 [RFC](https://github.com/umijs/qiankun/tree/next/docs/rfcs) 中。
