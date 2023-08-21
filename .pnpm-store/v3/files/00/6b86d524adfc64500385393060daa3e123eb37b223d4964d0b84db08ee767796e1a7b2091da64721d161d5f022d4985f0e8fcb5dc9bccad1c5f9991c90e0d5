"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeSummary_ = exports.retrieveSummary = exports.connectAllMactions = exports.connectMactions = exports.nodeAtPosition_ = exports.computePrefix_ = exports.retrievePrefix = exports.addPrefix = exports.addModality = exports.addSpeech = exports.recomputeMarkup = exports.computeMarkup = exports.recomputeSpeech = exports.computeSpeech = void 0;
const AuralRendering = require("../audio/aural_rendering");
const DomUtil = require("../common/dom_util");
const XpathUtil = require("../common/xpath_util");
const enrich_attr_1 = require("../enrich_mathml/enrich_attr");
const speech_rule_engine_1 = require("../rule_engine/speech_rule_engine");
const semantic_tree_1 = require("../semantic_tree/semantic_tree");
const WalkerUtil = require("../walker/walker_util");
function computeSpeech(xml) {
    return speech_rule_engine_1.SpeechRuleEngine.getInstance().evaluateNode(xml);
}
exports.computeSpeech = computeSpeech;
function recomputeSpeech(semantic) {
    const tree = semantic_tree_1.SemanticTree.fromNode(semantic);
    return computeSpeech(tree.xml());
}
exports.recomputeSpeech = recomputeSpeech;
function computeMarkup(tree) {
    const descrs = computeSpeech(tree);
    return AuralRendering.markup(descrs);
}
exports.computeMarkup = computeMarkup;
function recomputeMarkup(semantic) {
    const descrs = recomputeSpeech(semantic);
    return AuralRendering.markup(descrs);
}
exports.recomputeMarkup = recomputeMarkup;
function addSpeech(mml, semantic, snode) {
    const sxml = DomUtil.querySelectorAllByAttrValue(snode, 'id', semantic.id.toString())[0];
    const speech = sxml
        ? AuralRendering.markup(computeSpeech(sxml))
        : recomputeMarkup(semantic);
    mml.setAttribute(enrich_attr_1.Attribute.SPEECH, speech);
}
exports.addSpeech = addSpeech;
function addModality(mml, semantic, modality) {
    const markup = recomputeMarkup(semantic);
    mml.setAttribute(modality, markup);
}
exports.addModality = addModality;
function addPrefix(mml, semantic) {
    const speech = retrievePrefix(semantic);
    if (speech) {
        mml.setAttribute(enrich_attr_1.Attribute.PREFIX, speech);
    }
}
exports.addPrefix = addPrefix;
function retrievePrefix(semantic) {
    const descrs = computePrefix_(semantic);
    return AuralRendering.markup(descrs);
}
exports.retrievePrefix = retrievePrefix;
function computePrefix_(semantic) {
    const tree = semantic_tree_1.SemanticTree.fromRoot(semantic);
    const nodes = XpathUtil.evalXPath('.//*[@id="' + semantic.id + '"]', tree.xml());
    let node = nodes[0];
    if (nodes.length > 1) {
        node = nodeAtPosition_(semantic, nodes) || node;
    }
    return node
        ? speech_rule_engine_1.SpeechRuleEngine.getInstance().runInSetting({
            modality: 'prefix',
            domain: 'default',
            style: 'default',
            strict: true,
            speech: true
        }, function () {
            return speech_rule_engine_1.SpeechRuleEngine.getInstance().evaluateNode(node);
        })
        : [];
}
exports.computePrefix_ = computePrefix_;
function nodeAtPosition_(semantic, nodes) {
    const node = nodes[0];
    if (!semantic.parent) {
        return node;
    }
    const path = [];
    while (semantic) {
        path.push(semantic.id);
        semantic = semantic.parent;
    }
    const pathEquals = function (xml, path) {
        while (path.length &&
            path.shift().toString() === xml.getAttribute('id') &&
            xml.parentNode &&
            xml.parentNode.parentNode) {
            xml = xml.parentNode.parentNode;
        }
        return !path.length;
    };
    for (let i = 0, xml; (xml = nodes[i]); i++) {
        if (pathEquals(xml, path.slice())) {
            return xml;
        }
    }
    return node;
}
exports.nodeAtPosition_ = nodeAtPosition_;
function connectMactions(node, mml, stree) {
    const mactions = DomUtil.querySelectorAll(mml, 'maction');
    for (let i = 0, maction; (maction = mactions[i]); i++) {
        const aid = maction.getAttribute('id');
        const span = DomUtil.querySelectorAllByAttrValue(node, 'id', aid)[0];
        if (!span) {
            continue;
        }
        const lchild = maction.childNodes[1];
        const mid = lchild.getAttribute(enrich_attr_1.Attribute.ID);
        let cspan = WalkerUtil.getBySemanticId(node, mid);
        if (cspan && cspan.getAttribute(enrich_attr_1.Attribute.TYPE) !== 'dummy') {
            continue;
        }
        cspan = span.childNodes[0];
        if (cspan.getAttribute('sre-highlighter-added')) {
            continue;
        }
        const pid = lchild.getAttribute(enrich_attr_1.Attribute.PARENT);
        if (pid) {
            cspan.setAttribute(enrich_attr_1.Attribute.PARENT, pid);
        }
        cspan.setAttribute(enrich_attr_1.Attribute.TYPE, 'dummy');
        cspan.setAttribute(enrich_attr_1.Attribute.ID, mid);
        const cst = DomUtil.querySelectorAllByAttrValue(stree, 'id', mid)[0];
        cst.setAttribute('alternative', mid);
    }
}
exports.connectMactions = connectMactions;
function connectAllMactions(mml, stree) {
    const mactions = DomUtil.querySelectorAll(mml, 'maction');
    for (let i = 0, maction; (maction = mactions[i]); i++) {
        const lchild = maction.childNodes[1];
        const mid = lchild.getAttribute(enrich_attr_1.Attribute.ID);
        const cst = DomUtil.querySelectorAllByAttrValue(stree, 'id', mid)[0];
        cst.setAttribute('alternative', mid);
    }
}
exports.connectAllMactions = connectAllMactions;
function retrieveSummary(node) {
    const descrs = computeSummary_(node);
    return AuralRendering.markup(descrs);
}
exports.retrieveSummary = retrieveSummary;
function computeSummary_(node) {
    return node
        ? speech_rule_engine_1.SpeechRuleEngine.getInstance().runInSetting({ modality: 'summary', strict: false, speech: true }, function () {
            return speech_rule_engine_1.SpeechRuleEngine.getInstance().evaluateNode(node);
        })
        : [];
}
exports.computeSummary_ = computeSummary_;
