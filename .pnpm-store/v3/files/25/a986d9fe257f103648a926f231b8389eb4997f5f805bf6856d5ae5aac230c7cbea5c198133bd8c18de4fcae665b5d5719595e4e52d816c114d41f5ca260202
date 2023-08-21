"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPrefix = exports.removeAttributePrefix = exports.setPostfix = exports.setAttributes = exports.makeIdList = exports.EnrichAttributes = exports.Attribute = exports.Prefix = void 0;
exports.Prefix = 'data-semantic-';
var Attribute;
(function (Attribute) {
    Attribute["ADDED"] = "data-semantic-added";
    Attribute["ALTERNATIVE"] = "data-semantic-alternative";
    Attribute["CHILDREN"] = "data-semantic-children";
    Attribute["COLLAPSED"] = "data-semantic-collapsed";
    Attribute["CONTENT"] = "data-semantic-content";
    Attribute["EMBELLISHED"] = "data-semantic-embellished";
    Attribute["FENCEPOINTER"] = "data-semantic-fencepointer";
    Attribute["FONT"] = "data-semantic-font";
    Attribute["ID"] = "data-semantic-id";
    Attribute["ANNOTATION"] = "data-semantic-annotation";
    Attribute["ATTRIBUTES"] = "data-semantic-attributes";
    Attribute["OPERATOR"] = "data-semantic-operator";
    Attribute["OWNS"] = "data-semantic-owns";
    Attribute["PARENT"] = "data-semantic-parent";
    Attribute["POSTFIX"] = "data-semantic-postfix";
    Attribute["PREFIX"] = "data-semantic-prefix";
    Attribute["ROLE"] = "data-semantic-role";
    Attribute["SPEECH"] = "data-semantic-speech";
    Attribute["STRUCTURE"] = "data-semantic-structure";
    Attribute["TYPE"] = "data-semantic-type";
})(Attribute = exports.Attribute || (exports.Attribute = {}));
exports.EnrichAttributes = [
    Attribute.ADDED,
    Attribute.ALTERNATIVE,
    Attribute.CHILDREN,
    Attribute.COLLAPSED,
    Attribute.CONTENT,
    Attribute.EMBELLISHED,
    Attribute.FENCEPOINTER,
    Attribute.FONT,
    Attribute.ID,
    Attribute.ANNOTATION,
    Attribute.ATTRIBUTES,
    Attribute.OPERATOR,
    Attribute.OWNS,
    Attribute.PARENT,
    Attribute.POSTFIX,
    Attribute.PREFIX,
    Attribute.ROLE,
    Attribute.SPEECH,
    Attribute.STRUCTURE,
    Attribute.TYPE
];
function makeIdList(nodes) {
    return nodes
        .map(function (node) {
        return node.id;
    })
        .join(',');
}
exports.makeIdList = makeIdList;
function setAttributes(mml, semantic) {
    mml.setAttribute(Attribute.TYPE, semantic.type);
    const attributes = semantic.allAttributes();
    for (let i = 0, attr; (attr = attributes[i]); i++) {
        mml.setAttribute(exports.Prefix + attr[0].toLowerCase(), attr[1]);
    }
    if (semantic.childNodes.length) {
        mml.setAttribute(Attribute.CHILDREN, makeIdList(semantic.childNodes));
    }
    if (semantic.contentNodes.length) {
        mml.setAttribute(Attribute.CONTENT, makeIdList(semantic.contentNodes));
    }
    if (semantic.parent) {
        mml.setAttribute(Attribute.PARENT, semantic.parent.id.toString());
    }
    const external = semantic.attributesXml();
    if (external) {
        mml.setAttribute(Attribute.ATTRIBUTES, external);
    }
    setPostfix(mml, semantic);
}
exports.setAttributes = setAttributes;
function setPostfix(mml, semantic) {
    const postfix = [];
    if (semantic.role === "mglyph") {
        postfix.push('image');
    }
    if (semantic.attributes['href']) {
        postfix.push('link');
    }
    if (postfix.length) {
        mml.setAttribute(Attribute.POSTFIX, postfix.join(' '));
    }
}
exports.setPostfix = setPostfix;
function removeAttributePrefix(mml) {
    return mml.toString().replace(new RegExp(exports.Prefix, 'g'), '');
}
exports.removeAttributePrefix = removeAttributePrefix;
function addPrefix(attr) {
    return (exports.Prefix + attr);
}
exports.addPrefix = addPrefix;
