"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemCache = void 0;
const ramda_1 = __importDefault(require("ramda"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const f = __importStar(require("./funcs"));
const formatPath = ramda_1.default.pipe(f.ensureString('./.cache'), f.toAbsolutePath);
class FileSystemCache {
    constructor(options = {}) {
        this.basePath = formatPath(options.basePath);
        this.ns = f.hash(options.ns);
        if (f.isString(options.extension)) {
            this.extension = options.extension;
        }
        if (f.isFileSync(this.basePath)) {
            throw new Error(`The basePath '${this.basePath}' is a file. It should be a folder.`);
        }
    }
    path(key) {
        if (f.isNothing(key)) {
            throw new Error(`Path requires a cache key.`);
        }
        let name = f.hash(key);
        if (this.ns) {
            name = `${this.ns}-${name}`;
        }
        if (this.extension) {
            name = `${name}.${this.extension.replace(/^\./, '')}`;
        }
        return `${this.basePath}/${name}`;
    }
    fileExists(key) {
        return f.existsP(this.path(key));
    }
    ensureBasePath() {
        return new Promise((resolve, reject) => {
            if (this.basePathExists) {
                resolve();
            }
            else {
                fs_extra_1.default.ensureDir(this.basePath, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this.basePathExists = true;
                        resolve();
                    }
                });
            }
        });
    }
    get(key, defaultValue) {
        return f.getValueP(this.path(key), defaultValue);
    }
    getSync(key, defaultValue) {
        const path = this.path(key);
        return fs_extra_1.default.existsSync(path) ? f.toGetValue(fs_extra_1.default.readJsonSync(path)) : defaultValue;
    }
    set(key, value) {
        const path = this.path(key);
        return new Promise((resolve, reject) => {
            this.ensureBasePath()
                .then(() => {
                fs_extra_1.default.outputFile(path, f.toJson(value), (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({ path });
                    }
                });
            })
                .catch((err) => reject(err));
        });
    }
    setSync(key, value) {
        fs_extra_1.default.outputFileSync(this.path(key), f.toJson(value));
        return this;
    }
    remove(key) {
        return f.removeFileP(this.path(key));
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const paths = yield f.filePathsP(this.basePath, this.ns);
            yield Promise.all(paths.map((path) => fs_extra_1.default.remove(path)));
            console.groupEnd();
        });
    }
    save(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = (Array.isArray(input) ? input : [input]);
            const isValid = (item) => {
                if (!ramda_1.default.is(Object, item))
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
            const paths = yield f.filePathsP(this.basePath, this.ns);
            if (paths.length === 0)
                return { files: [] };
            const files = yield Promise.all(paths.map((path) => __awaiter(this, void 0, void 0, function* () { return ({ path, value: yield f.getValueP(path) }); })));
            return { files };
        });
    }
}
exports.FileSystemCache = FileSystemCache;
