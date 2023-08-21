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
exports.toJson = exports.toGetValue = exports.getValueP = exports.hash = exports.filePathsP = exports.readFileSync = exports.isFileSync = exports.toStringArray = exports.compact = exports.ensureString = exports.toAbsolutePath = exports.isString = exports.isNothing = void 0;
const libs_1 = require("./libs");
const isNothing = (value) => libs_1.R.isNil(value) || libs_1.R.isEmpty(value);
exports.isNothing = isNothing;
exports.isString = libs_1.R.is(String);
const toAbsolutePath = (path) => {
    return path.startsWith('.') ? libs_1.fsPath.resolve(path) : path;
};
exports.toAbsolutePath = toAbsolutePath;
exports.ensureString = libs_1.R.curry((defaultValue, text) => libs_1.R.is(String, text) ? text : defaultValue);
const compact = (input) => {
    return input.flat().filter((value) => !libs_1.R.isNil(value));
};
exports.compact = compact;
exports.toStringArray = libs_1.R.pipe(exports.compact, libs_1.R.map(libs_1.R.toString));
const isFileSync = (path) => {
    return libs_1.fs.existsSync(path) ? libs_1.fs.lstatSync(path).isFile() : false;
};
exports.isFileSync = isFileSync;
const readFileSync = (path) => {
    return libs_1.fs.existsSync(path) ? libs_1.fs.readFileSync(path).toString() : undefined;
};
exports.readFileSync = readFileSync;
const filePathsP = (basePath, ns) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield libs_1.fs.pathExists(basePath)))
        return [];
    return (yield libs_1.fs.readdir(basePath))
        .filter(Boolean)
        .filter((name) => (ns ? name.startsWith(ns) : true))
        .filter((name) => (!ns ? !name.includes('-') : true))
        .map((name) => `${basePath}/${name}`);
});
exports.filePathsP = filePathsP;
const hash = (...values) => {
    if (libs_1.R.pipe(exports.compact, libs_1.R.isEmpty)(values))
        return undefined;
    const resultHash = libs_1.crypto.createHash('md5');
    const addValue = (value) => resultHash.update(value);
    const addValues = libs_1.R.forEach(addValue);
    libs_1.R.pipe(exports.toStringArray, addValues)(values);
    return resultHash.digest('hex');
};
exports.hash = hash;
function getValueP(path, defaultValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const exists = yield libs_1.fs.pathExists(path);
        if (!exists)
            return defaultValue;
        try {
            return (0, exports.toGetValue)(yield libs_1.fs.readJson(path));
        }
        catch (error) {
            if (error.code === 'ENOENT')
                return defaultValue;
            throw new Error(`Failed to read cache value at: ${path}. ${error.message}`);
        }
    });
}
exports.getValueP = getValueP;
const toGetValue = (data) => {
    if (data.type === 'Date')
        return new Date(data.value);
    return data.value;
};
exports.toGetValue = toGetValue;
const toJson = (value) => JSON.stringify({ value, type: libs_1.R.type(value) });
exports.toJson = toJson;
