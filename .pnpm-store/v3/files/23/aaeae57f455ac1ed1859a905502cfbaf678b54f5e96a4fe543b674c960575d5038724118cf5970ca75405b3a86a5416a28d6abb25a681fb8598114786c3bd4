"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leftSubscriptBrief = exports.leftSuperscriptBrief = exports.leftSubscriptVerbose = exports.leftSuperscriptVerbose = exports.baselineBrief = exports.baselineVerbose = void 0;
const MathspeakUtil = require("./mathspeak_util");
function baselineVerbose(node) {
    const baseline = MathspeakUtil.baselineVerbose(node);
    return baseline.replace(/-$/, '');
}
exports.baselineVerbose = baselineVerbose;
function baselineBrief(node) {
    const baseline = MathspeakUtil.baselineBrief(node);
    return baseline.replace(/-$/, '');
}
exports.baselineBrief = baselineBrief;
function leftSuperscriptVerbose(node) {
    const leftIndex = MathspeakUtil.superscriptVerbose(node);
    return leftIndex.replace(/^exposant/, 'exposant gauche');
}
exports.leftSuperscriptVerbose = leftSuperscriptVerbose;
function leftSubscriptVerbose(node) {
    const leftIndex = MathspeakUtil.subscriptVerbose(node);
    return leftIndex.replace(/^indice/, 'indice gauche');
}
exports.leftSubscriptVerbose = leftSubscriptVerbose;
function leftSuperscriptBrief(node) {
    const leftIndex = MathspeakUtil.superscriptBrief(node);
    return leftIndex.replace(/^sup/, 'sup gauche');
}
exports.leftSuperscriptBrief = leftSuperscriptBrief;
function leftSubscriptBrief(node) {
    const leftIndex = MathspeakUtil.subscriptBrief(node);
    return leftIndex.replace(/^sub/, 'sub gauche');
}
exports.leftSubscriptBrief = leftSubscriptBrief;
