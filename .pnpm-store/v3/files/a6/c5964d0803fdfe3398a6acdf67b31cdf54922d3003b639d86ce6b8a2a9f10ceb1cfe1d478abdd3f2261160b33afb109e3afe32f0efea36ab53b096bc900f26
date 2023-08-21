import { ExtractorConfig, IExtractorConfigPrepareOptions } from '@microsoft/api-extractor';
import { IApi, IFatherPreBundleConfig } from '../types';
export interface IPreBundleConfig {
    deps: Record<string, {
        pkg: IApi['pkg'];
        output: string;
        nccConfig: any;
    }>;
    dts: Record<string, {
        pkg: IApi['pkg'];
        output: string;
        externals: Record<string, string>;
        maeConfig: ExtractorConfig;
        _maePrepareConfig: IExtractorConfigPrepareOptions;
    }>;
}
export declare function getConfig(opts: {
    userConfig: IFatherPreBundleConfig;
    cwd: string;
    pkg: IApi['pkg'];
}): IPreBundleConfig;
