import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { EnvList } from './StackItem.js';
import { ArrayItem } from './base/BaseItems.js';
import ParseOptions from './ParseOptions.js';
import TexParser from './TexParser.js';
declare namespace ParseUtil {
    function matchDimen(dim: string, rest?: boolean): [string, string, number];
    function dimen2em(dim: string): number;
    function Em(m: number): string;
    function cols(...W: number[]): string;
    function fenced(configuration: ParseOptions, open: string, mml: MmlNode, close: string, big?: string, color?: string): MmlNode;
    function fixedFence(configuration: ParseOptions, open: string, mml: MmlNode, close: string): MmlNode;
    function mathPalette(configuration: ParseOptions, fence: string, side: string): MmlNode;
    function fixInitialMO(configuration: ParseOptions, nodes: MmlNode[]): void;
    function internalMath(parser: TexParser, text: string, level?: number | string, font?: string): MmlNode[];
    function internalText(parser: TexParser, text: string, def: EnvList): MmlNode;
    function underOver(parser: TexParser, base: MmlNode, script: MmlNode, pos: string, stack: boolean): MmlNode;
    function checkMovableLimits(base: MmlNode): void;
    function trimSpaces(text: string): string;
    function setArrayAlign(array: ArrayItem, align: string): ArrayItem;
    function substituteArgs(parser: TexParser, args: string[], str: string): string;
    function addArgs(parser: TexParser, s1: string, s2: string): string;
    function checkMaxMacros(parser: TexParser, isMacro?: boolean): void;
    function checkEqnEnv(parser: TexParser): void;
    function copyNode(node: MmlNode, parser: TexParser): MmlNode;
    function MmlFilterAttribute(_parser: TexParser, _name: string, value: string): string;
    function getFontDef(parser: TexParser): EnvList;
    function keyvalOptions(attrib: string, allowed?: {
        [key: string]: number;
    }, error?: boolean): EnvList;
}
export default ParseUtil;
