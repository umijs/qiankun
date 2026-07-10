# 运行时实现

这一部分解释 qiankun v3 的内部实现，面向贡献者、维护者，以及需要排查公共契约之外行为的读者。

接入微应用不需要先阅读这些页面。普通使用者应从[加载一个微应用实例](/zh-CN/concepts/architecture)开始，再通过[使用指南](/zh-CN/cookbook/)和 [API 参考](/zh-CN/api/)了解受支持的行为。

## 内容

- [运行时编排](/zh-CN/internals/runtime-orchestration)：公共加载 API 如何连接加载器、沙箱和生命周期。
- [生命周期解析](/zh-CN/internals/lifecycle-resolution)：Classic 与 ESM 导出如何成为生命周期对象。
- [流式 HTML Entry](/zh-CN/internals/streaming-html-entry)：流、DOM 提交、head 虚拟化和资源转换。
- [JavaScript 沙箱](/zh-CN/internals/js-sandbox)：隔离膜、隔间、patcher 和多实例状态。
- [样式隔离](/zh-CN/internals/style-isolation)：CSS 转换、外链样式和运行时 CSSOM 处理。
- [ESM 沙箱](/zh-CN/internals/esm-sandbox)：模块改写、运行时 import map、执行顺序和 realm 清理。

## 稳定性

这里出现的名称、源码路径和控制流都是实现细节，可能在没有公共 API 废弃通知的情况下变化。应用集成应依赖有文档的 API 和可观察行为，而不是这些内部实现。

需要跨实现长期保留的设计取舍记录在 [RFC](https://github.com/umijs/qiankun/tree/next/docs/rfcs) 中。
