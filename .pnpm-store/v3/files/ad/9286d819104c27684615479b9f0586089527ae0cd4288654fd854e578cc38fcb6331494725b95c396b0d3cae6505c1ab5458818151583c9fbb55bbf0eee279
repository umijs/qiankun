"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummarySpeechGenerator = void 0;
const abstract_speech_generator_1 = require("./abstract_speech_generator");
const SpeechGeneratorUtil = require("./speech_generator_util");
class SummarySpeechGenerator extends abstract_speech_generator_1.AbstractSpeechGenerator {
    getSpeech(node, xml) {
        SpeechGeneratorUtil.connectAllMactions(xml, this.getRebuilt().xml);
        return this.generateSpeech(node, xml);
    }
}
exports.SummarySpeechGenerator = SummarySpeechGenerator;
