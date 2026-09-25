# timeout-invalid：加载超时配置无效

## 触发原因

`timeout` 不是有限的非负数，例如负数、`NaN` 或 `Infinity`。`start({ timeout })` 和应用级配置都会校验该值。

## 排查步骤

1. 根据调用栈确认报错来自 `start()`，还是来自某个应用的加载。
2. 检查 `timeout` 的来源。从环境变量、URL 参数或配置文件读取时，字符串转换失败会得到 `NaN`。

## 解决办法

传入以毫秒为单位的有限非负数。`0` 表示关闭超时；省略或设为 `undefined` 时，应用继承 `start({ timeout })` 设置的默认值。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [timeout-invalid: Invalid loading timeout](/errors/timeout-invalid)
