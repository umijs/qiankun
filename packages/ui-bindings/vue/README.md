# qiankun vue binding

## Usage

```bash
npm i @qiankunjs/vue
```

## MicroApp Component
Load (or unload) a sub-application directly through the `<MicroApp />` component, which provides capabilities related to loading and error capturing:

```vue
<script setup>
import { MicroApp } from '@qiankunjs/vue';

</script>
<template>
  <micro-app name="app1" entry="http://localhost:8000" />
</template>
```
When enabling the sub-application loading animation or error capturing capabilities, an additional style class `wrapperClassName` is accepted by the sub-application. The rendered result is as follows:

```vue
<div :class="wrapperClassName">
  <MicroAppLoader :loading="loading" />
  <ErrorBoundary :error="e" />
  <MicroApp :class="className" />
</div>
```

### Loading Animation
After enabling this feature, a loading animation will automatically be displayed while the sub-application is loading. When the sub-application finishes mounting and becomes in the MOUNTED state, the loading state ends, and the sub-application content is displayed.

Simply pass `autoSetLoading` as a parameter:

```vue
<script setup>
import { MicroApp } from '@qiankunjs/vue';

</script>
<template>
  <micro-app name="app1" entry="http://localhost:8000" autoSetLoading />
</template>
```
#### Custom Loading Animation
If you wish to override the default loading animation style, you can customize the loading component by using the loader slot as the sub-application's loading animation.

```vue
<script setup>
import CustomLoader from '@/components/CustomLoader.vue';
import { MicroApp } from '@qiankunjs/vue';

</script>
<template>
  <micro-app name="app1" entry="http://localhost:8000" >
     <template #loader="{ loading }">
       <custom-loader :loading="loading" />
     </template>
  </micro-app>
</template>
```
Here, `loading` is a boolean type parameter; when true, it indicates that it is still in the loading state, and when false, it indicates that the loading state has ended.

### Error Capturing
After enabling this feature, when the sub-application encounters an exception while loading, an error message will automatically be displayed. You can pass the `autoCaptureError` property to the sub-application to enable error capturing capabilities:

```vue
<script setup>
import { MicroApp } from '@qiankunjs/vue';

</script>
<template>
  <micro-app name="app1" entry="http://localhost:8000" autoCaptureError />
</template>
```
#### Custom Error Capturing
If you wish to override the default error capturing component style, you can customize the error capturing component for the sub-application using the errorBoundary slot:

```vue
<script setup>
import CustomErrorBoundary from '@/components/CustomErrorBoundary.vue';
import { MicroApp } from '@qiankunjs/vue';

</script>
<template>
  <micro-app name="app1" entry="http://localhost:8000" >
     <template #error-boundary="{ error }">
       <custom-error-boundary :error="error" />
     </template>
  </micro-app>
</template>
```

### Component Properties

| Property           | Required | Description                                                                   | Type      | Default Value |
| ------------------ | -------- | ----------------------------------------------------------------------------- | --------- | ------------- |
| `name`             | Yes      | The name of the micro-application                                             | `string`  |               |
| `entry`            | Yes      | The HTML address of the micro-application                                     | `string`  |               |
| `autoSetLoading`   | No       | Automatically set the loading status of the micro-application                 | `boolean` | `false`       |
| `autoCaptureError` | No       | Automatically set error capturing for the micro-application                   | `boolean` | `false`       |
| `className`        | No       | The style class for the micro-application                                     | `string`  | `undefined`   |
| `wrapperClassName` | No       | The style class wrapping the micro-application's loading and error components | `string`  | `undefined`   |

### Component Slots

| Slot            | Description          |
| --------------- | -------------------- |
| `loader`        | Loading state slot   |
| `errorBoundary` | Error capturing slot |