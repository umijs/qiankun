import TexParser from '../TexParser.js';
import { EnvList } from '../StackItem.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MmlMtable } from '../../../core/MmlTree/MmlNodes/mtable.js';
import { MmlMtd } from '../../../core/MmlTree/MmlNodes/mtd.js';
import { EmpheqBeginItem } from './EmpheqConfiguration.js';
export declare const EmpheqUtil: {
    environment(parser: TexParser, env: string, func: Function, args: any[]): void;
    splitOptions(text: string, allowed?: {
        [key: string]: number;
    }): EnvList;
    columnCount(table: MmlMtable): number;
    cellBlock(tex: string, table: MmlMtable, parser: TexParser, env: string): MmlNode;
    topRowTable(original: MmlMtable, parser: TexParser): MmlNode;
    rowspanCell(mtd: MmlMtd, tex: string, table: MmlMtable, parser: TexParser, env: string): void;
    left(table: MmlMtable, original: MmlMtable, left: string, parser: TexParser, env?: string): void;
    right(table: MmlMtable, original: MmlMtable, right: string, parser: TexParser, env?: string): void;
    adjustTable(empheq: EmpheqBeginItem, parser: TexParser): void;
    allowEnv: {
        equation: boolean;
        align: boolean;
        gather: boolean;
        flalign: boolean;
        alignat: boolean;
        multline: boolean;
    };
    checkEnv(env: string): boolean;
};
