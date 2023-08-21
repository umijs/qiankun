import { SemanticFont, SemanticMeaning } from './semantic_meaning';
import { SemanticNode } from './semantic_node';
export declare class SemanticDefault {
    map: {
        [key: string]: SemanticMeaning;
    };
    static key(symbol: string, font: SemanticFont): string;
    add(symbol: string, meaning: SemanticMeaning): void;
    addNode(node: SemanticNode): void;
    retrieve(symbol: string, font: SemanticFont): SemanticMeaning;
    retrieveNode(node: SemanticNode): SemanticMeaning;
    size(): number;
}
declare abstract class SemanticCollator<T> {
    map: {
        [key: string]: T[];
    };
    abstract copyCollator(): SemanticCollator<T>;
    add(symbol: string, entry: T): void;
    abstract addNode(node: SemanticNode): void;
    retrieve(symbol: string, font: SemanticFont): T[];
    retrieveNode(node: SemanticNode): T[];
    copy(): SemanticCollator<T>;
    minimize(): void;
    minimalCollator(): SemanticCollator<T>;
    isMultiValued(): boolean;
    isEmpty(): boolean;
}
export declare class SemanticNodeCollator extends SemanticCollator<SemanticNode> {
    copyCollator(): SemanticNodeCollator;
    add(symbol: string, entry: SemanticNode): void;
    addNode(node: SemanticNode): void;
    toString(): string;
    collateMeaning(): SemanticMeaningCollator;
}
export declare class SemanticMeaningCollator extends SemanticCollator<SemanticMeaning> {
    copyCollator(): SemanticMeaningCollator;
    add(symbol: string, entry: SemanticMeaning): void;
    addNode(node: SemanticNode): void;
    toString(): string;
    reduce(): void;
    default(): SemanticDefault;
    newDefault(): SemanticDefault | null;
}
export {};
