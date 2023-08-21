import { Debugger } from '@umijs/utils';
declare abstract class Common {
    debug: Debugger;
    protected namespace: string;
    protected profilers: object;
    protected formatTiming(timing: number): string;
    constructor(namespace: string);
    abstract error(msg: string): void;
    abstract log(msg: string): void;
    abstract info(msg: string): void;
    abstract profile(id: string, ...args: any): void;
}
export default Common;
