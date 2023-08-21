import {combineWithMathJax} from '../../../../../js/components/global.js';
import {VERSION} from '../../../../../js/components/version.js';

import * as module1 from '../../../../../js/ui/safe/SafeHandler.js';
import * as module2 from '../../../../../js/ui/safe/SafeMethods.js';
import * as module3 from '../../../../../js/ui/safe/safe.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('ui/safe', VERSION, 'ui');
}

combineWithMathJax({_: {
  ui: {
    safe: {
      SafeHandler: module1,
      SafeMethods: module2,
      safe: module3
    }
  }
}});
