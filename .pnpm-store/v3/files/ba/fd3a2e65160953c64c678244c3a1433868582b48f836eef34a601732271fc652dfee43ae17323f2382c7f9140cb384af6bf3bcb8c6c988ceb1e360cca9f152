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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const f = __importStar(require("./funcs"));
const formatPath = ramda_1.default.pipe(f.ensureString('./.cache'), f.toAbsolutePath);
const toGetValue = (data) => {
    const { type } = data;
    let { value } = data;
    if (type === 'Date') {
        value = new Date(value);
    }
    return value;
};
const getValueP = (path, defaultValue) => new Promise((resolve, reject) => {
    fs_extra_1.default.readJson(path, (err, result) => {
        if (err) {
            if (err.code === 'ENOENT') {
                resolve(defaultValue);
            }
            else {
                reject(err);
            }
        }
        else {
            const value = toGetValue(result);
            resolve(value);
        }
    });
});
const toJson = (value) => JSON.stringify({ value, type: ramda_1.default.type(value) });
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
        return getValueP(this.path(key), defaultValue);
    }
    getSync(key, defaultValue) {
        const path = this.path(key);
        return fs_extra_1.default.existsSync(path) ? toGetValue(fs_extra_1.default.readJsonSync(path)) : defaultValue;
    }
    set(key, value) {
        const path = this.path(key);
        return new Promise((resolve, reject) => {
            this.ensureBasePath()
                .then(() => {
                fs_extra_1.default.outputFile(path, toJson(value), (err) => {
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
        fs_extra_1.default.outputFileSync(this.path(key), toJson(value));
        return this;
    }
    remove(key) {
        return f.removeFileP(this.path(key));
    }
    clear() {
        return new Promise((resolve, reject) => {
            var _a;
            f.filePathsP(this.basePath, (_a = this.ns) !== null && _a !== void 0 ? _a : '')
                .then((paths) => {
                const remove = (index) => {
                    const path = paths[index];
                    if (path) {
                        f.removeFileP(path)
                            .then(() => remove(index + 1))
                            .catch((err) => reject(err));
                    }
                    else {
                        resolve();
                    }
                };
                remove(0);
            })
                .catch((err) => reject(err));
        });
    }
    save(items) {
        if (!ramda_1.default.is(Array, items)) {
            items = [items];
        }
        const isValid = (item) => {
            if (!ramda_1.default.is(Object, item)) {
                return false;
            }
            return item.key && item.value;
        };
        items = items.filter((item) => Boolean(item));
        items.forEach((item) => {
            if (!isValid(item)) {
                throw new Error(`Save items not valid, must be an array of {key, value} objects.`);
            }
        });
        return new Promise((resolve, reject) => {
            const response = { paths: [] };
            if (items.length === 0) {
                resolve(response);
                return;
            }
            const setValue = (index) => {
                const item = items[index];
                if (item) {
                    this.set(item.key, item.value)
                        .then((result) => {
                        response.paths[index] = result.path;
                        setValue(index + 1);
                    })
                        .catch((err) => reject(err));
                }
                else {
                    resolve(response);
                }
            };
            setValue(0);
        });
    }
    load() {
        return new Promise((resolve, reject) => {
            var _a;
            f.filePathsP(this.basePath, (_a = this.ns) !== null && _a !== void 0 ? _a : '')
                .then((paths) => {
                const response = { files: [] };
                if (paths.length === 0) {
                    resolve(response);
                    return;
                }
                const getValue = (index) => {
                    const path = paths[index];
                    if (path) {
                        getValueP(path)
                            .then((result) => {
                            response.files[index] = { path, value: result };
                            getValue(index + 1);
                        })
                            .catch((err) => reject(err));
                    }
                    else {
                        resolve(response);
                    }
                };
                getValue(0);
            })
                .catch((err) => reject(err));
        });
    }
}
exports.default = FileSystemCache;
