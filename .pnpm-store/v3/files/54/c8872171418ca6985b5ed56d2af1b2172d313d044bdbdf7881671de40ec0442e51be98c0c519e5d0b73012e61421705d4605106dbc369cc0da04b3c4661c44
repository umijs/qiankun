"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanTrieNode = exports.QueryTrieNode = exports.constraintTest_ = exports.DynamicTrieNode = exports.RootTrieNode = exports.getNode = void 0;
const DomUtil = require("../common/dom_util");
const XpathUtil = require("../common/xpath_util");
const grammar_1 = require("../rule_engine/grammar");
const MathCompoundStore = require("../rule_engine/math_compound_store");
const abstract_trie_node_1 = require("./abstract_trie_node");
const abstract_trie_node_2 = require("./abstract_trie_node");
const trie_node_1 = require("./trie_node");
function getNode(kind, constraint, context) {
    switch (kind) {
        case trie_node_1.TrieNodeKind.ROOT:
            return new RootTrieNode();
        case trie_node_1.TrieNodeKind.DYNAMIC:
            return new DynamicTrieNode(constraint);
        case trie_node_1.TrieNodeKind.QUERY:
            return new QueryTrieNode(constraint, context);
        case trie_node_1.TrieNodeKind.BOOLEAN:
            return new BooleanTrieNode(constraint, context);
        default:
            return null;
    }
}
exports.getNode = getNode;
class RootTrieNode extends abstract_trie_node_1.AbstractTrieNode {
    constructor() {
        super('', () => true);
        this.kind = trie_node_1.TrieNodeKind.ROOT;
    }
}
exports.RootTrieNode = RootTrieNode;
class DynamicTrieNode extends abstract_trie_node_1.AbstractTrieNode {
    constructor(constraint) {
        super(constraint, (axis) => axis === constraint);
        this.kind = trie_node_1.TrieNodeKind.DYNAMIC;
    }
}
exports.DynamicTrieNode = DynamicTrieNode;
const comparator = {
    '=': (x, y) => x === y,
    '!=': (x, y) => x !== y,
    '<': (x, y) => x < y,
    '>': (x, y) => x > y,
    '<=': (x, y) => x <= y,
    '>=': (x, y) => x >= y
};
function constraintTest_(constraint) {
    if (constraint.match(/^self::\*$/)) {
        return (_node) => true;
    }
    if (constraint.match(/^self::\w+$/)) {
        const tag = constraint.slice(6).toUpperCase();
        return (node) => node.tagName && DomUtil.tagName(node) === tag;
    }
    if (constraint.match(/^self::\w+:\w+$/)) {
        const inter = constraint.split(':');
        const namespace = XpathUtil.resolveNameSpace(inter[2]);
        if (!namespace) {
            return null;
        }
        const tag = inter[3].toUpperCase();
        return (node) => node.localName &&
            node.localName.toUpperCase() === tag &&
            node.namespaceURI === namespace;
    }
    if (constraint.match(/^@\w+$/)) {
        const attr = constraint.slice(1);
        return (node) => node.hasAttribute && node.hasAttribute(attr);
    }
    if (constraint.match(/^@\w+="[\w\d ]+"$/)) {
        const split = constraint.split('=');
        const attr = split[0].slice(1);
        const value = split[1].slice(1, -1);
        return (node) => node.hasAttribute &&
            node.hasAttribute(attr) &&
            node.getAttribute(attr) === value;
    }
    if (constraint.match(/^@\w+!="[\w\d ]+"$/)) {
        const split = constraint.split('!=');
        const attr = split[0].slice(1);
        const value = split[1].slice(1, -1);
        return (node) => !node.hasAttribute ||
            !node.hasAttribute(attr) ||
            node.getAttribute(attr) !== value;
    }
    if (constraint.match(/^contains\(\s*@grammar\s*,\s*"[\w\d ]+"\s*\)$/)) {
        const split = constraint.split('"');
        const value = split[1];
        return (_node) => !!grammar_1.Grammar.getInstance().getParameter(value);
    }
    if (constraint.match(/^not\(\s*contains\(\s*@grammar\s*,\s*"[\w\d ]+"\s*\)\s*\)$/)) {
        const split = constraint.split('"');
        const value = split[1];
        return (_node) => !grammar_1.Grammar.getInstance().getParameter(value);
    }
    if (constraint.match(/^name\(\.\.\/\.\.\)="\w+"$/)) {
        const split = constraint.split('"');
        const tag = split[1].toUpperCase();
        return (node) => {
            var _a, _b;
            return ((_b = (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.tagName) &&
                DomUtil.tagName(node.parentNode.parentNode) === tag;
        };
    }
    if (constraint.match(/^count\(preceding-sibling::\*\)=\d+$/)) {
        const split = constraint.split('=');
        const num = parseInt(split[1], 10);
        return (node) => { var _a; return ((_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.childNodes[num]) === node; };
    }
    if (constraint.match(/^.+\[@category!?=".+"\]$/)) {
        let [, query, equality, category] = constraint.match(/^(.+)\[@category(!?=)"(.+)"\]$/);
        const unit = category.match(/^unit:(.+)$/);
        let add = '';
        if (unit) {
            category = unit[1];
            add = ':unit';
        }
        return (node) => {
            const xpath = XpathUtil.evalXPath(query, node)[0];
            if (xpath) {
                const result = MathCompoundStore.lookupCategory(xpath.textContent + add);
                return equality === '=' ? result === category : result !== category;
            }
            return false;
        };
    }
    if (constraint.match(/^string-length\(.+\)\W+\d+/)) {
        const [, select, comp, count] = constraint.match(/^string-length\((.+)\)(\W+)(\d+)/);
        const func = comparator[comp] || comparator['='];
        const numb = parseInt(count, 10);
        return (node) => {
            const xpath = XpathUtil.evalXPath(select, node)[0];
            if (!xpath) {
                return false;
            }
            return func(Array.from(xpath.textContent).length, numb);
        };
    }
    return null;
}
exports.constraintTest_ = constraintTest_;
class QueryTrieNode extends abstract_trie_node_2.StaticTrieNode {
    constructor(constraint, context) {
        super(constraint, constraintTest_(constraint));
        this.context = context;
        this.kind = trie_node_1.TrieNodeKind.QUERY;
    }
    applyTest(object) {
        return this.test
            ? this.test(object)
            : this.context.applyQuery(object, this.constraint) === object;
    }
}
exports.QueryTrieNode = QueryTrieNode;
class BooleanTrieNode extends abstract_trie_node_2.StaticTrieNode {
    constructor(constraint, context) {
        super(constraint, constraintTest_(constraint));
        this.context = context;
        this.kind = trie_node_1.TrieNodeKind.BOOLEAN;
    }
    applyTest(object) {
        return this.test
            ? this.test(object)
            : this.context.applyConstraint(object, this.constraint);
    }
}
exports.BooleanTrieNode = BooleanTrieNode;
