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

    // `#error-boundary` is what the docs have always shown, but Vue does not normalize slot names
    // the way it normalizes props — both spellings must be accepted or the documented slot silently
    // renders nothing.
    const errorBoundarySlot = () => slots.errorBoundary ?? slots['error-boundary'];

    const isNeedShowError = computed(() => {
      return errorBoundarySlot() || autoCaptureError.value;
    });

    // 配置了 errorBoundary 才改 error 状态，否则直接往上抛异常
    const setComponentError = (err: Error | undefined) => {
      if (isNeedShowError.value) {
        error.value = err;
        // error log 出来，不要吞
        if (err) {
          console.error(err);
        }
      } else if (err) {
        throw err;
      }
    };

    const rootRef = ref(null);

    /**
     * Mounts and unmounts are serialized through one chain. `mountMicroApp` resolves a tick after
     * the app is handed over, so a second `name` change arriving before the first settles would
     * otherwise see no previous app to wait for and race two apps into the same container — which
     * is exactly what a `<router-view>` does when the user clicks twice.
     */
    let lifecycle: Promise<MicroAppType | undefined> = Promise.resolve(undefined);

    const unmount = () => {
      const unmounting = lifecycle.then(async (microApp) => {
        if (microApp) {
          microApp._unmounting = true;
          await unmountMicroApp(microApp);
        }

        microAppRef.value = undefined;
        return undefined;
      });

      unmounting.catch((err: Error) => {
        setComponentError(err);
        loading.value = false;
      });

      // the chain continues on the caught variant: unmounting an app whose mount failed rejects,
      // and that must not swallow the next app's mount
      lifecycle = unmounting.catch(() => undefined);
      return lifecycle;
    };

    onMounted(() => {
      // watch name 变更切换子应用
      watch(
        name,
        () => {
          // props 必须在此刻快照：挂载被排到卸载之后执行，那时读 originProps 拿到的已经是更之后的
          // 一次切换，于是最后那个应用会被反复挂载又拆掉
          const componentProps = {
            ...originProps,
            ...appProps.value,
          };

          // 销毁上一个子应用，再初始化下一个
          const mounting = unmount().then(() =>
            mountMicroApp({
              container: containerRef.value!,
              componentProps,
              setLoading: (l) => {
                loading.value = l;
              },
              setError: (err?: Error) => {
                setComponentError(err);
              },
            }).then((app) => {
              microAppRef.value = app;
              return app;
            }),
          );

          lifecycle = mounting.catch(() => undefined);
          mounting.catch((err: Error) => {
            setComponentError(err);
            loading.value = false;
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
            name: name.value,
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
      void unmount();
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
    const loaderSlot = this.$slots.loader;
    const errorBoundarySlot = this.$slots.errorBoundary ?? this.$slots['error-boundary'];
    const container = h('div', {
      class: this.microAppClassName,
      ref: 'containerRef',
    });

    // The container is rendered before the slots on purpose: qiankun keys its parcel cache and its
    // same-container serialization on the container's XPath, which counts same-tag siblings before
    // the element, so a conditionally rendered loader would split one app across two cache keys.
    return this.autoSetLoading || this.autoCaptureError || loaderSlot || errorBoundarySlot
      ? h(
          'div',
          {
            class: this.microAppWrapperClassName,
          },
          [
            container,
            loaderSlot
              ? typeof loaderSlot === 'function'
                ? // slot props are an object, as the docs have always shown: `#loader="{ loading }"`
                  // destructures nothing out of a bare boolean
                  loaderSlot({ loading: this.loading })
                : loaderSlot
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
              ? errorBoundarySlot
                ? typeof errorBoundarySlot === 'function'
                  ? errorBoundarySlot({ error: this.error })
                  : errorBoundarySlot
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
          ],
        )
      : container;
  },
});
