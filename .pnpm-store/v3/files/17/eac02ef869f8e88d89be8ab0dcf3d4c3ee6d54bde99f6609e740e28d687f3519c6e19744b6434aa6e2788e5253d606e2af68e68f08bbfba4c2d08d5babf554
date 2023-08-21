import { CommandLineParameter } from '../parameters/BaseClasses';
import { CommandLineAction } from './CommandLineAction';
export declare class TabCompleteAction extends CommandLineAction {
    private readonly _wordToCompleteParameter;
    private readonly _positionParameter;
    private readonly _actions;
    private readonly _globalParameters;
    constructor(actions: ReadonlyArray<CommandLineAction>, globalParameters: ReadonlyArray<CommandLineParameter>);
    protected onExecute(): Promise<void>;
    getCompletions(commandLine: string, caretPosition?: number): AsyncIterable<string>;
    private _getAllActions;
    tokenizeCommandLine(commandLine: string): string[];
    private _getParameterValueCompletions;
    private _getGlobalParameterOffset;
    private _completeParameterValues;
}
//# sourceMappingURL=TabCompletionAction.d.ts.map