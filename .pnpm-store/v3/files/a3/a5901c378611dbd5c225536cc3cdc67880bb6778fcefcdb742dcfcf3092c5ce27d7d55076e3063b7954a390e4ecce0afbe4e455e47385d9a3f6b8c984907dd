import {combineWithMathJax} from '../../../../../js/components/global.js';
import {VERSION} from '../../../../../js/components/version.js';

import * as module1 from '../../../../../js/ui/lazy/LazyHandler.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('ui/lazy', VERSION, 'ui');
}

combineWithMathJax({_: {
  ui: {
    lazy: {
      LazyHandler: module1
    }
  }
}});
