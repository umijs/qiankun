/**
 * @author Kuitos
 * @since 2020-03-02
 */

import { concat, mergeWith } from 'lodash';
import type { LifeCycleFn, LifeCycles, ObjectType } from '../types';
import getEngineFlagAddon from './engineFlag';
import getRuntimePublicPathAddOn from './runtimePublicPath';

export default function getAddOns<T extends ObjectType>(global: WindowProxy, publicPath: string): LifeCycles<T> {
  return mergeWith({}, getEngineFlagAddon(global), getRuntimePublicPathAddOn(global, publicPath), (v1, v2) =>
    concat((v1 ?? []) as LifeCycleFn<T>, (v2 ?? []) as LifeCycleFn<T>),
  );
}
