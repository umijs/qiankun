"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debugger_1 = require("../common/debugger");
const engine_1 = require("../common/engine");
const SemanticAttr = require("./semantic_attr");
const SemanticHeuristics = require("./semantic_heuristic_factory");
const semantic_heuristic_1 = require("./semantic_heuristic");
const SemanticPred = require("./semantic_pred");
const semantic_processor_1 = require("./semantic_processor");
const SemanticUtil = require("./semantic_util");
SemanticHeuristics.add(new semantic_heuristic_1.SemanticTreeHeuristic('combine_juxtaposition', combineJuxtaposition));
function combineJuxtaposition(root) {
    for (let i = root.childNodes.length - 1, child; (child = root.childNodes[i]); i--) {
        if (!SemanticPred.isImplicitOp(child) || child.nobreaking) {
            continue;
        }
        root.childNodes.splice(i, 1, ...child.childNodes);
        root.contentNodes.splice(i, 0, ...child.contentNodes);
        child.childNodes.concat(child.contentNodes).forEach(function (x) {
            x.parent = root;
        });
        root.addMathmlNodes(child.mathml);
    }
    return root;
}
SemanticHeuristics.add(new semantic_heuristic_1.SemanticTreeHeuristic('propagateSimpleFunction', (node) => {
    if ((node.type === "infixop" ||
        node.type === "fraction") &&
        node.childNodes.every(SemanticPred.isSimpleFunction)) {
        node.role = "composed function";
    }
    return node;
}, (_node) => engine_1.default.getInstance().domain === 'clearspeak'));
SemanticHeuristics.add(new semantic_heuristic_1.SemanticTreeHeuristic('simpleNamedFunction', (node) => {
    const specialFunctions = ['f', 'g', 'h', 'F', 'G', 'H'];
    if (node.role !== "unit" &&
        specialFunctions.indexOf(node.textContent) !== -1) {
        node.role = "simple function";
    }
    return node;
}, (_node) => engine_1.default.getInstance().domain === 'clearspeak'));
SemanticHeuristics.add(new semantic_heuristic_1.SemanticTreeHeuristic('propagateComposedFunction', (node) => {
    if (node.type === "fenced" &&
        node.childNodes[0].role === "composed function") {
        node.role = "composed function";
    }
    return node;
}, (_node) => engine_1.default.getInstance().domain === 'clearspeak'));
SemanticHeuristics.add(new semantic_heuristic_1.SemanticTreeHeuristic('multioperator', (node) => {
    if (node.role !== "unknown" || node.textContent.length <= 1) {
        return;
    }
    const content = [...node.textContent];
    const meaning = content.map(SemanticAttr.lookupMeaning);
    const singleRole = meaning.reduce(function (prev, curr) {
        if (!prev ||
            !curr.role ||
            curr.role === "unknown" ||
            curr.role === prev) {
            return prev;
        }
        if (prev === "unknown") {
            return curr.role;
        }
        return null;
    }, "unknown");
    if (singleRole) {
        node.role = singleRole;
    }
}));
SemanticHeuristics.add(new semantic_heuristic_1.SemanticMultiHeuristic('convert_juxtaposition', (nodes) => {
    let partition = SemanticUtil.partitionNodes(nodes, function (x) {
        return (x.textContent === SemanticAttr.invisibleTimes() &&
            x.type === "operator");
    });
    partition = partition.rel.length
        ? juxtapositionPrePost(partition)
        : partition;
    nodes = partition.comp[0];
    for (let i = 1, c, r; (c = partition.comp[i]), (r = partition.rel[i - 1]); i++) {
        nodes.push(r);
        nodes = nodes.concat(c);
    }
    partition = SemanticUtil.partitionNodes(nodes, function (x) {
        return (x.textContent === SemanticAttr.invisibleTimes() &&
            (x.type === "operator" || x.type === "infixop"));
    });
    if (!partition.rel.length) {
        return nodes;
    }
    return recurseJuxtaposition(partition.comp.shift(), partition.rel, partition.comp);
}));
SemanticHeuristics.add(new semantic_heuristic_1.SemanticTreeHeuristic('simple2prefix', (node) => {
    if (node.textContent.length > 1 &&
        !node.textContent[0].match(/[A-Z]/)) {
        node.role = "prefix function";
    }
    return node;
}, (node) => engine_1.default.getInstance().modality === 'braille' &&
    node.type === "identifier"));
SemanticHeuristics.add(new semantic_heuristic_1.SemanticTreeHeuristic('detect_cycle', (node) => {
    node.type = "matrix";
    node.role = "cycle";
    const row = node.childNodes[0];
    row.type = "row";
    row.role = "cycle";
    row.textContent = '';
    row.contentNodes = [];
    return node;
}, (node) => node.type === "fenced" &&
    node.childNodes[0].type === "infixop" &&
    node.childNodes[0].role === "implicit" &&
    node.childNodes[0].childNodes.every(function (x) {
        return x.type === "number";
    }) &&
    node.childNodes[0].contentNodes.every(function (x) {
        return x.role === "space";
    })));
function juxtapositionPrePost(partition) {
    const rels = [];
    const comps = [];
    let next = partition.comp.shift();
    let rel = null;
    let collect = [];
    while (partition.comp.length) {
        collect = [];
        if (next.length) {
            if (rel) {
                rels.push(rel);
            }
            comps.push(next);
            rel = partition.rel.shift();
            next = partition.comp.shift();
            continue;
        }
        if (rel) {
            collect.push(rel);
        }
        while (!next.length && partition.comp.length) {
            next = partition.comp.shift();
            collect.push(partition.rel.shift());
        }
        rel = convertPrePost(collect, next, comps);
    }
    if (!collect.length && !next.length) {
        collect.push(rel);
        convertPrePost(collect, next, comps);
    }
    else {
        rels.push(rel);
        comps.push(next);
    }
    return { rel: rels, comp: comps };
}
function convertPrePost(collect, next, comps) {
    let rel = null;
    if (!collect.length) {
        return rel;
    }
    const prev = comps[comps.length - 1];
    const prevExists = prev && prev.length;
    const nextExists = next && next.length;
    const processor = semantic_processor_1.default.getInstance();
    if (prevExists && nextExists) {
        if (next[0].type === "infixop" &&
            next[0].role === "implicit") {
            rel = collect.pop();
            prev.push(processor['postfixNode_'](prev.pop(), collect));
            return rel;
        }
        rel = collect.shift();
        const result = processor['prefixNode_'](next.shift(), collect);
        next.unshift(result);
        return rel;
    }
    if (prevExists) {
        prev.push(processor['postfixNode_'](prev.pop(), collect));
        return rel;
    }
    if (nextExists) {
        next.unshift(processor['prefixNode_'](next.shift(), collect));
    }
    return rel;
}
function recurseJuxtaposition(acc, ops, elements) {
    if (!ops.length) {
        return acc;
    }
    const left = acc.pop();
    const op = ops.shift();
    const first = elements.shift();
    if (SemanticPred.isImplicitOp(op)) {
        debugger_1.Debugger.getInstance().output('Juxta Heuristic Case 2');
        const right = (left ? [left, op] : [op]).concat(first);
        return recurseJuxtaposition(acc.concat(right), ops, elements);
    }
    if (!left) {
        debugger_1.Debugger.getInstance().output('Juxta Heuristic Case 3');
        return recurseJuxtaposition([op].concat(first), ops, elements);
    }
    const right = first.shift();
    if (!right) {
        debugger_1.Debugger.getInstance().output('Juxta Heuristic Case 9');
        const newOp = SemanticHeuristics.factory.makeBranchNode("infixop", [left, ops.shift()], [op], op.textContent);
        newOp.role = "implicit";
        SemanticHeuristics.run('combine_juxtaposition', newOp);
        ops.unshift(newOp);
        return recurseJuxtaposition(acc, ops, elements);
    }
    if (SemanticPred.isOperator(left) || SemanticPred.isOperator(right)) {
        debugger_1.Debugger.getInstance().output('Juxta Heuristic Case 4');
        return recurseJuxtaposition(acc.concat([left, op, right]).concat(first), ops, elements);
    }
    let result = null;
    if (SemanticPred.isImplicitOp(left) && SemanticPred.isImplicitOp(right)) {
        debugger_1.Debugger.getInstance().output('Juxta Heuristic Case 5');
        left.contentNodes.push(op);
        left.contentNodes = left.contentNodes.concat(right.contentNodes);
        left.childNodes.push(right);
        left.childNodes = left.childNodes.concat(right.childNodes);
        right.childNodes.forEach((x) => (x.parent = left));
        op.parent = left;
        left.addMathmlNodes(op.mathml);
        left.addMathmlNodes(right.mathml);
        result = left;
    }
    else if (SemanticPred.isImplicitOp(left)) {
        debugger_1.Debugger.getInstance().output('Juxta Heuristic Case 6');
        left.contentNodes.push(op);
        left.childNodes.push(right);
        right.parent = left;
        op.parent = left;
        left.addMathmlNodes(op.mathml);
        left.addMathmlNodes(right.mathml);
        result = left;
    }
    else if (SemanticPred.isImplicitOp(right)) {
        debugger_1.Debugger.getInstance().output('Juxta Heuristic Case 7');
        right.contentNodes.unshift(op);
        right.childNodes.unshift(left);
        left.parent = right;
        op.parent = right;
        right.addMathmlNodes(op.mathml);
        right.addMathmlNodes(left.mathml);
        result = right;
    }
    else {
        debugger_1.Debugger.getInstance().output('Juxta Heuristic Case 8');
        result = SemanticHeuristics.factory.makeBranchNode("infixop", [left, right], [op], op.textContent);
        result.role = "implicit";
    }
    acc.push(result);
    return recurseJuxtaposition(acc.concat(first), ops, elements);
}
