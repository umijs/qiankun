import type { PropType } from 'vue';
import { computed, defineComponent, h, onMounted, reactive, ref, toRefs, watch } from 'vue';
import type { AppConfiguration, LifeCycles } from 'qiankun';
import type { MicroAppType } from '@qiankunjs/ui-shared';
import { mountMicroApp, omitSharedProps, unmountMicroApp, updateMicroApp } from '@qiankunjs/ui-shared';

import MicroAppLoader from './MicroAppLoader';
import ErrorBoundary from './ErrorBoundary';

export const MicroApp = defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    entry: {
      type: String,
      required: true,
    },
    settings: {
      type: Object as PropType<AppConfiguration>,
      default: () => ({
        sandbox: true,
      }),
    },
    lifeCycles: {
      type: Object as PropType<LifeCycles<Record<string, unknown>>>,
    },
    autoSetLoading: {
      type: Boolean,
      default: false,
    },
    autoCaptureError: {
      type: Boolean,
      default: false,
    },
    wrapperClassName: {
      type: String,
    },
    className: {
      type: String,
    },
  },
  setup(props, { slots, expose }) {
    const originProps = props;
    const { name, wrapperClassName, className, ...propsFromParams } = toRefs(originProps);

    const loading = ref(false);
    const error = ref<Error>();

    const containerRef = ref<HTMLDivElement | null>(null);
    const microAppRef = ref<MicroAppType>();

    const reactivePropsFromParams = computed(() => {
      return omitSharedProps(reactive(propsFromParams));
    });

    const isNeedShowError = computed(() => {
      return slots.errorBoundary || reactivePropsFromParams.value.autoCaptureError;
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
            container: containerRef.value!,
            setMicroApp: (app?: MicroAppType) => {
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
            getMicroApp: () => microAppRef.value,
            setLoading: (l) => {
              loading.value = l;
            },
            key: 'vue',
          });
        },
        {
          deep: true,
        },
      );
    });

    const microAppWrapperClassName = computed(() =>
      wrapperClassName.value ? `${wrapperClassName.value} qiankun-micro-app-wrapper` : 'qiankun-micro-app-wrapper',
    );

    const microAppClassName = computed(() => {
      return className.value ? `${className.value} qiankun-micro-app-container` : 'qiankun-micro-app-container';
    });

    return () =>
      reactivePropsFromParams.value.autoSetLoading ||
      reactivePropsFromParams.value.autoCaptureError ||
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
                : reactivePropsFromParams.value.autoSetLoading &&
                  h(MicroAppLoader, {
                    loading: loading.value,
                  }),
              error.value
                ? slots.errorBoundary
                  ? slots.errorBoundary(error.value)
                  : reactivePropsFromParams.value.autoCaptureError &&
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
