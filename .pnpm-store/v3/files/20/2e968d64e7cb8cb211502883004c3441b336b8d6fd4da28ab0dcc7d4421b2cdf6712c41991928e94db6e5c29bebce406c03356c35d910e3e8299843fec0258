"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorMapping_ = exports.generator = void 0;
const adhoc_speech_generator_1 = require("./adhoc_speech_generator");
const color_generator_1 = require("./color_generator");
const direct_speech_generator_1 = require("./direct_speech_generator");
const dummy_speech_generator_1 = require("./dummy_speech_generator");
const node_speech_generator_1 = require("./node_speech_generator");
const summary_speech_generator_1 = require("./summary_speech_generator");
const tree_speech_generator_1 = require("./tree_speech_generator");
function generator(type) {
    const constructor = exports.generatorMapping_[type] || exports.generatorMapping_.Direct;
    return constructor();
}
exports.generator = generator;
exports.generatorMapping_ = {
    Adhoc: () => new adhoc_speech_generator_1.AdhocSpeechGenerator(),
    Color: () => new color_generator_1.ColorGenerator(),
    Direct: () => new direct_speech_generator_1.DirectSpeechGenerator(),
    Dummy: () => new dummy_speech_generator_1.DummySpeechGenerator(),
    Node: () => new node_speech_generator_1.NodeSpeechGenerator(),
    Summary: () => new summary_speech_generator_1.SummarySpeechGenerator(),
    Tree: () => new tree_speech_generator_1.TreeSpeechGenerator()
};
