"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keypress = exports.output = exports.print = exports.process = exports.set = void 0;
const AuralRendering = require("../audio/aural_rendering");
const Enrich = require("../enrich_mathml/enrich");
const HighlighterFactory = require("../highlighter/highlighter_factory");
const locale_1 = require("../l10n/locale");
const Semantic = require("../semantic_tree/semantic");
const SpeechGeneratorFactory = require("../speech_generator/speech_generator_factory");
const SpeechGeneratorUtil = require("../speech_generator/speech_generator_util");
const WalkerFactory = require("../walker/walker_factory");
const WalkerUtil = require("../walker/walker_util");
const DomUtil = require("./dom_util");
const engine_1 = require("./engine");
const EngineConst = require("../common/engine_const");
const processor_1 = require("./processor");
const XpathUtil = require("./xpath_util");
const PROCESSORS = new Map();
function set(processor) {
    PROCESSORS.set(processor.name, processor);
}
exports.set = set;
function get_(name) {
    const processor = PROCESSORS.get(name);
    if (!processor) {
        throw new engine_1.SREError('Unknown processor ' + name);
    }
    return processor;
}
function process(name, expr) {
    const processor = get_(name);
    try {
        return processor.processor(expr);
    }
    catch (_e) {
        throw new engine_1.SREError('Processing error for expression ' + expr);
    }
}
exports.process = process;
function print(name, data) {
    const processor = get_(name);
    return engine_1.default.getInstance().pprint
        ? processor.pprint(data)
        : processor.print(data);
}
exports.print = print;
function output(name, expr) {
    const processor = get_(name);
    try {
        const data = processor.processor(expr);
        return engine_1.default.getInstance().pprint
            ? processor.pprint(data)
            : processor.print(data);
    }
    catch (_e) {
        throw new engine_1.SREError('Processing error for expression ' + expr);
    }
}
exports.output = output;
function keypress(name, expr) {
    const processor = get_(name);
    const key = processor instanceof processor_1.KeyProcessor ? processor.key(expr) : expr;
    const data = processor.processor(key);
    return engine_1.default.getInstance().pprint
        ? processor.pprint(data)
        : processor.print(data);
}
exports.keypress = keypress;
set(new processor_1.Processor('semantic', {
    processor: function (expr) {
        const mml = DomUtil.parseInput(expr);
        return Semantic.xmlTree(mml);
    },
    postprocessor: function (xml, _expr) {
        const setting = engine_1.default.getInstance().speech;
        if (setting === EngineConst.Speech.NONE) {
            return xml;
        }
        const clone = DomUtil.cloneNode(xml);
        let speech = SpeechGeneratorUtil.computeMarkup(clone);
        if (setting === EngineConst.Speech.SHALLOW) {
            xml.setAttribute('speech', AuralRendering.finalize(speech));
            return xml;
        }
        const nodesXml = XpathUtil.evalXPath('.//*[@id]', xml);
        const nodesClone = XpathUtil.evalXPath('.//*[@id]', clone);
        for (let i = 0, orig, node; (orig = nodesXml[i]), (node = nodesClone[i]); i++) {
            speech = SpeechGeneratorUtil.computeMarkup(node);
            orig.setAttribute('speech', AuralRendering.finalize(speech));
        }
        return xml;
    },
    pprint: function (tree) {
        return DomUtil.formatXml(tree.toString());
    }
}));
set(new processor_1.Processor('speech', {
    processor: function (expr) {
        const mml = DomUtil.parseInput(expr);
        const xml = Semantic.xmlTree(mml);
        const descrs = SpeechGeneratorUtil.computeSpeech(xml);
        return AuralRendering.finalize(AuralRendering.markup(descrs));
    },
    pprint: function (speech) {
        const str = speech.toString();
        return AuralRendering.isXml() ? DomUtil.formatXml(str) : str;
    }
}));
set(new processor_1.Processor('json', {
    processor: function (expr) {
        const mml = DomUtil.parseInput(expr);
        const stree = Semantic.getTree(mml);
        return stree.toJson();
    },
    postprocessor: function (json, expr) {
        const setting = engine_1.default.getInstance().speech;
        if (setting === EngineConst.Speech.NONE) {
            return json;
        }
        const mml = DomUtil.parseInput(expr);
        const xml = Semantic.xmlTree(mml);
        const speech = SpeechGeneratorUtil.computeMarkup(xml);
        if (setting === EngineConst.Speech.SHALLOW) {
            json.stree.speech = AuralRendering.finalize(speech);
            return json;
        }
        const addRec = (json) => {
            const node = XpathUtil.evalXPath(`.//*[@id=${json.id}]`, xml)[0];
            const speech = SpeechGeneratorUtil.computeMarkup(node);
            json.speech = AuralRendering.finalize(speech);
            if (json.children) {
                json.children.forEach(addRec);
            }
        };
        addRec(json.stree);
        return json;
    },
    print: function (json) {
        return JSON.stringify(json);
    },
    pprint: function (json) {
        return JSON.stringify(json, null, 2);
    }
}));
set(new processor_1.Processor('description', {
    processor: function (expr) {
        const mml = DomUtil.parseInput(expr);
        const xml = Semantic.xmlTree(mml);
        const descrs = SpeechGeneratorUtil.computeSpeech(xml);
        return descrs;
    },
    print: function (descrs) {
        return JSON.stringify(descrs);
    },
    pprint: function (descrs) {
        return JSON.stringify(descrs, null, 2);
    }
}));
set(new processor_1.Processor('enriched', {
    processor: function (expr) {
        return Enrich.semanticMathmlSync(expr);
    },
    postprocessor: function (enr, _expr) {
        const root = WalkerUtil.getSemanticRoot(enr);
        let generator;
        switch (engine_1.default.getInstance().speech) {
            case EngineConst.Speech.NONE:
                break;
            case EngineConst.Speech.SHALLOW:
                generator = SpeechGeneratorFactory.generator('Adhoc');
                generator.getSpeech(root, enr);
                break;
            case EngineConst.Speech.DEEP:
                generator = SpeechGeneratorFactory.generator('Tree');
                generator.getSpeech(enr, enr);
                break;
            default:
                break;
        }
        return enr;
    },
    pprint: function (tree) {
        return DomUtil.formatXml(tree.toString());
    }
}));
set(new processor_1.Processor('walker', {
    processor: function (expr) {
        const generator = SpeechGeneratorFactory.generator('Node');
        processor_1.Processor.LocalState.speechGenerator = generator;
        generator.setOptions({
            modality: engine_1.default.getInstance().modality,
            locale: engine_1.default.getInstance().locale,
            domain: engine_1.default.getInstance().domain,
            style: engine_1.default.getInstance().style
        });
        processor_1.Processor.LocalState.highlighter = HighlighterFactory.highlighter({ color: 'black' }, { color: 'white' }, { renderer: 'NativeMML' });
        const node = process('enriched', expr);
        const eml = print('enriched', node);
        processor_1.Processor.LocalState.walker = WalkerFactory.walker(engine_1.default.getInstance().walker, node, generator, processor_1.Processor.LocalState.highlighter, eml);
        return processor_1.Processor.LocalState.walker;
    },
    print: function (_walker) {
        return processor_1.Processor.LocalState.walker.speech();
    }
}));
set(new processor_1.KeyProcessor('move', {
    processor: function (direction) {
        if (!processor_1.Processor.LocalState.walker) {
            return null;
        }
        const move = processor_1.Processor.LocalState.walker.move(direction);
        return move === false
            ? AuralRendering.error(direction)
            : processor_1.Processor.LocalState.walker.speech();
    }
}));
set(new processor_1.Processor('number', {
    processor: function (numb) {
        const num = parseInt(numb, 10);
        return isNaN(num) ? '' : locale_1.LOCALE.NUMBERS.numberToWords(num);
    }
}));
set(new processor_1.Processor('ordinal', {
    processor: function (numb) {
        const num = parseInt(numb, 10);
        return isNaN(num) ? '' : locale_1.LOCALE.NUMBERS.wordOrdinal(num);
    }
}));
set(new processor_1.Processor('numericOrdinal', {
    processor: function (numb) {
        const num = parseInt(numb, 10);
        return isNaN(num) ? '' : locale_1.LOCALE.NUMBERS.numericOrdinal(num);
    }
}));
set(new processor_1.Processor('vulgar', {
    processor: function (numb) {
        const [en, den] = numb.split('/').map((x) => parseInt(x, 10));
        return isNaN(en) || isNaN(den)
            ? ''
            : process('speech', `<mfrac><mn>${en}</mn><mn>${den}</mn></mfrac>`);
    }
}));
