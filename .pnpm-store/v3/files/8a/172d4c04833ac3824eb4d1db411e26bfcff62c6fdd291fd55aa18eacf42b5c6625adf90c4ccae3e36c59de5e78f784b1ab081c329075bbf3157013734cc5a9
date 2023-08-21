"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputError = exports.Precondition = exports.Action = exports.Component = exports.ActionType = exports.SpeechRule = void 0;
const engine_1 = require("../common/engine");
const Grammar = require("./grammar");
class SpeechRule {
    constructor(name, dynamicCstr, precondition, action) {
        this.name = name;
        this.dynamicCstr = dynamicCstr;
        this.precondition = precondition;
        this.action = action;
        this.context = null;
    }
    toString() {
        return (this.name +
            ' | ' +
            this.dynamicCstr.toString() +
            ' | ' +
            this.precondition.toString() +
            ' ==> ' +
            this.action.toString());
    }
}
exports.SpeechRule = SpeechRule;
var ActionType;
(function (ActionType) {
    ActionType["NODE"] = "NODE";
    ActionType["MULTI"] = "MULTI";
    ActionType["TEXT"] = "TEXT";
    ActionType["PERSONALITY"] = "PERSONALITY";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
function actionFromString(str) {
    switch (str) {
        case '[n]':
            return ActionType.NODE;
        case '[m]':
            return ActionType.MULTI;
        case '[t]':
            return ActionType.TEXT;
        case '[p]':
            return ActionType.PERSONALITY;
        default:
            throw 'Parse error: ' + str;
    }
}
function actionToString(speechType) {
    switch (speechType) {
        case ActionType.NODE:
            return '[n]';
        case ActionType.MULTI:
            return '[m]';
        case ActionType.TEXT:
            return '[t]';
        case ActionType.PERSONALITY:
            return '[p]';
        default:
            throw 'Unknown type error: ' + speechType;
    }
}
class Component {
    constructor({ type, content, attributes, grammar }) {
        this.type = type;
        this.content = content;
        this.attributes = attributes;
        this.grammar = grammar;
    }
    static grammarFromString(grammar) {
        return Grammar.Grammar.parseInput(grammar);
    }
    static fromString(input) {
        const output = {
            type: actionFromString(input.substring(0, 3))
        };
        let rest = input.slice(3).trim();
        if (!rest) {
            throw new OutputError('Missing content.');
        }
        switch (output.type) {
            case ActionType.TEXT:
                if (rest[0] === '"') {
                    const quotedString = splitString(rest, '\\(')[0].trim();
                    if (quotedString.slice(-1) !== '"') {
                        throw new OutputError('Invalid string syntax.');
                    }
                    output.content = quotedString;
                    rest = rest.slice(quotedString.length).trim();
                    if (rest.indexOf('(') === -1) {
                        rest = '';
                    }
                    break;
                }
            case ActionType.NODE:
            case ActionType.MULTI:
                {
                    const bracket = rest.indexOf(' (');
                    if (bracket === -1) {
                        output.content = rest.trim();
                        rest = '';
                        break;
                    }
                    output.content = rest.substring(0, bracket).trim();
                    rest = rest.slice(bracket).trim();
                }
                break;
        }
        if (rest) {
            const attributes = Component.attributesFromString(rest);
            if (attributes.grammar) {
                output.grammar = attributes.grammar;
                delete attributes.grammar;
            }
            if (Object.keys(attributes).length) {
                output.attributes = attributes;
            }
        }
        return new Component(output);
    }
    static attributesFromString(attrs) {
        if (attrs[0] !== '(' || attrs.slice(-1) !== ')') {
            throw new OutputError('Invalid attribute expression: ' + attrs);
        }
        const attributes = {};
        const attribs = splitString(attrs.slice(1, -1), ',');
        for (let i = 0, m = attribs.length; i < m; i++) {
            const attr = attribs[i];
            const colon = attr.indexOf(':');
            if (colon === -1) {
                attributes[attr.trim()] = 'true';
            }
            else {
                const key = attr.substring(0, colon).trim();
                const value = attr.slice(colon + 1).trim();
                attributes[key] =
                    key === Grammar.ATTRIBUTE
                        ? Component.grammarFromString(value)
                        : value;
            }
        }
        return attributes;
    }
    toString() {
        let strs = '';
        strs += actionToString(this.type);
        strs += this.content ? ' ' + this.content : '';
        const attrs = this.attributesToString();
        strs += attrs ? ' ' + attrs : '';
        return strs;
    }
    grammarToString() {
        return this.getGrammar().join(':');
    }
    getGrammar() {
        const attribs = [];
        for (const key in this.grammar) {
            if (this.grammar[key] === true) {
                attribs.push(key);
            }
            else if (this.grammar[key] === false) {
                attribs.push('!' + key);
            }
            else {
                attribs.push(key + '=' + this.grammar[key]);
            }
        }
        return attribs;
    }
    attributesToString() {
        const attribs = this.getAttributes();
        const grammar = this.grammarToString();
        if (grammar) {
            attribs.push('grammar:' + grammar);
        }
        return attribs.length > 0 ? '(' + attribs.join(', ') + ')' : '';
    }
    getAttributes() {
        const attribs = [];
        for (const key in this.attributes) {
            const value = this.attributes[key];
            value === 'true' ? attribs.push(key) : attribs.push(key + ':' + value);
        }
        return attribs;
    }
}
exports.Component = Component;
class Action {
    constructor(components) {
        this.components = components;
    }
    static fromString(input) {
        const comps = splitString(input, ';')
            .filter(function (x) {
            return x.match(/\S/);
        })
            .map(function (x) {
            return x.trim();
        });
        const newComps = [];
        for (let i = 0, m = comps.length; i < m; i++) {
            const comp = Component.fromString(comps[i]);
            if (comp) {
                newComps.push(comp);
            }
        }
        return new Action(newComps);
    }
    toString() {
        const comps = this.components.map(function (c) {
            return c.toString();
        });
        return comps.join('; ');
    }
}
exports.Action = Action;
class Precondition {
    constructor(query, ...cstr) {
        this.query = query;
        this.constraints = cstr;
        const [exists, user] = this.presetPriority();
        this.priority = exists ? user : this.calculatePriority();
    }
    static constraintValue(constr, priorities) {
        for (let i = 0, regexp; (regexp = priorities[i]); i++) {
            if (constr.match(regexp)) {
                return ++i;
            }
        }
        return 0;
    }
    toString() {
        const constrs = this.constraints.join(', ');
        return `${this.query}, ${constrs} (${this.priority}, ${this.rank})`;
    }
    calculatePriority() {
        const query = Precondition.constraintValue(this.query, Precondition.queryPriorities);
        if (!query) {
            return 0;
        }
        const inner = this.query.match(/^self::.+\[(.+)\]/)[1];
        const attr = Precondition.constraintValue(inner, Precondition.attributePriorities);
        return query * 100 + attr * 10;
    }
    presetPriority() {
        if (!this.constraints.length) {
            return [false, 0];
        }
        const last = this.constraints[this.constraints.length - 1].match(/^priority=(.*$)/);
        if (!last) {
            return [false, 0];
        }
        this.constraints.pop();
        const numb = parseFloat(last[1]);
        return [true, isNaN(numb) ? 0 : numb];
    }
}
exports.Precondition = Precondition;
Precondition.queryPriorities = [
    /^self::\*\[.+\]$/,
    /^self::[\w-]+\[.+\]$/
];
Precondition.attributePriorities = [
    /^@[\w-]+$/,
    /^@[\w-]+!=".+"$/,
    /^not\(contains\(@[\w-]+,\s*".+"\)\)$/,
    /^contains\(@[\w-]+,".+"\)$/,
    /^@[\w-]+=".+"$/
];
class OutputError extends engine_1.SREError {
    constructor(msg) {
        super(msg);
        this.name = 'RuleError';
    }
}
exports.OutputError = OutputError;
function splitString(str, sep) {
    const strList = [];
    let prefix = '';
    while (str !== '') {
        const sepPos = str.search(sep);
        if (sepPos === -1) {
            if ((str.match(/"/g) || []).length % 2 !== 0) {
                throw new OutputError('Invalid string in expression: ' + str);
            }
            strList.push(prefix + str);
            prefix = '';
            str = '';
        }
        else if ((str.substring(0, sepPos).match(/"/g) || []).length % 2 === 0) {
            strList.push(prefix + str.substring(0, sepPos));
            prefix = '';
            str = str.substring(sepPos + 1);
        }
        else {
            const nextQuot = str.substring(sepPos).search('"');
            if (nextQuot === -1) {
                throw new OutputError('Invalid string in expression: ' + str);
            }
            else {
                prefix = prefix + str.substring(0, sepPos + nextQuot + 1);
                str = str.substring(sepPos + nextQuot + 1);
            }
        }
    }
    if (prefix) {
        strList.push(prefix);
    }
    return strList;
}
