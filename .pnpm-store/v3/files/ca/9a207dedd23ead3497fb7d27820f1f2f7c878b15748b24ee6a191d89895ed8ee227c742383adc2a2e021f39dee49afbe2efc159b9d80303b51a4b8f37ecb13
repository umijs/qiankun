"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@umijs/utils");
const doctor_1 = __importStar(require("../doctor"));
function getSummaryLog(summary) {
    const color = summary.error ? utils_1.chalk.red : utils_1.chalk.yellow;
    const total = summary.error + summary.warn;
    return color.bold(`
💊 ${total} problems (${summary.error} errors ${summary.warn} warnings)`);
}
exports.default = (api) => {
    (0, doctor_1.registerRules)(api);
    api.registerCommand({
        name: 'doctor',
        description: 'check your project for potential problems',
        async fn() {
            const report = await (0, doctor_1.default)(api);
            const summary = { error: 0, warn: 0 };
            report
                .sort((p) => (p.type === 'error' ? -1 : 1))
                .forEach((item) => {
                summary[item.type] += 1;
                console.log(`
${utils_1.chalk[item.type === 'error' ? 'red' : 'yellow'](`${item.type.toUpperCase()}`.padStart(8))} ${item.problem}
${utils_1.chalk.green('SOLUTION')} ${item.solution}`);
            });
            if (summary.error || summary.warn) {
                console.log(getSummaryLog(summary));
                if (summary.error) {
                    process.exit(1);
                }
            }
            else {
                console.log(utils_1.chalk.bold.green('🎉 This project looks fine!'));
            }
        },
    });
};
