"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemCache = void 0;
const common_1 = require("./common");
const formatPath = common_1.R.pipe(common_1.Util.ensureString('./.cache'), common_1.Util.toAbsolutePath);
class FileSystemCache {
    constructor(options = {}) {
        this.basePath = formatPath(options.basePath);
        this.ns = common_1.Util.hash(options.ns);
        if (common_1.Util.isString(options.extension))
            this.extension = options.extension;
        if (common_1.Util.isFileSync(this.basePath)) {
            throw new Error(`The basePath '${this.basePath}' is a file. It should be a folder.`);
        }
    }
    path(key) {
        if (common_1.Util.isNothing(key))
            throw new Error(`Path requires a cache key.`);
        let name = common_1.Util.hash(key);
        if (this.ns)
            name = `${this.ns}-${name}`;
        if (this.extension)
            name = `${name}.${this.extension.replace(/^\./, '')}`;
        return `${this.basePath}/${name}`;
    }
    fileExists(key) {
        return common_1.fs.pathExists(this.path(key));
    }
    ensureBasePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.basePathExists)
                yield common_1.fs.ensureDir(this.basePath);
            this.basePathExists = true;
        });
    }
    get(key, defaultValue) {
        return common_1.Util.getValueP(this.path(key), defaultValue);
    }
    getSync(key, defaultValue) {
        const path = this.path(key);
        return common_1.fs.existsSync(path) ? common_1.Util.toGetValue(common_1.fs.readJsonSync(path)) : defaultValue;
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = this.path(key);
            yield this.ensureBasePath();
            yield common_1.fs.outputFile(path, common_1.Util.toJson(value));
            return { path };
        });
    }
    setSync(key, value) {
        common_1.fs.outputFileSync(this.path(key), common_1.Util.toJson(value));
        return this;
    }
    remove(key) {
        return common_1.fs.remove(this.path(key));
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = yield common_1.Util.filePathsP(this.basePath, this.ns);
            yield Promise.all(paths.map((path) => common_1.fs.remove(path)));
            console.groupEnd();
        });
    }
    save(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = (Array.isArray(input) ? input : [input]);
            const isValid = (item) => {
                if (!common_1.R.is(Object, item))
                    return false;
                return item.key && item.value;
            };
            items = items.filter((item) => Boolean(item));
            items
                .filter((item) => !isValid(item))
                .forEach(() => {
                const err = `Save items not valid, must be an array of {key, value} objects.`;
                throw new Error(err);
            });
            if (items.length === 0)
                return { paths: [] };
            const paths = yield Promise.all(items.map((item) => __awaiter(this, void 0, void 0, function* () { return (yield this.set(item.key, item.value)).path; })));
            return { paths };
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = yield common_1.Util.filePathsP(this.basePath, this.ns);
            if (paths.length === 0)
                return { files: [] };
            const files = yield Promise.all(paths.map((path) => __awaiter(this, void 0, void 0, function* () { return ({ path, value: yield common_1.Util.getValueP(path) }); })));
            return { files };
        });
    }
}
exports.FileSystemCache = FileSystemCache;
