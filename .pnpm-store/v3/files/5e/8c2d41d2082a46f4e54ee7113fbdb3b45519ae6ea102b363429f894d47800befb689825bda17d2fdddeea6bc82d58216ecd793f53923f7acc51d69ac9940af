import type webpack from 'webpack';
import type { TypeScriptConfigOverwrite } from './type-script-config-overwrite';
import type { TypeScriptDiagnosticsOptions } from './type-script-diagnostics-options';
import type { TypeScriptWorkerOptions } from './type-script-worker-options';
interface TypeScriptWorkerConfig {
    enabled: boolean;
    memoryLimit: number;
    configFile: string;
    configOverwrite: TypeScriptConfigOverwrite;
    build: boolean;
    context: string;
    mode: 'readonly' | 'write-dts' | 'write-tsbuildinfo' | 'write-references';
    diagnosticOptions: TypeScriptDiagnosticsOptions;
    profile: boolean;
    typescriptPath: string;
}
declare function createTypeScriptWorkerConfig(compiler: webpack.Compiler, options: TypeScriptWorkerOptions | undefined): TypeScriptWorkerConfig;
export { createTypeScriptWorkerConfig, TypeScriptWorkerConfig };
