import { SemanticHeuristic, SemanticHeuristicTypes } from './semantic_heuristic';
import { SemanticNodeFactory } from './semantic_node_factory';
export declare let factory: SemanticNodeFactory;
export declare function updateFactory(nodeFactory: SemanticNodeFactory): void;
export declare const flags: {
    [key: string]: boolean;
};
export declare const blacklist: {
    [key: string]: boolean;
};
export declare function add(heuristic: SemanticHeuristic<SemanticHeuristicTypes>): void;
export declare function run(name: string, root: SemanticHeuristicTypes, opt_alternative?: (p1: SemanticHeuristicTypes) => SemanticHeuristicTypes): SemanticHeuristicTypes | void;
export declare function lookup(name: string): SemanticHeuristic<SemanticHeuristicTypes>;
