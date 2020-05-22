/**
 * @author Kuitos
 * @since 2020-05-15
 */

import { FrameworkLifeCycles } from '../interfaces';

export default function getAddOn(global: Window): FrameworkLifeCycles<any> {
  return {
    async beforeLoad() {
      global.__POWERED_BY_QIANKUN__ = true;
    },

    async beforeMount() {
      global.__POWERED_BY_QIANKUN__ = true;
    },

    async beforeUnmount() {
      delete global.__POWERED_BY_QIANKUN__;
    },
  };
}
