import { Configuration } from '../Configuration.js';
import TexParser from '../TexParser.js';
import { BeginItem, EqnArrayItem } from '../base/BaseItems.js';
import { AmsTags } from '../ams/AmsConfiguration.js';
import { StackItem, CheckType } from '../StackItem.js';
export declare class CasesBeginItem extends BeginItem {
    get kind(): string;
    checkItem(item: StackItem): CheckType;
}
export declare class CasesTags extends AmsTags {
    protected subcounter: number;
    start(env: string, taggable: boolean, defaultTags: boolean): void;
    autoTag(): void;
    formatNumber(n: number, m?: number): string;
}
export declare const CasesMethods: {
    NumCases(parser: TexParser, begin: CasesBeginItem): EqnArrayItem;
    Entry(parser: TexParser, name: string): import("../Types.js").ParseResult;
};
export declare const CasesConfiguration: Configuration;
