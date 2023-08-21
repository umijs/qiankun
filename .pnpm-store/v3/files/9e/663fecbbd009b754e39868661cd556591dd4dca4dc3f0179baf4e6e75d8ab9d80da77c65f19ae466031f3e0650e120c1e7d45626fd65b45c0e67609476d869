"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticVisitor = exports.SemanticAnnotator = void 0;
class SemanticAnnotator {
    constructor(domain, name, func) {
        this.domain = domain;
        this.name = name;
        this.func = func;
        this.active = false;
    }
    annotate(node) {
        node.childNodes.forEach(this.annotate.bind(this));
        node.addAnnotation(this.domain, this.func(node));
    }
}
exports.SemanticAnnotator = SemanticAnnotator;
class SemanticVisitor {
    constructor(domain, name, func, def = {}) {
        this.domain = domain;
        this.name = name;
        this.func = func;
        this.def = def;
        this.active = false;
    }
    visit(node, info) {
        let result = this.func(node, info);
        node.addAnnotation(this.domain, result[0]);
        for (let i = 0, child; (child = node.childNodes[i]); i++) {
            result = this.visit(child, result[1]);
        }
        return result;
    }
}
exports.SemanticVisitor = SemanticVisitor;
