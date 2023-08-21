"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSpeechGenerator = void 0;
const engine_setup_1 = require("../common/engine_setup");
const EnrichAttr = require("../enrich_mathml/enrich_attr");
const rebuild_stree_1 = require("../walker/rebuild_stree");
const SpeechGeneratorUtil = require("./speech_generator_util");
class AbstractSpeechGenerator {
    constructor() {
        this.modality = EnrichAttr.addPrefix('speech');
        this.rebuilt_ = null;
        this.options_ = {};
    }
    getRebuilt() {
        return this.rebuilt_;
    }
    setRebuilt(rebuilt) {
        this.rebuilt_ = rebuilt;
    }
    setOptions(options) {
        this.options_ = options || {};
        this.modality = EnrichAttr.addPrefix(this.options_.modality || 'speech');
    }
    getOptions() {
        return this.options_;
    }
    start() { }
    end() { }
    generateSpeech(_node, xml) {
        if (!this.rebuilt_) {
            this.rebuilt_ = new rebuild_stree_1.RebuildStree(xml);
        }
        (0, engine_setup_1.setup)(this.options_);
        return SpeechGeneratorUtil.computeMarkup(this.getRebuilt().xml);
    }
}
exports.AbstractSpeechGenerator = AbstractSpeechGenerator;
