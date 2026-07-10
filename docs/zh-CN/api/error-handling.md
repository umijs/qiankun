# addErrorHandler / removeErrorHandler

注册一个全局观察器来接收微应用加载和生命周期失败，再用同一个函数引用注销它。qiankun 从 single-spa 原样导出这两个函数，没有改变其行为。

这个 API 适合集中记录日志和上报监控。面向用户的恢复界面应由受影响 UI 对应的 `loadMicroApp` 实例或 `<MicroApp>` 组件负责。

## 函数签名

```ts
type AppError = Error & {
  appOrParcelName: string;
};

function addErrorHandler(handler: (error: AppError) => void): void;
function removeErrorHandler(handler: (error: AppError) => void): void;
```

`appOrParcelName` 标识与错误关联的应用或实例。`removeErrorHandler` 按函数引用匹配，因此内容相同的新函数不能注销原来的处理器。

## 使用方式

在主应用启动阶段注册一次观察器：

```ts
import { addErrorHandler, removeErrorHandler } from 'qiankun';

type AppError = Error & { appOrParcelName: string };

const reportMicroAppError = (error: AppError) => {
  reportToMonitoring(error, {
    app: error.appOrParcelName,
  });
};

addErrorHandler(reportMicroAppError);

// 主应用清理或测试结束时：
removeErrorHandler(reportMicroAppError);
```

通过 [`loadMicroApp`](/zh-CN/api/load-micro-app) 加载的应用，以及路由驱动的 `registerMicroApps` 流程，产生的错误都会进入这个观察器。其中包括入口加载失败和微应用生命周期函数被拒绝。

这个处理器是全局的，不负责渲染。实例级界面应单独观察返回句柄：

```ts
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp({ name, entry, container });

void microApp.mountPromise.catch((error: unknown) => {
  showFallback(container, error);
});
```

请继续保留 `MicroApp` 句柄，并在成功挂载的视图移除时调用 `unmount()`。

## 处理器职责

- 处理器应保持防御性：上报错误后直接返回，不要继续抛错；
- 不要从全局通道启动无上限重试；
- 不要向用户展示原始调用栈或含敏感信息的响应；
- 为生产构建保留 source map，让监控系统能够还原转换后的应用调用栈。

React 和 Vue 的 `<MicroApp>` 组件通过各自的错误边界选项提供组件级兜底界面。组件边界和全局观察器可能同时收到同一次失败；前者用于就近恢复，后者用于遥测上报。

## 相关链接

- [处理微应用错误](/zh-CN/cookbook/handle-errors)——兜底界面、诊断与重试建议
- [`loadMicroApp`](/zh-CN/api/load-micro-app)——实例 Promise 与清理
- [React `<MicroApp>`](/zh-CN/ecosystem/react)和 [Vue `<MicroApp>`](/zh-CN/ecosystem/vue)——组件错误边界
