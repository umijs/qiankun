# custom-error：调用方自定义错误

## 触发原因

调用方通过 `new QiankunError(message)` 创建错误时，没有指定错误码，因此使用默认码 `custom-error`。它表示错误正文由调用方提供，不对应某个特定的 qiankun 内部校验。

## 排查步骤

1. 阅读 `[qiankun]:` 前缀之后、解决方案链接之前的原始错误正文。
2. 根据调用栈找到创建 `QiankunError` 的业务代码或集成代码。
3. 结合该调用点的参数、状态及此前日志，确定触发条件。

## 解决办法

按照调用方定义的错误含义处理问题。此默认错误码无法提供统一的配置修复方法；应以原始正文和调用栈为准。

编写自定义错误时，应在 `message` 中提供足够的诊断上下文。qiankun 会保留这段正文，并附加本页链接。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [custom-error: Caller-defined error](/errors/custom-error)
