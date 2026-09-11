# @qiankunjs/loader

qiankun 的流式 HTML 入口加载器，负责将微应用的 HTML 逐步写入容器，并通过沙箱提供的接口完成资源转换和脚本执行。它是 qiankun 加载流程的底层组件；业务应用建议使用 `qiankun` 的公开 API，无需单独安装本包。

文档：[HTML 入口](https://www.qiankunjs.com/zh-CN/concepts/html-entry-loading)。

## English

The streaming HTML-entry loader for qiankun. It incrementally writes a micro-app's HTML into its container and uses sandbox-provided interfaces for asset transformation and script execution. This package is a low-level part of qiankun's loading pipeline; application code should use the public `qiankun` APIs without installing it separately.

Documentation: [HTML entry](https://www.qiankunjs.com/concepts/html-entry-loading).
