import { chokidar } from '@umijs/utils';
import { IApi, IFatherConfig } from '../types';
interface IBuilderOpts {
    userConfig: IFatherConfig;
    cwd: string;
    pkg: IApi['pkg'];
    clean?: boolean;
    buildDependencies?: string[];
}
interface IWatchBuilderResult {
    close: chokidar.FSWatcher['close'];
}
declare function builder(opts: IBuilderOpts): Promise<void>;
declare function builder(opts: IBuilderOpts & {
    watch: true;
}): Promise<IWatchBuilderResult>;
export default builder;
