import type { PropType } from 'vue-demi';
import {
  computed,
  defineComponent,
  h,
  onMounted,
  ref,
  onBeforeUnmount,
  shallowRef,
  toRefs,
  watch,
  isVue2,
} from 'vue-demi';
import type { AppConfiguration, LifeCycles } from 'qiankun';
import type { MicroAppType } from '@qiankunjs/ui-shared';
import { mountMicroApp, omitSharedProps, unmountMicroApp, updateMicroApp } from '@qiankunjs/ui-shared';

import MicroAppLoader from './MicroAppLoader';
import ErrorBoundary from './ErrorBoundary';

export const MicroApp = defineComponent({
  name: 'MicroApp',
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
      default: undefined,
    },
    className: {
      type: String,
      default: undefined,
    },
    appProps: {
      type: Object,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const originProps = props;
    const { name, wrapperClassName, className, appProps, autoCaptureError } = toRefs(originProps);

    const loading = ref(false);
    const error = ref<Error>();

    const containerRef = ref(null);
    const microAppRef = shallowRef<MicroAppType>();

    const isNeedShowError = computed(() => {
      return slots.errorBoundary || autoCaptureError.value;
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

    const rootRef = ref(null);

    const unmount = () => {
      const microApp = microAppRef.value;

      if (microApp) {
        microApp._unmounting = true;

        unmountMicroApp(microApp).catch((err: Error) => {
          setComponentError(err);
          loading.value = false;
        });

        microAppRef.value = undefined;
      }
    };

    onMounted(() => {
      // watch name 变更切换子应用
      watch(
        name,
        () => {
          const prevApp = microAppRef.value;
          // 销毁上一个子应用
          unmount();

          // 初始化下一个子应用
          void mountMicroApp({
            prevMicroApp: prevApp,
            container: containerRef.value!,
            componentProps: {
              ...originProps,
              ...appProps.value,
            },
            setLoading: (l) => {
              loading.value = l;
            },
            setError: (err?: Error) => {
              setComponentError(err);
            },
          }).then((app) => {
            microAppRef.value = app;
          });
        },
        {
          immediate: true,
        },
      );

      watch(
        appProps,
        () => {
          updateMicroApp({
            microApp: microAppRef.value,
            setLoading: (l) => {
              loading.value = l;
            },
            microAppProps: {
              ...omitSharedProps(originProps),
              ...appProps.value,
            },
          });
        },
        {
          deep: true,
        },
      );
    });

    onBeforeUnmount(() => {
      unmount();
    });

    const microAppWrapperClassName = computed(() =>
      wrapperClassName.value ? `${wrapperClassName.value} qiankun-micro-app-wrapper` : 'qiankun-micro-app-wrapper',
    );

    const microAppClassName = computed(() => {
      return className.value ? `${className.value} qiankun-micro-app-container` : 'qiankun-micro-app-container';
    });

    return {
      loading,
      error,
      containerRef,
      microAppRef,
      microAppWrapperClassName,
      microAppClassName,
      rootRef,
      microApp: microAppRef,
    };
  },

  render() {
    return this.autoSetLoading || this.autoCaptureError || this.$slots.loader || this.$slots.errorBoundary
      ? h(
          'div',
          {
            class: this.microAppWrapperClassName,
          },
          [
            this.$slots.loader
              ? typeof this.$slots.loader === 'function'
                ? this.$slots.loader(this.loading)
                : this.$slots.loader
              : this.autoSetLoading &&
                h(MicroAppLoader, {
                  ...(isVue2
                    ? {
                        props: {
                          loading: this.loading,
                        },
                      }
                    : {
                        loading: this.loading,
                      }),
                }),
            this.error
              ? this.$slots.errorBoundary
                ? typeof this.$slots.errorBoundary === 'function'
                  ? this.$slots.errorBoundary(this.error)
                  : this.$slots.errorBoundary
                : this.autoCaptureError &&
                  h(ErrorBoundary, {
                    ...(isVue2
                      ? {
                          props: {
                            error: this.error,
                          },
                        }
                      : {
                          error: this.error,
                        }),
                  })
              : null,
            h('div', {
              class: this.microAppClassName,
              ref: 'containerRef',
            }),
          ],
        )
      : h('div', {
          class: this.microAppClassName,
          ref: 'containerRef',
        });
  },
});
