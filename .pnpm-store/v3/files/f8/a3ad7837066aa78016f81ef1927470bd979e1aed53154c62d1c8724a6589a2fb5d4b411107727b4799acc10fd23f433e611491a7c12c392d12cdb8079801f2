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
exports.localePath = exports.exit = exports.move = exports.walk = exports.processFile = exports.file = exports.vulgar = exports.numericOrdinal = exports.ordinal = exports.number = exports.toEnriched = exports.toDescription = exports.toJson = exports.toSemantic = exports.toSpeech = exports.localeLoader = exports.engineReady = exports.engineSetup = exports.setupEngine = exports.version = void 0;
const engine_1 = require("./engine");
const engine_setup_1 = require("./engine_setup");
const EngineConst = require("./engine_const");
const FileUtil = require("./file_util");
const ProcessorFactory = require("./processor_factory");
const system_external_1 = require("./system_external");
const variables_1 = require("./variables");
const math_map_1 = require("../speech_rules/math_map");
exports.version = variables_1.Variables.VERSION;
function setupEngine(feature) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, engine_setup_1.setup)(feature);
    });
}
exports.setupEngine = setupEngine;
function engineSetup() {
    const engineFeatures = ['mode'].concat(engine_1.default.STRING_FEATURES, engine_1.default.BINARY_FEATURES);
    const engine = engine_1.default.getInstance();
    const features = {};
    engineFeatures.forEach(function (x) {
        features[x] = engine[x];
    });
    features.json = system_external_1.default.jsonPath;
    features.xpath = system_external_1.default.WGXpath;
    features.rules = engine.ruleSets.slice();
    return features;
}
exports.engineSetup = engineSetup;
function engineReady() {
    return __awaiter(this, void 0, void 0, function* () {
        return setupEngine({}).then(() => engine_1.EnginePromise.getall());
    });
}
exports.engineReady = engineReady;
exports.localeLoader = math_map_1.standardLoader;
function toSpeech(expr) {
    return processString('speech', expr);
}
exports.toSpeech = toSpeech;
function toSemantic(expr) {
    return processString('semantic', expr);
}
exports.toSemantic = toSemantic;
function toJson(expr) {
    return processString('json', expr);
}
exports.toJson = toJson;
function toDescription(expr) {
    return processString('description', expr);
}
exports.toDescription = toDescription;
function toEnriched(expr) {
    return processString('enriched', expr);
}
exports.toEnriched = toEnriched;
function number(expr) {
    return processString('number', expr);
}
exports.number = number;
function ordinal(expr) {
    return processString('ordinal', expr);
}
exports.ordinal = ordinal;
function numericOrdinal(expr) {
    return processString('numericOrdinal', expr);
}
exports.numericOrdinal = numericOrdinal;
function vulgar(expr) {
    return processString('vulgar', expr);
}
exports.vulgar = vulgar;
function processString(processor, input) {
    return ProcessorFactory.process(processor, input);
}
exports.file = {};
exports.file.toSpeech = function (input, opt_output) {
    return processFile('speech', input, opt_output);
};
exports.file.toSemantic = function (input, opt_output) {
    return processFile('semantic', input, opt_output);
};
exports.file.toJson = function (input, opt_output) {
    return processFile('json', input, opt_output);
};
exports.file.toDescription = function (input, opt_output) {
    return processFile('description', input, opt_output);
};
exports.file.toEnriched = function (input, opt_output) {
    return processFile('enriched', input, opt_output);
};
function processFile(processor, input, opt_output) {
    switch (engine_1.default.getInstance().mode) {
        case EngineConst.Mode.ASYNC:
            return processFileAsync(processor, input, opt_output);
        case EngineConst.Mode.SYNC:
            return processFileSync(processor, input, opt_output);
        default:
            throw new engine_1.SREError(`Can process files in ${engine_1.default.getInstance().mode} mode`);
    }
}
exports.processFile = processFile;
function processFileSync(processor, input, opt_output) {
    const expr = inputFileSync_(input);
    const result = ProcessorFactory.output(processor, expr);
    if (opt_output) {
        try {
            system_external_1.default.fs.writeFileSync(opt_output, result);
        }
        catch (err) {
            throw new engine_1.SREError('Can not write to file: ' + opt_output);
        }
    }
    return result;
}
function inputFileSync_(file) {
    let expr;
    try {
        expr = system_external_1.default.fs.readFileSync(file, { encoding: 'utf8' });
    }
    catch (err) {
        throw new engine_1.SREError('Can not open file: ' + file);
    }
    return expr;
}
function processFileAsync(processor, file, output) {
    return __awaiter(this, void 0, void 0, function* () {
        const expr = yield system_external_1.default.fs.promises.readFile(file, {
            encoding: 'utf8'
        });
        const result = ProcessorFactory.output(processor, expr);
        if (output) {
            try {
                system_external_1.default.fs.promises.writeFile(output, result);
            }
            catch (_err) {
                throw new engine_1.SREError('Can not write to file: ' + output);
            }
        }
        return result;
    });
}
function walk(expr) {
    return ProcessorFactory.output('walker', expr);
}
exports.walk = walk;
function move(direction) {
    return ProcessorFactory.keypress('move', direction);
}
exports.move = move;
function exit(opt_value) {
    const value = opt_value || 0;
    engine_1.EnginePromise.getall().then(() => process.exit(value));
}
exports.exit = exit;
exports.localePath = FileUtil.localePath;
if (system_external_1.default.documentSupported) {
    setupEngine({ mode: EngineConst.Mode.HTTP }).then(() => setupEngine({}));
}
else {
    setupEngine({ mode: EngineConst.Mode.SYNC }).then(() => setupEngine({ mode: EngineConst.Mode.ASYNC }));
}
