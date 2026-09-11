# module-rewrite-invalid：模块改写区间异常

## 触发原因

ESM 源码改写时，两个修改区间发生了不符合包含关系的部分重叠，或纯文本替换区间中出现了子修改区间。这表示引擎的内部改写约束未得到满足。

## 排查步骤

1. 保留原始模块源码、模块 URL、qiankun 版本和完整调用栈。
2. 根据报错位置缩小复现范围，保留涉及动态 `import()`、静态导入或 `import.meta` 的相关语法。
3. 检查是否把 qiankun 已经在运行时改写的代码再次作为原始源码输入。

## 解决办法

重复输入运行时产物时，应改为提供原始源码，或通过公开的 `precompileModuleSource` API 生成并传递完整模块描述符。

若合法的原始源码仍然触发此错误，请提交 qiankun 问题报告，附上最小复现和上述诊断信息。这可能需要修复引擎，不能保证通过通用业务配置解决，也不应删除内部校验来绕过错误。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [module-rewrite-invalid: Invalid module rewrite spans](/errors/module-rewrite-invalid)
