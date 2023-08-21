"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticMathml = void 0;
const DomUtil = require("../common/dom_util");
const semantic_parser_1 = require("./semantic_parser");
const SemanticPred = require("./semantic_pred");
const semantic_processor_1 = require("./semantic_processor");
const SemanticUtil = require("./semantic_util");
class SemanticMathml extends semantic_parser_1.SemanticAbstractParser {
    constructor() {
        super('MathML');
        this.parseMap_ = {
            SEMANTICS: this.semantics_.bind(this),
            MATH: this.rows_.bind(this),
            MROW: this.rows_.bind(this),
            MPADDED: this.rows_.bind(this),
            MSTYLE: this.rows_.bind(this),
            MFRAC: this.fraction_.bind(this),
            MSUB: this.limits_.bind(this),
            MSUP: this.limits_.bind(this),
            MSUBSUP: this.limits_.bind(this),
            MOVER: this.limits_.bind(this),
            MUNDER: this.limits_.bind(this),
            MUNDEROVER: this.limits_.bind(this),
            MROOT: this.root_.bind(this),
            MSQRT: this.sqrt_.bind(this),
            MTABLE: this.table_.bind(this),
            MLABELEDTR: this.tableLabeledRow_.bind(this),
            MTR: this.tableRow_.bind(this),
            MTD: this.tableCell_.bind(this),
            MS: this.text_.bind(this),
            MTEXT: this.text_.bind(this),
            MSPACE: this.space_.bind(this),
            'ANNOTATION-XML': this.text_.bind(this),
            MI: this.identifier_.bind(this),
            MN: this.number_.bind(this),
            MO: this.operator_.bind(this),
            MFENCED: this.fenced_.bind(this),
            MENCLOSE: this.enclosed_.bind(this),
            MMULTISCRIPTS: this.multiscripts_.bind(this),
            ANNOTATION: this.empty_.bind(this),
            NONE: this.empty_.bind(this),
            MACTION: this.action_.bind(this)
        };
        const meaning = {
            type: "identifier",
            role: "numbersetletter",
            font: "double-struck"
        };
        [
            'C',
            'H',
            'N',
            'P',
            'Q',
            'R',
            'Z',
            'ℂ',
            'ℍ',
            'ℕ',
            'ℙ',
            'ℚ',
            'ℝ',
            'ℤ'
        ].forEach(((x) => this.getFactory().defaultMap.add(x, meaning)).bind(this));
    }
    static getAttribute_(node, attr, def) {
        if (!node.hasAttribute(attr)) {
            return def;
        }
        const value = node.getAttribute(attr);
        if (value.match(/^\s*$/)) {
            return null;
        }
        return value;
    }
    parse(mml) {
        semantic_processor_1.default.getInstance().setNodeFactory(this.getFactory());
        const children = DomUtil.toArray(mml.childNodes);
        const tag = DomUtil.tagName(mml);
        const func = this.parseMap_[tag];
        const newNode = (func ? func : this.dummy_.bind(this))(mml, children);
        SemanticUtil.addAttributes(newNode, mml);
        if (['MATH', 'MROW', 'MPADDED', 'MSTYLE', 'SEMANTICS'].indexOf(tag) !== -1) {
            return newNode;
        }
        newNode.mathml.unshift(mml);
        newNode.mathmlTree = mml;
        return newNode;
    }
    semantics_(_node, children) {
        return children.length
            ? this.parse(children[0])
            : this.getFactory().makeEmptyNode();
    }
    rows_(node, children) {
        const semantics = node.getAttribute('semantics');
        if (semantics && semantics.match('bspr_')) {
            return semantic_processor_1.default.proof(node, semantics, this.parseList.bind(this));
        }
        children = SemanticUtil.purgeNodes(children);
        let newNode;
        if (children.length === 1) {
            newNode = this.parse(children[0]);
            if (newNode.type === "empty" && !newNode.mathmlTree) {
                newNode.mathmlTree = node;
            }
        }
        else {
            newNode = semantic_processor_1.default.getInstance().row(this.parseList(children));
        }
        newNode.mathml.unshift(node);
        return newNode;
    }
    fraction_(node, children) {
        if (!children.length) {
            return this.getFactory().makeEmptyNode();
        }
        const upper = this.parse(children[0]);
        const lower = children[1]
            ? this.parse(children[1])
            : this.getFactory().makeEmptyNode();
        const sem = semantic_processor_1.default.getInstance().fractionLikeNode(upper, lower, node.getAttribute('linethickness'), node.getAttribute('bevelled') === 'true');
        return sem;
    }
    limits_(node, children) {
        return semantic_processor_1.default.getInstance().limitNode(DomUtil.tagName(node), this.parseList(children));
    }
    root_(node, children) {
        if (!children[1]) {
            return this.sqrt_(node, children);
        }
        return this.getFactory().makeBranchNode("root", [this.parse(children[1]), this.parse(children[0])], []);
    }
    sqrt_(_node, children) {
        const semNodes = this.parseList(SemanticUtil.purgeNodes(children));
        return this.getFactory().makeBranchNode("sqrt", [semantic_processor_1.default.getInstance().row(semNodes)], []);
    }
    table_(node, children) {
        const semantics = node.getAttribute('semantics');
        if (semantics && semantics.match('bspr_')) {
            return semantic_processor_1.default.proof(node, semantics, this.parseList.bind(this));
        }
        const newNode = this.getFactory().makeBranchNode("table", this.parseList(children), []);
        newNode.mathmlTree = node;
        semantic_processor_1.default.tableToMultiline(newNode);
        return newNode;
    }
    tableRow_(_node, children) {
        const newNode = this.getFactory().makeBranchNode("row", this.parseList(children), []);
        newNode.role = "table";
        return newNode;
    }
    tableLabeledRow_(node, children) {
        if (!children.length) {
            return this.tableRow_(node, children);
        }
        const label = this.parse(children[0]);
        label.role = "label";
        const newNode = this.getFactory().makeBranchNode("row", this.parseList(children.slice(1)), [label]);
        newNode.role = "table";
        return newNode;
    }
    tableCell_(_node, children) {
        const semNodes = this.parseList(SemanticUtil.purgeNodes(children));
        let childNodes;
        if (!semNodes.length) {
            childNodes = [];
        }
        else if (semNodes.length === 1 &&
            SemanticPred.isType(semNodes[0], "empty")) {
            childNodes = semNodes;
        }
        else {
            childNodes = [semantic_processor_1.default.getInstance().row(semNodes)];
        }
        const newNode = this.getFactory().makeBranchNode("cell", childNodes, []);
        newNode.role = "table";
        return newNode;
    }
    space_(node, children) {
        const width = node.getAttribute('width');
        const match = width && width.match(/[a-z]*$/);
        if (!match) {
            return this.empty_(node, children);
        }
        const sizes = {
            cm: 0.4,
            pc: 0.5,
            em: 0.5,
            ex: 1,
            in: 0.15,
            pt: 5,
            mm: 5
        };
        const unit = match[0];
        const measure = parseFloat(width.slice(0, match.index));
        const size = sizes[unit];
        if (!size || isNaN(measure) || measure < size) {
            return this.empty_(node, children);
        }
        const newNode = this.getFactory().makeUnprocessed(node);
        return semantic_processor_1.default.getInstance().text(newNode, DomUtil.tagName(node));
    }
    text_(node, children) {
        const newNode = this.leaf_(node, children);
        if (!node.textContent) {
            return newNode;
        }
        newNode.updateContent(node.textContent, true);
        return semantic_processor_1.default.getInstance().text(newNode, DomUtil.tagName(node));
    }
    identifier_(node, children) {
        const newNode = this.leaf_(node, children);
        return semantic_processor_1.default.getInstance().identifierNode(newNode, semantic_processor_1.default.getInstance().font(node.getAttribute('mathvariant')), node.getAttribute('class'));
    }
    number_(node, children) {
        const newNode = this.leaf_(node, children);
        semantic_processor_1.default.number(newNode);
        return newNode;
    }
    operator_(node, children) {
        const newNode = this.leaf_(node, children);
        semantic_processor_1.default.getInstance().operatorNode(newNode);
        return newNode;
    }
    fenced_(node, children) {
        const semNodes = this.parseList(SemanticUtil.purgeNodes(children));
        const sepValue = SemanticMathml.getAttribute_(node, 'separators', ',');
        const open = SemanticMathml.getAttribute_(node, 'open', '(');
        const close = SemanticMathml.getAttribute_(node, 'close', ')');
        const newNode = semantic_processor_1.default.getInstance().mfenced(open, close, sepValue, semNodes);
        const nodes = semantic_processor_1.default.getInstance().tablesInRow([newNode]);
        return nodes[0];
    }
    enclosed_(node, children) {
        const semNodes = this.parseList(SemanticUtil.purgeNodes(children));
        const newNode = this.getFactory().makeBranchNode("enclose", [semantic_processor_1.default.getInstance().row(semNodes)], []);
        newNode.role =
            node.getAttribute('notation') || "unknown";
        return newNode;
    }
    multiscripts_(_node, children) {
        if (!children.length) {
            return this.getFactory().makeEmptyNode();
        }
        const base = this.parse(children.shift());
        if (!children.length) {
            return base;
        }
        const lsup = [];
        const lsub = [];
        const rsup = [];
        const rsub = [];
        let prescripts = false;
        let scriptcount = 0;
        for (let i = 0, child; (child = children[i]); i++) {
            if (DomUtil.tagName(child) === 'MPRESCRIPTS') {
                prescripts = true;
                scriptcount = 0;
                continue;
            }
            prescripts
                ? scriptcount & 1
                    ? lsup.push(child)
                    : lsub.push(child)
                : scriptcount & 1
                    ? rsup.push(child)
                    : rsub.push(child);
            scriptcount++;
        }
        if (!SemanticUtil.purgeNodes(lsup).length &&
            !SemanticUtil.purgeNodes(lsub).length) {
            return semantic_processor_1.default.getInstance().pseudoTensor(base, this.parseList(rsub), this.parseList(rsup));
        }
        return semantic_processor_1.default.getInstance().tensor(base, this.parseList(lsub), this.parseList(lsup), this.parseList(rsub), this.parseList(rsup));
    }
    empty_(_node, _children) {
        return this.getFactory().makeEmptyNode();
    }
    action_(node, children) {
        return children.length > 1
            ? this.parse(children[1])
            : this.getFactory().makeUnprocessed(node);
    }
    dummy_(node, _children) {
        const unknown = this.getFactory().makeUnprocessed(node);
        unknown.role = node.tagName;
        unknown.textContent = node.textContent;
        return unknown;
    }
    leaf_(mml, children) {
        if (children.length === 1 &&
            children[0].nodeType !== DomUtil.NodeType.TEXT_NODE) {
            const node = this.getFactory().makeUnprocessed(mml);
            node.role = children[0].tagName;
            SemanticUtil.addAttributes(node, children[0]);
            return node;
        }
        return this.getFactory().makeLeafNode(mml.textContent, semantic_processor_1.default.getInstance().font(mml.getAttribute('mathvariant')));
    }
}
exports.SemanticMathml = SemanticMathml;
