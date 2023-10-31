import { computed, defineComponent, h, onMounted, reactive, ref, toRefs, watch } from 'vue';
import type { MicroAppType, SharedProps } from '@qiankunjs/ui-shared';
import { mountMicroApp, unmountMicroApp } from '@qiankunjs/ui-shared';

import MicroAppLoader from './MicroAppLoader';
import ErrorBoundary from './ErrorBoundary';
import { updateMicroApp } from '../../shared/src';

export const MicroApp = defineComponent({
  props: {},
  setup(props, { slots, expose }) {
    const originProps = props as unknown as SharedProps;
    const { name, wrapperClassName, className, ...propsFromParams } = toRefs(originProps);

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

          mountMicroApp({
            props: originProps,
            propsFromParams: reactivePropsFromParams,
            container: containerRef.value!,
            setApp: (app?: MicroAppType) => {
              microAppRef.value = app;
            },
            setLoading: (l) => {
              loading.value = l;
            },
            setError: (err?: Error) => {
              setComponentError(err);
            },
          });
        },
        {
          immediate: true,
        },
      );

      watch(
        reactivePropsFromParams,
        () => {
          updateMicroApp({
            propsFromParams: reactivePropsFromParams,
            getApp: () => microAppRef.value,
            setLoading: (l) => {
              loading.value = l;
            },
            source: 'vue',
          });
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
