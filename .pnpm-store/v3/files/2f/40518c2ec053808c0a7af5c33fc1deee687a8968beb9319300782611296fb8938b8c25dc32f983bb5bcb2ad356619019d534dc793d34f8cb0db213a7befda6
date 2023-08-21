import * as Api from 'speech-rule-engine/js/common/system.js';
import { Walker } from 'speech-rule-engine/js/walker/walker.js';
import * as WalkerFactory from 'speech-rule-engine/js/walker/walker_factory.js';
import * as SpeechGeneratorFactory from 'speech-rule-engine/js/speech_generator/speech_generator_factory.js';
import { ClearspeakPreferences } from 'speech-rule-engine/js/speech_rules/clearspeak_preferences.js';
import { Highlighter } from 'speech-rule-engine/js/highlighter/highlighter.js';
import * as HighlighterFactory from 'speech-rule-engine/js/highlighter/highlighter_factory.js';
import { SpeechGenerator } from 'speech-rule-engine/js/speech_generator/speech_generator.js';
export declare namespace Sre {
    type highlighter = Highlighter;
    type speechGenerator = SpeechGenerator;
    type walker = Walker;
    const locales: Map<string, string>;
    const sreReady: typeof Api.engineReady;
    const setupEngine: typeof Api.setupEngine;
    const engineSetup: typeof Api.engineSetup;
    const toEnriched: typeof Api.toEnriched;
    const toSpeech: typeof Api.toSpeech;
    const clearspeakPreferences: typeof ClearspeakPreferences;
    const getHighlighter: typeof HighlighterFactory.highlighter;
    const getSpeechGenerator: typeof SpeechGeneratorFactory.generator;
    const getWalker: typeof WalkerFactory.walker;
    const clearspeakStyle: () => string;
    const preloadLocales: (locale: string) => Promise<unknown>;
}
export declare const sreReady: typeof Api.engineReady;
export default Sre;
