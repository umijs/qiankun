"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditoryDescription = void 0;
const grammar_1 = require("../rule_engine/grammar");
const span_1 = require("./span");
class AuditoryDescription {
    constructor({ context, text, userValue, annotation, attributes, personality, layout }) {
        this.context = context || '';
        this.text = text || '';
        this.userValue = userValue || '';
        this.annotation = annotation || '';
        this.attributes = attributes || {};
        this.personality = personality || {};
        this.layout = layout || '';
    }
    static create(args, flags = {}) {
        args.text = grammar_1.Grammar.getInstance().apply(args.text, flags);
        return new AuditoryDescription(args);
    }
    isEmpty() {
        return (this.context.length === 0 &&
            this.text.length === 0 &&
            this.userValue.length === 0 &&
            this.annotation.length === 0);
    }
    clone() {
        let personality;
        if (this.personality) {
            personality = {};
            for (const key in this.personality) {
                personality[key] = this.personality[key];
            }
        }
        let attributes;
        if (this.attributes) {
            attributes = {};
            for (const key in this.attributes) {
                attributes[key] = this.attributes[key];
            }
        }
        return new AuditoryDescription({
            context: this.context,
            text: this.text,
            userValue: this.userValue,
            annotation: this.annotation,
            personality: personality,
            attributes: attributes,
            layout: this.layout
        });
    }
    toString() {
        return ('AuditoryDescription(context="' +
            this.context +
            '" ' +
            ' text="' +
            this.text +
            '" ' +
            ' userValue="' +
            this.userValue +
            '" ' +
            ' annotation="' +
            this.annotation +
            '")');
    }
    descriptionString() {
        return this.context && this.text
            ? this.context + ' ' + this.text
            : this.context || this.text;
    }
    descriptionSpan() {
        return new span_1.Span(this.descriptionString(), this.attributes);
    }
    equals(that) {
        return (this.context === that.context &&
            this.text === that.text &&
            this.userValue === that.userValue &&
            this.annotation === that.annotation);
    }
}
exports.AuditoryDescription = AuditoryDescription;
