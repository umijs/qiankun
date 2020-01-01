/**
 * @author Kuitos
 * @since 2019-11-12
 */
import { Freer } from '../interfaces';

const rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/';

export default function hijack(publicPath = '/'): Freer {
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;

  return function free() {
    if (rawPublicPath === undefined) {
      delete window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    } else {
      window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = rawPublicPath;
    }

    return function rebuild() {
      window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
    };
  };
}
