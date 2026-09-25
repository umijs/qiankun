# timeout-invalid：加载超时配置无效

## 触发原因

应用配置中的 `loadTimeout` 不是有限的非负数，例如负数、`NaN` 或 `Infinity`。

## 排查步骤

1. 根据错误所在的应用确认是哪一处 `loadMicroApp` 调用或 `registerMicroApps` 配置传入了该值。
2. 检查 `loadTimeout` 的来源。从环境变量、URL 参数或配置文件读取时，字符串转换失败会得到 `NaN`。

## 解决办法

传入以毫秒为单位的有限非负数。省略或设为 `0` 表示关闭超时。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [timeout-invalid: Invalid loading timeout](/errors/timeout-invalid)
