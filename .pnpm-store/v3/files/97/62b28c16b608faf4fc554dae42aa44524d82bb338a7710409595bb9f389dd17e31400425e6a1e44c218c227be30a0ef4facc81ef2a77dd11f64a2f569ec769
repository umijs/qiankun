/*************************************************************
 *
 *  Copyright (c) 2009-2022 The MathJax Consortium
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
 * @fileoverview Tree Explorers allow to switch on effects on the entire
 *     expression tree.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {A11yDocument, Region} from './Region.js';
import {Explorer, AbstractExplorer} from './Explorer.js';
import Sre from '../sre.js';

export interface TreeExplorer extends Explorer {

}


export class AbstractTreeExplorer extends AbstractExplorer<void> {

  /**
   * @override
   */
  protected constructor(public document: A11yDocument,
                        protected region: Region<void>,
                        protected node: HTMLElement,
                        protected mml: HTMLElement) {
    super(document, null, node);
  }

  /**
   * @override
   */
  public readonly stoppable = false;


  /**
   * @override
   */
  public Attach() {
    super.Attach();
    this.Start();
  }

  /**
   * @override
   */
  public Detach() {
    this.Stop();
    super.Detach();
  }

}


export class FlameColorer extends AbstractTreeExplorer {

  /**
   * @override
   */
  public Start() {
    if (this.active) return;
    this.active = true;
    this.highlighter.highlightAll(this.node);
  }

  /**
   * @override
   */
  public Stop() {
    if (this.active) {
      this.highlighter.unhighlightAll();
    }
    this.active = false;
  }

}


export class TreeColorer extends AbstractTreeExplorer {

  /**
   * @override
   */
  public Start() {
    if (this.active) return;
    this.active = true;
    let generator = Sre.getSpeechGenerator('Color');
    if (!this.node.hasAttribute('hasforegroundcolor')) {
      generator.generateSpeech(this.node, this.mml);
      this.node.setAttribute('hasforegroundcolor', 'true');
    }
    // TODO: Make this cleaner in Sre.
    (this.highlighter as any).colorizeAll(this.node);
  }

  /**
   * @override
   */
  public Stop() {
    if (this.active) {
      (this.highlighter as any).uncolorizeAll(this.node);
    }
    this.active = false;
  }

}
