"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkerMapping_ = exports.walker = void 0;
const dummy_walker_1 = require("./dummy_walker");
const semantic_walker_1 = require("./semantic_walker");
const syntax_walker_1 = require("./syntax_walker");
const table_walker_1 = require("./table_walker");
function walker(type, node, generator, highlighter, xml) {
    const constructor = exports.walkerMapping_[type.toLowerCase()] || exports.walkerMapping_['dummy'];
    return constructor(node, generator, highlighter, xml);
}
exports.walker = walker;
exports.walkerMapping_ = {
    dummy: (p1, p2, p3, p4) => new dummy_walker_1.DummyWalker(p1, p2, p3, p4),
    semantic: (p1, p2, p3, p4) => new semantic_walker_1.SemanticWalker(p1, p2, p3, p4),
    syntax: (p1, p2, p3, p4) => new syntax_walker_1.SyntaxWalker(p1, p2, p3, p4),
    table: (p1, p2, p3, p4) => new table_walker_1.TableWalker(p1, p2, p3, p4)
};
