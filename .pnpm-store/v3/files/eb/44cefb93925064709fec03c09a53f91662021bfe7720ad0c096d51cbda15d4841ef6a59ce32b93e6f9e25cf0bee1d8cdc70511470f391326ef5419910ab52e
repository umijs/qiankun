import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/mathml/mml3/mml3-node.js';
import * as module2 from '../../../../../../../js/input/mathml/mml3/mml3.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[mml]/mml3', VERSION, 'input/mml/extensions');
}

combineWithMathJax({_: {
  input: {
    mathml: {
      mml3: {
        "mml3-node": module1,
        mml3: module2
      }
    }
  }
}});
