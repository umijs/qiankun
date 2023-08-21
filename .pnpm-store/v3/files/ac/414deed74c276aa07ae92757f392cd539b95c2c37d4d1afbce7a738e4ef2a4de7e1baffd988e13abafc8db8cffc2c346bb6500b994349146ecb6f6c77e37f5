"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticMultiHeuristic = exports.SemanticTreeHeuristic = exports.SemanticAbstractHeuristic = void 0;
class SemanticAbstractHeuristic {
    constructor(name, method, predicate = (_x) => false) {
        this.name = name;
        this.apply = method;
        this.applicable = predicate;
    }
}
exports.SemanticAbstractHeuristic = SemanticAbstractHeuristic;
class SemanticTreeHeuristic extends SemanticAbstractHeuristic {
}
exports.SemanticTreeHeuristic = SemanticTreeHeuristic;
class SemanticMultiHeuristic extends SemanticAbstractHeuristic {
}
exports.SemanticMultiHeuristic = SemanticMultiHeuristic;
