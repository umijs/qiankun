"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeSpeechGenerator = void 0;
const WalkerUtil = require("../walker/walker_util");
const tree_speech_generator_1 = require("./tree_speech_generator");
class NodeSpeechGenerator extends tree_speech_generator_1.TreeSpeechGenerator {
    getSpeech(node, _xml) {
        super.getSpeech(node, _xml);
        return WalkerUtil.getAttribute(node, this.modality);
    }
}
exports.NodeSpeechGenerator = NodeSpeechGenerator;
