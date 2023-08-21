import { Highlighter } from '../highlighter/highlighter';
import { SemanticRole, SemanticType } from '../semantic_tree/semantic_meaning';
import { SpeechGenerator } from '../speech_generator/speech_generator';
import { AbstractWalker } from './abstract_walker';
import { Levels } from './levels';
export declare class SyntaxWalker extends AbstractWalker<string> {
    node: Element;
    generator: SpeechGenerator;
    highlighter: Highlighter;
    levels: Levels<string>;
    constructor(node: Element, generator: SpeechGenerator, highlighter: Highlighter, xml: string);
    initLevels(): Levels<string>;
    up(): import("./focus").Focus;
    down(): import("./focus").Focus;
    combineContentChildren(type: SemanticType, role: SemanticRole, content: string[], children: string[]): string[];
    left(): import("./focus").Focus;
    right(): import("./focus").Focus;
    findFocusOnLevel(id: number): import("./focus").Focus;
    focusDomNodes(): Element[];
    focusSemanticNodes(): import("../semantic_tree/semantic_node").SemanticNode[];
}
