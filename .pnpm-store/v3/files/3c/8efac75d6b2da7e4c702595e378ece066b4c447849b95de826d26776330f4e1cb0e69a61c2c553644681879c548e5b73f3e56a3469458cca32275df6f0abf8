"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticSkeleton = void 0;
const BaseUtil = require("../common/base_util");
const XpathUtil = require("../common/xpath_util");
const enrich_attr_1 = require("../enrich_mathml/enrich_attr");
class SemanticSkeleton {
    constructor(skeleton) {
        this.parents = null;
        this.levelsMap = null;
        skeleton = skeleton === 0 ? skeleton : skeleton || [];
        this.array = skeleton;
    }
    static fromTree(tree) {
        return SemanticSkeleton.fromNode(tree.root);
    }
    static fromNode(node) {
        return new SemanticSkeleton(SemanticSkeleton.fromNode_(node));
    }
    static fromString(skel) {
        return new SemanticSkeleton(SemanticSkeleton.fromString_(skel));
    }
    static simpleCollapseStructure(strct) {
        return typeof strct === 'number';
    }
    static contentCollapseStructure(strct) {
        return (!!strct &&
            !SemanticSkeleton.simpleCollapseStructure(strct) &&
            strct[0] === 'c');
    }
    static interleaveIds(first, second) {
        return BaseUtil.interleaveLists(SemanticSkeleton.collapsedLeafs(first), SemanticSkeleton.collapsedLeafs(second));
    }
    static collapsedLeafs(...args) {
        const collapseStructure = (coll) => {
            if (SemanticSkeleton.simpleCollapseStructure(coll)) {
                return [coll];
            }
            coll = coll;
            return SemanticSkeleton.contentCollapseStructure(coll[1])
                ? coll.slice(2)
                : coll.slice(1);
        };
        return args.reduce((x, y) => x.concat(collapseStructure(y)), []);
    }
    static fromStructure(mml, tree) {
        return new SemanticSkeleton(SemanticSkeleton.tree_(mml, tree.root));
    }
    static combineContentChildren(semantic, content, children) {
        switch (semantic.type) {
            case "relseq":
            case "infixop":
            case "multirel":
                return BaseUtil.interleaveLists(children, content);
            case "prefixop":
                return content.concat(children);
            case "postfixop":
                return children.concat(content);
            case "fenced":
                children.unshift(content[0]);
                children.push(content[1]);
                return children;
            case "appl":
                return [children[0], content[0], children[1]];
            case "root":
                return [children[1], children[0]];
            case "row":
            case "line":
                if (content.length) {
                    children.unshift(content[0]);
                }
                return children;
            default:
                return children;
        }
    }
    static makeSexp_(struct) {
        if (SemanticSkeleton.simpleCollapseStructure(struct)) {
            return struct.toString();
        }
        if (SemanticSkeleton.contentCollapseStructure(struct)) {
            return ('(' +
                'c ' +
                struct.slice(1).map(SemanticSkeleton.makeSexp_).join(' ') +
                ')');
        }
        return ('(' + struct.map(SemanticSkeleton.makeSexp_).join(' ') + ')');
    }
    static fromString_(skeleton) {
        let str = skeleton.replace(/\(/g, '[');
        str = str.replace(/\)/g, ']');
        str = str.replace(/ /g, ',');
        str = str.replace(/c/g, '"c"');
        return JSON.parse(str);
    }
    static fromNode_(node) {
        if (!node) {
            return [];
        }
        const content = node.contentNodes;
        let contentStructure;
        if (content.length) {
            contentStructure = content.map(SemanticSkeleton.fromNode_);
            contentStructure.unshift('c');
        }
        const children = node.childNodes;
        if (!children.length) {
            return content.length ? [node.id, contentStructure] : node.id;
        }
        const structure = children.map(SemanticSkeleton.fromNode_);
        if (content.length) {
            structure.unshift(contentStructure);
        }
        structure.unshift(node.id);
        return structure;
    }
    static tree_(mml, node) {
        if (!node) {
            return [];
        }
        if (!node.childNodes.length) {
            return node.id;
        }
        const id = node.id;
        const skeleton = [id];
        const mmlChild = XpathUtil.evalXPath(`.//self::*[@${enrich_attr_1.Attribute.ID}=${id}]`, mml)[0];
        const children = SemanticSkeleton.combineContentChildren(node, node.contentNodes.map(function (x) {
            return x;
        }), node.childNodes.map(function (x) {
            return x;
        }));
        if (mmlChild) {
            SemanticSkeleton.addOwns_(mmlChild, children);
        }
        for (let i = 0, child; (child = children[i]); i++) {
            skeleton.push(SemanticSkeleton.tree_(mml, child));
        }
        return skeleton;
    }
    static addOwns_(node, children) {
        const collapsed = node.getAttribute(enrich_attr_1.Attribute.COLLAPSED);
        const leafs = collapsed
            ? SemanticSkeleton.realLeafs_(SemanticSkeleton.fromString(collapsed).array)
            : children.map((x) => x.id);
        node.setAttribute(enrich_attr_1.Attribute.OWNS, leafs.join(' '));
    }
    static realLeafs_(sexp) {
        if (SemanticSkeleton.simpleCollapseStructure(sexp)) {
            return [sexp];
        }
        if (SemanticSkeleton.contentCollapseStructure(sexp)) {
            return [];
        }
        sexp = sexp;
        let result = [];
        for (let i = 1; i < sexp.length; i++) {
            result = result.concat(SemanticSkeleton.realLeafs_(sexp[i]));
        }
        return result;
    }
    populate() {
        if (this.parents && this.levelsMap) {
            return;
        }
        this.parents = {};
        this.levelsMap = {};
        this.populate_(this.array, this.array, []);
    }
    toString() {
        return SemanticSkeleton.makeSexp_(this.array);
    }
    populate_(element, layer, parents) {
        if (SemanticSkeleton.simpleCollapseStructure(element)) {
            element = element;
            this.levelsMap[element] = layer;
            this.parents[element] =
                element === parents[0] ? parents.slice(1) : parents;
            return;
        }
        const newElement = SemanticSkeleton.contentCollapseStructure(element)
            ? element.slice(1)
            : element;
        const newParents = [newElement[0]].concat(parents);
        for (let i = 0, l = newElement.length; i < l; i++) {
            const current = newElement[i];
            this.populate_(current, element, newParents);
        }
    }
    isRoot(id) {
        const level = this.levelsMap[id];
        return id === level[0];
    }
    directChildren(id) {
        if (!this.isRoot(id)) {
            return [];
        }
        const level = this.levelsMap[id];
        return level.slice(1).map((child) => {
            if (SemanticSkeleton.simpleCollapseStructure(child)) {
                return child;
            }
            if (SemanticSkeleton.contentCollapseStructure(child)) {
                return child[1];
            }
            return child[0];
        });
    }
    subtreeNodes(id) {
        if (!this.isRoot(id)) {
            return [];
        }
        const subtreeNodes_ = (tree, nodes) => {
            if (SemanticSkeleton.simpleCollapseStructure(tree)) {
                nodes.push(tree);
                return;
            }
            tree = tree;
            if (SemanticSkeleton.contentCollapseStructure(tree)) {
                tree = tree.slice(1);
            }
            tree.forEach((x) => subtreeNodes_(x, nodes));
        };
        const level = this.levelsMap[id];
        const subtree = [];
        subtreeNodes_(level.slice(1), subtree);
        return subtree;
    }
}
exports.SemanticSkeleton = SemanticSkeleton;
