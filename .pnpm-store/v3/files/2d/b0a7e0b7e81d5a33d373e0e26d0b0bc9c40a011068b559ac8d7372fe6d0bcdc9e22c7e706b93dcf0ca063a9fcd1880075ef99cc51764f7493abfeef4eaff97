"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableWalker = void 0;
const DomUtil = require("../common/dom_util");
const event_util_1 = require("../common/event_util");
const syntax_walker_1 = require("./syntax_walker");
const walker_1 = require("./walker");
class TableWalker extends syntax_walker_1.SyntaxWalker {
    constructor(node, generator, highlighter, xml) {
        super(node, generator, highlighter, xml);
        this.node = node;
        this.generator = generator;
        this.highlighter = highlighter;
        this.firstJump = null;
        this.key_ = null;
        this.row_ = 0;
        this.currentTable_ = null;
        this.keyMapping.set(event_util_1.KeyCode.ZERO, this.jumpCell.bind(this));
        this.keyMapping.set(event_util_1.KeyCode.ONE, this.jumpCell.bind(this));
        this.keyMapping.set(event_util_1.KeyCode.TWO, this.jumpCell.bind(this));
        this.keyMapping.set(event_util_1.KeyCode.THREE, this.jumpCell.bind(this));
        this.keyMapping.set(event_util_1.KeyCode.FOUR, this.jumpCell.bind(this));
        this.keyMapping.set(event_util_1.KeyCode.FIVE, this.jumpCell.bind(this));
        this.keyMapping.set(event_util_1.KeyCode.SIX, this.jumpCell.bind(this));
        this.keyMapping.set(event_util_1.KeyCode.SEVEN, this.jumpCell.bind(this));
        this.keyMapping.set(event_util_1.KeyCode.EIGHT, this.jumpCell.bind(this));
        this.keyMapping.set(event_util_1.KeyCode.NINE, this.jumpCell.bind(this));
    }
    move(key) {
        this.key_ = key;
        const result = super.move(key);
        this.modifier = false;
        return result;
    }
    up() {
        this.moved = walker_1.WalkerMoves.UP;
        return this.eligibleCell_() ? this.verticalMove_(false) : super.up();
    }
    down() {
        this.moved = walker_1.WalkerMoves.DOWN;
        return this.eligibleCell_() ? this.verticalMove_(true) : super.down();
    }
    jumpCell() {
        if (!this.isInTable_() || this.key_ === null) {
            return this.getFocus();
        }
        if (this.moved === walker_1.WalkerMoves.ROW) {
            this.moved = walker_1.WalkerMoves.CELL;
            const column = this.key_ - event_util_1.KeyCode.ZERO;
            if (!this.isLegalJump_(this.row_, column)) {
                return this.getFocus();
            }
            return this.jumpCell_(this.row_, column);
        }
        const row = this.key_ - event_util_1.KeyCode.ZERO;
        if (row > this.currentTable_.childNodes.length) {
            return this.getFocus();
        }
        this.row_ = row;
        this.moved = walker_1.WalkerMoves.ROW;
        return this.getFocus().clone();
    }
    undo() {
        const focus = super.undo();
        if (focus === this.firstJump) {
            this.firstJump = null;
        }
        return focus;
    }
    eligibleCell_() {
        const primary = this.getFocus().getSemanticPrimary();
        return (this.modifier &&
            primary.type === "cell" &&
            TableWalker.ELIGIBLE_CELL_ROLES.indexOf(primary.role) !== -1);
    }
    verticalMove_(direction) {
        const parent = this.previousLevel();
        if (!parent) {
            return null;
        }
        const origFocus = this.getFocus();
        const origIndex = this.levels.indexOf(this.primaryId());
        const origLevel = this.levels.pop();
        const parentIndex = this.levels.indexOf(parent);
        const row = this.levels.get(direction ? parentIndex + 1 : parentIndex - 1);
        if (!row) {
            this.levels.push(origLevel);
            return null;
        }
        this.setFocus(this.singletonFocus(row));
        const children = this.nextLevel();
        const newNode = children[origIndex];
        if (!newNode) {
            this.setFocus(origFocus);
            this.levels.push(origLevel);
            return null;
        }
        this.levels.push(children);
        return this.singletonFocus(children[origIndex]);
    }
    jumpCell_(row, column) {
        if (!this.firstJump) {
            this.firstJump = this.getFocus();
            this.virtualize(true);
        }
        else {
            this.virtualize(false);
        }
        const id = this.currentTable_.id.toString();
        let level;
        do {
            level = this.levels.pop();
        } while (level.indexOf(id) === -1);
        this.levels.push(level);
        this.setFocus(this.singletonFocus(id));
        this.levels.push(this.nextLevel());
        const semRow = this.currentTable_.childNodes[row - 1];
        this.setFocus(this.singletonFocus(semRow.id.toString()));
        this.levels.push(this.nextLevel());
        return this.singletonFocus(semRow.childNodes[column - 1].id.toString());
    }
    isLegalJump_(row, column) {
        const xmlTable = DomUtil.querySelectorAllByAttrValue(this.getRebuilt().xml, 'id', this.currentTable_.id.toString())[0];
        if (!xmlTable || xmlTable.hasAttribute('alternative')) {
            return false;
        }
        const rowNode = this.currentTable_.childNodes[row - 1];
        if (!rowNode) {
            return false;
        }
        const xmlRow = DomUtil.querySelectorAllByAttrValue(xmlTable, 'id', rowNode.id.toString())[0];
        if (!xmlRow || xmlRow.hasAttribute('alternative')) {
            return false;
        }
        return !!(rowNode && rowNode.childNodes[column - 1]);
    }
    isInTable_() {
        let snode = this.getFocus().getSemanticPrimary();
        while (snode) {
            if (TableWalker.ELIGIBLE_TABLE_TYPES.indexOf(snode.type) !== -1) {
                this.currentTable_ = snode;
                return true;
            }
            snode = snode.parent;
        }
        return false;
    }
}
exports.TableWalker = TableWalker;
TableWalker.ELIGIBLE_CELL_ROLES = [
    "determinant",
    "rowvector",
    "binomial",
    "squarematrix",
    "multiline",
    "matrix",
    "vector",
    "cases",
    "table"
];
TableWalker.ELIGIBLE_TABLE_TYPES = [
    "multiline",
    "matrix",
    "vector",
    "cases",
    "table"
];
