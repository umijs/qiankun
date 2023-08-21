"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Condition = exports.BaseRuleStore = void 0;
const auditory_description_1 = require("../audio/auditory_description");
const dynamic_cstr_1 = require("./dynamic_cstr");
const speech_rule_1 = require("./speech_rule");
const speech_rule_context_1 = require("./speech_rule_context");
class BaseRuleStore {
    constructor() {
        this.context = new speech_rule_context_1.SpeechRuleContext();
        this.parseOrder = dynamic_cstr_1.DynamicCstr.DEFAULT_ORDER;
        this.parser = new dynamic_cstr_1.DynamicCstrParser(this.parseOrder);
        this.locale = dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_1.Axis.LOCALE];
        this.modality = dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_1.Axis.MODALITY];
        this.domain = '';
        this.initialized = false;
        this.inherits = null;
        this.kind = 'standard';
        this.customTranscriptions = {};
        this.preconditions = new Map();
        this.speechRules_ = [];
        this.rank = 0;
        this.parseMethods = {
            Rule: this.defineRule,
            Generator: this.generateRules,
            Action: this.defineAction,
            Precondition: this.definePrecondition,
            Ignore: this.ignoreRules
        };
    }
    static compareStaticConstraints_(cstr1, cstr2) {
        if (cstr1.length !== cstr2.length) {
            return false;
        }
        for (let i = 0, cstr; (cstr = cstr1[i]); i++) {
            if (cstr2.indexOf(cstr) === -1) {
                return false;
            }
        }
        return true;
    }
    static comparePreconditions_(rule1, rule2) {
        const prec1 = rule1.precondition;
        const prec2 = rule2.precondition;
        if (prec1.query !== prec2.query) {
            return false;
        }
        return BaseRuleStore.compareStaticConstraints_(prec1.constraints, prec2.constraints);
    }
    defineRule(name, dynamic, action, prec, ...args) {
        const postc = this.parseAction(action);
        const fullPrec = this.parsePrecondition(prec, args);
        const dynamicCstr = this.parseCstr(dynamic);
        if (!(postc && fullPrec && dynamicCstr)) {
            console.error(`Rule Error: ${prec}, (${dynamic}): ${action}`);
            return null;
        }
        const rule = new speech_rule_1.SpeechRule(name, dynamicCstr, fullPrec, postc);
        rule.precondition.rank = this.rank++;
        this.addRule(rule);
        return rule;
    }
    addRule(rule) {
        rule.context = this.context;
        this.speechRules_.unshift(rule);
    }
    deleteRule(rule) {
        const index = this.speechRules_.indexOf(rule);
        if (index !== -1) {
            this.speechRules_.splice(index, 1);
        }
    }
    findRule(pred) {
        for (let i = 0, rule; (rule = this.speechRules_[i]); i++) {
            if (pred(rule)) {
                return rule;
            }
        }
        return null;
    }
    findAllRules(pred) {
        return this.speechRules_.filter(pred);
    }
    evaluateDefault(node) {
        const rest = node.textContent.slice(0);
        if (rest.match(/^\s+$/)) {
            return this.evaluateWhitespace(rest);
        }
        return this.evaluateString(rest);
    }
    evaluateWhitespace(_str) {
        return [];
    }
    evaluateCustom(str) {
        const trans = this.customTranscriptions[str];
        return trans !== undefined
            ? auditory_description_1.AuditoryDescription.create({ text: trans }, { adjust: true, translate: false })
            : null;
    }
    evaluateCharacter(str) {
        return (this.evaluateCustom(str) ||
            auditory_description_1.AuditoryDescription.create({ text: str }, { adjust: true, translate: true }));
    }
    removeDuplicates(rule) {
        for (let i = this.speechRules_.length - 1, oldRule; (oldRule = this.speechRules_[i]); i--) {
            if (oldRule !== rule &&
                rule.dynamicCstr.equal(oldRule.dynamicCstr) &&
                BaseRuleStore.comparePreconditions_(oldRule, rule)) {
                this.speechRules_.splice(i, 1);
            }
        }
    }
    getSpeechRules() {
        return this.speechRules_;
    }
    setSpeechRules(rules) {
        this.speechRules_ = rules;
    }
    getPreconditions() {
        return this.preconditions;
    }
    parseCstr(cstr) {
        try {
            return this.parser.parse(this.locale +
                '.' +
                this.modality +
                (this.domain ? '.' + this.domain : '') +
                '.' +
                cstr);
        }
        catch (err) {
            if (err.name === 'RuleError') {
                console.error('Rule Error ', `Illegal Dynamic Constraint: ${cstr}.`, err.message);
                return null;
            }
            else {
                throw err;
            }
        }
    }
    parsePrecondition(query, rest) {
        try {
            const queryCstr = this.parsePrecondition_(query);
            query = queryCstr[0];
            let restCstr = queryCstr.slice(1);
            for (const cstr of rest) {
                restCstr = restCstr.concat(this.parsePrecondition_(cstr));
            }
            return new speech_rule_1.Precondition(query, ...restCstr);
        }
        catch (err) {
            if (err.name === 'RuleError') {
                console.error('Rule Error ', `Illegal preconditions: ${query}, ${rest}.`, err.message);
                return null;
            }
            else {
                throw err;
            }
        }
    }
    parseAction(action) {
        try {
            return speech_rule_1.Action.fromString(action);
        }
        catch (err) {
            if (err.name === 'RuleError') {
                console.error('Rule Error ', `Illegal action: ${action}.`, err.message);
                return null;
            }
            else {
                throw err;
            }
        }
    }
    parse(ruleSet) {
        this.modality = ruleSet.modality || this.modality;
        this.locale = ruleSet.locale || this.locale;
        this.domain = ruleSet.domain || this.domain;
        this.context.parse(ruleSet.functions || []);
        if (ruleSet.kind !== 'actions') {
            this.kind = ruleSet.kind || this.kind;
            this.inheritRules();
        }
        this.parseRules(ruleSet.rules || []);
    }
    parseRules(rules) {
        for (let i = 0, rule; (rule = rules[i]); i++) {
            const type = rule[0];
            const method = this.parseMethods[type];
            if (type && method) {
                method.apply(this, rule.slice(1));
            }
        }
    }
    generateRules(generator) {
        const method = this.context.customGenerators.lookup(generator);
        if (method) {
            method(this);
        }
    }
    defineAction(name, action) {
        let postc;
        try {
            postc = speech_rule_1.Action.fromString(action);
        }
        catch (err) {
            if (err.name === 'RuleError') {
                console.error('Action Error ', action, err.message);
                return;
            }
            else {
                throw err;
            }
        }
        const prec = this.getFullPreconditions(name);
        if (!prec) {
            console.error(`Action Error: No precondition for action ${name}`);
            return;
        }
        this.ignoreRules(name);
        const regexp = new RegExp('^\\w+\\.\\w+\\.' + (this.domain ? '\\w+\\.' : ''));
        prec.conditions.forEach(([dynamic, prec]) => {
            const newDynamic = this.parseCstr(dynamic.toString().replace(regexp, ''));
            this.addRule(new speech_rule_1.SpeechRule(name, newDynamic, prec, postc));
        });
    }
    getFullPreconditions(name) {
        const prec = this.preconditions.get(name);
        if (prec || !this.inherits) {
            return prec;
        }
        return this.inherits.getFullPreconditions(name);
    }
    definePrecondition(name, dynamic, prec, ...args) {
        const fullPrec = this.parsePrecondition(prec, args);
        const dynamicCstr = this.parseCstr(dynamic);
        if (!(fullPrec && dynamicCstr)) {
            console.error(`Precondition Error: ${prec}, (${dynamic})`);
            return;
        }
        fullPrec.rank = this.rank++;
        this.preconditions.set(name, new Condition(dynamicCstr, fullPrec));
    }
    inheritRules() {
        if (!this.inherits || !this.inherits.getSpeechRules().length) {
            return;
        }
        const regexp = new RegExp('^\\w+\\.\\w+\\.' + (this.domain ? '\\w+\\.' : ''));
        this.inherits.getSpeechRules().forEach((rule) => {
            const newDynamic = this.parseCstr(rule.dynamicCstr.toString().replace(regexp, ''));
            this.addRule(new speech_rule_1.SpeechRule(rule.name, newDynamic, rule.precondition, rule.action));
        });
    }
    ignoreRules(name, ...cstrs) {
        let rules = this.findAllRules((r) => r.name === name);
        if (!cstrs.length) {
            rules.forEach(this.deleteRule.bind(this));
            return;
        }
        let rest = [];
        for (const cstr of cstrs) {
            const dynamic = this.parseCstr(cstr);
            for (const rule of rules) {
                if (dynamic.equal(rule.dynamicCstr)) {
                    this.deleteRule(rule);
                }
                else {
                    rest.push(rule);
                }
            }
            rules = rest;
            rest = [];
        }
    }
    parsePrecondition_(cstr) {
        const generator = this.context.customGenerators.lookup(cstr);
        return generator ? generator() : [cstr];
    }
}
exports.BaseRuleStore = BaseRuleStore;
class Condition {
    constructor(base, condition) {
        this.base = base;
        this._conditions = [];
        this.constraints = [];
        this.allCstr = {};
        this.constraints.push(base);
        this.addCondition(base, condition);
    }
    get conditions() {
        return this._conditions;
    }
    addConstraint(dynamic) {
        if (this.constraints.filter((cstr) => cstr.equal(dynamic)).length) {
            return;
        }
        this.constraints.push(dynamic);
        const newConds = [];
        for (const [dyn, pre] of this.conditions) {
            if (this.base.equal(dyn)) {
                newConds.push([dynamic, pre]);
            }
        }
        this._conditions = this._conditions.concat(newConds);
    }
    addBaseCondition(cond) {
        this.addCondition(this.base, cond);
    }
    addFullCondition(cond) {
        this.constraints.forEach((cstr) => this.addCondition(cstr, cond));
    }
    addCondition(dynamic, cond) {
        const condStr = dynamic.toString() + ' ' + cond.toString();
        if (this.allCstr.condStr) {
            return;
        }
        this.allCstr[condStr] = true;
        this._conditions.push([dynamic, cond]);
    }
}
exports.Condition = Condition;
