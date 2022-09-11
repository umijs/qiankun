/**
 * @author Kuitos
 * @since 2020-03-02
 */

import mergeWith from 'lodash.mergewith';
import type { FrameworkLifeCycles, ObjectType } from '../interfaces';
import getEngineFlagAddon from './engineFlag';
import getRuntimePublicPathAddOn from './runtimePublicPath';

export default function getAddOns<T extends ObjectType>(global: Window, publicPath: string): FrameworkLifeCycles<T> {
  return mergeWith({}, getEngineFlagAddon(global), getRuntimePublicPathAddOn(global, publicPath), (v1, v2) =>
    (v1 ?? []).concat(v2 ?? [])
  );
}
