"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWatchSolutionBuilderHost = void 0;
const system_1 = require("../system");
const typescript_1 = require("../typescript");
const watch_compiler_host_1 = require("./watch-compiler-host");
function createWatchSolutionBuilderHost(parsedConfig, createProgram, reportDiagnostic, reportWatchStatus, reportSolutionBuilderStatus, afterProgramCreate, afterProgramEmitAndDiagnostics) {
    const controlledWatchCompilerHost = (0, watch_compiler_host_1.createWatchCompilerHost)(parsedConfig, createProgram, reportDiagnostic, reportWatchStatus, afterProgramCreate);
    return Object.assign(Object.assign({}, controlledWatchCompilerHost), { reportDiagnostic(diagnostic) {
            if (reportDiagnostic) {
                reportDiagnostic(diagnostic);
            }
        },
        reportSolutionBuilderStatus(diagnostic) {
            if (reportSolutionBuilderStatus) {
                reportSolutionBuilderStatus(diagnostic);
            }
        },
        afterProgramEmitAndDiagnostics(program) {
            if (afterProgramEmitAndDiagnostics) {
                afterProgramEmitAndDiagnostics(program);
            }
        },
        createDirectory(path) {
            system_1.system.createDirectory(path);
        },
        writeFile(path, data) {
            system_1.system.writeFile(path, data);
        },
        getModifiedTime(fileName) {
            return system_1.system.getModifiedTime(fileName);
        },
        setModifiedTime(fileName, date) {
            system_1.system.setModifiedTime(fileName, date);
        },
        deleteFile(fileName) {
            system_1.system.deleteFile(fileName);
        },
        getParsedCommandLine(fileName) {
            return typescript_1.typescript.getParsedCommandLineOfConfigFile(fileName, { skipLibCheck: true }, Object.assign(Object.assign({}, system_1.system), { onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
                    if (reportDiagnostic) {
                        reportDiagnostic(diagnostic);
                    }
                } }));
        } });
}
exports.createWatchSolutionBuilderHost = createWatchSolutionBuilderHost;
