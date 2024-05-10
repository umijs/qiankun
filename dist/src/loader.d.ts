/**
 * @author Kuitos
 * @since 2020-04-01
 */
import type { ParcelConfigObject } from 'single-spa';
import type { FrameworkConfiguration, FrameworkLifeCycles, LoadableApp, ObjectType } from './interfaces';
export type ParcelConfigObjectGetter = (remountContainer?: string | HTMLElement) => ParcelConfigObject;
export declare function loadApp<T extends ObjectType>(app: LoadableApp<T>, configuration?: FrameworkConfiguration, lifeCycles?: FrameworkLifeCycles<T>): Promise<ParcelConfigObjectGetter>;
