/**
 * @author Kuitos
 * @since 2020-04-13
 */
type AppInstance = {
    name: string;
    window: WindowProxy;
};
/**
 * get the app that running tasks at current tick
 */
export declare function getCurrentRunningApp(): AppInstance | null;
export declare function setCurrentRunningApp(appInstance: {
    name: string;
    window: WindowProxy;
}): void;
export declare function clearCurrentRunningApp(): void;
export declare function rebindTarget2Fn(target: any, fn: any): any;
export {};
