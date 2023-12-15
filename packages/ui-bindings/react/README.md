# qiankun ui binding for react

## Usage

```bash
npm i @qiankunjs/react
```

## MicroApp component

Load (or unload) child apps directly through the `<MicroApp/>` component, which provides loading and error catching-related capabilities:

```tsx
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" />;
}
```

When the sub-app loading animation or error capture capability is enabled, the sub-app accepts an additional style class `wrapperClassName`, and the rendered result is as follows:

```tsx
<div style={{ position: 'relative' }} className={wrapperClassName}>
  <MicroAppLoader loading={loading} />
  <ErrorBoundary error={e} />
  <MicroApp className={className} />
</div>
```

### Load animation

When this capability is enabled, loading animations are automatically displayed when child apps are loading. When the sub-application is mounted and changes to the `MOUNTED` state, the loading status ends and the sub-application content is displayed.

Just pass `autoSetLoading` as a parameter:

```tsx
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" autoSetLoading />;
}
```

#### Custom loading animation

If you want to override the default loading animation style, you can set a custom loading component `loader` as the loading animation for the child app.

```tsx
import CustomLoader from '@/components/CustomLoader';
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return (
    <MicroApp name="app1" entry="http://localhost:8000" loader={(loading) => <CustomLoader loading={loading} />} />
  );
}
```

where `loading` is the `boolean` type parameter, `true` indicates that the loading state is still being loaded, and `false` indicates that the loading state has ended.

### Error catching

When this capability is enabled, an error message is automatically displayed when a child app loads unexpectedly. You can pass the `autoCaptureError` property to the sub-app to enable sub-app error capture capabilities:

```tsx
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" autoCaptureError />;
}
```

#### Custom error capture

If you want to override the default error capture component style, you can set a custom component `errorBoundary` as the error capture component for the child app:

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

### Component Props

| Name | Required | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `name` | yes | The name of the microapp | `string` |
| `entry` | yes | The HTML address of the microapp | `string` |
| `autoSetLoading` | no | Automatically set the loading state of your microapp | `boolean` | `false` |
| `loader` | no | Custom microapps load state components | `(loading) => React.ReactNode` | `undefined` |
| `autoCaptureError` | no | Automatically set up error capture for microapps | `boolean` | `false` |
| `errorBoundary` | no | Custom microapp error capture component | `(error: any) => React.ReactNode` | `undefined` |
| `className` | no | The style class for the microapp | `string` | `undefined` |
| `wrapperClassName` | no | Wrap the microapp loading component, error capture component, and microapp's style classes, and are only valid when the load component or error capture component is enabled | `string` | `undefined` |

## Get the child app load status

The loading status includes: "NOT_LOADED" | "LOADING_SOURCE_CODE" | "NOT_BOOTSTRAPPED" | "BOOTSTRAPPING" | "NOT_MOUNTED" | "MOUNTING" | "MOUNTED" | "UPDATING" | "UNMOUNTING" | "UNLOADING" |

```tsx
import { useRef } from 'react';
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  const microAppRef = useRef();

  useEffect(() => {
    // Get the child app load status
    console.log(microAppRef.current?.getStatus());
  }, []);

  return <MicroApp name="app1" entry="http://localhost:8000" ref={microAppRef} />;
}
```
