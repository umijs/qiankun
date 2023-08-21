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
 * @fileoverview Configuration file for the AMS package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration, ParserConfiguration} from '../Configuration.js';
import {MultlineItem, FlalignItem} from './AmsItems.js';
import {AbstractTags} from '../Tags.js';
import {NEW_OPS} from './AmsMethods.js';
import './AmsMappings.js';
import {CommandMap} from '../SymbolMap.js';


/**
 * Standard AMS style tagging.
 * @constructor
 * @extends {AbstractTags}
 */
export class AmsTags extends AbstractTags { }


/**
 * Init method for AMS package.
 * @param {ParserConfiguration} config The current configuration.
 */
let init = function(config: ParserConfiguration) {
  new CommandMap(NEW_OPS, {}, {});
  config.append(Configuration.local({handler: {macro: [NEW_OPS]},
                                    priority: -1}));
};

export const AmsConfiguration = Configuration.create(
  'ams', {
    handler: {
      character: ['AMSmath-operatorLetter'],
      delimiter: ['AMSsymbols-delimiter', 'AMSmath-delimiter'],
      macro: ['AMSsymbols-mathchar0mi', 'AMSsymbols-mathchar0mo',
              'AMSsymbols-delimiter', 'AMSsymbols-macros',
              'AMSmath-mathchar0mo', 'AMSmath-macros', 'AMSmath-delimiter'],
      environment: ['AMSmath-environment']
    },
    items: {
      [MultlineItem.prototype.kind]: MultlineItem,
      [FlalignItem.prototype.kind]: FlalignItem,
    },
    tags: {'ams': AmsTags},
    init: init,
    config: (_config: ParserConfiguration, jax: any)  => {
      //
      //  Move multlineWidth from old location to ams block (remove in next version)
      //
      if (jax.parseOptions.options.multlineWidth) {
        jax.parseOptions.options.ams.multlineWidth = jax.parseOptions.options.multlineWidth;
      }
      delete jax.parseOptions.options.multlineWidth;
    },
    options: {
      multlineWidth: '',
      ams: {
        multlineWidth: '100%',  // The width to use for multline environments.
        multlineIndent: '1em',  // The margin to use on both sides of multline environments.
      }
    }
  }
);


