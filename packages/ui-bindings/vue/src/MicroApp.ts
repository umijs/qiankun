import type { PropType } from 'vue-demi';
import { computed, defineComponent, h, onMounted, reactive, ref, toRefs, watch, isVue2 } from 'vue-demi';
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
  },
  setup(props, { slots }) {
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

    const rootRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      console.log(rootRef.value);

      console.log(containerRef.value);

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

          void mountMicroApp({
            componentProps: originProps,
            container: containerRef.value! as HTMLDivElement,
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
            microApp: microAppRef.value,
            setLoading: (l) => {
              loading.value = l;
            },
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

    return {
      loading,
      error,
      containerRef,
      microAppRef,
      microAppWrapperClassName,
      microAppClassName,
      rootRef,
      reactivePropsFromParams,
      microApp: microAppRef,
    };
  },

  render() {
    return this.reactivePropsFromParams.autoSetLoading ||
      this.reactivePropsFromParams.autoCaptureError ||
      this.$slots.loader ||
      this.$slots.errorBoundary
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
              : this.reactivePropsFromParams.autoSetLoading &&
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
                : this.reactivePropsFromParams.autoCaptureError &&
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
