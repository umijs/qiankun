import {combineWithMathJax} from '../../../../js/components/global.js';
import {VERSION} from '../../../../js/components/version.js';

import * as module1 from '../../../../js/components/loader.js';
import * as module2 from '../../../../js/components/package.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('loader', VERSION, 'loader');
}

combineWithMathJax({_: {
  components: {
    loader: module1,
    package: module2
  }
}});
