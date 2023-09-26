# qiankun renderer react

## 安装

```bash
npm i @qiankunjs/renderer-react
```

## MicroApp 组件

直接通过 `<MicroApp />` 组件加载（或卸载）子应用，该组件提供了 loading 以及错误捕获相关的能力：

```tsx
import { MicroApp } from '@qiankunjs/renderer-react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" />;
}
```

当启用子应用加载动画或错误捕获能力时，子应用接受一个额外的样式类 `wrapperClassName`，渲染的结果如下所示：

```tsx
<div style={{ position: 'relative' }} className={wrapperClassName}>
  <MicroAppLoader loading={loading} />
  <ErrorBoundary error={e} />
  <MicroApp className={className} />
</div>
```

### 加载动画

启用此能力后，当子应用正在加载时，会自动显示加载动画。当子应用挂载完成变成 `MOUNTED` 状态时，加载状态结束，显示子应用内容。

直接将 `autoSetLoading` 作为参数传入即可：

```tsx
import { MicroApp } from '@qiankunjs/renderer-react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" autoSetLoading />;
}
```

#### 自定义加载动画

如果您希望覆盖默认的加载动画样式时，可以设置一个自定义的加载组件 `loader` 作为子应用的加载动画。

```tsx
import CustomLoader from '@/components/CustomLoader';
import { MicroApp } from '@qiankunjs/renderer-react';

export default function Page() {
  return (
    <MicroApp name="app1" entry="http://localhost:8000" loader={(loading) => <CustomLoader loading={loading} />} />
  );
}
```

其中，`loading` 为 `boolean` 类型参数，为 `true` 时表示仍在加载状态，为 `false` 时表示加载状态已结束。

### 错误捕获

启用此能力后，当子应用加载出现异常时，会自动显示错误信息。可以向子应用传入 `autoCaptureError` 属性以开启子应用错误捕获能力：

```tsx
import { MicroApp } from '@qiankunjs/renderer-react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" autoCaptureError />;
}
```

#### 自定义错误捕获

如果您希望覆盖默认的错误捕获组件样式时，可以设置一个自定义的组件 `errorBoundary` 作为子应用的错误捕获组件：

```tsx
import CustomErrorBoundary from '@/components/CustomErrorBoundary';
import { MicroApp } from '@qiankunjs/renderer-react';

export default function Page() {
  return (
    <MicroApp
      name="app1"
      entry="http://localhost:8000"
      errorBoundary={(error) => <CustomErrorBoundary error={error} />}
    />
  );
}
```

### 组件属性

| 属性 | 必填 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- | --- |
| `name` | 是 | 微应用的名称 | `string` |
| `entry` | 是 | 微应用的 HTML 地址 | `string` |
| `autoSetLoading` | 否 | 自动设置微应用的加载状态 | `boolean` | `false` |
| `loader` | 否 | 自定义的微应用加载状态组件 | `(loading) => React.ReactNode` | `undefined` |
| `autoCaptureError` | 否 | 自动设置微应用的错误捕获 | `boolean` | `false` |
| `errorBoundary` | 否 | 自定义的微应用错误捕获组件 | `(error: any) => React.ReactNode` | `undefined` |
| `className` | 否 | 微应用的样式类 | `string` | `undefined` |
| `wrapperClassName` | 否 | 包裹微应用加载组件、错误捕获组件和微应用的样式类，仅在启用加载组件或错误捕获组件时有效 | `string` | `undefined` |

## 子应用生命周期

Qiankun 在 single-spa 的基础上实现了一些额外的生命钩子。按照微应用的生命周期顺序，Qiankun 支持的完整的生命钩子列表如下：

- `beforeLoad`，微应用**开始获取前**调用。最初，微应用为 `NOT_LOADED` 状态。
- [`load`](https://single-spa.js.org/docs/building-applications/#load)，微应用**获取完成时**调用。开始获取微应用时，微应用变成 `LOADING_SOURCE_CODE` 状态。若获取成功，微应用变成 `NOT_BOOTSTRAPPED` 状态；若获取失败，微应用变成 `LOAD_ERROR` 状态。
- [`bootstrap`](https://single-spa.js.org/docs/building-applications/#bootstrap)，微应用**初始化完成时**调用。开始初始化微应用时，微应用变成 `BOOTSTRAPPING` 状态。初始化完成时，微应用变成 `NOT_MOUNTED` 状态。
- `beforeMount`，微应用每次**开始挂载前**调用。
- [`mount`](https://single-spa.js.org/docs/building-applications/#mount)，微应用每次**开始挂载时**调用。微应用变成 `MOUNTING` 状态。
- `afterMount`，微应用每次**挂载完成时**调用。微应用变成 `MOUNTED` 状态。
- `beforeUnmount`，微应用每次**开始卸载前**调用。
- [`unmount`](https://single-spa.js.org/docs/building-applications/#unmount)，微应用每次**开始卸载时**调用。微应用变成 `UNMOUNTING` 状态。
- `afterUnmount`，微应用每次**卸载完成时**调用。微应用变成 `NOT_MOUNTED` 状态。
- [`unload`](https://single-spa.js.org/docs/building-applications/#unload)，微应用**卸载完成时**调用。微应用变成 `NOT_LOADED` 状态。

此外，还存在一个特殊的生命钩子 `update`，仅在使用 `<MicroApp />` 组件引入微应用时生效：状态为 `MOUNTED` 的微应用**手动刷新时**调用。开始更新时，微应用变成 `UPDATING` 状态；更新完成时，微应用变成 `MOUNTED` 状态。

您可以像这样手动刷新子应用：

```tsx
import { useRef } from 'react';
import { MicroApp } from '@qiankunjs/renderer-react';

export default function Page() {
  const microAppRef = useRef();

  // 执行此方法时，更新子应用
  const updateMicroApp = () => {
    microAppRef.current?.update();
  };

  return <MicroApp name="app1" entry="http://localhost:8000" ref={microAppRef} />;
}
```
