"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.filePathsP = exports.removeFileP = exports.existsP = exports.readFileSync = exports.isFileSync = exports.toStringArray = exports.compact = exports.ensureString = exports.toAbsolutePath = exports.isString = exports.isNothing = void 0;
const ramda_1 = __importDefault(require("ramda"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const isNothing = (value) => ramda_1.default.isNil(value) || ramda_1.default.isEmpty(value);
exports.isNothing = isNothing;
exports.isString = ramda_1.default.is(String);
const toAbsolutePath = (path) => {
    return path.startsWith('.') ? path_1.default.resolve(path) : path;
};
exports.toAbsolutePath = toAbsolutePath;
exports.ensureString = ramda_1.default.curry((defaultValue, text) => ramda_1.default.is(String, text) ? text : defaultValue);
const compact = (input) => {
    return input.flat().filter((value) => !ramda_1.default.isNil(value));
};
exports.compact = compact;
exports.toStringArray = ramda_1.default.pipe(exports.compact, ramda_1.default.map(ramda_1.default.toString));
const isFileSync = (path) => {
    if (fs_extra_1.default.existsSync(path))
        return fs_extra_1.default.lstatSync(path).isFile();
    return false;
};
exports.isFileSync = isFileSync;
const readFileSync = (path) => {
    if (fs_extra_1.default.existsSync(path)) {
        return fs_extra_1.default.readFileSync(path).toString();
    }
};
exports.readFileSync = readFileSync;
const existsP = (path) => new Promise((resolve) => {
    fs_extra_1.default.pathExists(path, (exists) => resolve(exists));
});
exports.existsP = existsP;
const removeFileP = (path) => new Promise((resolve, reject) => {
    (0, exports.existsP)(path).then((exists) => {
        if (exists) {
            fs_extra_1.default.remove(path, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        }
        else {
            resolve();
        }
    });
});
exports.removeFileP = removeFileP;
const filePathsP = (basePath, ns) => new Promise((resolve, reject) => {
    (0, exports.existsP)(basePath).then((exists) => {
        if (!exists) {
            resolve([]);
            return;
        }
        fs_extra_1.default.readdir(basePath, (err, fileNames) => {
            if (err) {
                reject(err);
            }
            else {
                const paths = ramda_1.default.pipe(exports.compact, ramda_1.default.filter((name) => (ns ? name.startsWith(ns) : true)), ramda_1.default.filter((name) => (!ns ? !name.includes('-') : true)), ramda_1.default.map((name) => `${basePath}/${name}`))(fileNames);
                resolve(paths);
            }
        });
    });
});
exports.filePathsP = filePathsP;
const hash = (...values) => {
    if (ramda_1.default.pipe(exports.compact, ramda_1.default.isEmpty)(values)) {
        return undefined;
    }
    const resultHash = crypto_1.default.createHash('md5');
    const addValue = (value) => resultHash.update(value);
    const addValues = ramda_1.default.forEach(addValue);
    ramda_1.default.pipe(exports.toStringArray, addValues)(values);
    return resultHash.digest('hex');
};
exports.hash = hash;
