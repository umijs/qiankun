"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechRuleContext = void 0;
const XpathUtil = require("../common/xpath_util");
const srf = require("./speech_rule_functions");
class SpeechRuleContext {
    constructor() {
        this.customQueries = new srf.CustomQueries();
        this.customStrings = new srf.CustomStrings();
        this.contextFunctions = new srf.ContextFunctions();
        this.customGenerators = new srf.CustomGenerators();
    }
    applyCustomQuery(node, funcName) {
        const func = this.customQueries.lookup(funcName);
        return func ? func(node) : null;
    }
    applySelector(node, expr) {
        const result = this.applyCustomQuery(node, expr);
        return result || XpathUtil.evalXPath(expr, node);
    }
    applyQuery(node, expr) {
        const results = this.applySelector(node, expr);
        if (results.length > 0) {
            return results[0];
        }
        return null;
    }
    applyConstraint(node, expr) {
        const result = this.applyQuery(node, expr);
        return !!result || XpathUtil.evaluateBoolean(expr, node);
    }
    constructString(node, expr) {
        if (!expr) {
            return '';
        }
        if (expr.charAt(0) === '"') {
            return expr.slice(1, -1);
        }
        const func = this.customStrings.lookup(expr);
        if (func) {
            return func(node);
        }
        return XpathUtil.evaluateString(expr, node);
    }
    parse(functions) {
        const functs = Array.isArray(functions)
            ? functions
            : Object.entries(functions);
        for (let i = 0, func; (func = functs[i]); i++) {
            const kind = func[0].slice(0, 3);
            switch (kind) {
                case 'CQF':
                    this.customQueries.add(func[0], func[1]);
                    break;
                case 'CSF':
                    this.customStrings.add(func[0], func[1]);
                    break;
                case 'CTF':
                    this.contextFunctions.add(func[0], func[1]);
                    break;
                case 'CGF':
                    this.customGenerators.add(func[0], func[1]);
                    break;
                default:
                    console.error('FunctionError: Invalid function name ' + func[0]);
            }
        }
    }
}
exports.SpeechRuleContext = SpeechRuleContext;
