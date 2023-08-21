"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathspeakRules = void 0;
const dynamic_cstr_1 = require("../rule_engine/dynamic_cstr");
const StoreUtil = require("../rule_engine/store_util");
const MathspeakFrenchUtil = require("./mathspeak_french_util");
const MathspeakUtil = require("./mathspeak_util");
const NumbersUtil = require("./numbers_util");
const SpeechRules = require("./speech_rules");
const UnitUtil = require("./unit_util");
function MathspeakRules() {
    SpeechRules.addStore(dynamic_cstr_1.DynamicCstr.BASE_LOCALE + '.speech.mathspeak', '', {
        CQFspaceoutNumber: MathspeakUtil.spaceoutNumber,
        CQFspaceoutIdentifier: MathspeakUtil.spaceoutIdentifier,
        CSFspaceoutText: MathspeakUtil.spaceoutText,
        CSFopenFracVerbose: MathspeakUtil.openingFractionVerbose,
        CSFcloseFracVerbose: MathspeakUtil.closingFractionVerbose,
        CSFoverFracVerbose: MathspeakUtil.overFractionVerbose,
        CSFopenFracBrief: MathspeakUtil.openingFractionBrief,
        CSFcloseFracBrief: MathspeakUtil.closingFractionBrief,
        CSFopenFracSbrief: MathspeakUtil.openingFractionSbrief,
        CSFcloseFracSbrief: MathspeakUtil.closingFractionSbrief,
        CSFoverFracSbrief: MathspeakUtil.overFractionSbrief,
        CSFvulgarFraction: NumbersUtil.vulgarFraction,
        CQFvulgarFractionSmall: MathspeakUtil.isSmallVulgarFraction,
        CSFopenRadicalVerbose: MathspeakUtil.openingRadicalVerbose,
        CSFcloseRadicalVerbose: MathspeakUtil.closingRadicalVerbose,
        CSFindexRadicalVerbose: MathspeakUtil.indexRadicalVerbose,
        CSFopenRadicalBrief: MathspeakUtil.openingRadicalBrief,
        CSFcloseRadicalBrief: MathspeakUtil.closingRadicalBrief,
        CSFindexRadicalBrief: MathspeakUtil.indexRadicalBrief,
        CSFopenRadicalSbrief: MathspeakUtil.openingRadicalSbrief,
        CSFindexRadicalSbrief: MathspeakUtil.indexRadicalSbrief,
        CQFisSmallRoot: MathspeakUtil.smallRoot,
        CSFsuperscriptVerbose: MathspeakUtil.superscriptVerbose,
        CSFsuperscriptBrief: MathspeakUtil.superscriptBrief,
        CSFsubscriptVerbose: MathspeakUtil.subscriptVerbose,
        CSFsubscriptBrief: MathspeakUtil.subscriptBrief,
        CSFbaselineVerbose: MathspeakUtil.baselineVerbose,
        CSFbaselineBrief: MathspeakUtil.baselineBrief,
        CSFleftsuperscriptVerbose: MathspeakUtil.superscriptVerbose,
        CSFleftsubscriptVerbose: MathspeakUtil.subscriptVerbose,
        CSFrightsuperscriptVerbose: MathspeakUtil.superscriptVerbose,
        CSFrightsubscriptVerbose: MathspeakUtil.subscriptVerbose,
        CSFleftsuperscriptBrief: MathspeakUtil.superscriptBrief,
        CSFleftsubscriptBrief: MathspeakUtil.subscriptBrief,
        CSFrightsuperscriptBrief: MathspeakUtil.superscriptBrief,
        CSFrightsubscriptBrief: MathspeakUtil.subscriptBrief,
        CSFunderscript: MathspeakUtil.nestedUnderscript,
        CSFoverscript: MathspeakUtil.nestedOverscript,
        CSFendscripts: MathspeakUtil.endscripts,
        CTFordinalCounter: NumbersUtil.ordinalCounter,
        CTFwordCounter: NumbersUtil.wordCounter,
        CTFcontentIterator: StoreUtil.contentIterator,
        CQFdetIsSimple: MathspeakUtil.determinantIsSimple,
        CSFRemoveParens: MathspeakUtil.removeParens,
        CQFresetNesting: MathspeakUtil.resetNestingDepth,
        CGFbaselineConstraint: MathspeakUtil.generateBaselineConstraint,
        CGFtensorRules: MathspeakUtil.generateTensorRules
    });
    SpeechRules.addStore('es.speech.mathspeak', dynamic_cstr_1.DynamicCstr.BASE_LOCALE + '.speech.mathspeak', {
        CTFunitMultipliers: UnitUtil.unitMultipliers,
        CQFoneLeft: UnitUtil.oneLeft
    });
    SpeechRules.addStore('fr.speech.mathspeak', dynamic_cstr_1.DynamicCstr.BASE_LOCALE + '.speech.mathspeak', {
        CSFbaselineVerbose: MathspeakFrenchUtil.baselineVerbose,
        CSFbaselineBrief: MathspeakFrenchUtil.baselineBrief,
        CSFleftsuperscriptVerbose: MathspeakFrenchUtil.leftSuperscriptVerbose,
        CSFleftsubscriptVerbose: MathspeakFrenchUtil.leftSubscriptVerbose,
        CSFleftsuperscriptBrief: MathspeakFrenchUtil.leftSuperscriptBrief,
        CSFleftsubscriptBrief: MathspeakFrenchUtil.leftSubscriptBrief
    });
}
exports.MathspeakRules = MathspeakRules;
