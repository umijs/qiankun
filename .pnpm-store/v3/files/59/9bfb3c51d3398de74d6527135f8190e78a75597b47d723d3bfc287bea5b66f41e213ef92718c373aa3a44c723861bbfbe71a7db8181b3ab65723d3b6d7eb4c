import type { BundleConfigProvider } from '../config';
export interface IBundleWatcher {
    close: () => void;
}
interface IBundlessOpts {
    cwd: string;
    configProvider: BundleConfigProvider;
    buildDependencies?: string[];
    watch?: boolean;
}
declare function bundless(opts: Omit<IBundlessOpts, 'watch'>): Promise<void>;
declare function bundless(opts: IBundlessOpts): Promise<IBundleWatcher>;
export default bundless;
