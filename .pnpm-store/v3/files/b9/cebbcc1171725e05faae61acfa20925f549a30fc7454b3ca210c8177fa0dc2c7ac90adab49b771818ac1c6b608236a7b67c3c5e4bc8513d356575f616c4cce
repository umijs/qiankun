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
 * @fileoverview Configuration file for the Physics package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../Configuration.js';
import {AutoOpen} from './PhysicsItems.js';
import './PhysicsMappings.js';


export const PhysicsConfiguration = Configuration.create(
  'physics', {
    handler: {
      macro: [
        'Physics-automatic-bracing-macros',
        'Physics-vector-macros',
        'Physics-vector-mo',
        'Physics-vector-mi',
        'Physics-derivative-macros',
        'Physics-expressions-macros',
        'Physics-quick-quad-macros',
        'Physics-bra-ket-macros',
        'Physics-matrix-macros'
      ],
      character: ['Physics-characters'],
      environment: ['Physics-aux-envs']
    },
    items: {
      [AutoOpen.prototype.kind]: AutoOpen
    },
    options: {
      physics: {
        italicdiff: false,
        arrowdel: false
      }
    }
  }
);
