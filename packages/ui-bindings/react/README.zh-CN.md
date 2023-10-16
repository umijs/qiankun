# qiankun react

## 安装

```bash
npm i @qiankunjs/react
```

## MicroApp 组件

直接通过 `<MicroApp />` 组件加载（或卸载）子应用，该组件提供了 loading 以及错误捕获相关的能力：

```tsx
import { MicroApp } from '@qiankunjs/react';

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
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" autoSetLoading />;
}
```

#### 自定义加载动画

如果您希望覆盖默认的加载动画样式时，可以设置一个自定义的加载组件 `loader` 作为子应用的加载动画。

```tsx
import CustomLoader from '@/components/CustomLoader';
import { MicroApp } from '@qiankunjs/react';

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
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" autoCaptureError />;
}
```

#### 自定义错误捕获

如果您希望覆盖默认的错误捕获组件样式时，可以设置一个自定义的组件 `errorBoundary` 作为子应用的错误捕获组件：

```tsx
import CustomErrorBoundary from '@/components/CustomErrorBoundary';
import { MicroApp } from '@qiankunjs/react';

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

## 获取子应用加载状态

加载状态包括："NOT_LOADED" | "LOADING_SOURCE_CODE" | "NOT_BOOTSTRAPPED" | "BOOTSTRAPPING" | "NOT_MOUNTED" | "MOUNTING" | "MOUNTED" | "UPDATING" | "UNMOUNTING" | "UNLOADING" |

```tsx
import { useRef } from 'react';
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  const microAppRef = useRef();

  useEffect(() => {
    // 获取子应用加载状态
    console.log(microAppRef.current?.getStatus());
  }, []);

  return <MicroApp name="app1" entry="http://localhost:8000" ref={microAppRef} />;
}
```
