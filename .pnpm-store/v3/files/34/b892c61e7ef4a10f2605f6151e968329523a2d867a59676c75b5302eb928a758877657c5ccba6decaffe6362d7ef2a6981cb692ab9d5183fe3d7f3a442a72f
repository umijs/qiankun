"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticNode = void 0;
const DomUtil = require("../common/dom_util");
const semantic_attr_1 = require("./semantic_attr");
const SemanticUtil = require("./semantic_util");
class SemanticNode {
    constructor(id) {
        this.id = id;
        this.mathml = [];
        this.parent = null;
        this.type = "unknown";
        this.role = "unknown";
        this.font = "unknown";
        this.embellished = null;
        this.fencePointer = '';
        this.childNodes = [];
        this.textContent = '';
        this.mathmlTree = null;
        this.contentNodes = [];
        this.annotation = {};
        this.attributes = {};
        this.nobreaking = false;
    }
    static fromXml(xml) {
        const id = parseInt(xml.getAttribute('id'), 10);
        const node = new SemanticNode(id);
        node.type = xml.tagName;
        SemanticNode.setAttribute(node, xml, 'role');
        SemanticNode.setAttribute(node, xml, 'font');
        SemanticNode.setAttribute(node, xml, 'embellished');
        SemanticNode.setAttribute(node, xml, 'fencepointer', 'fencePointer');
        if (xml.getAttribute('annotation')) {
            node.parseAnnotation(xml.getAttribute('annotation'));
        }
        SemanticUtil.addAttributes(node, xml);
        SemanticNode.processChildren(node, xml);
        return node;
    }
    static setAttribute(node, xml, attribute, opt_name) {
        opt_name = opt_name || attribute;
        const value = xml.getAttribute(attribute);
        if (value) {
            node[opt_name] = value;
        }
    }
    static processChildren(node, xml) {
        for (const child of DomUtil.toArray(xml.childNodes)) {
            if (child.nodeType === DomUtil.NodeType.TEXT_NODE) {
                node.textContent = child.textContent;
                continue;
            }
            const children = DomUtil.toArray(child.childNodes).map(SemanticNode.fromXml);
            children.forEach((x) => (x.parent = node));
            if (DomUtil.tagName(child) === 'CONTENT') {
                node.contentNodes = children;
            }
            else {
                node.childNodes = children;
            }
        }
    }
    querySelectorAll(pred) {
        let result = [];
        for (let i = 0, child; (child = this.childNodes[i]); i++) {
            result = result.concat(child.querySelectorAll(pred));
        }
        for (let i = 0, content; (content = this.contentNodes[i]); i++) {
            result = result.concat(content.querySelectorAll(pred));
        }
        if (pred(this)) {
            result.unshift(this);
        }
        return result;
    }
    xml(xml, brief) {
        const xmlNodeList = function (tag, nodes) {
            const xmlNodes = nodes.map(function (x) {
                return x.xml(xml, brief);
            });
            const tagNode = xml.createElementNS('', tag);
            for (let i = 0, child; (child = xmlNodes[i]); i++) {
                tagNode.appendChild(child);
            }
            return tagNode;
        };
        const node = xml.createElementNS('', this.type);
        if (!brief) {
            this.xmlAttributes(node);
        }
        node.textContent = this.textContent;
        if (this.contentNodes.length > 0) {
            node.appendChild(xmlNodeList("content", this.contentNodes));
        }
        if (this.childNodes.length > 0) {
            node.appendChild(xmlNodeList("children", this.childNodes));
        }
        return node;
    }
    toString(brief = false) {
        const xml = DomUtil.parseInput('<snode/>');
        return DomUtil.serializeXml(this.xml(xml.ownerDocument, brief));
    }
    allAttributes() {
        const attributes = [];
        attributes.push(["role", this.role]);
        if (this.font !== "unknown") {
            attributes.push(["font", this.font]);
        }
        if (Object.keys(this.annotation).length) {
            attributes.push(["annotation", this.annotationXml()]);
        }
        if (this.embellished) {
            attributes.push(["embellished", this.embellished]);
        }
        if (this.fencePointer) {
            attributes.push(["fencepointer", this.fencePointer]);
        }
        attributes.push(["id", this.id.toString()]);
        return attributes;
    }
    annotationXml() {
        const result = [];
        for (const key in this.annotation) {
            this.annotation[key].forEach(function (mean) {
                result.push(key + ':' + mean);
            });
        }
        return result.join(';');
    }
    attributesXml() {
        const result = [];
        for (const [key, value] of Object.entries(this.attributes)) {
            result.push(key + ':' + value);
        }
        return result.join(';');
    }
    toJson() {
        const json = {};
        json["type"] = this.type;
        const attributes = this.allAttributes();
        for (let i = 0, attr; (attr = attributes[i]); i++) {
            json[attr[0]] = attr[1].toString();
        }
        if (this.textContent) {
            json["$t"] = this.textContent;
        }
        if (this.childNodes.length) {
            json["children"] = this.childNodes.map(function (child) {
                return child.toJson();
            });
        }
        if (this.contentNodes.length) {
            json["content"] = this.contentNodes.map(function (child) {
                return child.toJson();
            });
        }
        return json;
    }
    updateContent(content, text) {
        const newContent = text
            ? content
                .replace(/^[ \f\n\r\t\v\u200b]*/, '')
                .replace(/[ \f\n\r\t\v\u200b]*$/, '')
            : content.trim();
        content = content && !newContent ? content : newContent;
        if (this.textContent === content) {
            return;
        }
        const meaning = (0, semantic_attr_1.lookupMeaning)(content);
        this.textContent = content;
        this.role = meaning.role;
        this.type = meaning.type;
        this.font = meaning.font;
    }
    addMathmlNodes(mmlNodes) {
        for (let i = 0, mml; (mml = mmlNodes[i]); i++) {
            if (this.mathml.indexOf(mml) === -1) {
                this.mathml.push(mml);
            }
        }
    }
    appendChild(child) {
        this.childNodes.push(child);
        this.addMathmlNodes(child.mathml);
        child.parent = this;
    }
    replaceChild(oldNode, newNode) {
        const index = this.childNodes.indexOf(oldNode);
        if (index === -1) {
            return;
        }
        oldNode.parent = null;
        newNode.parent = this;
        this.childNodes[index] = newNode;
        const removeMathml = oldNode.mathml.filter(function (x) {
            return newNode.mathml.indexOf(x) === -1;
        });
        const addMathml = newNode.mathml.filter(function (x) {
            return oldNode.mathml.indexOf(x) === -1;
        });
        this.removeMathmlNodes(removeMathml);
        this.addMathmlNodes(addMathml);
    }
    appendContentNode(node) {
        if (node) {
            this.contentNodes.push(node);
            this.addMathmlNodes(node.mathml);
            node.parent = this;
        }
    }
    removeContentNode(node) {
        if (node) {
            const index = this.contentNodes.indexOf(node);
            if (index !== -1) {
                this.contentNodes.slice(index, 1);
            }
        }
    }
    equals(node) {
        if (!node) {
            return false;
        }
        if (this.type !== node.type ||
            this.role !== node.role ||
            this.textContent !== node.textContent ||
            this.childNodes.length !== node.childNodes.length ||
            this.contentNodes.length !== node.contentNodes.length) {
            return false;
        }
        for (let i = 0, node1, node2; (node1 = this.childNodes[i]), (node2 = node.childNodes[i]); i++) {
            if (!node1.equals(node2)) {
                return false;
            }
        }
        for (let i = 0, node1, node2; (node1 = this.contentNodes[i]), (node2 = node.contentNodes[i]); i++) {
            if (!node1.equals(node2)) {
                return false;
            }
        }
        return true;
    }
    displayTree() {
        console.info(this.displayTree_(0));
    }
    addAnnotation(domain, annotation) {
        if (annotation) {
            this.addAnnotation_(domain, annotation);
        }
    }
    getAnnotation(domain) {
        const content = this.annotation[domain];
        return content ? content : [];
    }
    hasAnnotation(domain, annotation) {
        const content = this.annotation[domain];
        if (!content) {
            return false;
        }
        return content.indexOf(annotation) !== -1;
    }
    parseAnnotation(stateStr) {
        const annotations = stateStr.split(';');
        for (let i = 0, l = annotations.length; i < l; i++) {
            const annotation = annotations[i].split(':');
            this.addAnnotation(annotation[0], annotation[1]);
        }
    }
    meaning() {
        return { type: this.type, role: this.role, font: this.font };
    }
    xmlAttributes(node) {
        const attributes = this.allAttributes();
        for (let i = 0, attr; (attr = attributes[i]); i++) {
            node.setAttribute(attr[0], attr[1]);
        }
        this.addExternalAttributes(node);
    }
    addExternalAttributes(node) {
        for (const attr in this.attributes) {
            node.setAttribute(attr, this.attributes[attr]);
        }
    }
    parseAttributes(stateStr) {
        if (!stateStr)
            return;
        const attributes = stateStr.split(';');
        for (let i = 0, l = attributes.length; i < l; i++) {
            const [key, value] = attributes[i].split(':');
            if (key) {
                this.attributes[key] = value;
            }
        }
    }
    removeMathmlNodes(mmlNodes) {
        const mmlList = this.mathml;
        for (let i = 0, mml; (mml = mmlNodes[i]); i++) {
            const index = mmlList.indexOf(mml);
            if (index !== -1) {
                mmlList.splice(index, 1);
            }
        }
        this.mathml = mmlList;
    }
    displayTree_(depth) {
        depth++;
        const depthString = Array(depth).join('  ');
        let result = '';
        result += '\n' + depthString + this.toString();
        result += '\n' + depthString + 'MathmlTree:';
        result += '\n' + depthString + this.mathmlTreeString();
        result += '\n' + depthString + 'MathML:';
        for (let i = 0, mml; (mml = this.mathml[i]); i++) {
            result += '\n' + depthString + mml.toString();
        }
        result += '\n' + depthString + 'Begin Content';
        this.contentNodes.forEach(function (x) {
            result += x.displayTree_(depth);
        });
        result += '\n' + depthString + 'End Content';
        result += '\n' + depthString + 'Begin Children';
        this.childNodes.forEach(function (x) {
            result += x.displayTree_(depth);
        });
        result += '\n' + depthString + 'End Children';
        return result;
    }
    mathmlTreeString() {
        return this.mathmlTree ? this.mathmlTree.toString() : 'EMPTY';
    }
    addAnnotation_(domain, annotation) {
        const content = this.annotation[domain];
        if (content) {
            content.push(annotation);
        }
        else {
            this.annotation[domain] = [annotation];
        }
    }
}
exports.SemanticNode = SemanticNode;
