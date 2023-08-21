"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeSpeechGenerator = void 0;
const enrich_attr_1 = require("../enrich_mathml/enrich_attr");
const WalkerUtil = require("../walker/walker_util");
const abstract_speech_generator_1 = require("./abstract_speech_generator");
const SpeechGeneratorUtil = require("./speech_generator_util");
class TreeSpeechGenerator extends abstract_speech_generator_1.AbstractSpeechGenerator {
    getSpeech(node, xml) {
        const speech = this.generateSpeech(node, xml);
        const nodes = this.getRebuilt().nodeDict;
        for (const key in nodes) {
            const snode = nodes[key];
            const innerMml = WalkerUtil.getBySemanticId(xml, key);
            const innerNode = WalkerUtil.getBySemanticId(node, key);
            if (!innerMml || !innerNode) {
                continue;
            }
            if (!this.modality || this.modality === enrich_attr_1.Attribute.SPEECH) {
                SpeechGeneratorUtil.addSpeech(innerNode, snode, this.getRebuilt().xml);
            }
            else {
                SpeechGeneratorUtil.addModality(innerNode, snode, this.modality);
            }
            if (this.modality === enrich_attr_1.Attribute.SPEECH) {
                SpeechGeneratorUtil.addPrefix(innerNode, snode);
            }
        }
        return speech;
    }
}
exports.TreeSpeechGenerator = TreeSpeechGenerator;
