/**
 * @author Kuitos
 * @since 2020-03-02
 */

import { mergeWith } from 'lodash';

import { LifeCycles } from '../register';
import { toArray } from '../utils';
import getRuntimePublicPathAddOn from './runtimePublicPath';

export default function getAddOns<T extends object>(global: Window, publicPath: string): LifeCycles<T> {
  return mergeWith(
    {},
    getRuntimePublicPathAddOn(global, publicPath),
    (v1: () => Promise<void>, v2: () => Promise<void>) => [...toArray(v1 ?? []), ...toArray(v2 ?? [])],
  );
}
