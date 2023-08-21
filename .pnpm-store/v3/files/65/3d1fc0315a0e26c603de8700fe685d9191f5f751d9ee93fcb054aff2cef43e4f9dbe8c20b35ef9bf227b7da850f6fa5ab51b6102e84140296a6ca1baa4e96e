"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotate = exports.activate = exports.register = exports.visitors = exports.annotators = void 0;
const semantic_annotator_1 = require("./semantic_annotator");
exports.annotators = new Map();
exports.visitors = new Map();
function register(annotator) {
    const name = annotator.domain + ':' + annotator.name;
    annotator instanceof semantic_annotator_1.SemanticAnnotator
        ? exports.annotators.set(name, annotator)
        : exports.visitors.set(name, annotator);
}
exports.register = register;
function activate(domain, name) {
    const key = domain + ':' + name;
    const annotator = exports.annotators.get(key) || exports.visitors.get(key);
    if (annotator) {
        annotator.active = true;
    }
}
exports.activate = activate;
function annotate(node) {
    for (const annotator of exports.annotators.values()) {
        if (annotator.active) {
            annotator.annotate(node);
        }
    }
    for (const visitor of exports.visitors.values()) {
        if (visitor.active) {
            visitor.visit(node, Object.assign({}, visitor.def));
        }
    }
}
exports.annotate = annotate;
