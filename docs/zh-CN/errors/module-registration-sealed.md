# module-registration-sealed：文档模块注册已结束

## 触发原因

第一次调用 `importDocumentModules()` 后，文档模块集合即停止接受注册。此后继续调用 `registerDocumentModule()` 会抛出此错误。

## 排查步骤

1. 检查自定义加载器或流式集成中这两个方法的调用顺序。
2. 确认是否在所有文档模块注册完成前，就开始调用 `importDocumentModules()`。
3. 检查异步回调是否在导入开始后又提交了新的文档模块。

## 解决办法

先注册本轮文档中的全部模块，再统一调用 `importDocumentModules()`。后续需要按需加载的模块，应通过 Compartment 的 `import()` 或 `load()` 处理。已经结束的文档模块注册阶段不能重新打开。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [module-registration-sealed: Document module registration is closed](/errors/module-registration-sealed)
