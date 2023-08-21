"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticTrieNode = exports.AbstractTrieNode = void 0;
const debugger_1 = require("../common/debugger");
const trie_node_1 = require("./trie_node");
class AbstractTrieNode {
    constructor(constraint, test) {
        this.constraint = constraint;
        this.test = test;
        this.children_ = {};
        this.kind = trie_node_1.TrieNodeKind.ROOT;
    }
    getConstraint() {
        return this.constraint;
    }
    getKind() {
        return this.kind;
    }
    applyTest(object) {
        return this.test(object);
    }
    addChild(node) {
        const constraint = node.getConstraint();
        const child = this.children_[constraint];
        this.children_[constraint] = node;
        return child;
    }
    getChild(constraint) {
        return this.children_[constraint];
    }
    getChildren() {
        const children = [];
        for (const key in this.children_) {
            children.push(this.children_[key]);
        }
        return children;
    }
    findChildren(object) {
        const children = [];
        for (const key in this.children_) {
            const child = this.children_[key];
            if (child.applyTest(object)) {
                children.push(child);
            }
        }
        return children;
    }
    removeChild(constraint) {
        delete this.children_[constraint];
    }
    toString() {
        return this.constraint;
    }
}
exports.AbstractTrieNode = AbstractTrieNode;
class StaticTrieNode extends AbstractTrieNode {
    constructor(constraint, test) {
        super(constraint, test);
        this.rule_ = null;
        this.kind = trie_node_1.TrieNodeKind.STATIC;
    }
    getRule() {
        return this.rule_;
    }
    setRule(rule) {
        if (this.rule_) {
            debugger_1.Debugger.getInstance().output('Replacing rule ' + this.rule_ + ' with ' + rule);
        }
        this.rule_ = rule;
    }
    toString() {
        const rule = this.getRule();
        return rule
            ? this.constraint + '\n' + '==> ' + this.getRule().action
            : this.constraint;
    }
}
exports.StaticTrieNode = StaticTrieNode;
