"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearspeakRules = void 0;
const dynamic_cstr_1 = require("../rule_engine/dynamic_cstr");
const StoreUtil = require("../rule_engine/store_util");
const ClearspeakUtil = require("./clearspeak_util");
const MathspeakUtil = require("./mathspeak_util");
const NumbersUtil = require("./numbers_util");
const SpeechRules = require("./speech_rules");
function ClearspeakRules() {
    SpeechRules.addStore(dynamic_cstr_1.DynamicCstr.BASE_LOCALE + '.speech.clearspeak', '', {
        CTFpauseSeparator: StoreUtil.pauseSeparator,
        CTFnodeCounter: ClearspeakUtil.nodeCounter,
        CTFcontentIterator: StoreUtil.contentIterator,
        CSFvulgarFraction: NumbersUtil.vulgarFraction,
        CQFvulgarFractionSmall: ClearspeakUtil.isSmallVulgarFraction,
        CQFcellsSimple: ClearspeakUtil.allCellsSimple,
        CSFordinalExponent: ClearspeakUtil.ordinalExponent,
        CSFwordOrdinal: ClearspeakUtil.wordOrdinal,
        CQFmatchingFences: ClearspeakUtil.matchingFences,
        CSFnestingDepth: ClearspeakUtil.nestingDepth,
        CQFfencedArguments: ClearspeakUtil.fencedArguments,
        CQFsimpleArguments: ClearspeakUtil.simpleArguments,
        CQFspaceoutNumber: MathspeakUtil.spaceoutNumber
    });
}
exports.ClearspeakRules = ClearspeakRules;
