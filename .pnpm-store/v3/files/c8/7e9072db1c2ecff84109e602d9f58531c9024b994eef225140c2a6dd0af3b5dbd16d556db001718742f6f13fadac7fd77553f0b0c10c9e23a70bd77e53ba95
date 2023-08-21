"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutRenderer = void 0;
const debugger_1 = require("../common/debugger");
const DomUtil = require("../common/dom_util");
const EngineConst = require("../common/engine_const");
const AudioUtil = require("./audio_util");
const xml_renderer_1 = require("./xml_renderer");
class LayoutRenderer extends xml_renderer_1.XmlRenderer {
    finalize(str) {
        return setTwoDim(str);
    }
    pause(_pause) {
        return '';
    }
    prosodyElement(attr, value) {
        return attr === EngineConst.personalityProps.LAYOUT ? `<${value}>` : '';
    }
    closeTag(tag) {
        return `</${tag}>`;
    }
    markup(descrs) {
        const result = [];
        let content = [];
        for (const descr of descrs) {
            if (!descr.layout) {
                content.push(descr);
                continue;
            }
            result.push(this.processContent(content));
            content = [];
            const value = descr.layout;
            if (value.match(/^begin/)) {
                result.push('<' + value.replace(/^begin/, '') + '>');
                continue;
            }
            if (value.match(/^end/)) {
                result.push('</' + value.replace(/^end/, '') + '>');
                continue;
            }
            console.warn('Something went wrong with layout markup: ' + value);
        }
        result.push(this.processContent(content));
        return result.join('');
    }
    processContent(content) {
        const result = [];
        const markup = AudioUtil.personalityMarkup(content);
        for (let i = 0, descr; (descr = markup[i]); i++) {
            if (descr.span) {
                result.push(this.merge(descr.span));
                continue;
            }
            if (AudioUtil.isPauseElement(descr)) {
                continue;
            }
        }
        return result.join('');
    }
}
exports.LayoutRenderer = LayoutRenderer;
let twodExpr = '';
const handlers = {
    TABLE: handleTable,
    CASES: handleCases,
    CAYLEY: handleCayley,
    MATRIX: handleMatrix,
    CELL: recurseTree,
    FENCE: recurseTree,
    ROW: recurseTree,
    FRACTION: handleFraction,
    NUMERATOR: handleFractionPart,
    DENOMINATOR: handleFractionPart
};
function applyHandler(element) {
    const tag = DomUtil.tagName(element);
    const handler = handlers[tag];
    return handler ? handler(element) : element.textContent;
}
function setTwoDim(str) {
    twodExpr = '';
    const dom = DomUtil.parseInput(`<all>${str}</all>`);
    debugger_1.Debugger.getInstance().output(DomUtil.formatXml(dom.toString()));
    twodExpr = recurseTree(dom);
    return twodExpr;
}
function combineContent(str1, str2) {
    if (!str1 || !str2) {
        return str1 + str2;
    }
    const height1 = strHeight(str1);
    const height2 = strHeight(str2);
    const diff = height1 - height2;
    str1 = diff < 0 ? padCell(str1, height2, strWidth(str1)) : str1;
    str2 = diff > 0 ? padCell(str2, height1, strWidth(str2)) : str2;
    const lines1 = str1.split(/\r\n|\r|\n/);
    const lines2 = str2.split(/\r\n|\r|\n/);
    const result = [];
    for (let i = 0; i < lines1.length; i++) {
        result.push(lines1[i] + lines2[i]);
    }
    return result.join('\n');
}
function recurseTree(dom) {
    let result = '';
    for (const child of Array.from(dom.childNodes)) {
        if (child.nodeType === DomUtil.NodeType.TEXT_NODE) {
            result = combineContent(result, child.textContent);
            continue;
        }
        result = combineContent(result, applyHandler(child));
    }
    return result;
}
function strHeight(str) {
    return str.split(/\r\n|\r|\n/).length;
}
function strWidth(str) {
    return str.split(/\r\n|\r|\n/).reduce((max, x) => Math.max(x.length, max), 0);
}
function padHeight(str, height) {
    const padding = height - strHeight(str);
    return str + (padding > 0 ? new Array(padding + 1).join('\n') : '');
}
function padWidth(str, width) {
    const lines = str.split(/\r\n|\r|\n/);
    const result = [];
    for (const line of lines) {
        const padding = width - line.length;
        result.push(line + (padding > 0 ? new Array(padding + 1).join('⠀') : ''));
    }
    return result.join('\n');
}
function padCell(str, height, width) {
    str = padHeight(str, height);
    return padWidth(str, width);
}
function assembleRows(matrix) {
    const children = Array.from(matrix.childNodes);
    const mat = [];
    for (const row of children) {
        if (row.nodeType !== DomUtil.NodeType.ELEMENT_NODE) {
            continue;
        }
        mat.push(handleRow(row));
    }
    return mat;
}
function getMaxParameters(mat) {
    const maxHeight = mat.reduce((max, x) => Math.max(x.height, max), 0);
    const maxWidth = [];
    for (let i = 0; i < mat[0].width.length; i++) {
        maxWidth.push(mat.map((x) => x.width[i]).reduce((max, x) => Math.max(max, x), 0));
    }
    return [maxHeight, maxWidth];
}
function combineCells(mat, maxWidth) {
    const newMat = [];
    for (const row of mat) {
        if (row.height === 0) {
            continue;
        }
        const newCells = [];
        for (let i = 0; i < row.cells.length; i++) {
            newCells.push(padCell(row.cells[i], row.height, maxWidth[i]));
        }
        row.cells = newCells;
        newMat.push(row);
    }
    return newMat;
}
function combineRows(mat, maxHeight) {
    if (maxHeight === 1) {
        return mat
            .map((row) => row.lfence + row.cells.join(row.sep) + row.rfence)
            .join('\n');
    }
    const result = [];
    for (const row of mat) {
        const sep = verticalArrange(row.sep, row.height);
        let str = row.cells.shift();
        while (row.cells.length) {
            str = combineContent(str, sep);
            str = combineContent(str, row.cells.shift());
        }
        str = combineContent(verticalArrange(row.lfence, row.height), str);
        str = combineContent(str, verticalArrange(row.rfence, row.height));
        result.push(str);
        result.push(row.lfence + new Array(strWidth(str) - 3).join(row.sep) + row.rfence);
    }
    return result.slice(0, -1).join('\n');
}
function verticalArrange(char, height) {
    let str = '';
    while (height) {
        str += char + '\n';
        height--;
    }
    return str.slice(0, -1);
}
function getFence(node) {
    if (node.nodeType === DomUtil.NodeType.ELEMENT_NODE &&
        DomUtil.tagName(node) === 'FENCE') {
        return applyHandler(node);
    }
    return '';
}
function handleMatrix(matrix) {
    let mat = assembleRows(matrix);
    const [maxHeight, maxWidth] = getMaxParameters(mat);
    mat = combineCells(mat, maxWidth);
    return combineRows(mat, maxHeight);
}
function handleTable(table) {
    let mat = assembleRows(table);
    mat.forEach((row) => {
        row.cells = row.cells.slice(1).slice(0, -1);
        row.width = row.width.slice(1).slice(0, -1);
    });
    const [maxHeight, maxWidth] = getMaxParameters(mat);
    mat = combineCells(mat, maxWidth);
    return combineRows(mat, maxHeight);
}
function handleCases(cases) {
    let mat = assembleRows(cases);
    mat.forEach((row) => {
        row.cells = row.cells.slice(0, -1);
        row.width = row.width.slice(0, -1);
    });
    const [maxHeight, maxWidth] = getMaxParameters(mat);
    mat = combineCells(mat, maxWidth);
    return combineRows(mat, maxHeight);
}
function handleCayley(cayley) {
    let mat = assembleRows(cayley);
    mat.forEach((row) => {
        row.cells = row.cells.slice(1).slice(0, -1);
        row.width = row.width.slice(1).slice(0, -1);
        row.sep = row.sep + row.sep;
    });
    const [maxHeight, maxWidth] = getMaxParameters(mat);
    const bar = {
        lfence: '',
        rfence: '',
        cells: maxWidth.map((x) => '⠐' + new Array(x).join('⠒')),
        width: maxWidth,
        height: 1,
        sep: mat[0].sep
    };
    mat.splice(1, 0, bar);
    mat = combineCells(mat, maxWidth);
    return combineRows(mat, maxHeight);
}
function handleRow(row) {
    const children = Array.from(row.childNodes);
    const lfence = getFence(children[0]);
    const rfence = getFence(children[children.length - 1]);
    if (lfence) {
        children.shift();
    }
    if (rfence) {
        children.pop();
    }
    let sep = '';
    const cells = [];
    for (const child of children) {
        if (child.nodeType === DomUtil.NodeType.TEXT_NODE) {
            sep = child.textContent;
            continue;
        }
        const result = applyHandler(child);
        cells.push(result);
    }
    return {
        lfence: lfence,
        rfence: rfence,
        sep: sep,
        cells: cells,
        height: cells.reduce((max, x) => Math.max(strHeight(x), max), 0),
        width: cells.map(strWidth)
    };
}
function centerCell(cell, width) {
    const cw = strWidth(cell);
    const center = (width - cw) / 2;
    const [lpad, rpad] = Math.floor(center) === center
        ? [center, center]
        : [Math.floor(center), Math.ceil(center)];
    const lines = cell.split(/\r\n|\r|\n/);
    const result = [];
    const [lstr, rstr] = [
        new Array(lpad + 1).join('⠀'),
        new Array(rpad + 1).join('⠀')
    ];
    for (const line of lines) {
        result.push(lstr + line + rstr);
    }
    return result.join('\n');
}
function handleFraction(frac) {
    const [open, num, , den, close] = Array.from(frac.childNodes);
    const numerator = applyHandler(num);
    const denominator = applyHandler(den);
    const nwidth = strWidth(numerator);
    const dwidth = strWidth(denominator);
    let maxWidth = Math.max(nwidth, dwidth);
    const bar = open + new Array(maxWidth + 1).join('⠒') + close;
    maxWidth = bar.length;
    return (`${centerCell(numerator, maxWidth)}\n${bar}\n` +
        `${centerCell(denominator, maxWidth)}`);
}
function handleFractionPart(prt) {
    const fchild = prt.firstChild;
    const content = recurseTree(prt);
    if (fchild && fchild.nodeType === DomUtil.NodeType.ELEMENT_NODE) {
        if (DomUtil.tagName(fchild) === 'ENGLISH') {
            return '⠰' + content;
        }
        if (DomUtil.tagName(fchild) === 'NUMBER') {
            return '⠼' + content;
        }
    }
    return content;
}
