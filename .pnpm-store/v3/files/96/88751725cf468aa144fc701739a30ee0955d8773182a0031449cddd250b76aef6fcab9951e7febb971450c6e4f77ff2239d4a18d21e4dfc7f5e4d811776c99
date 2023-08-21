import TexParser from '../TexParser.js';
import ParseOptions from '../ParseOptions.js';
import { StackItem } from '../StackItem.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { EnvList } from '../StackItem.js';
export declare class TextParser extends TexParser {
    text: string;
    envStack: EnvList[];
    level: number | string | undefined;
    protected nodes: MmlNode[];
    get texParser(): any;
    get tags(): any;
    constructor(text: string, env: EnvList, configuration: ParseOptions, level?: number | string);
    mml(): MmlNode;
    Parse(): void;
    saveText(): void;
    Push(mml: MmlNode | StackItem): void;
    PushMath(mml: MmlNode): void;
    addAttributes(mml: MmlNode): void;
    ParseTextArg(name: string, env: EnvList): MmlNode;
    ParseArg(name: string): MmlNode;
    Error(id: string, message: string, ...args: string[]): void;
}
