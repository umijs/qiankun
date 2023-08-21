"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function batchedSingleLineTests(options) {
    // eslint counts lines from 1
    const lineOffset = options.code[0] === '\n' ? 2 : 1;
    return options.code
        .trim()
        .split('\n')
        .map((code, i) => {
        const lineNum = i + lineOffset;
        const errors = 'errors' in options
            ? options.errors.filter(e => e.line === lineNum)
            : [];
        return Object.assign({}, options, { code, errors: errors.map(e => (Object.assign({}, e, { line: 1 }))) });
    });
}
exports.batchedSingleLineTests = batchedSingleLineTests;
//# sourceMappingURL=batchedSingleLineTests.js.map