"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const mimer_1 = __importDefault(require("mimer"));
const image_size_1 = require("image-size");
const uri_1 = __importDefault(require("./template/uri"));
const css_1 = __importDefault(require("./template/css"));
const defaultCSSConfig = {};
const readFile = util_1.default.promisify(fs_1.default.readFile);
class DataURIParser {
    async encode(fileName, handler) {
        try {
            this.base64 = await readFile(fileName, { 'encoding': 'base64' });
            this.createMetadata(fileName);
            handler && handler(undefined, this.content, this);
            return this.content;
        }
        catch (err) {
            if (handler) {
                handler(err);
                return;
            }
            throw err;
        }
    }
    format(fileName, fileContent) {
        const fileBuffer = (fileContent instanceof Buffer) ? fileContent : Buffer.from(fileContent);
        this.base64 = fileBuffer.toString('base64');
        this.createMetadata(fileName);
        return this;
    }
    getCSS(config = defaultCSSConfig) {
        config = config || {};
        if (!this.content || !this.fileName) {
            throw new Error('Create a data-uri config using the method encodeSync');
        }
        config.class = config.class || path_1.default.basename(this.fileName, path_1.default.extname(this.fileName));
        if (config.width || config.height || config['background-size']) {
            config.dimensions = image_size_1.imageSize(this.fileName);
        }
        return css_1.default(Object.assign(Object.assign({}, config), { background: this.content }));
    }
    createMetadata(fileName) {
        this.fileName = fileName;
        this.mimetype = mimer_1.default(fileName);
        this.content = uri_1.default(this);
        return this;
    }
}
module.exports = DataURIParser;
