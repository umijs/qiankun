import { SemanticRole, SemanticType } from '../semantic_tree/semantic_meaning';
import { AbstractWalker } from './abstract_walker';
import { Focus } from './focus';
import { Levels } from './levels';
export declare class DummyWalker extends AbstractWalker<void> {
    up(): Focus;
    down(): Focus;
    left(): Focus;
    right(): Focus;
    repeat(): Focus;
    depth(): Focus;
    home(): Focus;
    getDepth(): number;
    initLevels(): Levels<void>;
    combineContentChildren(_type: SemanticType, _role: SemanticRole, _content: string[], _children: string[]): void[];
    findFocusOnLevel(_id: number): Focus;
}
