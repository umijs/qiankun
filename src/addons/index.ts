/**
 * @author Kuitos
 * @since 2020-03-02
 */

import { concat, mergeWith } from 'lodash';

import { LifeCycles } from '../register';
import getRuntimePublicPathAddOn from './runtimePublicPath';

export default function getAddOns<T extends object>(global: Window, publicPath: string): LifeCycles<T> {
  return mergeWith({}, getRuntimePublicPathAddOn(global, publicPath), (v1, v2) => concat(v1 ?? [], v2 ?? []));
}
