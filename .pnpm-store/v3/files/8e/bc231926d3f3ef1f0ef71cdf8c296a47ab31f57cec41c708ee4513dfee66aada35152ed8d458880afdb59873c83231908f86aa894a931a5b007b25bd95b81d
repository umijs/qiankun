"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapAfterCompileToAddDependencies = void 0;
const infrastructure_logger_1 = require("../infrastructure-logger");
function tapAfterCompileToAddDependencies(compiler, config, state) {
    const { debug } = (0, infrastructure_logger_1.getInfrastructureLogger)(compiler);
    compiler.hooks.afterCompile.tapPromise('ForkTsCheckerWebpackPlugin', (compilation) => __awaiter(this, void 0, void 0, function* () {
        if (compilation.compiler !== compiler) {
            // run only for the compiler that the plugin was registered for
            return;
        }
        const dependencies = yield state.dependenciesPromise;
        debug(`Got dependencies from the getDependenciesWorker.`, dependencies);
        if (dependencies) {
            state.lastDependencies = dependencies;
            dependencies.files.forEach((file) => {
                compilation.fileDependencies.add(file);
            });
        }
    }));
}
exports.tapAfterCompileToAddDependencies = tapAfterCompileToAddDependencies;
