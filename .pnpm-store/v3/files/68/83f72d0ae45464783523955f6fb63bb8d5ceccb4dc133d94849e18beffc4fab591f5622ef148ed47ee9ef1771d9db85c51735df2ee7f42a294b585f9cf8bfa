import { Attribute } from '../enrich_mathml/enrich_attr';
import { AxisMap } from '../rule_engine/dynamic_cstr';
import { RebuildStree } from '../walker/rebuild_stree';
export interface SpeechGenerator {
    modality: Attribute;
    getSpeech(node: Element, xml: Element): string;
    generateSpeech(_node: Node, xml: Element): string;
    getRebuilt(): RebuildStree;
    setRebuilt(rebuilt: RebuildStree): void;
    setOptions(options: AxisMap): void;
    getOptions(): AxisMap;
    start(): void;
    end(): void;
}
