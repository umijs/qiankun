/**
 * @author Kuitos
 * @since 2019-11-12
 */
import type { FrameworkLifeCycles } from '../interfaces';

const rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;

export default function getAddOn(global: Window, publicPath = '/'): FrameworkLifeCycles<any> {
  let hasMountedOnce = false;

  return {
    async beforeLoad() {
      // eslint-disable-next-line no-param-reassign
      global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
    },

    async beforeMount() {
      if (hasMountedOnce) {
        // eslint-disable-next-line no-param-reassign
        global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
      }
    },

    async beforeUnmount() {
      if (rawPublicPath === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
      } else {
        // eslint-disable-next-line no-param-reassign
        global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = rawPublicPath;
      }

      hasMountedOnce = true;
    },
  };
}
