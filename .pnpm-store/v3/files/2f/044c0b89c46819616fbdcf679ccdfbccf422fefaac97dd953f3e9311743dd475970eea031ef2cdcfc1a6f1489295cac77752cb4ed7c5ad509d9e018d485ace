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
 * @fileoverview Configuration file for the Newcommand package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration, ParserConfiguration} from '../Configuration.js';
import {BeginEnvItem} from './NewcommandItems.js';
import NewcommandUtil from './NewcommandUtil.js';
import './NewcommandMappings.js';
import ParseMethods from '../ParseMethods.js';
import * as sm from '../SymbolMap.js';


/**
 * Init method for Newcommand package.
 * @param {Configuration} config The current configuration.
 */
let init = function(config: ParserConfiguration) {
  new sm.DelimiterMap(NewcommandUtil.NEW_DELIMITER,
                      ParseMethods.delimiter, {});
  new sm.CommandMap(NewcommandUtil.NEW_COMMAND, {}, {});
  new sm.EnvironmentMap(NewcommandUtil.NEW_ENVIRONMENT,
                        ParseMethods.environment, {}, {});
  config.append(Configuration.local(
    {handler: {character: [],
               delimiter: [NewcommandUtil.NEW_DELIMITER],
               macro: [NewcommandUtil.NEW_DELIMITER,
                       NewcommandUtil.NEW_COMMAND],
               environment: [NewcommandUtil.NEW_ENVIRONMENT]
              },
     priority: -1}));
};


export const NewcommandConfiguration = Configuration.create(
  'newcommand', {
    handler: {
      macro: ['Newcommand-macros']
    },
    items: {
      [BeginEnvItem.prototype.kind]: BeginEnvItem,
    },
    options: {maxMacros: 1000},
    init: init
  }
);


