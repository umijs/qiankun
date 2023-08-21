"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cli = void 0;
const dynamic_cstr_1 = require("../rule_engine/dynamic_cstr");
const MathCompoundStore = require("../rule_engine/math_compound_store");
const speech_rule_engine_1 = require("../rule_engine/speech_rule_engine");
const clearspeak_preferences_1 = require("../speech_rules/clearspeak_preferences");
const debugger_1 = require("./debugger");
const engine_1 = require("./engine");
const EngineConst = require("./engine_const");
const ProcessorFactory = require("./processor_factory");
const System = require("./system");
const system_external_1 = require("./system_external");
const variables_1 = require("./variables");
class Cli {
    constructor() {
        this.process = system_external_1.default.extRequire('process');
        this.setup = {
            mode: EngineConst.Mode.SYNC
        };
        this.processors = [];
        this.output = this.process.stdout;
        this.dp = new system_external_1.default.xmldom.DOMParser({
            errorHandler: (_key, _msg) => {
                throw new engine_1.SREError('XML DOM error!');
            }
        });
    }
    set(arg, value, _def) {
        this.setup[arg] = typeof value === 'undefined' ? true : value;
    }
    processor(processor) {
        this.processors.push(processor);
    }
    loadLocales() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const loc of variables_1.Variables.LOCALES.keys()) {
                yield System.setupEngine({ locale: loc });
            }
        });
    }
    enumerate(all = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = System.setupEngine(this.setup);
            return (all ? this.loadLocales() : promise).then(() => engine_1.EnginePromise.getall().then(() => {
                const length = dynamic_cstr_1.DynamicCstr.DEFAULT_ORDER.map((x) => x.length);
                const maxLength = (obj, index) => {
                    length[index] = Math.max.apply(null, Object.keys(obj)
                        .map((x) => x.length)
                        .concat(length[index]));
                };
                const compStr = (str, length) => str + new Array(length - str.length + 1).join(' ');
                let dynamic = speech_rule_engine_1.SpeechRuleEngine.getInstance().enumerate();
                dynamic = MathCompoundStore.enumerate(dynamic);
                const table = [];
                maxLength(dynamic, 0);
                for (const ax1 in dynamic) {
                    let clear1 = true;
                    const dyna1 = dynamic[ax1];
                    maxLength(dyna1, 1);
                    for (const ax2 in dyna1) {
                        let clear2 = true;
                        const dyna2 = dyna1[ax2];
                        maxLength(dyna2, 2);
                        for (const ax3 in dyna2) {
                            const styles = Object.keys(dyna2[ax3]).sort();
                            if (ax3 === 'clearspeak') {
                                let clear3 = true;
                                const prefs = clearspeak_preferences_1.ClearspeakPreferences.getLocalePreferences(dynamic)[ax1];
                                for (const ax4 in prefs) {
                                    table.push([
                                        compStr(clear1 ? ax1 : '', length[0]),
                                        compStr(clear2 ? ax2 : '', length[1]),
                                        compStr(clear3 ? ax3 : '', length[2]),
                                        prefs[ax4].join(', ')
                                    ]);
                                    clear1 = false;
                                    clear2 = false;
                                    clear3 = false;
                                }
                            }
                            else {
                                table.push([
                                    compStr(clear1 ? ax1 : '', length[0]),
                                    compStr(clear2 ? ax2 : '', length[1]),
                                    compStr(ax3, length[2]),
                                    styles.join(', ')
                                ]);
                            }
                            clear1 = false;
                            clear2 = false;
                        }
                    }
                }
                let i = 0;
                let output = '';
                output += dynamic_cstr_1.DynamicCstr.DEFAULT_ORDER.slice(0, -1)
                    .map((x) => compStr(x, length[i++]))
                    .join(' | ');
                output += '\n';
                length.forEach((x) => (output += new Array(x + 3).join('=')));
                output += '========================\n';
                output += table.map((x) => x.join(' | ')).join('\n');
                console.info(output);
            }));
        });
    }
    execute(input) {
        engine_1.EnginePromise.getall().then(() => {
            this.runProcessors_((proc, file) => this.output.write(System.processFile(proc, file) + '\n'), input);
        });
    }
    readline() {
        this.process.stdin.setEncoding('utf8');
        const inter = system_external_1.default.extRequire('readline').createInterface({
            input: this.process.stdin,
            output: this.output
        });
        let input = '';
        inter.on('line', ((expr) => {
            input += expr;
            if (this.readExpression_(input)) {
                inter.close();
            }
        }).bind(this));
        inter.on('close', (() => {
            this.runProcessors_((proc, expr) => {
                inter.output.write(ProcessorFactory.output(proc, expr) + '\n');
            }, input);
            System.engineReady().then(() => debugger_1.Debugger.getInstance().exit(() => System.exit(0)));
        }).bind(this));
    }
    commandLine() {
        return __awaiter(this, void 0, void 0, function* () {
            const commander = system_external_1.default.commander;
            const system = System;
            const set = ((key) => {
                return (val, def) => this.set(key, val, def);
            }).bind(this);
            const processor = this.processor.bind(this);
            commander
                .version(system.version)
                .usage('[options] <file ...>')
                .option('-i, --input [name]', 'Input file [name]. (Deprecated)')
                .option('-o, --output [name]', 'Output file [name]. Defaults to stdout.')
                .option('-d, --domain [name]', 'Speech rule set [name]. See --options' + ' for details.', set(dynamic_cstr_1.Axis.DOMAIN), dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_1.Axis.DOMAIN])
                .option('-t, --style [name]', 'Speech style [name]. See --options' + ' for details.', set(dynamic_cstr_1.Axis.STYLE), dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_1.Axis.STYLE])
                .option('-c, --locale [code]', 'Locale [code].', set(dynamic_cstr_1.Axis.LOCALE), dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_1.Axis.LOCALE])
                .option('-b, --modality [name]', 'Modality [name].', set(dynamic_cstr_1.Axis.MODALITY), dynamic_cstr_1.DynamicCstr.DEFAULT_VALUES[dynamic_cstr_1.Axis.MODALITY])
                .option('-k, --markup [name]', 'Generate speech output with markup tags.', set('markup'), 'none')
                .option('-r, --rate [value]', 'Base rate [value] for tagged speech' + ' output.', set('rate'), '100')
                .option('-p, --speech', 'Generate speech output (default).', () => processor('speech'))
                .option('-a, --audit', 'Generate auditory descriptions (JSON format).', () => processor('description'))
                .option('-j, --json', 'Generate JSON of semantic tree.', () => processor('json'))
                .option('-x, --xml', 'Generate XML of semantic tree.', () => processor('semantic'))
                .option('-m, --mathml', 'Generate enriched MathML.', () => processor('enriched'))
                .option('-g, --generate <depth>', 'Include generated speech in enriched' +
                ' MathML (with -m option only).', set('speech'), 'none')
                .option('-w, --structure', 'Include structure attribute in enriched' +
                ' MathML (with -m option only).', set('structure'))
                .option('-P, --pprint', 'Pretty print output whenever possible.', set('pprint'))
                .option('-f, --rules [name]', 'Loads a local rule file [name].', set('rules'))
                .option('-C, --subiso [name]', 'Supplementary country code (or similar) for the given locale.', set('subiso'))
                .option('-N, --number', 'Translate number to word.', () => processor('number'))
                .option('-O, --ordinal', 'Translate number to ordinal.', () => processor('ordinal'), 'ordinal')
                .option('-S, --numeric', 'Translate number to numeric ordinal.', () => processor('numericOrdinal'))
                .option('-F, --vulgar', 'Translate vulgar fraction to word. Provide vulgar fraction as slash seperated numbers.', () => processor('vulgar'))
                .option('-v, --verbose', 'Verbose mode.')
                .option('-l, --log [name]', 'Log file [name].')
                .option('--opt', 'List engine setup options.')
                .option('--opt-all', 'List engine setup options for all available locales.')
                .on('option:opt', () => {
                this.enumerate().then(() => System.exit(0));
            })
                .on('option:opt-all', () => {
                this.enumerate(true).then(() => System.exit(0));
            })
                .parse(this.process.argv);
            yield System.engineReady().then(() => System.setupEngine(this.setup));
            const options = commander.opts();
            if (options.output) {
                this.output = system_external_1.default.fs.createWriteStream(options.output);
            }
            if (options.verbose) {
                yield debugger_1.Debugger.getInstance().init(options.log);
            }
            if (options.input) {
                this.execute(options.input);
            }
            if (commander.args.length) {
                commander.args.forEach(this.execute.bind(this));
                System.engineReady().then(() => debugger_1.Debugger.getInstance().exit(() => System.exit(0)));
            }
            else {
                this.readline();
            }
        });
    }
    runProcessors_(processor, input) {
        try {
            if (!this.processors.length) {
                this.processors.push('speech');
            }
            if (input) {
                this.processors.forEach((proc) => processor(proc, input));
            }
        }
        catch (err) {
            console.error(err.name + ': ' + err.message);
            debugger_1.Debugger.getInstance().exit(() => this.process.exit(1));
        }
    }
    readExpression_(input) {
        try {
            const testInput = input.replace(/(&|#|;)/g, '');
            this.dp.parseFromString(testInput, 'text/xml');
        }
        catch (err) {
            return false;
        }
        return true;
    }
}
exports.Cli = Cli;
