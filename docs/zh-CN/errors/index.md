# 错误码与解决办法

qiankun 自身抛出的 `QiankunError` 带有稳定的 `code` 属性，消息末尾附有对应解决方案的官网链接。开发和生产构建均保留完整错误消息及动态上下文，不压缩错误内容。

[English](/errors/)

## 识别框架错误

```ts
import { loadMicroApp, QiankunError } from 'qiankun';

const microApp = loadMicroApp({ name, entry, container });

void microApp.mountPromise.catch((error: unknown) => {
  if (error instanceof QiankunError) {
    console.error(error.code, error.message);
  } else {
    console.error(error);
  }
});
```

loader、沙箱和共享模块使用同一个 `QiankunError` 构造函数。微应用自身、浏览器或 single-spa 也可能抛出其他类型的错误，调用方应一并处理。

## 函数签名

```ts
import { type QiankunErrorCode } from 'qiankun';

declare class QiankunError extends Error {
  readonly code: QiankunErrorCode;
  constructor(message: string, code?: QiankunErrorCode);
}
```

`code` 默认值为 `custom-error`，保留只传 `message` 的用法。实例上的 `code` 为只读属性；`message` 保留 `[qiankun]: ` 前缀，末尾追加换行和 `See https://www.qiankunjs.com/zh-CN/errors/<code>`。错误链接统一指向中文页，各页提供英文入口。

## 错误码约定

错误码使用小写英文单词和连字符，按触发原因与解决方法命名。同一原因在不同包出现时共用错误码；文件移动、文案调整或新增其他错误均不改变已有错误码。程序判断请使用 `error.code`，避免依赖完整错误消息。框架内部的抛错点均显式指定错误码；调用方未指定时使用 `custom-error`。

## 错误码索引

<!-- code-index -->

- [custom-error：调用方自定义错误](/zh-CN/errors/custom-error)
- [lifecycle-missing：生命周期导出不完整](/zh-CN/errors/lifecycle-missing)
- [entry-duplicate：入口脚本重复](/zh-CN/errors/entry-duplicate)
- [entry-script-failed：入口脚本加载失败](/zh-CN/errors/entry-script-failed)
- [entry-body-missing：入口响应缺少正文流](/zh-CN/errors/entry-body-missing)
- [container-required：缺少应用容器](/zh-CN/errors/container-required)
- [container-head-missing：容器内缺少 head 节点](/zh-CN/errors/container-head-missing)
- [module-hooks-conflict：模块加载钩子冲突](/zh-CN/errors/module-hooks-conflict)
- [compartment-disposed：隔离实例已销毁](/zh-CN/errors/compartment-disposed)
- [module-descriptor-invalid：模块描述符无效](/zh-CN/errors/module-descriptor-invalid)
- [module-registration-sealed：文档模块注册已结束](/zh-CN/errors/module-registration-sealed)
- [module-unresolved：模块说明符无法解析](/zh-CN/errors/module-unresolved)
- [module-specifier-reserved：使用了保留模块说明符](/zh-CN/errors/module-specifier-reserved)
- [module-resolve-invalid：模块解析结果无效](/zh-CN/errors/module-resolve-invalid)
- [module-redirect-cycle：模块重定向循环](/zh-CN/errors/module-redirect-cycle)
- [module-context-missing：模块加载上下文丢失](/zh-CN/errors/module-context-missing)
- [module-rewrite-invalid：模块改写区间异常](/zh-CN/errors/module-rewrite-invalid)
