"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.createIssuesFromDiagnostics = exports.getDiagnosticsOfProgram = exports.invalidateDiagnostics = exports.getIssues = exports.updateDiagnostics = void 0;
const os = __importStar(require("os"));
const issue_1 = require("../../../issue");
const typescript_1 = require("./typescript");
const worker_config_1 = require("./worker-config");
const diagnosticsPerConfigFile = new Map();
function updateDiagnostics(configFile, diagnostics) {
    diagnosticsPerConfigFile.set(configFile, diagnostics);
}
exports.updateDiagnostics = updateDiagnostics;
function getIssues() {
    const allDiagnostics = [];
    diagnosticsPerConfigFile.forEach((diagnostics) => {
        allDiagnostics.push(...diagnostics);
    });
    return createIssuesFromDiagnostics(allDiagnostics);
}
exports.getIssues = getIssues;
function invalidateDiagnostics() {
    diagnosticsPerConfigFile.clear();
}
exports.invalidateDiagnostics = invalidateDiagnostics;
function getDiagnosticsOfProgram(program) {
    const programDiagnostics = [];
    if (worker_config_1.config.diagnosticOptions.syntactic) {
        programDiagnostics.push(...program.getSyntacticDiagnostics());
    }
    if (worker_config_1.config.diagnosticOptions.global) {
        programDiagnostics.push(...program.getGlobalDiagnostics());
    }
    if (worker_config_1.config.diagnosticOptions.semantic) {
        programDiagnostics.push(...program.getSemanticDiagnostics());
    }
    if (worker_config_1.config.diagnosticOptions.declaration) {
        programDiagnostics.push(...program.getDeclarationDiagnostics());
    }
    return programDiagnostics;
}
exports.getDiagnosticsOfProgram = getDiagnosticsOfProgram;
function createIssueFromDiagnostic(diagnostic) {
    let file;
    let location;
    if (diagnostic.file) {
        file = diagnostic.file.fileName;
        if (diagnostic.start && diagnostic.length) {
            const { line: startLine, character: startCharacter } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const { line: endLine, character: endCharacter } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start + diagnostic.length);
            location = {
                start: {
                    line: startLine + 1,
                    column: startCharacter + 1,
                },
                end: {
                    line: endLine + 1,
                    column: endCharacter + 1,
                },
            };
        }
    }
    return {
        code: 'TS' + String(diagnostic.code),
        // we don't handle Suggestion and Message diagnostics
        severity: diagnostic.category === 0 ? 'warning' : 'error',
        message: typescript_1.typescript.flattenDiagnosticMessageText(diagnostic.messageText, os.EOL),
        file,
        location,
    };
}
function createIssuesFromDiagnostics(diagnostics) {
    return (0, issue_1.deduplicateAndSortIssues)(diagnostics.map((diagnostic) => createIssueFromDiagnostic(diagnostic)));
}
exports.createIssuesFromDiagnostics = createIssuesFromDiagnostics;
