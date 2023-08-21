import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/newcommand/NewcommandConfiguration.js';
import * as module2 from '../../../../../../../js/input/tex/newcommand/NewcommandItems.js';
import * as module3 from '../../../../../../../js/input/tex/newcommand/NewcommandMethods.js';
import * as module4 from '../../../../../../../js/input/tex/newcommand/NewcommandUtil.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/newcommand', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      newcommand: {
        NewcommandConfiguration: module1,
        NewcommandItems: module2,
        NewcommandMethods: module3,
        NewcommandUtil: module4
      }
    }
  }
}});
