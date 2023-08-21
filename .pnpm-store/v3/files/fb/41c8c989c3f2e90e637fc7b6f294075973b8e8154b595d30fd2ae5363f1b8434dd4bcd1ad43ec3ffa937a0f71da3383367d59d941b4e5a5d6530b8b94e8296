"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeLocale = exports.getLocale = exports.setLocale = exports.locales = void 0;
const engine_1 = require("../common/engine");
const variables_1 = require("../common/variables");
const grammar_1 = require("../rule_engine/grammar");
const locale_ca_1 = require("./locales/locale_ca");
const locale_da_1 = require("./locales/locale_da");
const locale_de_1 = require("./locales/locale_de");
const locale_en_1 = require("./locales/locale_en");
const locale_es_1 = require("./locales/locale_es");
const locale_fr_1 = require("./locales/locale_fr");
const locale_hi_1 = require("./locales/locale_hi");
const locale_it_1 = require("./locales/locale_it");
const locale_nb_1 = require("./locales/locale_nb");
const locale_nemeth_1 = require("./locales/locale_nemeth");
const locale_nn_1 = require("./locales/locale_nn");
const locale_sv_1 = require("./locales/locale_sv");
const locale_1 = require("./locale");
exports.locales = {
    ca: locale_ca_1.ca,
    da: locale_da_1.da,
    de: locale_de_1.de,
    en: locale_en_1.en,
    es: locale_es_1.es,
    fr: locale_fr_1.fr,
    hi: locale_hi_1.hi,
    it: locale_it_1.it,
    nb: locale_nb_1.nb,
    nn: locale_nn_1.nn,
    sv: locale_sv_1.sv,
    nemeth: locale_nemeth_1.nemeth
};
function setLocale() {
    const msgs = getLocale();
    setSubiso(msgs);
    if (msgs) {
        for (const key of Object.getOwnPropertyNames(msgs)) {
            locale_1.LOCALE[key] = msgs[key];
        }
        for (const [key, func] of Object.entries(msgs.CORRECTIONS)) {
            grammar_1.Grammar.getInstance().setCorrection(key, func);
        }
    }
}
exports.setLocale = setLocale;
function setSubiso(msg) {
    const subiso = engine_1.default.getInstance().subiso;
    if (msg.SUBISO.all.indexOf(subiso) === -1) {
        engine_1.default.getInstance().subiso = msg.SUBISO.default;
    }
    msg.SUBISO.current = engine_1.default.getInstance().subiso;
}
function getLocale() {
    const locale = variables_1.Variables.ensureLocale(engine_1.default.getInstance().locale, engine_1.default.getInstance().defaultLocale);
    engine_1.default.getInstance().locale = locale;
    return exports.locales[locale]();
}
exports.getLocale = getLocale;
function completeLocale(json) {
    const locale = exports.locales[json.locale];
    if (!locale) {
        console.error('Locale ' + json.locale + ' does not exist!');
        return;
    }
    const kind = json.kind.toUpperCase();
    const messages = json.messages;
    if (!messages)
        return;
    const loc = locale();
    for (const [key, value] of Object.entries(messages)) {
        loc[kind][key] = value;
    }
}
exports.completeLocale = completeLocale;
