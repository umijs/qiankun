"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleSitemapAndIndex = void 0;
const index_1 = require("../index");
const zlib_1 = require("zlib");
const fs_1 = require("fs");
const path_1 = require("path");
const stream_1 = require("stream");
const util_1 = require("util");
const url_1 = require("url");
const pipeline = util_1.promisify(stream_1.pipeline);
const simpleSitemapAndIndex = async ({ hostname, sitemapHostname = hostname, // if different
/**
 * Pass a line separated list of sitemap items or a stream or an array
 */
sourceData, destinationDir, limit = 50000, gzip = true, }) => {
    await fs_1.promises.mkdir(destinationDir, { recursive: true });
    const sitemapAndIndexStream = new index_1.SitemapAndIndexStream({
        limit,
        getSitemapStream: (i) => {
            const sitemapStream = new index_1.SitemapStream({
                hostname,
            });
            const path = `./sitemap-${i}.xml`;
            const writePath = path_1.resolve(destinationDir, path + (gzip ? '.gz' : ''));
            let pipeline;
            if (gzip) {
                pipeline = sitemapStream
                    .pipe(zlib_1.createGzip()) // compress the output of the sitemap
                    .pipe(fs_1.createWriteStream(writePath)); // write it to sitemap-NUMBER.xml
            }
            else {
                pipeline = sitemapStream.pipe(fs_1.createWriteStream(writePath)); // write it to sitemap-NUMBER.xml
            }
            return [
                new url_1.URL(`${path}${gzip ? '.gz' : ''}`, sitemapHostname).toString(),
                sitemapStream,
                pipeline,
            ];
        },
    });
    let src;
    if (typeof sourceData === 'string') {
        src = index_1.lineSeparatedURLsToSitemapOptions(fs_1.createReadStream(sourceData));
    }
    else if (sourceData instanceof stream_1.Readable) {
        src = sourceData;
    }
    else if (Array.isArray(sourceData)) {
        src = stream_1.Readable.from(sourceData);
    }
    else {
        throw new Error("unhandled source type. You've passed in data that is not supported");
    }
    const writePath = path_1.resolve(destinationDir, `./sitemap-index.xml${gzip ? '.gz' : ''}`);
    if (gzip) {
        return pipeline(src, sitemapAndIndexStream, zlib_1.createGzip(), fs_1.createWriteStream(writePath));
    }
    else {
        return pipeline(src, sitemapAndIndexStream, fs_1.createWriteStream(writePath));
    }
};
exports.simpleSitemapAndIndex = simpleSitemapAndIndex;
exports.default = exports.simpleSitemapAndIndex;
