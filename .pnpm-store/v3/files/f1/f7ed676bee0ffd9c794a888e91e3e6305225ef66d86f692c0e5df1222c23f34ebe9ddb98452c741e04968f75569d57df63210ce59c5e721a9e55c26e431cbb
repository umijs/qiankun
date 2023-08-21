"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomUtil = require("../common/dom_util");
const SemanticAttr = require("./semantic_attr");
const SemanticHeuristics = require("./semantic_heuristic_factory");
const semantic_node_factory_1 = require("./semantic_node_factory");
const SemanticPred = require("./semantic_pred");
const SemanticUtil = require("./semantic_util");
class SemanticProcessor {
    constructor() {
        this.funcAppls = {};
        this.factory_ = new semantic_node_factory_1.SemanticNodeFactory();
        SemanticHeuristics.updateFactory(this.factory_);
    }
    static getInstance() {
        SemanticProcessor.instance =
            SemanticProcessor.instance || new SemanticProcessor();
        return SemanticProcessor.instance;
    }
    static tableToMultiline(table) {
        if (!SemanticPred.tableIsMultiline(table)) {
            SemanticProcessor.classifyTable(table);
            return;
        }
        table.type = "multiline";
        for (let i = 0, row; (row = table.childNodes[i]); i++) {
            SemanticProcessor.rowToLine_(row, "multiline");
        }
        if (table.childNodes.length === 1 &&
            !SemanticPred.lineIsLabelled(table.childNodes[0]) &&
            SemanticPred.isFencedElement(table.childNodes[0].childNodes[0])) {
            SemanticProcessor.tableToMatrixOrVector_(SemanticProcessor.rewriteFencedLine_(table));
        }
        SemanticProcessor.binomialForm_(table);
        SemanticProcessor.classifyMultiline(table);
    }
    static number(node) {
        if (node.type === "unknown" ||
            node.type === "identifier") {
            node.type = "number";
        }
        SemanticProcessor.numberRole_(node);
        SemanticProcessor.exprFont_(node);
    }
    static classifyMultiline(multiline) {
        let index = 0;
        const length = multiline.childNodes.length;
        let line;
        while (index < length &&
            (!(line = multiline.childNodes[index]) || !line.childNodes.length)) {
            index++;
        }
        if (index >= length) {
            return;
        }
        const firstRole = line.childNodes[0].role;
        if (firstRole !== "unknown" &&
            multiline.childNodes.every(function (x) {
                const cell = x.childNodes[0];
                return (!cell ||
                    (cell.role === firstRole &&
                        (SemanticPred.isType(cell, "relation") ||
                            SemanticPred.isType(cell, "relseq"))));
            })) {
            multiline.role = firstRole;
        }
    }
    static classifyTable(table) {
        const columns = SemanticProcessor.computeColumns_(table);
        SemanticProcessor.classifyByColumns_(table, columns, "equality") ||
            SemanticProcessor.classifyByColumns_(table, columns, "inequality", ["equality"]) ||
            SemanticProcessor.classifyByColumns_(table, columns, "arrow") ||
            SemanticProcessor.detectCaleyTable(table);
    }
    static detectCaleyTable(table) {
        if (!table.mathmlTree) {
            return false;
        }
        const tree = table.mathmlTree;
        const cl = tree.getAttribute('columnlines');
        const rl = tree.getAttribute('rowlines');
        if (!cl || !rl) {
            return false;
        }
        if (SemanticProcessor.cayleySpacing(cl) &&
            SemanticProcessor.cayleySpacing(rl)) {
            table.role = "cayley";
            return true;
        }
        return false;
    }
    static cayleySpacing(lines) {
        const list = lines.split(' ');
        return ((list[0] === 'solid' || list[0] === 'dashed') &&
            list.slice(1).every((x) => x === 'none'));
    }
    static proof(node, semantics, parse) {
        const attrs = SemanticProcessor.separateSemantics(semantics);
        return SemanticProcessor.getInstance().proof(node, attrs, parse);
    }
    static findSemantics(node, attr, opt_value) {
        const value = opt_value == null ? null : opt_value;
        const semantics = SemanticProcessor.getSemantics(node);
        if (!semantics) {
            return false;
        }
        if (!semantics[attr]) {
            return false;
        }
        return value == null ? true : semantics[attr] === value;
    }
    static getSemantics(node) {
        const semantics = node.getAttribute('semantics');
        if (!semantics) {
            return null;
        }
        return SemanticProcessor.separateSemantics(semantics);
    }
    static removePrefix(name) {
        const [, ...rest] = name.split('_');
        return rest.join('_');
    }
    static separateSemantics(attr) {
        const result = {};
        attr.split(';').forEach(function (x) {
            const [name, value] = x.split(':');
            result[SemanticProcessor.removePrefix(name)] = value;
        });
        return result;
    }
    static matchSpaces_(nodes, ops) {
        for (let i = 0, op; (op = ops[i]); i++) {
            const node = nodes[i];
            const mt1 = node.mathmlTree;
            const mt2 = nodes[i + 1].mathmlTree;
            if (!mt1 || !mt2) {
                continue;
            }
            const sibling = mt1.nextSibling;
            if (!sibling || sibling === mt2) {
                continue;
            }
            const spacer = SemanticProcessor.getSpacer_(sibling);
            if (spacer) {
                op.mathml.push(spacer);
                op.mathmlTree = spacer;
                op.role = "space";
            }
        }
    }
    static getSpacer_(node) {
        if (DomUtil.tagName(node) === 'MSPACE') {
            return node;
        }
        while (SemanticUtil.hasEmptyTag(node) && node.childNodes.length === 1) {
            node = node.childNodes[0];
            if (DomUtil.tagName(node) === 'MSPACE') {
                return node;
            }
        }
        return null;
    }
    static fenceToPunct_(fence) {
        const newRole = SemanticProcessor.FENCE_TO_PUNCT_[fence.role];
        if (!newRole) {
            return;
        }
        while (fence.embellished) {
            fence.embellished = "punctuation";
            if (!(SemanticPred.isRole(fence, "subsup") ||
                SemanticPred.isRole(fence, "underover"))) {
                fence.role = newRole;
            }
            fence = fence.childNodes[0];
        }
        fence.type = "punctuation";
        fence.role = newRole;
    }
    static classifyFunction_(funcNode, restNodes) {
        if (funcNode.type === "appl" ||
            funcNode.type === "bigop" ||
            funcNode.type === "integral") {
            return '';
        }
        if (restNodes[0] &&
            restNodes[0].textContent === SemanticAttr.functionApplication()) {
            SemanticProcessor.getInstance().funcAppls[funcNode.id] =
                restNodes.shift();
            let role = "simple function";
            SemanticHeuristics.run('simple2prefix', funcNode);
            if (funcNode.role === "prefix function" ||
                funcNode.role === "limit function") {
                role = funcNode.role;
            }
            SemanticProcessor.propagateFunctionRole_(funcNode, role);
            return 'prefix';
        }
        const kind = SemanticProcessor.CLASSIFY_FUNCTION_[funcNode.role];
        return kind
            ? kind
            : SemanticPred.isSimpleFunctionHead(funcNode)
                ? 'simple'
                : '';
    }
    static propagateFunctionRole_(funcNode, tag) {
        if (funcNode) {
            if (funcNode.type === "infixop") {
                return;
            }
            if (!(SemanticPred.isRole(funcNode, "subsup") ||
                SemanticPred.isRole(funcNode, "underover"))) {
                funcNode.role = tag;
            }
            SemanticProcessor.propagateFunctionRole_(funcNode.childNodes[0], tag);
        }
    }
    static getFunctionOp_(tree, pred) {
        if (pred(tree)) {
            return tree;
        }
        for (let i = 0, child; (child = tree.childNodes[i]); i++) {
            const op = SemanticProcessor.getFunctionOp_(child, pred);
            if (op) {
                return op;
            }
        }
        return null;
    }
    static tableToMatrixOrVector_(node) {
        const matrix = node.childNodes[0];
        SemanticPred.isType(matrix, "multiline")
            ? SemanticProcessor.tableToVector_(node)
            : SemanticProcessor.tableToMatrix_(node);
        node.contentNodes.forEach(matrix.appendContentNode.bind(matrix));
        for (let i = 0, row; (row = matrix.childNodes[i]); i++) {
            SemanticProcessor.assignRoleToRow_(row, SemanticProcessor.getComponentRoles_(matrix));
        }
        matrix.parent = null;
        return matrix;
    }
    static tableToVector_(node) {
        const vector = node.childNodes[0];
        vector.type = "vector";
        if (vector.childNodes.length === 1) {
            SemanticProcessor.tableToSquare_(node);
            return;
        }
        SemanticProcessor.binomialForm_(vector);
    }
    static binomialForm_(node) {
        if (SemanticPred.isBinomial(node)) {
            node.role = "binomial";
            node.childNodes[0].role = "binomial";
            node.childNodes[1].role = "binomial";
        }
    }
    static tableToMatrix_(node) {
        const matrix = node.childNodes[0];
        matrix.type = "matrix";
        if (matrix.childNodes &&
            matrix.childNodes.length > 0 &&
            matrix.childNodes[0].childNodes &&
            matrix.childNodes.length === matrix.childNodes[0].childNodes.length) {
            SemanticProcessor.tableToSquare_(node);
            return;
        }
        if (matrix.childNodes && matrix.childNodes.length === 1) {
            matrix.role = "rowvector";
        }
    }
    static tableToSquare_(node) {
        const matrix = node.childNodes[0];
        if (SemanticPred.isNeutralFence(node)) {
            matrix.role = "determinant";
            return;
        }
        matrix.role = "squarematrix";
    }
    static getComponentRoles_(node) {
        const role = node.role;
        if (role && role !== "unknown") {
            return role;
        }
        return node.type.toLowerCase() || "unknown";
    }
    static tableToCases_(table, openFence) {
        for (let i = 0, row; (row = table.childNodes[i]); i++) {
            SemanticProcessor.assignRoleToRow_(row, "cases");
        }
        table.type = "cases";
        table.appendContentNode(openFence);
        if (SemanticPred.tableIsMultiline(table)) {
            SemanticProcessor.binomialForm_(table);
        }
        return table;
    }
    static rewriteFencedLine_(table) {
        const line = table.childNodes[0];
        const fenced = table.childNodes[0].childNodes[0];
        const element = table.childNodes[0].childNodes[0].childNodes[0];
        fenced.parent = table.parent;
        table.parent = fenced;
        element.parent = line;
        fenced.childNodes = [table];
        line.childNodes = [element];
        return fenced;
    }
    static rowToLine_(row, opt_role) {
        const role = opt_role || "unknown";
        if (SemanticPred.isType(row, "row")) {
            row.type = "line";
            row.role = role;
            if (row.childNodes.length === 1 &&
                SemanticPred.isType(row.childNodes[0], "cell")) {
                row.childNodes = row.childNodes[0].childNodes;
                row.childNodes.forEach(function (x) {
                    x.parent = row;
                });
            }
        }
    }
    static assignRoleToRow_(row, role) {
        if (SemanticPred.isType(row, "line")) {
            row.role = role;
            return;
        }
        if (SemanticPred.isType(row, "row")) {
            row.role = role;
            row.childNodes.forEach(function (cell) {
                if (SemanticPred.isType(cell, "cell")) {
                    cell.role = role;
                }
            });
        }
    }
    static nextSeparatorFunction_(separators) {
        let sepList;
        if (separators) {
            if (separators.match(/^\s+$/)) {
                return null;
            }
            else {
                sepList = separators
                    .replace(/\s/g, '')
                    .split('')
                    .filter(function (x) {
                    return x;
                });
            }
        }
        else {
            sepList = [','];
        }
        return function () {
            if (sepList.length > 1) {
                return sepList.shift();
            }
            return sepList[0];
        };
    }
    static numberRole_(node) {
        if (node.role !== "unknown") {
            return;
        }
        const content = [...node.textContent].filter((x) => x.match(/[^\s]/));
        const meaning = content.map(SemanticAttr.lookupMeaning);
        if (meaning.every(function (x) {
            return ((x.type === "number" && x.role === "integer") ||
                (x.type === "punctuation" && x.role === "comma"));
        })) {
            node.role = "integer";
            if (content[0] === '0') {
                node.addAnnotation('general', 'basenumber');
            }
            return;
        }
        if (meaning.every(function (x) {
            return ((x.type === "number" && x.role === "integer") ||
                x.type === "punctuation");
        })) {
            node.role = "float";
            return;
        }
        node.role = "othernumber";
    }
    static exprFont_(node) {
        if (node.font !== "unknown") {
            return;
        }
        const content = [...node.textContent];
        const meaning = content.map(SemanticAttr.lookupMeaning);
        const singleFont = meaning.reduce(function (prev, curr) {
            if (!prev ||
                !curr.font ||
                curr.font === "unknown" ||
                curr.font === prev) {
                return prev;
            }
            if (prev === "unknown") {
                return curr.font;
            }
            return null;
        }, "unknown");
        if (singleFont) {
            node.font = singleFont;
        }
    }
    static purgeFences_(partition) {
        const rel = partition.rel;
        const comp = partition.comp;
        const newRel = [];
        const newComp = [];
        while (rel.length > 0) {
            const currentRel = rel.shift();
            let currentComp = comp.shift();
            if (SemanticPred.isElligibleEmbellishedFence(currentRel)) {
                newRel.push(currentRel);
                newComp.push(currentComp);
                continue;
            }
            SemanticProcessor.fenceToPunct_(currentRel);
            currentComp.push(currentRel);
            currentComp = currentComp.concat(comp.shift());
            comp.unshift(currentComp);
        }
        newComp.push(comp.shift());
        return { rel: newRel, comp: newComp };
    }
    static rewriteFencedNode_(fenced) {
        const ofence = fenced.contentNodes[0];
        const cfence = fenced.contentNodes[1];
        let rewritten = SemanticProcessor.rewriteFence_(fenced, ofence);
        fenced.contentNodes[0] = rewritten.fence;
        rewritten = SemanticProcessor.rewriteFence_(rewritten.node, cfence);
        fenced.contentNodes[1] = rewritten.fence;
        fenced.contentNodes[0].parent = fenced;
        fenced.contentNodes[1].parent = fenced;
        rewritten.node.parent = null;
        return rewritten.node;
    }
    static rewriteFence_(node, fence) {
        if (!fence.embellished) {
            return { node: node, fence: fence };
        }
        const newFence = fence.childNodes[0];
        const rewritten = SemanticProcessor.rewriteFence_(node, newFence);
        if (SemanticPred.isType(fence, "superscript") ||
            SemanticPred.isType(fence, "subscript") ||
            SemanticPred.isType(fence, "tensor")) {
            if (!SemanticPred.isRole(fence, "subsup")) {
                fence.role = node.role;
            }
            if (newFence !== rewritten.node) {
                fence.replaceChild(newFence, rewritten.node);
                newFence.parent = node;
            }
            SemanticProcessor.propagateFencePointer_(fence, newFence);
            return { node: fence, fence: rewritten.fence };
        }
        fence.replaceChild(newFence, rewritten.fence);
        if (fence.mathmlTree && fence.mathml.indexOf(fence.mathmlTree) === -1) {
            fence.mathml.push(fence.mathmlTree);
        }
        return { node: rewritten.node, fence: fence };
    }
    static propagateFencePointer_(oldNode, newNode) {
        oldNode.fencePointer = newNode.fencePointer || newNode.id.toString();
        oldNode.embellished = null;
    }
    static classifyByColumns_(table, columns, relation, _alternatives) {
        const test1 = (x) => SemanticProcessor.isPureRelation_(x, relation);
        const test2 = (x) => SemanticProcessor.isEndRelation_(x, relation) ||
            SemanticProcessor.isPureRelation_(x, relation);
        const test3 = (x) => SemanticProcessor.isEndRelation_(x, relation, true) ||
            SemanticProcessor.isPureRelation_(x, relation);
        if ((columns.length === 3 &&
            SemanticProcessor.testColumns_(columns, 1, test1)) ||
            (columns.length === 2 &&
                (SemanticProcessor.testColumns_(columns, 1, test2) ||
                    SemanticProcessor.testColumns_(columns, 0, test3)))) {
            table.role = relation;
            return true;
        }
        return false;
    }
    static isEndRelation_(node, relation, opt_right) {
        const position = opt_right ? node.childNodes.length - 1 : 0;
        return (SemanticPred.isType(node, "relseq") &&
            SemanticPred.isRole(node, relation) &&
            SemanticPred.isType(node.childNodes[position], "empty"));
    }
    static isPureRelation_(node, relation) {
        return (SemanticPred.isType(node, "relation") &&
            SemanticPred.isRole(node, relation));
    }
    static computeColumns_(table) {
        const columns = [];
        for (let i = 0, row; (row = table.childNodes[i]); i++) {
            for (let j = 0, cell; (cell = row.childNodes[j]); j++) {
                const column = columns[j];
                column ? columns[j].push(cell) : (columns[j] = [cell]);
            }
        }
        return columns;
    }
    static testColumns_(columns, index, pred) {
        const column = columns[index];
        return column
            ? column.some(function (cell) {
                return (cell.childNodes.length && pred(cell.childNodes[0]));
            }) &&
                column.every(function (cell) {
                    return (!cell.childNodes.length ||
                        pred(cell.childNodes[0]));
                })
            : false;
    }
    setNodeFactory(factory) {
        SemanticProcessor.getInstance().factory_ = factory;
        SemanticHeuristics.updateFactory(SemanticProcessor.getInstance().factory_);
    }
    getNodeFactory() {
        return SemanticProcessor.getInstance().factory_;
    }
    identifierNode(leaf, font, unit) {
        if (unit === 'MathML-Unit') {
            leaf.type = "identifier";
            leaf.role = "unit";
        }
        else if (!font &&
            leaf.textContent.length === 1 &&
            (leaf.role === "integer" ||
                leaf.role === "latinletter" ||
                leaf.role === "greekletter") &&
            leaf.font === "normal") {
            leaf.font = "italic";
            return SemanticHeuristics.run('simpleNamedFunction', leaf);
        }
        if (leaf.type === "unknown") {
            leaf.type = "identifier";
        }
        SemanticProcessor.exprFont_(leaf);
        return SemanticHeuristics.run('simpleNamedFunction', leaf);
    }
    implicitNode(nodes) {
        nodes = SemanticProcessor.getInstance().getMixedNumbers_(nodes);
        nodes = SemanticProcessor.getInstance().combineUnits_(nodes);
        if (nodes.length === 1) {
            return nodes[0];
        }
        const node = SemanticProcessor.getInstance().implicitNode_(nodes);
        return SemanticHeuristics.run('combine_juxtaposition', node);
    }
    text(leaf, type) {
        SemanticProcessor.exprFont_(leaf);
        leaf.type = "text";
        if (type === 'MS') {
            leaf.role = "string";
            return leaf;
        }
        if (type === 'MSPACE' || leaf.textContent.match(/^\s*$/)) {
            leaf.role = "space";
            return leaf;
        }
        return leaf;
    }
    row(nodes) {
        nodes = nodes.filter(function (x) {
            return !SemanticPred.isType(x, "empty");
        });
        if (nodes.length === 0) {
            return SemanticProcessor.getInstance().factory_.makeEmptyNode();
        }
        nodes = SemanticProcessor.getInstance().getFencesInRow_(nodes);
        nodes = SemanticProcessor.getInstance().tablesInRow(nodes);
        nodes = SemanticProcessor.getInstance().getPunctuationInRow_(nodes);
        nodes = SemanticProcessor.getInstance().getTextInRow_(nodes);
        nodes = SemanticProcessor.getInstance().getFunctionsInRow_(nodes);
        return SemanticProcessor.getInstance().relationsInRow_(nodes);
    }
    limitNode(mmlTag, children) {
        if (!children.length) {
            return SemanticProcessor.getInstance().factory_.makeEmptyNode();
        }
        let center = children[0];
        let type = "unknown";
        if (!children[1]) {
            return center;
        }
        let result;
        if (SemanticPred.isLimitBase(center)) {
            result = SemanticProcessor.MML_TO_LIMIT_[mmlTag];
            const length = result.length;
            type = result.type;
            children = children.slice(0, result.length + 1);
            if ((length === 1 && SemanticPred.isAccent(children[1])) ||
                (length === 2 &&
                    SemanticPred.isAccent(children[1]) &&
                    SemanticPred.isAccent(children[2]))) {
                result = SemanticProcessor.MML_TO_BOUNDS_[mmlTag];
                return SemanticProcessor.getInstance().accentNode_(center, children, result.type, result.length, result.accent);
            }
            if (length === 2) {
                if (SemanticPred.isAccent(children[1])) {
                    center = SemanticProcessor.getInstance().accentNode_(center, [center, children[1]], {
                        MSUBSUP: "subscript",
                        MUNDEROVER: "underscore"
                    }[mmlTag], 1, true);
                    return !children[2]
                        ? center
                        : SemanticProcessor.getInstance().makeLimitNode_(center, [center, children[2]], null, "limupper");
                }
                if (children[2] && SemanticPred.isAccent(children[2])) {
                    center = SemanticProcessor.getInstance().accentNode_(center, [center, children[2]], {
                        MSUBSUP: "superscript",
                        MUNDEROVER: "overscore"
                    }[mmlTag], 1, true);
                    return SemanticProcessor.getInstance().makeLimitNode_(center, [center, children[1]], null, "limlower");
                }
                if (!children[length]) {
                    type = "limlower";
                }
            }
            return SemanticProcessor.getInstance().makeLimitNode_(center, children, null, type);
        }
        result = SemanticProcessor.MML_TO_BOUNDS_[mmlTag];
        return SemanticProcessor.getInstance().accentNode_(center, children, result.type, result.length, result.accent);
    }
    tablesInRow(nodes) {
        let partition = SemanticUtil.partitionNodes(nodes, SemanticPred.tableIsMatrixOrVector);
        let result = [];
        for (let i = 0, matrix; (matrix = partition.rel[i]); i++) {
            result = result.concat(partition.comp.shift());
            result.push(SemanticProcessor.tableToMatrixOrVector_(matrix));
        }
        result = result.concat(partition.comp.shift());
        partition = SemanticUtil.partitionNodes(result, SemanticPred.isTableOrMultiline);
        result = [];
        for (let i = 0, table; (table = partition.rel[i]); i++) {
            const prevNodes = partition.comp.shift();
            if (SemanticPred.tableIsCases(table, prevNodes)) {
                SemanticProcessor.tableToCases_(table, prevNodes.pop());
            }
            result = result.concat(prevNodes);
            result.push(table);
        }
        return result.concat(partition.comp.shift());
    }
    mfenced(open, close, sepValue, children) {
        if (sepValue && children.length > 0) {
            const separators = SemanticProcessor.nextSeparatorFunction_(sepValue);
            const newChildren = [children.shift()];
            children.forEach((child) => {
                newChildren.push(SemanticProcessor.getInstance().factory_.makeContentNode(separators()));
                newChildren.push(child);
            });
            children = newChildren;
        }
        if (open && close) {
            return SemanticProcessor.getInstance().horizontalFencedNode_(SemanticProcessor.getInstance().factory_.makeContentNode(open), SemanticProcessor.getInstance().factory_.makeContentNode(close), children);
        }
        if (open) {
            children.unshift(SemanticProcessor.getInstance().factory_.makeContentNode(open));
        }
        if (close) {
            children.push(SemanticProcessor.getInstance().factory_.makeContentNode(close));
        }
        return SemanticProcessor.getInstance().row(children);
    }
    fractionLikeNode(denom, enume, linethickness, bevelled) {
        let node;
        if (!bevelled && SemanticUtil.isZeroLength(linethickness)) {
            const child0 = SemanticProcessor.getInstance().factory_.makeBranchNode("line", [denom], []);
            const child1 = SemanticProcessor.getInstance().factory_.makeBranchNode("line", [enume], []);
            node = SemanticProcessor.getInstance().factory_.makeBranchNode("multiline", [child0, child1], []);
            SemanticProcessor.binomialForm_(node);
            SemanticProcessor.classifyMultiline(node);
            return node;
        }
        else {
            node = SemanticProcessor.getInstance().fractionNode_(denom, enume);
            if (bevelled) {
                node.addAnnotation('general', 'bevelled');
            }
            return node;
        }
    }
    tensor(base, lsub, lsup, rsub, rsup) {
        const newNode = SemanticProcessor.getInstance().factory_.makeBranchNode("tensor", [
            base,
            SemanticProcessor.getInstance().scriptNode_(lsub, "leftsub"),
            SemanticProcessor.getInstance().scriptNode_(lsup, "leftsuper"),
            SemanticProcessor.getInstance().scriptNode_(rsub, "rightsub"),
            SemanticProcessor.getInstance().scriptNode_(rsup, "rightsuper")
        ], []);
        newNode.role = base.role;
        newNode.embellished = SemanticPred.isEmbellished(base);
        return newNode;
    }
    pseudoTensor(base, sub, sup) {
        const isEmpty = (x) => !SemanticPred.isType(x, "empty");
        const nonEmptySub = sub.filter(isEmpty).length;
        const nonEmptySup = sup.filter(isEmpty).length;
        if (!nonEmptySub && !nonEmptySup) {
            return base;
        }
        const mmlTag = nonEmptySub ? (nonEmptySup ? 'MSUBSUP' : 'MSUB') : 'MSUP';
        const mmlchild = [base];
        if (nonEmptySub) {
            mmlchild.push(SemanticProcessor.getInstance().scriptNode_(sub, "rightsub", true));
        }
        if (nonEmptySup) {
            mmlchild.push(SemanticProcessor.getInstance().scriptNode_(sup, "rightsuper", true));
        }
        return SemanticProcessor.getInstance().limitNode(mmlTag, mmlchild);
    }
    font(font) {
        const mathjaxFont = SemanticProcessor.MATHJAX_FONTS[font];
        return mathjaxFont ? mathjaxFont : font;
    }
    proof(node, semantics, parse) {
        if (!semantics['inference'] && !semantics['axiom']) {
            console.log('Noise');
        }
        if (semantics['axiom']) {
            const cleaned = SemanticProcessor.getInstance().cleanInference(node.childNodes);
            const axiom = cleaned.length
                ? SemanticProcessor.getInstance().factory_.makeBranchNode("inference", parse(cleaned), [])
                : SemanticProcessor.getInstance().factory_.makeEmptyNode();
            axiom.role = "axiom";
            axiom.mathmlTree = node;
            return axiom;
        }
        const inference = SemanticProcessor.getInstance().inference(node, semantics, parse);
        if (semantics['proof']) {
            inference.role = "proof";
            inference.childNodes[0].role = "final";
        }
        return inference;
    }
    inference(node, semantics, parse) {
        if (semantics['inferenceRule']) {
            const formulas = SemanticProcessor.getInstance().getFormulas(node, [], parse);
            const inference = SemanticProcessor.getInstance().factory_.makeBranchNode("inference", [formulas.conclusion, formulas.premises], []);
            return inference;
        }
        const label = semantics['labelledRule'];
        const children = DomUtil.toArray(node.childNodes);
        const content = [];
        if (label === 'left' || label === 'both') {
            content.push(SemanticProcessor.getInstance().getLabel(node, children, parse, "left"));
        }
        if (label === 'right' || label === 'both') {
            content.push(SemanticProcessor.getInstance().getLabel(node, children, parse, "right"));
        }
        const formulas = SemanticProcessor.getInstance().getFormulas(node, children, parse);
        const inference = SemanticProcessor.getInstance().factory_.makeBranchNode("inference", [formulas.conclusion, formulas.premises], content);
        inference.mathmlTree = node;
        return inference;
    }
    getLabel(_node, children, parse, side) {
        const label = SemanticProcessor.getInstance().findNestedRow(children, 'prooflabel', side);
        const sem = SemanticProcessor.getInstance().factory_.makeBranchNode("rulelabel", parse(DomUtil.toArray(label.childNodes)), []);
        sem.role = side;
        sem.mathmlTree = label;
        return sem;
    }
    getFormulas(node, children, parse) {
        const inf = children.length
            ? SemanticProcessor.getInstance().findNestedRow(children, 'inferenceRule')
            : node;
        const up = SemanticProcessor.getSemantics(inf)['inferenceRule'] === 'up';
        const premRow = up ? inf.childNodes[1] : inf.childNodes[0];
        const concRow = up ? inf.childNodes[0] : inf.childNodes[1];
        const premTable = premRow.childNodes[0].childNodes[0];
        const topRow = DomUtil.toArray(premTable.childNodes[0].childNodes);
        const premNodes = [];
        let i = 1;
        for (const cell of topRow) {
            if (i % 2) {
                premNodes.push(cell.childNodes[0]);
            }
            i++;
        }
        const premises = parse(premNodes);
        const conclusion = parse(DomUtil.toArray(concRow.childNodes[0].childNodes))[0];
        const prem = SemanticProcessor.getInstance().factory_.makeBranchNode("premises", premises, []);
        prem.mathmlTree = premTable;
        const conc = SemanticProcessor.getInstance().factory_.makeBranchNode("conclusion", [conclusion], []);
        conc.mathmlTree = concRow.childNodes[0].childNodes[0];
        return { conclusion: conc, premises: prem };
    }
    findNestedRow(nodes, semantic, opt_value) {
        return SemanticProcessor.getInstance().findNestedRow_(nodes, semantic, 0, opt_value);
    }
    cleanInference(nodes) {
        return DomUtil.toArray(nodes).filter(function (x) {
            return DomUtil.tagName(x) !== 'MSPACE';
        });
    }
    operatorNode(node) {
        if (node.type === "unknown") {
            node.type = "operator";
        }
        return SemanticHeuristics.run('multioperator', node);
    }
    implicitNode_(nodes) {
        const operators = SemanticProcessor.getInstance().factory_.makeMultipleContentNodes(nodes.length - 1, SemanticAttr.invisibleTimes());
        SemanticProcessor.matchSpaces_(nodes, operators);
        const newNode = SemanticProcessor.getInstance().infixNode_(nodes, operators[0]);
        newNode.role = "implicit";
        operators.forEach(function (op) {
            op.parent = newNode;
        });
        newNode.contentNodes = operators;
        return newNode;
    }
    infixNode_(children, opNode) {
        const node = SemanticProcessor.getInstance().factory_.makeBranchNode("infixop", children, [opNode], SemanticUtil.getEmbellishedInner(opNode).textContent);
        node.role = opNode.role;
        return SemanticHeuristics.run('propagateSimpleFunction', node);
    }
    explicitMixed_(nodes) {
        const partition = SemanticUtil.partitionNodes(nodes, function (x) {
            return x.textContent === SemanticAttr.invisiblePlus();
        });
        if (!partition.rel.length) {
            return nodes;
        }
        let result = [];
        for (let i = 0, rel; (rel = partition.rel[i]); i++) {
            const prev = partition.comp[i];
            const next = partition.comp[i + 1];
            const last = prev.length - 1;
            if (prev[last] &&
                next[0] &&
                SemanticPred.isType(prev[last], "number") &&
                !SemanticPred.isRole(prev[last], "mixed") &&
                SemanticPred.isType(next[0], "fraction")) {
                const newNode = SemanticProcessor.getInstance().factory_.makeBranchNode("number", [prev[last], next[0]], []);
                newNode.role = "mixed";
                result = result.concat(prev.slice(0, last));
                result.push(newNode);
                next.shift();
            }
            else {
                result = result.concat(prev);
                result.push(rel);
            }
        }
        return result.concat(partition.comp[partition.comp.length - 1]);
    }
    concatNode_(inner, nodeList, type) {
        if (nodeList.length === 0) {
            return inner;
        }
        const content = nodeList
            .map(function (x) {
            return SemanticUtil.getEmbellishedInner(x).textContent;
        })
            .join(' ');
        const newNode = SemanticProcessor.getInstance().factory_.makeBranchNode(type, [inner], nodeList, content);
        if (nodeList.length > 1) {
            newNode.role = "multiop";
        }
        return newNode;
    }
    prefixNode_(node, prefixes) {
        const negatives = SemanticUtil.partitionNodes(prefixes, (x) => SemanticPred.isRole(x, "subtraction"));
        let newNode = SemanticProcessor.getInstance().concatNode_(node, negatives.comp.pop(), "prefixop");
        if (newNode.contentNodes.length === 1 &&
            newNode.contentNodes[0].role === "addition" &&
            newNode.contentNodes[0].textContent === '+') {
            newNode.role = "positive";
        }
        while (negatives.rel.length > 0) {
            newNode = SemanticProcessor.getInstance().concatNode_(newNode, [negatives.rel.pop()], "prefixop");
            newNode.role = "negative";
            newNode = SemanticProcessor.getInstance().concatNode_(newNode, negatives.comp.pop(), "prefixop");
        }
        return newNode;
    }
    postfixNode_(node, postfixes) {
        if (!postfixes.length) {
            return node;
        }
        return SemanticProcessor.getInstance().concatNode_(node, postfixes, "postfixop");
    }
    combineUnits_(nodes) {
        const partition = SemanticUtil.partitionNodes(nodes, function (x) {
            return !SemanticPred.isRole(x, "unit");
        });
        if (nodes.length === partition.rel.length) {
            return partition.rel;
        }
        const result = [];
        let rel;
        let last;
        do {
            const comp = partition.comp.shift();
            rel = partition.rel.shift();
            let unitNode = null;
            last = result.pop();
            if (last) {
                if (!comp.length || !SemanticPred.isUnitCounter(last)) {
                    result.push(last);
                }
                else {
                    comp.unshift(last);
                }
            }
            if (comp.length === 1) {
                unitNode = comp.pop();
            }
            if (comp.length > 1) {
                unitNode = SemanticProcessor.getInstance().implicitNode_(comp);
                unitNode.role = "unit";
            }
            if (unitNode) {
                result.push(unitNode);
            }
            if (rel) {
                result.push(rel);
            }
        } while (rel);
        return result;
    }
    getMixedNumbers_(nodes) {
        const partition = SemanticUtil.partitionNodes(nodes, function (x) {
            return (SemanticPred.isType(x, "fraction") &&
                SemanticPred.isRole(x, "vulgar"));
        });
        if (!partition.rel.length) {
            return nodes;
        }
        let result = [];
        for (let i = 0, rel; (rel = partition.rel[i]); i++) {
            const comp = partition.comp[i];
            const last = comp.length - 1;
            if (comp[last] &&
                SemanticPred.isType(comp[last], "number") &&
                (SemanticPred.isRole(comp[last], "integer") ||
                    SemanticPred.isRole(comp[last], "float"))) {
                const newNode = SemanticProcessor.getInstance().factory_.makeBranchNode("number", [comp[last], rel], []);
                newNode.role = "mixed";
                result = result.concat(comp.slice(0, last));
                result.push(newNode);
            }
            else {
                result = result.concat(comp);
                result.push(rel);
            }
        }
        return result.concat(partition.comp[partition.comp.length - 1]);
    }
    getTextInRow_(nodes) {
        if (nodes.length <= 1) {
            return nodes;
        }
        const partition = SemanticUtil.partitionNodes(nodes, (x) => SemanticPred.isType(x, "text"));
        if (partition.rel.length === 0) {
            return nodes;
        }
        const result = [];
        let nextComp = partition.comp[0];
        if (nextComp.length > 0) {
            result.push(SemanticProcessor.getInstance().row(nextComp));
        }
        for (let i = 0, text; (text = partition.rel[i]); i++) {
            result.push(text);
            nextComp = partition.comp[i + 1];
            if (nextComp.length > 0) {
                result.push(SemanticProcessor.getInstance().row(nextComp));
            }
        }
        return [SemanticProcessor.getInstance().dummyNode_(result)];
    }
    relationsInRow_(nodes) {
        const partition = SemanticUtil.partitionNodes(nodes, SemanticPred.isRelation);
        const firstRel = partition.rel[0];
        if (!firstRel) {
            return SemanticProcessor.getInstance().operationsInRow_(nodes);
        }
        if (nodes.length === 1) {
            return nodes[0];
        }
        const children = partition.comp.map(SemanticProcessor.getInstance().operationsInRow_);
        let node;
        if (partition.rel.some(function (x) {
            return !x.equals(firstRel);
        })) {
            node = SemanticProcessor.getInstance().factory_.makeBranchNode("multirel", children, partition.rel);
            if (partition.rel.every(function (x) {
                return x.role === firstRel.role;
            })) {
                node.role = firstRel.role;
            }
            return node;
        }
        node = SemanticProcessor.getInstance().factory_.makeBranchNode("relseq", children, partition.rel, SemanticUtil.getEmbellishedInner(firstRel).textContent);
        node.role = firstRel.role;
        return node;
    }
    operationsInRow_(nodes) {
        if (nodes.length === 0) {
            return SemanticProcessor.getInstance().factory_.makeEmptyNode();
        }
        nodes = SemanticProcessor.getInstance().explicitMixed_(nodes);
        if (nodes.length === 1) {
            return nodes[0];
        }
        const prefix = [];
        while (nodes.length > 0 && SemanticPred.isOperator(nodes[0])) {
            prefix.push(nodes.shift());
        }
        if (nodes.length === 0) {
            return SemanticProcessor.getInstance().prefixNode_(prefix.pop(), prefix);
        }
        if (nodes.length === 1) {
            return SemanticProcessor.getInstance().prefixNode_(nodes[0], prefix);
        }
        nodes = SemanticHeuristics.run('convert_juxtaposition', nodes);
        const split = SemanticUtil.sliceNodes(nodes, SemanticPred.isOperator);
        const node = SemanticProcessor.getInstance().prefixNode_(SemanticProcessor.getInstance().implicitNode(split.head), prefix);
        if (!split.div) {
            return node;
        }
        return SemanticProcessor.getInstance().operationsTree_(split.tail, node, split.div);
    }
    operationsTree_(nodes, root, lastop, opt_prefixes) {
        const prefixes = opt_prefixes || [];
        if (nodes.length === 0) {
            prefixes.unshift(lastop);
            if (root.type === "infixop") {
                const node = SemanticProcessor.getInstance().postfixNode_(root.childNodes.pop(), prefixes);
                root.appendChild(node);
                return root;
            }
            return SemanticProcessor.getInstance().postfixNode_(root, prefixes);
        }
        const split = SemanticUtil.sliceNodes(nodes, SemanticPred.isOperator);
        if (split.head.length === 0) {
            prefixes.push(split.div);
            return SemanticProcessor.getInstance().operationsTree_(split.tail, root, lastop, prefixes);
        }
        const node = SemanticProcessor.getInstance().prefixNode_(SemanticProcessor.getInstance().implicitNode(split.head), prefixes);
        const newNode = SemanticProcessor.getInstance().appendOperand_(root, lastop, node);
        if (!split.div) {
            return newNode;
        }
        return SemanticProcessor.getInstance().operationsTree_(split.tail, newNode, split.div, []);
    }
    appendOperand_(root, op, node) {
        if (root.type !== "infixop") {
            return SemanticProcessor.getInstance().infixNode_([root, node], op);
        }
        const division = SemanticProcessor.getInstance().appendDivisionOp_(root, op, node);
        if (division) {
            return division;
        }
        if (SemanticProcessor.getInstance().appendExistingOperator_(root, op, node)) {
            return root;
        }
        return op.role === "multiplication"
            ? SemanticProcessor.getInstance().appendMultiplicativeOp_(root, op, node)
            : SemanticProcessor.getInstance().appendAdditiveOp_(root, op, node);
    }
    appendDivisionOp_(root, op, node) {
        if (op.role === "division") {
            if (SemanticPred.isImplicit(root)) {
                return SemanticProcessor.getInstance().infixNode_([root, node], op);
            }
            return SemanticProcessor.getInstance().appendLastOperand_(root, op, node);
        }
        return root.role === "division"
            ? SemanticProcessor.getInstance().infixNode_([root, node], op)
            : null;
    }
    appendLastOperand_(root, op, node) {
        let lastRoot = root;
        let lastChild = root.childNodes[root.childNodes.length - 1];
        while (lastChild &&
            lastChild.type === "infixop" &&
            !SemanticPred.isImplicit(lastChild)) {
            lastRoot = lastChild;
            lastChild = lastRoot.childNodes[root.childNodes.length - 1];
        }
        const newNode = SemanticProcessor.getInstance().infixNode_([lastRoot.childNodes.pop(), node], op);
        lastRoot.appendChild(newNode);
        return root;
    }
    appendMultiplicativeOp_(root, op, node) {
        if (SemanticPred.isImplicit(root)) {
            return SemanticProcessor.getInstance().infixNode_([root, node], op);
        }
        let lastRoot = root;
        let lastChild = root.childNodes[root.childNodes.length - 1];
        while (lastChild &&
            lastChild.type === "infixop" &&
            !SemanticPred.isImplicit(lastChild)) {
            lastRoot = lastChild;
            lastChild = lastRoot.childNodes[root.childNodes.length - 1];
        }
        const newNode = SemanticProcessor.getInstance().infixNode_([lastRoot.childNodes.pop(), node], op);
        lastRoot.appendChild(newNode);
        return root;
    }
    appendAdditiveOp_(root, op, node) {
        return SemanticProcessor.getInstance().infixNode_([root, node], op);
    }
    appendExistingOperator_(root, op, node) {
        if (!root ||
            root.type !== "infixop" ||
            SemanticPred.isImplicit(root)) {
            return false;
        }
        if (root.contentNodes[0].equals(op)) {
            root.appendContentNode(op);
            root.appendChild(node);
            return true;
        }
        return SemanticProcessor.getInstance().appendExistingOperator_(root.childNodes[root.childNodes.length - 1], op, node);
    }
    getFencesInRow_(nodes) {
        let partition = SemanticUtil.partitionNodes(nodes, SemanticPred.isFence);
        partition = SemanticProcessor.purgeFences_(partition);
        const felem = partition.comp.shift();
        return SemanticProcessor.getInstance().fences_(partition.rel, partition.comp, [], [felem]);
    }
    fences_(fences, content, openStack, contentStack) {
        if (fences.length === 0 && openStack.length === 0) {
            return contentStack[0];
        }
        const openPred = (x) => SemanticPred.isRole(x, "open");
        if (fences.length === 0) {
            const result = contentStack.shift();
            while (openStack.length > 0) {
                if (openPred(openStack[0])) {
                    const firstOpen = openStack.shift();
                    SemanticProcessor.fenceToPunct_(firstOpen);
                    result.push(firstOpen);
                }
                else {
                    const split = SemanticUtil.sliceNodes(openStack, openPred);
                    const cutLength = split.head.length - 1;
                    const innerNodes = SemanticProcessor.getInstance().neutralFences_(split.head, contentStack.slice(0, cutLength));
                    contentStack = contentStack.slice(cutLength);
                    result.push(...innerNodes);
                    if (split.div) {
                        split.tail.unshift(split.div);
                    }
                    openStack = split.tail;
                }
                result.push(...contentStack.shift());
            }
            return result;
        }
        const lastOpen = openStack[openStack.length - 1];
        const firstRole = fences[0].role;
        if (firstRole === "open" ||
            (SemanticPred.isNeutralFence(fences[0]) &&
                !(lastOpen && SemanticPred.compareNeutralFences(fences[0], lastOpen)))) {
            openStack.push(fences.shift());
            const cont = content.shift();
            if (cont) {
                contentStack.push(cont);
            }
            return SemanticProcessor.getInstance().fences_(fences, content, openStack, contentStack);
        }
        if (lastOpen &&
            firstRole === "close" &&
            lastOpen.role === "open") {
            const fenced = SemanticProcessor.getInstance().horizontalFencedNode_(openStack.pop(), fences.shift(), contentStack.pop());
            contentStack.push(contentStack.pop().concat([fenced], content.shift()));
            return SemanticProcessor.getInstance().fences_(fences, content, openStack, contentStack);
        }
        if (lastOpen &&
            SemanticPred.compareNeutralFences(fences[0], lastOpen)) {
            if (!SemanticPred.elligibleLeftNeutral(lastOpen) ||
                !SemanticPred.elligibleRightNeutral(fences[0])) {
                openStack.push(fences.shift());
                const cont = content.shift();
                if (cont) {
                    contentStack.push(cont);
                }
                return SemanticProcessor.getInstance().fences_(fences, content, openStack, contentStack);
            }
            const fenced = SemanticProcessor.getInstance().horizontalFencedNode_(openStack.pop(), fences.shift(), contentStack.pop());
            contentStack.push(contentStack.pop().concat([fenced], content.shift()));
            return SemanticProcessor.getInstance().fences_(fences, content, openStack, contentStack);
        }
        if (lastOpen &&
            firstRole === "close" &&
            SemanticPred.isNeutralFence(lastOpen) &&
            openStack.some(openPred)) {
            const split = SemanticUtil.sliceNodes(openStack, openPred, true);
            const rightContent = contentStack.pop();
            const cutLength = contentStack.length - split.tail.length + 1;
            const innerNodes = SemanticProcessor.getInstance().neutralFences_(split.tail, contentStack.slice(cutLength));
            contentStack = contentStack.slice(0, cutLength);
            const fenced = SemanticProcessor.getInstance().horizontalFencedNode_(split.div, fences.shift(), contentStack.pop().concat(innerNodes, rightContent));
            contentStack.push(contentStack.pop().concat([fenced], content.shift()));
            return SemanticProcessor.getInstance().fences_(fences, content, split.head, contentStack);
        }
        const fenced = fences.shift();
        SemanticProcessor.fenceToPunct_(fenced);
        contentStack.push(contentStack.pop().concat([fenced], content.shift()));
        return SemanticProcessor.getInstance().fences_(fences, content, openStack, contentStack);
    }
    neutralFences_(fences, content) {
        if (fences.length === 0) {
            return fences;
        }
        if (fences.length === 1) {
            SemanticProcessor.fenceToPunct_(fences[0]);
            return fences;
        }
        const firstFence = fences.shift();
        if (!SemanticPred.elligibleLeftNeutral(firstFence)) {
            SemanticProcessor.fenceToPunct_(firstFence);
            const restContent = content.shift();
            restContent.unshift(firstFence);
            return restContent.concat(SemanticProcessor.getInstance().neutralFences_(fences, content));
        }
        const split = SemanticUtil.sliceNodes(fences, function (x) {
            return SemanticPred.compareNeutralFences(x, firstFence);
        });
        if (!split.div) {
            SemanticProcessor.fenceToPunct_(firstFence);
            const restContent = content.shift();
            restContent.unshift(firstFence);
            return restContent.concat(SemanticProcessor.getInstance().neutralFences_(fences, content));
        }
        if (!SemanticPred.elligibleRightNeutral(split.div)) {
            SemanticProcessor.fenceToPunct_(split.div);
            fences.unshift(firstFence);
            return SemanticProcessor.getInstance().neutralFences_(fences, content);
        }
        const newContent = SemanticProcessor.getInstance().combineFencedContent_(firstFence, split.div, split.head, content);
        if (split.tail.length > 0) {
            const leftContent = newContent.shift();
            const result = SemanticProcessor.getInstance().neutralFences_(split.tail, newContent);
            return leftContent.concat(result);
        }
        return newContent[0];
    }
    combineFencedContent_(leftFence, rightFence, midFences, content) {
        if (midFences.length === 0) {
            const fenced = SemanticProcessor.getInstance().horizontalFencedNode_(leftFence, rightFence, content.shift());
            if (content.length > 0) {
                content[0].unshift(fenced);
            }
            else {
                content = [[fenced]];
            }
            return content;
        }
        const leftContent = content.shift();
        const cutLength = midFences.length - 1;
        const midContent = content.slice(0, cutLength);
        content = content.slice(cutLength);
        const rightContent = content.shift();
        const innerNodes = SemanticProcessor.getInstance().neutralFences_(midFences, midContent);
        leftContent.push(...innerNodes);
        leftContent.push(...rightContent);
        const fenced = SemanticProcessor.getInstance().horizontalFencedNode_(leftFence, rightFence, leftContent);
        if (content.length > 0) {
            content[0].unshift(fenced);
        }
        else {
            content = [[fenced]];
        }
        return content;
    }
    horizontalFencedNode_(ofence, cfence, content) {
        const childNode = SemanticProcessor.getInstance().row(content);
        let newNode = SemanticProcessor.getInstance().factory_.makeBranchNode("fenced", [childNode], [ofence, cfence]);
        if (ofence.role === "open") {
            SemanticProcessor.getInstance().classifyHorizontalFence_(newNode);
            newNode = SemanticHeuristics.run('propagateComposedFunction', newNode);
        }
        else {
            newNode.role = ofence.role;
        }
        newNode = SemanticHeuristics.run('detect_cycle', newNode);
        return SemanticProcessor.rewriteFencedNode_(newNode);
    }
    classifyHorizontalFence_(node) {
        node.role = "leftright";
        const children = node.childNodes;
        if (!SemanticPred.isSetNode(node) || children.length > 1) {
            return;
        }
        if (children.length === 0 || children[0].type === "empty") {
            node.role = "set empty";
            return;
        }
        const type = children[0].type;
        if (children.length === 1 &&
            SemanticPred.isSingletonSetContent(children[0])) {
            node.role = "set singleton";
            return;
        }
        const role = children[0].role;
        if (type !== "punctuated" || role !== "sequence") {
            return;
        }
        if (children[0].contentNodes[0].role === "comma") {
            node.role = "set collection";
            return;
        }
        if (children[0].contentNodes.length === 1 &&
            (children[0].contentNodes[0].role === "vbar" ||
                children[0].contentNodes[0].role === "colon")) {
            node.role = "set extended";
            SemanticProcessor.getInstance().setExtension_(node);
            return;
        }
    }
    setExtension_(set) {
        const extender = set.childNodes[0].childNodes[0];
        if (extender &&
            extender.type === "infixop" &&
            extender.contentNodes.length === 1 &&
            SemanticPred.isMembership(extender.contentNodes[0])) {
            extender.addAnnotation('set', 'intensional');
            extender.contentNodes[0].addAnnotation('set', 'intensional');
        }
    }
    getPunctuationInRow_(nodes) {
        if (nodes.length <= 1) {
            return nodes;
        }
        const allowedType = (x) => {
            const type = x.type;
            return (type === 'punctuation' ||
                type === 'text' ||
                type === 'operator' ||
                type === 'relation');
        };
        const partition = SemanticUtil.partitionNodes(nodes, function (x) {
            if (!SemanticPred.isPunctuation(x)) {
                return false;
            }
            if (SemanticPred.isPunctuation(x) &&
                !SemanticPred.isRole(x, "ellipsis")) {
                return true;
            }
            const index = nodes.indexOf(x);
            if (index === 0) {
                if (nodes[1] && allowedType(nodes[1])) {
                    return false;
                }
                return true;
            }
            const prev = nodes[index - 1];
            if (index === nodes.length - 1) {
                if (allowedType(prev)) {
                    return false;
                }
                return true;
            }
            const next = nodes[index + 1];
            if (allowedType(prev) && allowedType(next)) {
                return false;
            }
            return true;
        });
        if (partition.rel.length === 0) {
            return nodes;
        }
        const newNodes = [];
        let firstComp = partition.comp.shift();
        if (firstComp.length > 0) {
            newNodes.push(SemanticProcessor.getInstance().row(firstComp));
        }
        let relCounter = 0;
        while (partition.comp.length > 0) {
            newNodes.push(partition.rel[relCounter++]);
            firstComp = partition.comp.shift();
            if (firstComp.length > 0) {
                newNodes.push(SemanticProcessor.getInstance().row(firstComp));
            }
        }
        return [
            SemanticProcessor.getInstance().punctuatedNode_(newNodes, partition.rel)
        ];
    }
    punctuatedNode_(nodes, punctuations) {
        const newNode = SemanticProcessor.getInstance().factory_.makeBranchNode("punctuated", nodes, punctuations);
        if (punctuations.length === nodes.length) {
            const firstRole = punctuations[0].role;
            if (firstRole !== "unknown" &&
                punctuations.every(function (punct) {
                    return punct.role === firstRole;
                })) {
                newNode.role = firstRole;
                return newNode;
            }
        }
        if (SemanticPred.singlePunctAtPosition(nodes, punctuations, 0)) {
            newNode.role = "startpunct";
        }
        else if (SemanticPred.singlePunctAtPosition(nodes, punctuations, nodes.length - 1)) {
            newNode.role = "endpunct";
        }
        else if (punctuations.every((x) => SemanticPred.isRole(x, "dummy"))) {
            newNode.role = "text";
        }
        else if (punctuations.every((x) => SemanticPred.isRole(x, "space"))) {
            newNode.role = "space";
        }
        else {
            newNode.role = "sequence";
        }
        return newNode;
    }
    dummyNode_(children) {
        const commata = SemanticProcessor.getInstance().factory_.makeMultipleContentNodes(children.length - 1, SemanticAttr.invisibleComma());
        commata.forEach(function (comma) {
            comma.role = "dummy";
        });
        return SemanticProcessor.getInstance().punctuatedNode_(children, commata);
    }
    accentRole_(node, type) {
        if (!SemanticPred.isAccent(node)) {
            return false;
        }
        const content = node.textContent;
        const role = SemanticAttr.lookupSecondary('bar', content) ||
            SemanticAttr.lookupSecondary('tilde', content) ||
            node.role;
        node.role =
            type === "underscore"
                ? "underaccent"
                : "overaccent";
        node.addAnnotation('accent', role);
        return true;
    }
    accentNode_(center, children, type, length, accent) {
        children = children.slice(0, length + 1);
        const child1 = children[1];
        const child2 = children[2];
        let innerNode;
        if (!accent && child2) {
            innerNode = SemanticProcessor.getInstance().factory_.makeBranchNode("subscript", [center, child1], []);
            innerNode.role = "subsup";
            children = [innerNode, child2];
            type = "superscript";
        }
        if (accent) {
            const underAccent = SemanticProcessor.getInstance().accentRole_(child1, type);
            if (child2) {
                const overAccent = SemanticProcessor.getInstance().accentRole_(child2, "overscore");
                if (overAccent && !underAccent) {
                    innerNode = SemanticProcessor.getInstance().factory_.makeBranchNode("overscore", [center, child2], []);
                    children = [innerNode, child1];
                    type = "underscore";
                }
                else {
                    innerNode = SemanticProcessor.getInstance().factory_.makeBranchNode("underscore", [center, child1], []);
                    children = [innerNode, child2];
                    type = "overscore";
                }
                innerNode.role = "underover";
            }
        }
        return SemanticProcessor.getInstance().makeLimitNode_(center, children, innerNode, type);
    }
    makeLimitNode_(center, children, innerNode, type) {
        if (type === "limupper" &&
            center.type === "limlower") {
            center.childNodes.push(children[1]);
            children[1].parent = center;
            center.type = "limboth";
            return center;
        }
        if (type === "limlower" &&
            center.type === "limupper") {
            center.childNodes.splice(1, -1, children[1]);
            children[1].parent = center;
            center.type = "limboth";
            return center;
        }
        const newNode = SemanticProcessor.getInstance().factory_.makeBranchNode(type, children, []);
        const embellished = SemanticPred.isEmbellished(center);
        if (innerNode) {
            innerNode.embellished = embellished;
        }
        newNode.embellished = embellished;
        newNode.role = center.role;
        return newNode;
    }
    getFunctionsInRow_(restNodes, opt_result) {
        const result = opt_result || [];
        if (restNodes.length === 0) {
            return result;
        }
        const firstNode = restNodes.shift();
        const heuristic = SemanticProcessor.classifyFunction_(firstNode, restNodes);
        if (!heuristic) {
            result.push(firstNode);
            return SemanticProcessor.getInstance().getFunctionsInRow_(restNodes, result);
        }
        const processedRest = SemanticProcessor.getInstance().getFunctionsInRow_(restNodes, []);
        const newRest = SemanticProcessor.getInstance().getFunctionArgs_(firstNode, processedRest, heuristic);
        return result.concat(newRest);
    }
    getFunctionArgs_(func, rest, heuristic) {
        let partition, arg, funcNode;
        switch (heuristic) {
            case 'integral': {
                const components = SemanticProcessor.getInstance().getIntegralArgs_(rest);
                if (!components.intvar && !components.integrand.length) {
                    components.rest.unshift(func);
                    return components.rest;
                }
                const integrand = SemanticProcessor.getInstance().row(components.integrand);
                funcNode = SemanticProcessor.getInstance().integralNode_(func, integrand, components.intvar);
                components.rest.unshift(funcNode);
                return components.rest;
            }
            case 'prefix': {
                if (rest[0] && rest[0].type === "fenced") {
                    const arg = rest.shift();
                    if (!SemanticPred.isNeutralFence(arg)) {
                        arg.role = "leftright";
                    }
                    funcNode = SemanticProcessor.getInstance().functionNode_(func, arg);
                    rest.unshift(funcNode);
                    return rest;
                }
                partition = SemanticUtil.sliceNodes(rest, SemanticPred.isPrefixFunctionBoundary);
                if (!partition.head.length) {
                    if (!partition.div ||
                        !SemanticPred.isType(partition.div, "appl")) {
                        rest.unshift(func);
                        return rest;
                    }
                    arg = partition.div;
                }
                else {
                    arg = SemanticProcessor.getInstance().row(partition.head);
                    if (partition.div) {
                        partition.tail.unshift(partition.div);
                    }
                }
                funcNode = SemanticProcessor.getInstance().functionNode_(func, arg);
                partition.tail.unshift(funcNode);
                return partition.tail;
            }
            case 'bigop': {
                partition = SemanticUtil.sliceNodes(rest, SemanticPred.isBigOpBoundary);
                if (!partition.head.length) {
                    rest.unshift(func);
                    return rest;
                }
                arg = SemanticProcessor.getInstance().row(partition.head);
                funcNode = SemanticProcessor.getInstance().bigOpNode_(func, arg);
                if (partition.div) {
                    partition.tail.unshift(partition.div);
                }
                partition.tail.unshift(funcNode);
                return partition.tail;
            }
            case 'simple':
            default: {
                if (rest.length === 0) {
                    return [func];
                }
                const firstArg = rest[0];
                if (firstArg.type === "fenced" &&
                    !SemanticPred.isNeutralFence(firstArg) &&
                    SemanticPred.isSimpleFunctionScope(firstArg)) {
                    firstArg.role = "leftright";
                    SemanticProcessor.propagateFunctionRole_(func, "simple function");
                    funcNode = SemanticProcessor.getInstance().functionNode_(func, rest.shift());
                    rest.unshift(funcNode);
                    return rest;
                }
                rest.unshift(func);
                return rest;
            }
        }
    }
    getIntegralArgs_(nodes, args = []) {
        if (nodes.length === 0) {
            return { integrand: args, intvar: null, rest: nodes };
        }
        const firstNode = nodes[0];
        if (SemanticPred.isGeneralFunctionBoundary(firstNode)) {
            return { integrand: args, intvar: null, rest: nodes };
        }
        if (SemanticPred.isIntegralDxBoundarySingle(firstNode)) {
            firstNode.role = "integral";
            return { integrand: args, intvar: firstNode, rest: nodes.slice(1) };
        }
        if (nodes[1] && SemanticPred.isIntegralDxBoundary(firstNode, nodes[1])) {
            const intvar = SemanticProcessor.getInstance().prefixNode_(nodes[1], [firstNode]);
            intvar.role = "integral";
            return { integrand: args, intvar: intvar, rest: nodes.slice(2) };
        }
        args.push(nodes.shift());
        return SemanticProcessor.getInstance().getIntegralArgs_(nodes, args);
    }
    functionNode_(func, arg) {
        const applNode = SemanticProcessor.getInstance().factory_.makeContentNode(SemanticAttr.functionApplication());
        const appl = SemanticProcessor.getInstance().funcAppls[func.id];
        if (appl) {
            applNode.mathmlTree = appl.mathmlTree;
            applNode.mathml = appl.mathml;
            applNode.annotation = appl.annotation;
            applNode.attributes = appl.attributes;
            delete SemanticProcessor.getInstance().funcAppls[func.id];
        }
        applNode.type = "punctuation";
        applNode.role = "application";
        const funcop = SemanticProcessor.getFunctionOp_(func, function (node) {
            return (SemanticPred.isType(node, "function") ||
                (SemanticPred.isType(node, "identifier") &&
                    SemanticPred.isRole(node, "simple function")));
        });
        return SemanticProcessor.getInstance().functionalNode_("appl", [func, arg], funcop, [applNode]);
    }
    bigOpNode_(bigOp, arg) {
        const largeop = SemanticProcessor.getFunctionOp_(bigOp, (x) => SemanticPred.isType(x, "largeop"));
        return SemanticProcessor.getInstance().functionalNode_("bigop", [bigOp, arg], largeop, []);
    }
    integralNode_(integral, integrand, intvar) {
        integrand =
            integrand || SemanticProcessor.getInstance().factory_.makeEmptyNode();
        intvar = intvar || SemanticProcessor.getInstance().factory_.makeEmptyNode();
        const largeop = SemanticProcessor.getFunctionOp_(integral, (x) => SemanticPred.isType(x, "largeop"));
        return SemanticProcessor.getInstance().functionalNode_("integral", [integral, integrand, intvar], largeop, []);
    }
    functionalNode_(type, children, operator, content) {
        const funcop = children[0];
        let oldParent;
        if (operator) {
            oldParent = operator.parent;
            content.push(operator);
        }
        const newNode = SemanticProcessor.getInstance().factory_.makeBranchNode(type, children, content);
        newNode.role = funcop.role;
        if (oldParent) {
            operator.parent = oldParent;
        }
        return newNode;
    }
    fractionNode_(denom, enume) {
        const newNode = SemanticProcessor.getInstance().factory_.makeBranchNode("fraction", [denom, enume], []);
        newNode.role = newNode.childNodes.every(function (x) {
            return (SemanticPred.isType(x, "number") &&
                SemanticPred.isRole(x, "integer"));
        })
            ? "vulgar"
            : newNode.childNodes.every(SemanticPred.isPureUnit)
                ? "unit"
                : "division";
        return SemanticHeuristics.run('propagateSimpleFunction', newNode);
    }
    scriptNode_(nodes, role, opt_noSingle) {
        let newNode;
        switch (nodes.length) {
            case 0:
                newNode = SemanticProcessor.getInstance().factory_.makeEmptyNode();
                break;
            case 1:
                newNode = nodes[0];
                if (opt_noSingle) {
                    return newNode;
                }
                break;
            default:
                newNode = SemanticProcessor.getInstance().dummyNode_(nodes);
        }
        newNode.role = role;
        return newNode;
    }
    findNestedRow_(nodes, semantic, level, value) {
        if (level > 3) {
            return null;
        }
        for (let i = 0, node; (node = nodes[i]); i++) {
            const tag = DomUtil.tagName(node);
            if (tag !== 'MSPACE') {
                if (tag === 'MROW') {
                    return SemanticProcessor.getInstance().findNestedRow_(DomUtil.toArray(node.childNodes), semantic, level + 1, value);
                }
                if (SemanticProcessor.findSemantics(node, semantic, value)) {
                    return node;
                }
            }
        }
        return null;
    }
}
exports.default = SemanticProcessor;
SemanticProcessor.FENCE_TO_PUNCT_ = {
    ["metric"]: "metric",
    ["neutral"]: "vbar",
    ["open"]: "openfence",
    ["close"]: "closefence"
};
SemanticProcessor.MML_TO_LIMIT_ = {
    MSUB: { type: "limlower", length: 1 },
    MUNDER: { type: "limlower", length: 1 },
    MSUP: { type: "limupper", length: 1 },
    MOVER: { type: "limupper", length: 1 },
    MSUBSUP: { type: "limboth", length: 2 },
    MUNDEROVER: { type: "limboth", length: 2 }
};
SemanticProcessor.MML_TO_BOUNDS_ = {
    MSUB: { type: "subscript", length: 1, accent: false },
    MSUP: { type: "superscript", length: 1, accent: false },
    MSUBSUP: { type: "subscript", length: 2, accent: false },
    MUNDER: { type: "underscore", length: 1, accent: true },
    MOVER: { type: "overscore", length: 1, accent: true },
    MUNDEROVER: { type: "underscore", length: 2, accent: true }
};
SemanticProcessor.CLASSIFY_FUNCTION_ = {
    ["integral"]: 'integral',
    ["sum"]: 'bigop',
    ["prefix function"]: 'prefix',
    ["limit function"]: 'prefix',
    ["simple function"]: 'prefix',
    ["composed function"]: 'prefix'
};
SemanticProcessor.MATHJAX_FONTS = {
    '-tex-caligraphic': "caligraphic",
    '-tex-caligraphic-bold': "caligraphic-bold",
    '-tex-calligraphic': "caligraphic",
    '-tex-calligraphic-bold': "caligraphic-bold",
    '-tex-oldstyle': "oldstyle",
    '-tex-oldstyle-bold': "oldstyle-bold",
    '-tex-mathit': "italic"
};
