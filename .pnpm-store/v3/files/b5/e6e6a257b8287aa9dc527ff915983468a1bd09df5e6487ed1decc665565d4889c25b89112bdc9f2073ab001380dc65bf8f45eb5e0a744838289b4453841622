"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variables = void 0;
class Variables {
    static ensureLocale(loc, def) {
        if (!Variables.LOCALES.get(loc)) {
            console.error(`Locale ${loc} does not exist! Using` +
                ` ${Variables.LOCALES.get(def)} instead.`);
            return def;
        }
        return loc;
    }
}
exports.Variables = Variables;
Variables.VERSION = '4.0.6';
Variables.LOCALES = new Map([
    ['ca', 'Catalan'],
    ['da', 'Danish'],
    ['de', 'German'],
    ['en', 'English'],
    ['es', 'Spanish'],
    ['fr', 'French'],
    ['hi', 'Hindi'],
    ['it', 'Italian'],
    ['nb', 'Bokmål'],
    ['nn', 'Nynorsk'],
    ['sv', 'Swedish'],
    ['nemeth', 'Nemeth']
]);
Variables.mathjaxVersion = '3.2.1';
Variables.url = 'https://cdn.jsdelivr.net/npm/speech-rule-engine@' +
    Variables.VERSION +
    '/lib/mathmaps';
Variables.WGXpath = 'https://cdn.jsdelivr.net/npm/wicked-good-xpath@1.3.0/dist/wgxpath.install.js';
