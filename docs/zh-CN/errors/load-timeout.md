# load-timeout：微应用加载超时

## 触发原因

微应用配置了 `timeout`，或者通过 `start({ timeout })` 设置了默认值，而加载准备没有在时限内完成。

计时从应用取得容器的加载权限后开始，覆盖 `beforeLoad`、入口请求和 HTML 流、加载器需要等待的资源，以及入口生命周期的发现。排队等待前一个实例释放容器的时间不计入，`bootstrap`、`mount`、`unmount` 也不受该时限约束。

该错误的类型是 `LoadAppTimeoutError`，继承 `QiankunError`，另外提供 `appName`、`timeout` 和 `elapsed` 三个只读字段。

## 排查步骤

1. 对比错误中的 `timeout` 与 `elapsed`，确认时限是否明显短于正常加载所需的时间。
2. 在浏览器开发者工具的网络面板中查看入口 HTML 和阻塞资源，找出耗时最长或一直没有结束的请求。
3. 检查入口 HTML 的响应是否会正常结束。启用超时后，qiankun 要等 HTML 流完整结束才进入挂载阶段，始终不关闭的流式响应必然超时。
4. 检查 `beforeLoad` 钩子里是否有耗时的异步任务。

## 解决办法

按实际网络状况和资源规模调整时限，也可以只为个别应用单独设置 `timeout`；设为 `0` 可关闭该应用的超时。

超时发生时，qiankun 已经中止这次加载、清理了写入容器的节点和沙箱，并释放了容器。需要重试时，重新调用 `loadMicroApp` 创建新实例，不要继续挂载已经失败的句柄。超时无法中断正在执行的同步 JavaScript。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [load-timeout: Micro app loading timed out](/errors/load-timeout)
