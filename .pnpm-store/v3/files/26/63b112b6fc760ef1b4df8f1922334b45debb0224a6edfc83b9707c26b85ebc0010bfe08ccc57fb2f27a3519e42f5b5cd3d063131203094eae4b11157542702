export { isCancel } from '@clack/core';

interface TextOptions {
    message: string;
    placeholder?: string;
    initialValue?: string;
    validate?: (value: string) => string | void;
}
declare const text: (opts: TextOptions) => Promise<string | symbol>;
interface ConfirmOptions {
    message: string;
    active?: string;
    inactive?: string;
    initialValue?: boolean;
}
declare const confirm: (opts: ConfirmOptions) => Promise<boolean | symbol>;
interface Option<Value extends Readonly<string>> {
    value: Value;
    label?: string;
    hint?: string;
}
interface SelectOptions<Options extends Option<Value>[], Value extends Readonly<string>> {
    message: string;
    options: Options;
    initialValue?: Options[number]["value"];
}
declare const select: <Options extends Option<Value>[], Value extends string>(opts: SelectOptions<Options, Value>) => Promise<symbol | Options[number]["value"]>;
declare const multiselect: <Options extends Option<Value>[], Value extends string>(opts: SelectOptions<Options, Value>) => Promise<symbol | Options[number]["value"][]>;
declare const note: (message?: string, title?: string) => void;
declare const cancel: (message?: string) => void;
declare const intro: (title?: string) => void;
declare const outro: (message?: string) => void;
declare const spinner: () => {
    start(message?: string): void;
    stop(message?: string): void;
};

export { ConfirmOptions, SelectOptions, TextOptions, cancel, confirm, intro, multiselect, note, outro, select, spinner, text };
