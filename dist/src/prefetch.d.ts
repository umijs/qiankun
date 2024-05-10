/**
 * @author Kuitos
 * @since 2019-02-26
 */
import type { ImportEntryOpts } from 'import-html-entry';
import type { AppMetadata, PrefetchStrategy } from './interfaces';
declare global {
    interface NetworkInformation {
        saveData: boolean;
        effectiveType: string;
    }
}
declare global {
    interface Navigator {
        connection: {
            saveData: boolean;
            effectiveType: string;
            type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
        };
    }
}
export declare function prefetchImmediately(apps: AppMetadata[], opts?: ImportEntryOpts): void;
export declare function doPrefetchStrategy(apps: AppMetadata[], prefetchStrategy: PrefetchStrategy, importEntryOpts?: ImportEntryOpts): void;
