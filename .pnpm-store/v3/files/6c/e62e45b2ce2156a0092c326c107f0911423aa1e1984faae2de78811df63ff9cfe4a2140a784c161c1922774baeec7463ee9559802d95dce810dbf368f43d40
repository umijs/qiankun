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
exports.loadAjax = exports.loadFileSync = exports.loadFile = exports.parseMaps = exports.retrieveFiles = exports.standardLoader = exports.loadLocale = exports.store = void 0;
const BrowserUtil = require("../common/browser_util");
const engine_1 = require("../common/engine");
const EngineConst = require("../common/engine_const");
const FileUtil = require("../common/file_util");
const system_external_1 = require("../common/system_external");
const dynamic_cstr_1 = require("../rule_engine/dynamic_cstr");
const MathCompoundStore = require("../rule_engine/math_compound_store");
const speech_rule_engine_1 = require("../rule_engine/speech_rule_engine");
const l10n_1 = require("../l10n/l10n");
const AlphabetGenerator = require("./alphabet_generator");
exports.store = MathCompoundStore;
const addSymbols = {
    functions: MathCompoundStore.addFunctionRules,
    symbols: MathCompoundStore.addSymbolRules,
    units: MathCompoundStore.addUnitRules,
    si: MathCompoundStore.setSiPrefixes
};
let _init = false;
function loadLocale(locale = engine_1.default.getInstance().locale) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!_init) {
            _loadLocale(dynamic_cstr_1.DynamicCstr.BASE_LOCALE);
            _init = true;
        }
        return engine_1.EnginePromise.promises[dynamic_cstr_1.DynamicCstr.BASE_LOCALE].then(() => __awaiter(this, void 0, void 0, function* () {
            const defLoc = engine_1.default.getInstance().defaultLocale;
            if (defLoc) {
                _loadLocale(defLoc);
                return engine_1.EnginePromise.promises[defLoc].then(() => __awaiter(this, void 0, void 0, function* () {
                    _loadLocale(locale);
                    return engine_1.EnginePromise.promises[locale];
                }));
            }
            _loadLocale(locale);
            return engine_1.EnginePromise.promises[locale];
        }));
    });
}
exports.loadLocale = loadLocale;
function _loadLocale(locale = engine_1.default.getInstance().locale) {
    if (!engine_1.EnginePromise.loaded[locale]) {
        engine_1.EnginePromise.loaded[locale] = [false, false];
        retrieveMaps(locale);
    }
}
function loadMethod() {
    if (engine_1.default.getInstance().customLoader) {
        return engine_1.default.getInstance().customLoader;
    }
    return standardLoader();
}
function standardLoader() {
    switch (engine_1.default.getInstance().mode) {
        case EngineConst.Mode.ASYNC:
            return loadFile;
        case EngineConst.Mode.HTTP:
            return loadAjax;
        case EngineConst.Mode.SYNC:
        default:
            return loadFileSync;
    }
}
exports.standardLoader = standardLoader;
function retrieveFiles(locale) {
    const loader = loadMethod();
    const promise = new Promise((res) => {
        const inner = loader(locale);
        inner.then((str) => {
            parseMaps(str);
            engine_1.EnginePromise.loaded[locale] = [true, true];
            res(locale);
        }, (_err) => {
            engine_1.EnginePromise.loaded[locale] = [true, false];
            console.error(`Unable to load locale: ${locale}`);
            engine_1.default.getInstance().locale = engine_1.default.getInstance().defaultLocale;
            res(locale);
        });
    });
    engine_1.EnginePromise.promises[locale] = promise;
}
exports.retrieveFiles = retrieveFiles;
function parseMaps(json) {
    const js = JSON.parse(json);
    addMaps(js);
}
exports.parseMaps = parseMaps;
function addMaps(json, opt_locale) {
    let generate = true;
    for (let i = 0, key; (key = Object.keys(json)[i]); i++) {
        const info = key.split('/');
        if (opt_locale && opt_locale !== info[0]) {
            continue;
        }
        if (info[1] === 'rules') {
            speech_rule_engine_1.SpeechRuleEngine.getInstance().addStore(json[key]);
        }
        else if (info[1] === 'messages') {
            (0, l10n_1.completeLocale)(json[key]);
        }
        else {
            if (generate) {
                AlphabetGenerator.generate(info[0]);
                generate = false;
            }
            json[key].forEach(addSymbols[info[1]]);
        }
    }
}
function retrieveMaps(locale) {
    if (engine_1.default.getInstance().isIE &&
        engine_1.default.getInstance().mode === EngineConst.Mode.HTTP) {
        getJsonIE_(locale);
        return;
    }
    retrieveFiles(locale);
}
function getJsonIE_(locale, opt_count) {
    let count = opt_count || 1;
    if (!BrowserUtil.mapsForIE) {
        if (count <= 5) {
            setTimeout((() => getJsonIE_(locale, count++)).bind(this), 300);
        }
        return;
    }
    addMaps(BrowserUtil.mapsForIE, locale);
}
function loadFile(locale) {
    const file = FileUtil.localePath(locale);
    return new Promise((res, rej) => {
        system_external_1.default.fs.readFile(file, 'utf8', (err, json) => {
            if (err) {
                return rej(err);
            }
            res(json);
        });
    });
}
exports.loadFile = loadFile;
function loadFileSync(locale) {
    const file = FileUtil.localePath(locale);
    return new Promise((res, rej) => {
        let str = '{}';
        try {
            str = system_external_1.default.fs.readFileSync(file, 'utf8');
        }
        catch (err) {
            return rej(err);
        }
        res(str);
    });
}
exports.loadFileSync = loadFileSync;
function loadAjax(locale) {
    const file = FileUtil.localePath(locale);
    const httpRequest = new XMLHttpRequest();
    return new Promise((res, rej) => {
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) {
                const status = httpRequest.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    res(httpRequest.responseText);
                }
                else {
                    rej(status);
                }
            }
        };
        httpRequest.open('GET', file, true);
        httpRequest.send();
    });
}
exports.loadAjax = loadAjax;
