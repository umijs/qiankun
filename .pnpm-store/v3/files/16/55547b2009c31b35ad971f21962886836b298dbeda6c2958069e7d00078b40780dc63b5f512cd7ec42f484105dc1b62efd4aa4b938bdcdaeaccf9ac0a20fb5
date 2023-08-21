import { Highlighter } from '../highlighter/highlighter';
import { SpeechGenerator } from '../speech_generator/speech_generator';
import { Walker } from '../walker/walker';
import { KeyCode } from './event_util';
export declare class Processor<T> {
    name: string;
    static LocalState: {
        walker: Walker;
        speechGenerator: SpeechGenerator;
        highlighter: Highlighter;
    };
    process: (p1: string) => T;
    postprocess: (p1: T, p2: string) => T;
    print: (p1: T) => string;
    pprint: (p1: T) => string;
    processor: (p1: string) => T;
    private static stringify_;
    constructor(name: string, methods: {
        processor: (p1: string) => T;
        postprocessor?: (p1: T, p2: string) => T;
        print?: (p1: T) => string;
        pprint?: (p1: T) => string;
    });
}
export declare class KeyProcessor<T> extends Processor<T> {
    key: (p1: KeyCode | string) => KeyCode;
    private static getKey_;
    constructor(name: string, methods: {
        processor: (p1: string) => T;
        key?: (p1: KeyCode | string) => KeyCode;
        print?: (p1: T) => string;
        pprint?: (p1: T) => string;
    });
}
