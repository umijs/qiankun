"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareMmlString = exports.testTranslation = exports.semanticMathml = exports.semanticMathmlSync = exports.semanticMathmlNode = void 0;
const debugger_1 = require("../common/debugger");
const DomUtil = require("../common/dom_util");
const engine_1 = require("../common/engine");
const Semantic = require("../semantic_tree/semantic");
const EnrichMathml = require("./enrich_mathml");
require("./enrich_case_factory");
function semanticMathmlNode(mml) {
    const clone = DomUtil.cloneNode(mml);
    const tree = Semantic.getTree(clone);
    return EnrichMathml.enrich(clone, tree);
}
exports.semanticMathmlNode = semanticMathmlNode;
function semanticMathmlSync(expr) {
    const mml = DomUtil.parseInput(expr);
    return semanticMathmlNode(mml);
}
exports.semanticMathmlSync = semanticMathmlSync;
function semanticMathml(expr, callback) {
    engine_1.EnginePromise.getall().then(() => {
        const mml = DomUtil.parseInput(expr);
        callback(semanticMathmlNode(mml));
    });
}
exports.semanticMathml = semanticMathml;
function testTranslation(expr) {
    debugger_1.Debugger.getInstance().init();
    const mml = semanticMathmlSync(prepareMmlString(expr));
    debugger_1.Debugger.getInstance().exit();
    return mml;
}
exports.testTranslation = testTranslation;
function prepareMmlString(expr) {
    if (!expr.match(/^<math/)) {
        expr = '<math>' + expr;
    }
    if (!expr.match(/\/math>$/)) {
        expr += '</math>';
    }
    return expr;
}
exports.prepareMmlString = prepareMmlString;
