import * as defaultWebpack from '@umijs/deps/compiled/webpack';
import { IServerOpts } from '@umijs/server';
import { BundlerConfigType, IConfig } from '@umijs/types';
import { IOpts as IGetConfigOpts } from './getConfig/getConfig';
interface IOpts {
    cwd: string;
    config: IConfig;
}
declare class Bundler {
    static id: string;
    static version: number;
    cwd: string;
    config: IConfig;
    constructor({ cwd, config }: IOpts);
    getConfig(opts: Omit<IGetConfigOpts, 'cwd' | 'config'>): Promise<defaultWebpack.Configuration>;
    build({ bundleConfigs, bundleImplementor, watch, onBuildComplete, }: {
        bundleConfigs: defaultWebpack.Configuration[];
        bundleImplementor?: typeof defaultWebpack;
        watch?: boolean;
        onBuildComplete?: any;
    }): Promise<{
        stats?: defaultWebpack.Stats;
        compiler: any;
    }>;
    /**
     * get ignored watch dirs regexp, for test case
     */
    getIgnoredWatchRegExp: () => defaultWebpack.Options.WatchOptions['ignored'];
    setupDevServerOpts({ bundleConfigs, bundleImplementor, }: {
        bundleConfigs: defaultWebpack.Configuration[];
        bundleImplementor?: typeof defaultWebpack;
    }): IServerOpts;
}
export { Bundler, BundlerConfigType, defaultWebpack as webpack };
