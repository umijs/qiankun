"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Comparator = exports.ClearspeakPreferences = void 0;
const engine_1 = require("../common/engine");
const EngineConst = require("../common/engine_const");
const dynamic_cstr_1 = require("../rule_engine/dynamic_cstr");
const dynamic_cstr_2 = require("../rule_engine/dynamic_cstr");
const MathCompoundStore = require("../rule_engine/math_compound_store");
const speech_rule_engine_1 = require("../rule_engine/speech_rule_engine");
class ClearspeakPreferences extends dynamic_cstr_1.DynamicCstr {
    constructor(cstr, preference) {
        super(cstr);
        this.preference = preference;
    }
    static comparator() {
        return new Comparator(engine_1.default.getInstance().dynamicCstr, dynamic_cstr_2.DynamicProperties.createProp([dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_2.Axis.LOCALE]], [dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_2.Axis.MODALITY]], [dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_2.Axis.DOMAIN]], [dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_2.Axis.STYLE]]));
    }
    static fromPreference(pref) {
        const pairs = pref.split(':');
        const preferences = {};
        const properties = PREFERENCES.getProperties();
        const validKeys = Object.keys(properties);
        for (let i = 0, key; (key = pairs[i]); i++) {
            const pair = key.split('_');
            if (validKeys.indexOf(pair[0]) === -1) {
                continue;
            }
            const value = pair[1];
            if (value &&
                value !== ClearspeakPreferences.AUTO &&
                properties[pair[0]].indexOf(value) !== -1) {
                preferences[pair[0]] = pair[1];
            }
        }
        return preferences;
    }
    static toPreference(pref) {
        const keys = Object.keys(pref);
        const str = [];
        for (let i = 0; i < keys.length; i++) {
            str.push(keys[i] + '_' + pref[keys[i]]);
        }
        return str.length ? str.join(':') : dynamic_cstr_1.DynamicCstr.DEFAULT_VALUE;
    }
    static getLocalePreferences(opt_dynamic) {
        const dynamic = opt_dynamic ||
            MathCompoundStore.enumerate(speech_rule_engine_1.SpeechRuleEngine.getInstance().enumerate());
        return ClearspeakPreferences.getLocalePreferences_(dynamic);
    }
    static smartPreferences(item, locale) {
        const prefs = ClearspeakPreferences.getLocalePreferences();
        const loc = prefs[locale];
        if (!loc) {
            return [];
        }
        const explorer = item['explorers']['speech'];
        const smart = ClearspeakPreferences.relevantPreferences(explorer.walker.getFocus().getSemanticPrimary());
        const previous = EngineConst.DOMAIN_TO_STYLES['clearspeak'];
        const items = [
            {
                type: 'radio',
                content: 'No Preferences',
                id: 'clearspeak-default',
                variable: 'speechRules'
            },
            {
                type: 'radio',
                content: 'Current Preferences',
                id: 'clearspeak-' + previous,
                variable: 'speechRules'
            },
            { type: 'rule' },
            { type: 'label', content: 'Preferences for ' + smart },
            { type: 'rule' }
        ];
        return items.concat(loc[smart].map(function (x) {
            const pair = x.split('_');
            return {
                type: 'radio',
                content: pair[1],
                id: 'clearspeak-' +
                    ClearspeakPreferences.addPreference(previous, pair[0], pair[1]),
                variable: 'speechRules'
            };
        }));
    }
    static relevantPreferences(node) {
        const roles = SEMANTIC_MAPPING_[node.type];
        if (!roles) {
            return 'ImpliedTimes';
        }
        return roles[node.role] || roles[''] || 'ImpliedTimes';
    }
    static findPreference(prefs, kind) {
        if (prefs === 'default') {
            return ClearspeakPreferences.AUTO;
        }
        const parsed = ClearspeakPreferences.fromPreference(prefs);
        return parsed[kind] || ClearspeakPreferences.AUTO;
    }
    static addPreference(prefs, kind, value) {
        if (prefs === 'default') {
            return kind + '_' + value;
        }
        const parsed = ClearspeakPreferences.fromPreference(prefs);
        parsed[kind] = value;
        return ClearspeakPreferences.toPreference(parsed);
    }
    static getLocalePreferences_(dynamic) {
        const result = {};
        for (const locale in dynamic) {
            if (!dynamic[locale]['speech'] ||
                !dynamic[locale]['speech']['clearspeak']) {
                continue;
            }
            const locPrefs = Object.keys(dynamic[locale]['speech']['clearspeak']);
            const prefs = (result[locale] = {});
            for (const axis in PREFERENCES.getProperties()) {
                const allSty = PREFERENCES.getProperties()[axis];
                const values = [axis + '_Auto'];
                if (allSty) {
                    for (const sty of allSty) {
                        if (locPrefs.indexOf(axis + '_' + sty) !== -1) {
                            values.push(axis + '_' + sty);
                        }
                    }
                }
                prefs[axis] = values;
            }
        }
        return result;
    }
    equal(cstr) {
        const top = super.equal(cstr);
        if (!top) {
            return false;
        }
        const keys = Object.keys(this.preference);
        const preference = cstr.preference;
        if (keys.length !== Object.keys(preference).length) {
            return false;
        }
        for (let i = 0, key; (key = keys[i]); i++) {
            if (this.preference[key] !== preference[key]) {
                return false;
            }
        }
        return true;
    }
}
exports.ClearspeakPreferences = ClearspeakPreferences;
ClearspeakPreferences.AUTO = 'Auto';
const PREFERENCES = new dynamic_cstr_2.DynamicProperties({
    AbsoluteValue: ['Auto', 'AbsEnd', 'Cardinality', 'Determinant'],
    Bar: ['Auto', 'Conjugate'],
    Caps: ['Auto', 'SayCaps'],
    CombinationPermutation: ['Auto', 'ChoosePermute'],
    Currency: ['Auto', 'Position', 'Prefix'],
    Ellipses: ['Auto', 'AndSoOn'],
    Enclosed: ['Auto', 'EndEnclose'],
    Exponent: [
        'Auto',
        'AfterPower',
        'Ordinal',
        'OrdinalPower',
        'Exponent'
    ],
    Fraction: [
        'Auto',
        'EndFrac',
        'FracOver',
        'General',
        'GeneralEndFrac',
        'Ordinal',
        'Over',
        'OverEndFrac',
        'Per'
    ],
    Functions: [
        'Auto',
        'None',
        'Reciprocal'
    ],
    ImpliedTimes: ['Auto', 'MoreImpliedTimes', 'None'],
    Log: ['Auto', 'LnAsNaturalLog'],
    Matrix: [
        'Auto',
        'Combinatoric',
        'EndMatrix',
        'EndVector',
        'SilentColNum',
        'SpeakColNum',
        'Vector'
    ],
    MultiLineLabel: [
        'Auto',
        'Case',
        'Constraint',
        'Equation',
        'Line',
        'None',
        'Row',
        'Step'
    ],
    MultiLineOverview: ['Auto', 'None'],
    MultiLinePausesBetweenColumns: ['Auto', 'Long', 'Short'],
    MultsymbolDot: ['Auto', 'Dot'],
    MultsymbolX: ['Auto', 'By', 'Cross'],
    Paren: [
        'Auto',
        'CoordPoint',
        'Interval',
        'Silent',
        'Speak',
        'SpeakNestingLevel'
    ],
    Prime: ['Auto', 'Angle', 'Length'],
    Roots: ['Auto', 'PosNegSqRoot', 'PosNegSqRootEnd', 'RootEnd'],
    SetMemberSymbol: ['Auto', 'Belongs', 'Element', 'Member', 'In'],
    Sets: ['Auto', 'SilentBracket', 'woAll'],
    TriangleSymbol: ['Auto', 'Delta'],
    Trig: [
        'Auto',
        'ArcTrig',
        'TrigInverse',
        'Reciprocal'
    ],
    VerticalLine: ['Auto', 'Divides', 'Given', 'SuchThat']
});
class Comparator extends dynamic_cstr_2.DefaultComparator {
    constructor(cstr, props) {
        super(cstr, props);
        this.preference =
            cstr instanceof ClearspeakPreferences ? cstr.preference : {};
    }
    match(cstr) {
        if (!(cstr instanceof ClearspeakPreferences)) {
            return super.match(cstr);
        }
        if (cstr.getComponents()[dynamic_cstr_2.Axis.STYLE] === 'default') {
            return true;
        }
        const keys = Object.keys(cstr.preference);
        for (let i = 0, key; (key = keys[i]); i++) {
            if (this.preference[key] !== cstr.preference[key]) {
                return false;
            }
        }
        return true;
    }
    compare(cstr1, cstr2) {
        const top = super.compare(cstr1, cstr2);
        if (top !== 0) {
            return top;
        }
        const pref1 = cstr1 instanceof ClearspeakPreferences;
        const pref2 = cstr2 instanceof ClearspeakPreferences;
        if (!pref1 && pref2) {
            return 1;
        }
        if (pref1 && !pref2) {
            return -1;
        }
        if (!pref1 && !pref2) {
            return 0;
        }
        const length1 = Object.keys(cstr1.preference).length;
        const length2 = Object.keys(cstr2.preference).length;
        return length1 > length2 ? -1 : length1 < length2 ? 1 : 0;
    }
}
exports.Comparator = Comparator;
class Parser extends dynamic_cstr_2.DynamicCstrParser {
    constructor() {
        super([dynamic_cstr_2.Axis.LOCALE, dynamic_cstr_2.Axis.MODALITY, dynamic_cstr_2.Axis.DOMAIN, dynamic_cstr_2.Axis.STYLE]);
    }
    parse(str) {
        const initial = super.parse(str);
        let style = initial.getValue(dynamic_cstr_2.Axis.STYLE);
        const locale = initial.getValue(dynamic_cstr_2.Axis.LOCALE);
        const modality = initial.getValue(dynamic_cstr_2.Axis.MODALITY);
        let pref = {};
        if (style !== dynamic_cstr_1.DynamicCstr.DEFAULT_VALUE) {
            pref = this.fromPreference(style);
            style = this.toPreference(pref);
        }
        return new ClearspeakPreferences({
            locale: locale,
            modality: modality,
            domain: 'clearspeak',
            style: style
        }, pref);
    }
    fromPreference(pref) {
        return ClearspeakPreferences.fromPreference(pref);
    }
    toPreference(pref) {
        return ClearspeakPreferences.toPreference(pref);
    }
}
exports.Parser = Parser;
const REVERSE_MAPPING = [
    [
        'AbsoluteValue',
        "fenced",
        "neutral",
        "metric"
    ],
    ['Bar', "overscore", "overaccent"],
    ['Caps', "identifier", "latinletter"],
    ['CombinationPermutation', "appl", "unknown"],
    ['Ellipses', "punctuation", "ellipsis"],
    ['Exponent', "superscript", ''],
    ['Fraction', "fraction", ''],
    ['Functions', "appl", "simple function"],
    ['ImpliedTimes', "operator", "implicit"],
    ['Log', "appl", "prefix function"],
    ['Matrix', "matrix", ''],
    ['Matrix', "vector", ''],
    ['MultiLineLabel', "multiline", "label"],
    ['MultiLineOverview', "multiline", "table"],
    ['MultiLinePausesBetweenColumns', "multiline", "table"],
    ['MultiLineLabel', "table", "label"],
    ['MultiLineOverview', "table", "table"],
    ['MultiLinePausesBetweenColumns', "table", "table"],
    ['MultiLineLabel', "cases", "label"],
    ['MultiLineOverview', "cases", "table"],
    ['MultiLinePausesBetweenColumns', "cases", "table"],
    ['MultsymbolDot', "operator", "multiplication"],
    ['MultsymbolX', "operator", "multiplication"],
    ['Paren', "fenced", "leftright"],
    ['Prime', "superscript", "prime"],
    ['Roots', "root", ''],
    ['Roots', "sqrt", ''],
    ['SetMemberSymbol', "relation", "element"],
    ['Sets', "fenced", "set extended"],
    ['TriangleSymbol', "identifier", "greekletter"],
    ['Trig', "appl", "prefix function"],
    ['VerticalLine', "punctuated", "vbar"]
];
const SEMANTIC_MAPPING_ = (function () {
    const result = {};
    for (let i = 0, triple; (triple = REVERSE_MAPPING[i]); i++) {
        const pref = triple[0];
        let role = result[triple[1]];
        if (!role) {
            role = {};
            result[triple[1]] = role;
        }
        role[triple[2]] = pref;
    }
    return result;
})();
engine_1.default.getInstance().comparators['clearspeak'] =
    ClearspeakPreferences.comparator;
engine_1.default.getInstance().parsers['clearspeak'] = new Parser();
