# container-required：缺少应用容器

## 触发原因

启用样式隔离时未提供 `container` 配置，或者 DOM 隔离插件在执行及重建副作用时无法取得容器。

## 排查步骤

1. 确认主应用已创建容器，并取得实际的 `HTMLElement`。
2. 若 `container` 使用访问函数，检查函数在插件执行和挂载阶段是否都能返回正确元素。
3. 若自行实现插件生命周期管理，检查重建函数是否收到了本次挂载的容器。

## 解决办法

在容器就绪后初始化需要 DOM 隔离的沙箱，并在每次挂载、重建时提供当前容器。主应用移除容器前，应先完成微应用卸载。

确实只需要 JavaScript 隔离时，可使用无容器的沙箱配置；此时不要启用 `styleIsolation` 或依赖容器的 DOM 插件。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [container-required: Missing app container](/errors/container-required)
