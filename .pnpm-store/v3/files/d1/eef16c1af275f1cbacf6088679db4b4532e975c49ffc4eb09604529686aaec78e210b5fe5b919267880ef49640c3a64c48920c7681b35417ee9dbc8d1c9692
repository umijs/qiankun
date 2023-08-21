import prompts from '../../compiled/prompts';
import Generator, { type IGeneratorOpts } from '../Generator/Generator';
interface IBaseGeneratorOpts extends Partial<Omit<IGeneratorOpts, 'args'>> {
    path: string;
    target: string;
    data?: any;
    questions?: prompts.PromptObject[];
}
export default class BaseGenerator extends Generator {
    path: string;
    target: string;
    data: any;
    questions: prompts.PromptObject[];
    constructor({ path, target, data, questions, baseDir, slient, }: IBaseGeneratorOpts);
    prompting(): prompts.PromptObject<string>[];
    writing(): Promise<void>;
}
export {};
