import { computed, defineComponent, h, onMounted, reactive, ref, toRefs, watch } from 'vue';
import type { Props } from './props';
import type { MicroAppType } from '@qiankunjs/ui-shared';
import { unmountMicroApp } from '@qiankunjs/ui-shared';
import { mergeWith, concat } from 'lodash';
import type { LifeCycleFn } from 'qiankun';
import { loadMicroApp } from 'qiankun';

import MicroAppLoader from './MicroAppLoader';
import ErrorBoundary from './ErrorBoundary';

export const MicroApp = defineComponent({
  props: {},
  setup(props, { slots, expose }) {
    const {
      name,
      entry,
      settings = ref({}),
      lifeCycles,
      wrapperClassName,
      className,
      ...propsFromParams
    } = toRefs(props as unknown as Props);

    const loading = ref(false);
    const error = ref<Error>();

    const containerRef = ref<HTMLDivElement | null>(null);
    const microAppRef = ref<MicroAppType>();

    const reactivePropsFromParams = reactive(propsFromParams);

    const isNeedShowError = computed(() => {
      return slots.errorBoundary || reactivePropsFromParams.autoCaptureError;
    });

    // 配置了 errorBoundary 才改 error 状态，否则直接往上抛异常
    const setComponentError = (err: Error | undefined) => {
      if (isNeedShowError.value) {
        error.value = err;
        // error log 出来，不要吞
        if (err) {
          console.error(error);
        }
      } else if (err) {
        throw err;
      }
    };

    expose({
      microApp: microAppRef,
    });

    onMounted(() => {
      watch(
        name,
        () => {
          const microApp = microAppRef.value;
          if (microApp) {
            microApp._unmounting = true;

            unmountMicroApp(microApp).catch((err: Error) => {
              setComponentError(err);
              loading.value = false;
            });

            microAppRef.value = undefined;
          }

          loading.value = true;
          setComponentError(undefined);

          const configuration = {
            globalContext: window,
            ...settings.value,
          };

          microAppRef.value = loadMicroApp(
            {
              name: name.value,
              entry: entry.value,
              container: containerRef.value!,
              props: reactivePropsFromParams,
            },
            configuration,
            mergeWith(
              {},
              lifeCycles?.value,
              (v1: LifeCycleFn<Record<string, unknown>>, v2: LifeCycleFn<Record<string, unknown>>) => concat(v1, v2),
            ),
          );

          microAppRef.value.mountPromise
            .then(() => {
              if (reactivePropsFromParams.autoSetLoading) {
                loading.value = false;
              }
            })
            .catch((err: Error) => {
              setComponentError(err);
              loading.value = false;
            });

          (['loadPromise', 'bootstrapPromise'] as const).forEach((key) => {
            const promise = microAppRef.value![key];
            promise.catch((e: Error) => {
              setComponentError(e);
              loading.value = false;
            });
          });
        },
        {
          immediate: true,
        },
      );

      watch(
        reactivePropsFromParams,
        () => {
          const microApp = microAppRef.value;

          if (microApp) {
            if (!microApp._updatingPromise) {
              // 初始化 updatingPromise 为 microApp.mountPromise，从而确保后续更新是在应用 mount 完成之后
              microApp._updatingPromise = microApp.mountPromise;
              microApp._updatingTimestamp = Date.now();
            } else {
              // 确保 microApp.update 调用是跟组件状态变更顺序一致的，且后一个微应用更新必须等待前一个更新完成
              microApp._updatingPromise = microApp._updatingPromise.then(() => {
                const canUpdate = (microApp: MicroAppType) =>
                  microApp.update && microApp.getStatus() === 'MOUNTED' && !microApp._unmounting;
                if (canUpdate(microApp)) {
                  const props = {
                    ...propsFromParams,
                    setLoading(l: boolean) {
                      loading.value = l;
                    },
                  };

                  if (process.env.NODE_ENV === 'development') {
                    const updatingTimestamp = microApp._updatingTimestamp!;
                    if (Date.now() - updatingTimestamp < 200) {
                      console.warn(
                        `[@qiankunjs/vue] It seems like microApp ${name.value} is updating too many times in a short time(200ms), you may need to do some optimization to avoid the unnecessary re-rendering.`,
                      );
                    }

                    console.info(`[@qiankunjs/vue] MicroApp ${name.value} is updating with props: `, props);
                    microApp._updatingTimestamp = Date.now();
                  }

                  // 返回 microApp.update 形成链式调用
                  return microApp.update?.(props);
                }

                return void 0;
              });
            }
          }
        },
        {
          deep: true,
          immediate: true,
        },
      );
    });

    const microAppWrapperClassName = computed(() =>
      wrapperClassName?.value ? `${wrapperClassName.value} qiankun-micro-app-wrapper` : 'qiankun-micro-app-wrapper',
    );

    const microAppClassName = computed(() => {
      return className?.value ? `${className.value} qiankun-micro-app-container` : 'qiankun-micro-app-container';
    });

    return () =>
      reactivePropsFromParams.autoSetLoading ||
      reactivePropsFromParams.autoCaptureError ||
      slots.loader ||
      slots.errorBoundary
        ? h(
            'div',
            {
              class: microAppWrapperClassName.value,
            },
            [
              slots.loader
                ? slots.loader(loading.value)
                : reactivePropsFromParams.autoSetLoading &&
                  h(MicroAppLoader, {
                    loading: loading.value,
                  }),
              error.value
                ? slots.errorBoundary
                  ? slots.errorBoundary(error.value)
                  : reactivePropsFromParams.autoCaptureError &&
                    h(ErrorBoundary, {
                      error: error.value,
                    })
                : null,
              h('div', {
                class: microAppClassName.value,
                ref: containerRef,
              }),
            ],
          )
        : h('div', {
            class: microAppClassName.value,
            ref: containerRef,
          });
  },
});
