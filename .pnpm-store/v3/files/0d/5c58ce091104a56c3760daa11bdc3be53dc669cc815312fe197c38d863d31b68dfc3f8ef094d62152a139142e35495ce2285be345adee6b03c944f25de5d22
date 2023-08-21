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
exports.setup = void 0;
const L10n = require("../l10n/l10n");
const MathMap = require("../speech_rules/math_map");
const BrowserUtil = require("./browser_util");
const debugger_1 = require("./debugger");
const engine_1 = require("./engine");
const FileUtil = require("./file_util");
const system_external_1 = require("./system_external");
function setup(feature) {
    return __awaiter(this, void 0, void 0, function* () {
        const engine = engine_1.default.getInstance();
        if (feature.domain === 'default' &&
            (feature.modality === 'speech' ||
                !feature.modality ||
                engine.modality === 'speech')) {
            feature.domain = 'mathspeak';
        }
        const setIf = (feat) => {
            if (typeof feature[feat] !== 'undefined') {
                engine[feat] = !!feature[feat];
            }
        };
        const setMulti = (feat) => {
            if (typeof feature[feat] !== 'undefined') {
                engine[feat] = feature[feat];
            }
        };
        setMulti('mode');
        engine.configurate(feature);
        engine_1.default.BINARY_FEATURES.forEach(setIf);
        engine_1.default.STRING_FEATURES.forEach(setMulti);
        if (feature.debug) {
            debugger_1.Debugger.getInstance().init();
        }
        if (feature.json) {
            system_external_1.default.jsonPath = FileUtil.makePath(feature.json);
        }
        if (feature.xpath) {
            system_external_1.default.WGXpath = feature.xpath;
        }
        engine.setCustomLoader(feature.custom);
        setupBrowsers(engine);
        L10n.setLocale();
        engine.setDynamicCstr();
        if (engine.init) {
            engine_1.EnginePromise.promises['init'] = new Promise((res, _rej) => {
                setTimeout(() => {
                    res('init');
                }, 10);
            });
            engine.init = false;
            return engine_1.EnginePromise.get();
        }
        if (engine.delay) {
            engine.delay = false;
            return engine_1.EnginePromise.get();
        }
        return MathMap.loadLocale();
    });
}
exports.setup = setup;
function setupBrowsers(engine) {
    engine.isIE = BrowserUtil.detectIE();
    engine.isEdge = BrowserUtil.detectEdge();
}
