# addErrorHandler / removeErrorHandler

这两个函数用于注册和移除 single-spa 的全局错误处理器。处理器主要接收路由驱动应用（经 `registerMicroApps` 注册）在加载和生命周期执行中产生的错误。移除处理器时必须传入注册时使用的同一函数引用。qiankun 直接导出 single-spa 的对应函数，不改变其行为。

该 API 适合用于集中记录路由驱动应用的日志和上报监控数据。通过 `loadMicroApp` 创建的实例不会在首次加载或生命周期失败时调用该全局处理器，应通过实例句柄中的 Promise 处理相应错误。面向用户的错误恢复界面应由负责该区域的 `loadMicroApp` 调用方或 `<MicroApp>` 组件处理。

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

在主应用启动阶段注册一次错误处理器：

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

由 `registerMicroApps` 注册的路由驱动应用会将入口加载失败和生命周期 Promise 被拒绝的错误传递给该处理器。`loadMicroApp` 使用 single-spa 的 Parcel 加载流程，其首次加载和生命周期错误只会反映在实例句柄对应的 Promise 中，不会传递给全局处理器。

该处理器作用于全局，不负责界面渲染。实例级界面应单独监听返回句柄中的 Promise：

```ts
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp({ name, entry, container });

void microApp.mountPromise.catch((error: unknown) => {
  showFallback(container, error);
});
```

应保留 `MicroApp` 句柄，并在移除已挂载的视图时调用 `unmount()`。

## 处理器职责

- 处理器在上报错误后应正常返回，避免再次抛出错误；
- 不应通过全局错误处理器启动无限重试；
- 不应向用户显示原始调用栈或包含敏感信息的响应；
- 生产构建应保留源码映射（source map），以便监控系统还原转换后的应用调用栈。

React 和 Vue 的 `<MicroApp>` 组件可通过各自的错误边界选项提供组件级错误界面。这些组件基于 `loadMicroApp`，因此应由组件自身处理实例错误，不能依赖全局处理器接收同一错误。

## 相关内容

- [处理微应用错误](/zh-CN/cookbook/handle-errors)——错误界面、诊断与重试建议。
- [`loadMicroApp`](/zh-CN/api/load-micro-app)——实例 Promise 与清理。
- [React `<MicroApp>`](/zh-CN/ecosystem/react) 和 [Vue `<MicroApp>`](/zh-CN/ecosystem/vue)——组件错误边界。
