"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (api) => {
    let hasProblem = false;
    api.addSourceCheckup(({ file, content }) => {
        if (!hasProblem &&
            /\.(j|t)sx?$/.test(file) &&
            /\sfrom\s+['"]\.[^'"]+\.(less|css|sass|scss)/.test(content)) {
            hasProblem = true;
            return {
                type: 'warn',
                problem: 'To make it easier for users to override component styles, CSS Modules is not recommended',
                solution: "Do not use CSS Modules, and `import './example.less'` directly",
            };
        }
    });
};
