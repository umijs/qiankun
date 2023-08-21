import { SemanticMeaning, SemanticType } from './semantic_meaning';
export declare function add(comparator: SemanticComparator): void;
export declare function apply(meaning1: SemanticMeaning, meaning2: SemanticMeaning): number;
export declare function sort(meanings: SemanticMeaning[]): void;
export declare function reduce(meanings: SemanticMeaning[]): SemanticMeaning[];
export declare class SemanticComparator {
    comparator: (p1: SemanticMeaning, p2: SemanticMeaning) => number;
    type: SemanticType;
    constructor(comparator: (p1: SemanticMeaning, p2: SemanticMeaning) => number, type?: SemanticType);
    compare(meaning1: SemanticMeaning, meaning2: SemanticMeaning): number;
}
