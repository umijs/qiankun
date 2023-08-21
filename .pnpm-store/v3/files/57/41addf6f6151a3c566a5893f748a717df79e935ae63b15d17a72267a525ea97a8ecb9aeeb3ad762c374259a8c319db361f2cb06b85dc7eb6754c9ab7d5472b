"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookup = exports.run = exports.add = exports.blacklist = exports.flags = exports.updateFactory = exports.factory = void 0;
exports.factory = null;
function updateFactory(nodeFactory) {
    exports.factory = nodeFactory;
}
exports.updateFactory = updateFactory;
const heuristics = new Map();
exports.flags = {
    combine_juxtaposition: true,
    convert_juxtaposition: true,
    multioperator: true
};
exports.blacklist = {};
function add(heuristic) {
    const name = heuristic.name;
    heuristics.set(name, heuristic);
    if (!exports.flags[name]) {
        exports.flags[name] = false;
    }
}
exports.add = add;
function run(name, root, opt_alternative) {
    const heuristic = lookup(name);
    return heuristic &&
        !exports.blacklist[name] &&
        (exports.flags[name] || heuristic.applicable(root))
        ? heuristic.apply(root)
        : opt_alternative
            ? opt_alternative(root)
            : root;
}
exports.run = run;
function lookup(name) {
    return heuristics.get(name);
}
exports.lookup = lookup;
