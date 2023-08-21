import {combineWithMathJax} from '../../../../../js/components/global.js';
import {VERSION} from '../../../../../js/components/version.js';

import * as module1 from '../../../../../js/input/mathml.js';
import * as module2 from '../../../../../js/input/mathml/FindMathML.js';
import * as module3 from '../../../../../js/input/mathml/MathMLCompile.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('input/mml', VERSION, 'input');
}

combineWithMathJax({_: {
  input: {
    mathml_ts: module1,
    mathml: {
      FindMathML: module2,
      MathMLCompile: module3
    }
  }
}});
