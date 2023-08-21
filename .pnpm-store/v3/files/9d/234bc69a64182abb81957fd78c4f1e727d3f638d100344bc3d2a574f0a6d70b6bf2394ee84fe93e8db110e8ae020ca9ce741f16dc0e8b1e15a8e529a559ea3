import { Symbol } from './Symbol.js';
import TexParser from './TexParser.js';
declare namespace ParseMethods {
    function variable(parser: TexParser, c: string): void;
    function digit(parser: TexParser, c: string): void;
    function controlSequence(parser: TexParser, _c: string): void;
    function mathchar0mi(parser: TexParser, mchar: Symbol): void;
    function mathchar0mo(parser: TexParser, mchar: Symbol): void;
    function mathchar7(parser: TexParser, mchar: Symbol): void;
    function delimiter(parser: TexParser, delim: Symbol): void;
    function environment(parser: TexParser, env: string, func: Function, args: any[]): void;
}
export default ParseMethods;
