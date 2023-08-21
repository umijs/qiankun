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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sreReady = exports.Sre = void 0;
var Api = __importStar(require("speech-rule-engine/js/common/system.js"));
var WalkerFactory = __importStar(require("speech-rule-engine/js/walker/walker_factory.js"));
var SpeechGeneratorFactory = __importStar(require("speech-rule-engine/js/speech_generator/speech_generator_factory.js"));
var EngineConst = __importStar(require("speech-rule-engine/js/common/engine_const.js"));
var engine_js_1 = __importDefault(require("speech-rule-engine/js/common/engine.js"));
var clearspeak_preferences_js_1 = require("speech-rule-engine/js/speech_rules/clearspeak_preferences.js");
var HighlighterFactory = __importStar(require("speech-rule-engine/js/highlighter/highlighter_factory.js"));
var variables_js_1 = require("speech-rule-engine/js/common/variables.js");
var mathmaps_js_1 = __importDefault(require("./mathmaps.js"));
var Sre;
(function (Sre) {
    Sre.locales = variables_js_1.Variables.LOCALES;
    Sre.sreReady = Api.engineReady;
    Sre.setupEngine = Api.setupEngine;
    Sre.engineSetup = Api.engineSetup;
    Sre.toEnriched = Api.toEnriched;
    Sre.toSpeech = Api.toSpeech;
    Sre.clearspeakPreferences = clearspeak_preferences_js_1.ClearspeakPreferences;
    Sre.getHighlighter = HighlighterFactory.highlighter;
    Sre.getSpeechGenerator = SpeechGeneratorFactory.generator;
    Sre.getWalker = WalkerFactory.walker;
    Sre.clearspeakStyle = function () {
        return EngineConst.DOMAIN_TO_STYLES['clearspeak'];
    };
    Sre.preloadLocales = function (locale) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                json = mathmaps_js_1.default.get(locale);
                return [2, json ? new Promise(function (res, _rej) { return res(JSON.stringify(json)); }) :
                        Api.localeLoader()(locale)];
            });
        });
    };
})(Sre = exports.Sre || (exports.Sre = {}));
exports.sreReady = Sre.sreReady;
engine_js_1.default.getInstance().delay = true;
exports.default = Sre;
//# sourceMappingURL=sre.js.map