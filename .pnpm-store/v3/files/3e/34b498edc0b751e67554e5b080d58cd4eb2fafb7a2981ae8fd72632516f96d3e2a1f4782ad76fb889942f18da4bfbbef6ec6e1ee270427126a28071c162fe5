import { Menu } from './menu.js';
import { Item } from './item.js';
import { ParserFactory, ParseMethod } from './parser_factory.js';
export declare class Parser {
    private _initList;
    private readonly _factory;
    constructor(init?: [string, ParseMethod][]);
    get factory(): ParserFactory;
    items(_factory: ParserFactory, its: any[], ctxt: Menu): Item[];
    parse({ type: kind, ...json }: {
        type: string;
        [k: string]: any;
    }, ...rest: any[]): any;
}
