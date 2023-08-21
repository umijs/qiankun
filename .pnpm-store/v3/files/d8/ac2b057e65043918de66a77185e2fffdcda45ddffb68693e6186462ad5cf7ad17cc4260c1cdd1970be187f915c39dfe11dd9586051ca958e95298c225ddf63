import { prompts } from '@umijs/utils';
import { IApi } from '../../types';
export declare class GeneratorHelper {
    readonly api: IApi;
    constructor(api: IApi);
    addDevDeps(deps: Record<string, string>): void;
    addScript(name: string, cmd: string): void;
    private addScriptToPkg;
    installDeps(): void;
}
export declare function promptsExitWhenCancel<T extends string = string>(questions: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>, options?: Pick<prompts.Options, 'onSubmit'>): Promise<prompts.Answers<T>>;
