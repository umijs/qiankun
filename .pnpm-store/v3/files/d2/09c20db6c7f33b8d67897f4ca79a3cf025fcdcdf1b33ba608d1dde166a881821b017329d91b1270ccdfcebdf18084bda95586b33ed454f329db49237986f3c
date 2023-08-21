"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numbersToAlpha = exports.Grammar = exports.ATTRIBUTE = void 0;
const DomUtil = require("../common/dom_util");
const engine_1 = require("../common/engine");
const LocaleUtil = require("../l10n/locale_util");
const locale_1 = require("../l10n/locale");
exports.ATTRIBUTE = 'grammar';
class Grammar {
    constructor() {
        this.currentFlags = {};
        this.parameters_ = {};
        this.corrections_ = {};
        this.preprocessors_ = {};
        this.stateStack_ = [];
    }
    static getInstance() {
        Grammar.instance = Grammar.instance || new Grammar();
        return Grammar.instance;
    }
    static parseInput(grammar) {
        const attributes = {};
        const components = grammar.split(':');
        for (let i = 0, l = components.length; i < l; i++) {
            const comp = components[i].split('=');
            const key = comp[0].trim();
            if (comp[1]) {
                attributes[key] = comp[1].trim();
                continue;
            }
            key.match(/^!/)
                ? (attributes[key.slice(1)] = false)
                : (attributes[key] = true);
        }
        return attributes;
    }
    static parseState(stateStr) {
        const state = {};
        const corrections = stateStr.split(' ');
        for (let i = 0, l = corrections.length; i < l; i++) {
            const corr = corrections[i].split(':');
            const key = corr[0];
            const value = corr[1];
            state[key] = value ? value : true;
        }
        return state;
    }
    static translateString_(text) {
        if (text.match(/:unit$/)) {
            return Grammar.translateUnit_(text);
        }
        const engine = engine_1.default.getInstance();
        let result = engine.evaluator(text, engine.dynamicCstr);
        result = result === null ? text : result;
        if (Grammar.getInstance().getParameter('plural')) {
            result = locale_1.LOCALE.FUNCTIONS.plural(result);
        }
        return result;
    }
    static translateUnit_(text) {
        text = Grammar.prepareUnit_(text);
        const engine = engine_1.default.getInstance();
        const plural = Grammar.getInstance().getParameter('plural');
        const strict = engine.strict;
        const baseCstr = `${engine.locale}.${engine.modality}.default`;
        engine.strict = true;
        let cstr;
        let result;
        if (plural) {
            cstr = engine.defaultParser.parse(baseCstr + '.plural');
            result = engine.evaluator(text, cstr);
        }
        if (result) {
            engine.strict = strict;
            return result;
        }
        cstr = engine.defaultParser.parse(baseCstr + '.default');
        result = engine.evaluator(text, cstr);
        engine.strict = strict;
        if (!result) {
            return Grammar.cleanUnit_(text);
        }
        if (plural) {
            result = locale_1.LOCALE.FUNCTIONS.plural(result);
        }
        return result;
    }
    static prepareUnit_(text) {
        const match = text.match(/:unit$/);
        return match
            ? text.slice(0, match.index).replace(/\s+/g, ' ') +
                text.slice(match.index)
            : text;
    }
    static cleanUnit_(text) {
        if (text.match(/:unit$/)) {
            return text.replace(/:unit$/, '');
        }
        return text;
    }
    clear() {
        this.parameters_ = {};
        this.stateStack_ = [];
    }
    setParameter(parameter, value) {
        const oldValue = this.parameters_[parameter];
        value
            ? (this.parameters_[parameter] = value)
            : delete this.parameters_[parameter];
        return oldValue;
    }
    getParameter(parameter) {
        return this.parameters_[parameter];
    }
    setCorrection(correction, func) {
        this.corrections_[correction] = func;
    }
    setPreprocessor(preprocessor, func) {
        this.preprocessors_[preprocessor] = func;
    }
    getCorrection(correction) {
        return this.corrections_[correction];
    }
    getState() {
        const pairs = [];
        for (const key in this.parameters_) {
            const value = this.parameters_[key];
            pairs.push(typeof value === 'string' ? key + ':' + value : key);
        }
        return pairs.join(' ');
    }
    pushState(assignment) {
        for (const key in assignment) {
            assignment[key] = this.setParameter(key, assignment[key]);
        }
        this.stateStack_.push(assignment);
    }
    popState() {
        const assignment = this.stateStack_.pop();
        for (const key in assignment) {
            this.setParameter(key, assignment[key]);
        }
    }
    setAttribute(node) {
        if (node && node.nodeType === DomUtil.NodeType.ELEMENT_NODE) {
            const state = this.getState();
            if (state) {
                node.setAttribute(exports.ATTRIBUTE, state);
            }
        }
    }
    preprocess(text) {
        return this.runProcessors_(text, this.preprocessors_);
    }
    correct(text) {
        return this.runProcessors_(text, this.corrections_);
    }
    apply(text, opt_flags) {
        this.currentFlags = opt_flags || {};
        text =
            this.currentFlags.adjust || this.currentFlags.preprocess
                ? Grammar.getInstance().preprocess(text)
                : text;
        if (this.parameters_['translate'] || this.currentFlags.translate) {
            text = Grammar.translateString_(text);
        }
        text =
            this.currentFlags.adjust || this.currentFlags.correct
                ? Grammar.getInstance().correct(text)
                : text;
        this.currentFlags = {};
        return text;
    }
    runProcessors_(text, funcs) {
        for (const key in this.parameters_) {
            const func = funcs[key];
            if (!func) {
                continue;
            }
            const value = this.parameters_[key];
            text = value === true ? func(text) : func(text, value);
        }
        return text;
    }
}
exports.Grammar = Grammar;
function correctFont_(text, correction) {
    if (!correction || !text) {
        return text;
    }
    const regexp = locale_1.LOCALE.FUNCTIONS.fontRegexp(LocaleUtil.localFont(correction));
    return text.replace(regexp, '');
}
function correctCaps_(text) {
    let cap = locale_1.LOCALE.ALPHABETS.capPrefix[engine_1.default.getInstance().domain];
    if (typeof cap === 'undefined') {
        cap = locale_1.LOCALE.ALPHABETS.capPrefix['default'];
    }
    return correctFont_(text, cap);
}
function addAnnotation_(text, annotation) {
    return text + ':' + annotation;
}
function numbersToAlpha(text) {
    return text.match(/\d+/)
        ? locale_1.LOCALE.NUMBERS.numberToWords(parseInt(text, 10))
        : text;
}
exports.numbersToAlpha = numbersToAlpha;
function noTranslateText_(text) {
    if (text.match(new RegExp('^[' + locale_1.LOCALE.MESSAGES.regexp.TEXT + ']+$'))) {
        Grammar.getInstance().currentFlags['translate'] = false;
    }
    return text;
}
Grammar.getInstance().setCorrection('localFont', LocaleUtil.localFont);
Grammar.getInstance().setCorrection('localRole', LocaleUtil.localRole);
Grammar.getInstance().setCorrection('localEnclose', LocaleUtil.localEnclose);
Grammar.getInstance().setCorrection('ignoreFont', correctFont_);
Grammar.getInstance().setPreprocessor('annotation', addAnnotation_);
Grammar.getInstance().setPreprocessor('noTranslateText', noTranslateText_);
Grammar.getInstance().setCorrection('ignoreCaps', correctCaps_);
Grammar.getInstance().setPreprocessor('numbers2alpha', numbersToAlpha);
