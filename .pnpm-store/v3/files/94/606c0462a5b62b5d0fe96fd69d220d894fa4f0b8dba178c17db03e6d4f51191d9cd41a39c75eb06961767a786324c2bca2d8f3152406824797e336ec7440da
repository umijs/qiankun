"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticAbstractParser = void 0;
const semantic_node_factory_1 = require("./semantic_node_factory");
class SemanticAbstractParser {
    constructor(type) {
        this.type = type;
        this.factory_ = new semantic_node_factory_1.SemanticNodeFactory();
    }
    getFactory() {
        return this.factory_;
    }
    setFactory(factory) {
        this.factory_ = factory;
    }
    getType() {
        return this.type;
    }
    parseList(list) {
        const result = [];
        for (let i = 0, element; (element = list[i]); i++) {
            result.push(this.parse(element));
        }
        return result;
    }
}
exports.SemanticAbstractParser = SemanticAbstractParser;
