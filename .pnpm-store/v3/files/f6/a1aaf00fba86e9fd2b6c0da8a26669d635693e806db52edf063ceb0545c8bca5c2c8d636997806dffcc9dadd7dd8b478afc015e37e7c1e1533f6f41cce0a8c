"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relativeToContext = void 0;
const path_1 = __importDefault(require("path"));
const forward_slash_1 = require("./forward-slash");
function relativeToContext(file, context) {
    let fileInContext = (0, forward_slash_1.forwardSlash)(path_1.default.relative(context, file));
    if (!fileInContext.startsWith('../')) {
        fileInContext = './' + fileInContext;
    }
    return fileInContext;
}
exports.relativeToContext = relativeToContext;
