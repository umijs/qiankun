"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxWalker = void 0;
const base_util_1 = require("../common/base_util");
const abstract_walker_1 = require("./abstract_walker");
const levels_1 = require("./levels");
class SyntaxWalker extends abstract_walker_1.AbstractWalker {
    constructor(node, generator, highlighter, xml) {
        super(node, generator, highlighter, xml);
        this.node = node;
        this.generator = generator;
        this.highlighter = highlighter;
        this.levels = null;
        this.restoreState();
    }
    initLevels() {
        const levels = new levels_1.Levels();
        levels.push([this.primaryId()]);
        return levels;
    }
    up() {
        super.up();
        const parent = this.previousLevel();
        if (!parent) {
            return null;
        }
        this.levels.pop();
        return this.singletonFocus(parent);
    }
    down() {
        super.down();
        const children = this.nextLevel();
        if (children.length === 0) {
            return null;
        }
        const focus = this.singletonFocus(children[0]);
        if (focus) {
            this.levels.push(children);
        }
        return focus;
    }
    combineContentChildren(type, role, content, children) {
        switch (type) {
            case "relseq":
            case "infixop":
            case "multirel":
                return (0, base_util_1.interleaveLists)(children, content);
            case "prefixop":
                return content.concat(children);
            case "postfixop":
                return children.concat(content);
            case "matrix":
            case "vector":
            case "fenced":
                children.unshift(content[0]);
                children.push(content[1]);
                return children;
            case "cases":
                children.unshift(content[0]);
                return children;
            case "punctuated":
                if (role === "text") {
                    return (0, base_util_1.interleaveLists)(children, content);
                }
                return children;
            case "appl":
                return [children[0], content[0], children[1]];
            case "root":
                return [children[1], children[0]];
            default:
                return children;
        }
    }
    left() {
        super.left();
        const index = this.levels.indexOf(this.primaryId());
        if (index === null) {
            return null;
        }
        const id = this.levels.get(index - 1);
        return id ? this.singletonFocus(id) : null;
    }
    right() {
        super.right();
        const index = this.levels.indexOf(this.primaryId());
        if (index === null) {
            return null;
        }
        const id = this.levels.get(index + 1);
        return id ? this.singletonFocus(id) : null;
    }
    findFocusOnLevel(id) {
        return this.singletonFocus(id.toString());
    }
    focusDomNodes() {
        return [this.getFocus().getDomPrimary()];
    }
    focusSemanticNodes() {
        return [this.getFocus().getSemanticPrimary()];
    }
}
exports.SyntaxWalker = SyntaxWalker;
