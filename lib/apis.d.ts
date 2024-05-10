import type { FrameworkConfiguration, FrameworkLifeCycles, LoadableApp, MicroApp, ObjectType, RegistrableApp } from './interfaces';
export declare let frameworkConfiguration: FrameworkConfiguration;
export declare function registerMicroApps<T extends ObjectType>(apps: Array<RegistrableApp<T>>, lifeCycles?: FrameworkLifeCycles<T>): void;
export declare function loadMicroApp<T extends ObjectType>(app: LoadableApp<T>, configuration?: FrameworkConfiguration & {
    autoStart?: boolean;
}, lifeCycles?: FrameworkLifeCycles<T>): MicroApp;
export declare function start(opts?: FrameworkConfiguration): void;
