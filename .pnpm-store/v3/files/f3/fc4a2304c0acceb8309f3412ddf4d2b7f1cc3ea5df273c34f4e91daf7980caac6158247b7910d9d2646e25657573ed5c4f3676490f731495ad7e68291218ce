"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsFormatter = void 0;
const chalk_1 = __importDefault(require("chalk"));
// mimics webpack's stats summary formatter
function statsFormatter(issues, stats) {
    const errorsNumber = issues.filter((issue) => issue.severity === 'error').length;
    const warningsNumber = issues.filter((issue) => issue.severity === 'warning').length;
    const errorsFormatted = errorsNumber
        ? chalk_1.default.red.bold(`${errorsNumber} ${errorsNumber === 1 ? 'error' : 'errors'}`)
        : '';
    const warningsFormatted = warningsNumber
        ? chalk_1.default.yellow.bold(`${warningsNumber} ${warningsNumber === 1 ? 'warning' : 'warnings'}`)
        : '';
    const timeFormatted = Math.round(Date.now() - stats.startTime);
    return [
        'Found ',
        errorsFormatted,
        errorsFormatted && warningsFormatted ? ' and ' : '',
        warningsFormatted,
        ` in ${timeFormatted} ms`,
        '.',
    ].join('');
}
exports.statsFormatter = statsFormatter;
