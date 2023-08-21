"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneLeft = exports.leftMostUnit = exports.rightMostUnit = exports.unitMultipliers = void 0;
const auditory_description_1 = require("../audio/auditory_description");
const XpathUtil = require("../common/xpath_util");
const locale_1 = require("../l10n/locale");
function unitMultipliers(nodes, _context) {
    const children = nodes;
    let counter = 0;
    return function () {
        const descr = auditory_description_1.AuditoryDescription.create({
            text: rightMostUnit(children[counter]) &&
                leftMostUnit(children[counter + 1])
                ? locale_1.LOCALE.MESSAGES.unitTimes
                : ''
        }, {});
        counter++;
        return [descr];
    };
}
exports.unitMultipliers = unitMultipliers;
const SCRIPT_ELEMENTS = [
    "superscript",
    "subscript",
    "overscore",
    "underscore"
];
function rightMostUnit(node) {
    while (node) {
        if (node.getAttribute('role') === 'unit') {
            return true;
        }
        const tag = node.tagName;
        const children = XpathUtil.evalXPath('children/*', node);
        node = (SCRIPT_ELEMENTS.indexOf(tag) !== -1
            ? children[0]
            : children[children.length - 1]);
    }
    return false;
}
exports.rightMostUnit = rightMostUnit;
function leftMostUnit(node) {
    while (node) {
        if (node.getAttribute('role') === 'unit') {
            return true;
        }
        const children = XpathUtil.evalXPath('children/*', node);
        node = children[0];
    }
    return false;
}
exports.leftMostUnit = leftMostUnit;
function oneLeft(node) {
    while (node) {
        if (node.tagName === 'number' && node.textContent === '1') {
            return [node];
        }
        if (node.tagName !== 'infixop' ||
            (node.getAttribute('role') !== 'multiplication' &&
                node.getAttribute('role') !== 'implicit')) {
            return [];
        }
        node = XpathUtil.evalXPath('children/*', node)[0];
    }
    return [];
}
exports.oneLeft = oneLeft;
