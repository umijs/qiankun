import { Span } from './span';
interface AudioDescr {
    context?: string;
    text: string;
    userValue?: string;
    annotation?: string;
    attributes?: {
        [key: string]: string;
    };
    personality?: {
        [key: string]: string;
    };
    layout?: string;
}
interface AudioFlags {
    adjust?: boolean;
    preprocess?: boolean;
    correct?: boolean;
    translate?: boolean;
}
export declare class AuditoryDescription {
    context: string;
    text: string;
    userValue: string;
    annotation: string;
    attributes: {
        [key: string]: string;
    };
    personality: {
        [key: string]: string;
    };
    layout: string;
    static create(args: AudioDescr, flags?: AudioFlags): AuditoryDescription;
    constructor({ context, text, userValue, annotation, attributes, personality, layout }: AudioDescr);
    isEmpty(): boolean;
    clone(): AuditoryDescription;
    toString(): string;
    descriptionString(): string;
    descriptionSpan(): Span;
    equals(that: AuditoryDescription): boolean;
}
export {};
