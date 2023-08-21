/// <reference types="node" />
import { Transform, TransformOptions, TransformCallback } from 'stream';
import { IndexItem, SitemapItemLoose, ErrorLevel } from './types';
import { SitemapStream } from './sitemap-stream';
import { WriteStream } from 'fs';
export declare enum IndexTagNames {
    sitemap = "sitemap",
    loc = "loc",
    lastmod = "lastmod"
}
export interface SitemapIndexStreamOptions extends TransformOptions {
    level?: ErrorLevel;
    xslUrl?: string;
}
export declare class SitemapIndexStream extends Transform {
    level: ErrorLevel;
    xslUrl?: string;
    private hasHeadOutput;
    constructor(opts?: SitemapIndexStreamOptions);
    _transform(item: IndexItem | string, encoding: string, callback: TransformCallback): void;
    _flush(cb: TransformCallback): void;
}
/**
 * Shortcut for `new SitemapIndex (...)`.
 * Create several sitemaps and an index automatically from a list of urls
 *
 * @deprecated Use SitemapAndIndexStream
 * @param   {Object}        conf
 * @param   {String|Array}  conf.urls
 * @param   {String}        conf.targetFolder where do you want the generated index and maps put
 * @param   {String}        conf.hostname required for index file, will also be used as base url for sitemap items
 * @param   {String}        conf.sitemapName what do you want to name the files it generats
 * @param   {Number}        conf.sitemapSize maximum number of entries a sitemap should have before being split
 * @param   {Boolean}       conf.gzip whether to gzip the files (defaults to true)
 * @return  {SitemapIndex}
 */
export declare function createSitemapsAndIndex({ urls, targetFolder, hostname, sitemapName, sitemapSize, gzip, xslUrl, }: {
    urls: (string | SitemapItemLoose)[];
    targetFolder: string;
    hostname?: string;
    sitemapName?: string;
    sitemapSize?: number;
    gzip?: boolean;
    xslUrl?: string;
}): Promise<boolean>;
declare type getSitemapStream = (i: number) => [IndexItem | string, SitemapStream, WriteStream];
/** @deprecated */
declare type getSitemapStreamDeprecated = (i: number) => [IndexItem | string, SitemapStream];
export interface SitemapAndIndexStreamOptions extends SitemapIndexStreamOptions {
    level?: ErrorLevel;
    limit?: number;
    getSitemapStream: getSitemapStream;
}
export interface SitemapAndIndexStreamOptionsDeprecated extends SitemapIndexStreamOptions {
    level?: ErrorLevel;
    limit?: number;
    getSitemapStream: getSitemapStreamDeprecated;
}
export declare class SitemapAndIndexStream extends SitemapIndexStream {
    private i;
    private getSitemapStream;
    private currentSitemap;
    private currentSitemapPipeline?;
    private idxItem;
    private limit;
    /**
     * @deprecated this version does not properly wait for everything to write before resolving
     * pass a 3rd param in your return from getSitemapStream that is the writeable stream
     * to remove this warning
     */
    constructor(opts: SitemapAndIndexStreamOptionsDeprecated);
    constructor(opts: SitemapAndIndexStreamOptions);
    _writeSMI(item: SitemapItemLoose): void;
    _transform(item: SitemapItemLoose, encoding: string, callback: TransformCallback): void;
    _flush(cb: TransformCallback): void;
}
export {};
