/**
 * @author Kuitos
 * @since 2020-03-02
 */
import type { FrameworkLifeCycles, ObjectType } from '../interfaces';
export default function getAddOns<T extends ObjectType>(global: Window, publicPath: string): FrameworkLifeCycles<T>;
