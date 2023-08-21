/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Provides the interface functionality to SRE.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import * as Api from 'speech-rule-engine/js/common/system.js';
import {Walker} from 'speech-rule-engine/js/walker/walker.js';
import * as WalkerFactory from 'speech-rule-engine/js/walker/walker_factory.js';
import * as SpeechGeneratorFactory from 'speech-rule-engine/js/speech_generator/speech_generator_factory.js';
import * as EngineConst from 'speech-rule-engine/js/common/engine_const.js';
import Engine from 'speech-rule-engine/js/common/engine.js';
import {ClearspeakPreferences} from 'speech-rule-engine/js/speech_rules/clearspeak_preferences.js';
import {Highlighter} from 'speech-rule-engine/js/highlighter/highlighter.js';
import * as HighlighterFactory from 'speech-rule-engine/js/highlighter/highlighter_factory.js';
import {SpeechGenerator} from 'speech-rule-engine/js/speech_generator/speech_generator.js';
import {Variables} from 'speech-rule-engine/js/common/variables.js';
import MathMaps from './mathmaps.js';

export namespace Sre {

  export type highlighter = Highlighter;

  export type speechGenerator = SpeechGenerator;

  export type walker = Walker;


  export const locales = Variables.LOCALES;

  export const sreReady = Api.engineReady;

  export const setupEngine = Api.setupEngine;

  export const engineSetup = Api.engineSetup;

  export const toEnriched = Api.toEnriched;

  export const toSpeech = Api.toSpeech;

  export const clearspeakPreferences = ClearspeakPreferences;

  export const getHighlighter = HighlighterFactory.highlighter;

  export const getSpeechGenerator = SpeechGeneratorFactory.generator;

  export const getWalker = WalkerFactory.walker;

  export const clearspeakStyle = () => {
    return EngineConst.DOMAIN_TO_STYLES['clearspeak'];
  };

  /**
   * Loads locales that are already included in the imported MathMaps. Defaults
   * to standard loading if a locale is not yet preloaded.
   */
  export const preloadLocales = async function(locale: string) {
    const json = MathMaps.get(locale);
    return json ? new Promise((res, _rej) => res(JSON.stringify(json))) :
      Api.localeLoader()(locale);
  };

}

/**
 * A promise that resolves when SRE is loaded and ready, and rejects if
 * SRE can't be loaded, or does not become ready within the timout period.
 *
 * @deprecated
 */
export const sreReady = Sre.sreReady;

// Setting delay stops SRE from setting itself up (and loading locales) when it
// is not actually being used. As we are not yet sure in which environment we
// are (browser, node) we can not use a configuration vector.
Engine.getInstance().delay = true;

export default Sre;
