# container-head-missing：容器内缺少 head 节点

## 触发原因

沙箱访问代理 `document.head`，或重新挂载时恢复 head 中的样式，但容器内没有容器协议要求的 `<qiankun-head>` 节点。

## 排查步骤

1. 检查主应用是否在微应用运行期间清空、替换了容器，或删除了 `<qiankun-head>`。
2. 检查脚本执行与容器准备顺序，确认访问 `document.head` 前已准备好该节点。
3. 独立使用沙箱时，检查 `provisionContainerHead`；通过 qiankun 加载 HTML 时，检查入口是否包含 `<head>`，以及流式加载是否正常完成。

## 解决办法

独立沙箱应保留 `provisionContainerHead` 的默认值 `true`，由沙箱在挂载时准备节点。自定义集成若将其设为 `false`，必须在使用 DOM 插件前自行完成相应准备。

使用 qiankun 的 HTML 加载流程时，应提供包含 `<head>` 的完整入口，并由加载器生成容器内的对应节点。不要在微应用仍运行时手工清空或改写其容器。

## 相关内容

- [错误码与解决办法](/zh-CN/errors/)
- [container-head-missing: Missing container head node](/errors/container-head-missing)
