import { chokidar } from '@umijs/utils';
import type { BundlessConfigProvider } from '../config';
/**
 * transform specific files
 */
declare function transformFiles(files: string[], opts: {
    cwd: string;
    configProvider: BundlessConfigProvider;
    watch?: true;
}): Promise<number>;
declare function bundless(opts: Omit<Parameters<typeof transformFiles>[1], 'watch'>): Promise<void>;
declare function bundless(opts: Parameters<typeof transformFiles>[1]): Promise<chokidar.FSWatcher>;
export default bundless;
