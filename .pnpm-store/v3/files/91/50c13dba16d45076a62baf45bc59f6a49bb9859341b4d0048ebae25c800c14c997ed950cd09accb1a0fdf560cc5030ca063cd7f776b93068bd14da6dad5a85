"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProgramFromProjectService = void 0;
const path_1 = __importDefault(require("path"));
const createProjectProgram_1 = require("./create-program/createProjectProgram");
function useProgramFromProjectService(projectService, parseSettings) {
    const opened = projectService.openClientFile(absolutify(parseSettings.filePath), parseSettings.codeFullText, 
    /* scriptKind */ undefined, parseSettings.tsconfigRootDir);
    if (!opened.configFileName) {
        return undefined;
    }
    const scriptInfo = projectService.getScriptInfo(parseSettings.filePath);
    const program = projectService
        .getDefaultProjectForFile(scriptInfo.fileName, true)
        .getLanguageService(/*ensureSynchronized*/ true)
        .getProgram();
    if (!program) {
        return undefined;
    }
    return (0, createProjectProgram_1.createProjectProgram)(parseSettings, [program]);
    function absolutify(filePath) {
        return path_1.default.isAbsolute(filePath)
            ? filePath
            : path_1.default.join(projectService.host.getCurrentDirectory(), filePath);
    }
}
exports.useProgramFromProjectService = useProgramFromProjectService;
//# sourceMappingURL=useProgramFromProjectService.js.map