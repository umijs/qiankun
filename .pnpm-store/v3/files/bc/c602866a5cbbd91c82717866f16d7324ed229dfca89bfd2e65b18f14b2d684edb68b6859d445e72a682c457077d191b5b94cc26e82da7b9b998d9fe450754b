"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrailleRules = exports.OtherRules = exports.PrefixRules = void 0;
const dynamic_cstr_1 = require("../rule_engine/dynamic_cstr");
const StoreUtil = require("../rule_engine/store_util");
const MathspeakUtil = require("./mathspeak_util");
const NemethUtil = require("./nemeth_util");
const NumbersUtil = require("./numbers_util");
const SpeechRules = require("./speech_rules");
function PrefixRules() {
    SpeechRules.addStore('en.prefix.default', '', {
        CSFordinalPosition: NumbersUtil.ordinalPosition
    });
}
exports.PrefixRules = PrefixRules;
function OtherRules() {
    SpeechRules.addStore('en.speech.chromevox', '', {
        CTFnodeCounter: StoreUtil.nodeCounter,
        CTFcontentIterator: StoreUtil.contentIterator
    });
    SpeechRules.addStore('en.speech.emacspeak', 'en.speech.chromevox', {
        CQFvulgarFractionSmall: MathspeakUtil.isSmallVulgarFraction,
        CSFvulgarFraction: NumbersUtil.vulgarFraction
    });
}
exports.OtherRules = OtherRules;
function BrailleRules() {
    SpeechRules.addStore('nemeth.braille.default', dynamic_cstr_1.DynamicCstr.BASE_LOCALE + '.speech.mathspeak', {
        CSFopenFraction: NemethUtil.openingFraction,
        CSFcloseFraction: NemethUtil.closingFraction,
        CSFoverFraction: NemethUtil.overFraction,
        CSFoverBevFraction: NemethUtil.overBevelledFraction,
        CQFhyperFraction: NemethUtil.hyperFractionBoundary,
        CSFopenRadical: NemethUtil.openingRadical,
        CSFcloseRadical: NemethUtil.closingRadical,
        CSFindexRadical: NemethUtil.indexRadical,
        CSFsubscript: MathspeakUtil.subscriptVerbose,
        CSFsuperscript: MathspeakUtil.superscriptVerbose,
        CSFbaseline: MathspeakUtil.baselineVerbose,
        CGFtensorRules: (st) => MathspeakUtil.generateTensorRules(st, false),
        CTFrelationIterator: NemethUtil.relationIterator,
        CTFimplicitIterator: NemethUtil.implicitIterator
    });
}
exports.BrailleRules = BrailleRules;
