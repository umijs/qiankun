"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const parser_1 = __importDefault(require("./parser"));
const fs_1 = __importDefault(require("fs"));
function DataURISync(fileName) {
    if (!fileName || !fileName.trim || fileName.trim() === '') {
        throw new Error('Insert a File path as string argument');
    }
    const parser = new parser_1.default();
    if (fs_1.default.existsSync(fileName)) {
        const fileContent = fs_1.default.readFileSync(fileName);
        return parser.format(fileName, fileContent);
    }
    throw new Error(`The file ${fileName} was not found!`);
}
module.exports = DataURISync;
