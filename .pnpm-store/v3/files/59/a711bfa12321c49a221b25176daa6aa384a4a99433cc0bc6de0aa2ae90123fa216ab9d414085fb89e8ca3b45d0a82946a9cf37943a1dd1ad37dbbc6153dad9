"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapAndIndexStream = exports.createSitemapsAndIndex = exports.SitemapIndexStream = exports.IndexTagNames = void 0;
const util_1 = require("util");
const url_1 = require("url");
const fs_1 = require("fs");
const zlib_1 = require("zlib");
const stream_1 = require("stream");
const types_1 = require("./types");
const errors_1 = require("./errors");
const utils_1 = require("./utils");
const sitemap_stream_1 = require("./sitemap-stream");
const sitemap_xml_1 = require("./sitemap-xml");
var IndexTagNames;
(function (IndexTagNames) {
    IndexTagNames["sitemap"] = "sitemap";
    IndexTagNames["loc"] = "loc";
    IndexTagNames["lastmod"] = "lastmod";
})(IndexTagNames = exports.IndexTagNames || (exports.IndexTagNames = {}));
const statPromise = util_1.promisify(fs_1.stat);
const xmlDec = '<?xml version="1.0" encoding="UTF-8"?>';
const sitemapIndexTagStart = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const closetag = '</sitemapindex>';
const defaultStreamOpts = {};
class SitemapIndexStream extends stream_1.Transform {
    constructor(opts = defaultStreamOpts) {
        var _a;
        opts.objectMode = true;
        super(opts);
        this.hasHeadOutput = false;
        this.level = (_a = opts.level) !== null && _a !== void 0 ? _a : types_1.ErrorLevel.WARN;
        this.xslUrl = opts.xslUrl;
    }
    _transform(item, encoding, callback) {
        if (!this.hasHeadOutput) {
            this.hasHeadOutput = true;
            let stylesheet = '';
            if (this.xslUrl) {
                stylesheet = sitemap_stream_1.stylesheetInclude(this.xslUrl);
            }
            this.push(xmlDec + stylesheet + sitemapIndexTagStart);
        }
        this.push(sitemap_xml_1.otag(IndexTagNames.sitemap));
        if (typeof item === 'string') {
            this.push(sitemap_xml_1.element(IndexTagNames.loc, item));
        }
        else {
            this.push(sitemap_xml_1.element(IndexTagNames.loc, item.url));
            if (item.lastmod) {
                this.push(sitemap_xml_1.element(IndexTagNames.lastmod, new Date(item.lastmod).toISOString()));
            }
        }
        this.push(sitemap_xml_1.ctag(IndexTagNames.sitemap));
        callback();
    }
    _flush(cb) {
        this.push(closetag);
        cb();
    }
}
exports.SitemapIndexStream = SitemapIndexStream;
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
async function createSitemapsAndIndex({ urls, targetFolder, hostname, sitemapName = 'sitemap', sitemapSize = 50000, gzip = true, xslUrl, }) {
    const indexStream = new SitemapIndexStream({ xslUrl });
    try {
        const stats = await statPromise(targetFolder);
        if (!stats.isDirectory()) {
            throw new errors_1.UndefinedTargetFolder();
        }
    }
    catch (e) {
        throw new errors_1.UndefinedTargetFolder();
    }
    const indexWS = fs_1.createWriteStream(targetFolder + '/' + sitemapName + '-index.xml');
    indexStream.pipe(indexWS);
    const smPromises = utils_1.chunk(urls, sitemapSize).map((chunk, idx) => {
        return new Promise((resolve, reject) => {
            const extension = '.xml' + (gzip ? '.gz' : '');
            const filename = sitemapName + '-' + idx + extension;
            indexStream.write(new url_1.URL(filename, hostname).toString());
            const ws = fs_1.createWriteStream(targetFolder + '/' + filename);
            const sms = new sitemap_stream_1.SitemapStream({ hostname, xslUrl });
            let pipe;
            if (gzip) {
                pipe = sms.pipe(zlib_1.createGzip()).pipe(ws);
            }
            else {
                pipe = sms.pipe(ws);
            }
            chunk.forEach((smi) => sms.write(smi));
            sms.end();
            pipe.on('finish', () => resolve(true));
            pipe.on('error', (e) => reject(e));
        });
    });
    return Promise.all(smPromises).then(() => {
        indexStream.end();
        return true;
    });
}
exports.createSitemapsAndIndex = createSitemapsAndIndex;
// const defaultSIStreamOpts: SitemapAndIndexStreamOptions = {};
class SitemapAndIndexStream extends SitemapIndexStream {
    constructor(opts) {
        var _a;
        opts.objectMode = true;
        super(opts);
        this.i = 0;
        this.getSitemapStream = opts.getSitemapStream;
        [
            this.idxItem,
            this.currentSitemap,
            this.currentSitemapPipeline,
        ] = this.getSitemapStream(0);
        this.limit = (_a = opts.limit) !== null && _a !== void 0 ? _a : 45000;
    }
    _writeSMI(item) {
        this.currentSitemap.write(item);
        this.i++;
    }
    _transform(item, encoding, callback) {
        var _a;
        if (this.i === 0) {
            this._writeSMI(item);
            super._transform(this.idxItem, encoding, callback);
        }
        else if (this.i % this.limit === 0) {
            const onFinish = () => {
                const [idxItem, currentSitemap, currentSitemapPipeline,] = this.getSitemapStream(this.i / this.limit);
                this.currentSitemap = currentSitemap;
                this.currentSitemapPipeline = currentSitemapPipeline;
                this._writeSMI(item);
                // push to index stream
                super._transform(idxItem, encoding, callback);
            };
            (_a = this.currentSitemapPipeline) === null || _a === void 0 ? void 0 : _a.on('finish', onFinish);
            this.currentSitemap.end(!this.currentSitemapPipeline ? onFinish : undefined);
        }
        else {
            this._writeSMI(item);
            callback();
        }
    }
    _flush(cb) {
        var _a;
        const onFinish = () => super._flush(cb);
        (_a = this.currentSitemapPipeline) === null || _a === void 0 ? void 0 : _a.on('finish', onFinish);
        this.currentSitemap.end(!this.currentSitemapPipeline ? onFinish : undefined);
    }
}
exports.SitemapAndIndexStream = SitemapAndIndexStream;
