import * as EnrichAttr from '../enrich_mathml/enrich_attr';
import { AxisMap } from '../rule_engine/dynamic_cstr';
import { RebuildStree } from '../walker/rebuild_stree';
import { SpeechGenerator } from './speech_generator';
export declare abstract class AbstractSpeechGenerator implements SpeechGenerator {
    modality: EnrichAttr.Attribute;
    private rebuilt_;
    private options_;
    abstract getSpeech(node: Element, xml: Element): string;
    getRebuilt(): RebuildStree;
    setRebuilt(rebuilt: RebuildStree): void;
    setOptions(options: AxisMap): void;
    getOptions(): {
        [key: string]: string;
    };
    start(): void;
    end(): void;
    generateSpeech(_node: Node, xml: Element): string;
}
