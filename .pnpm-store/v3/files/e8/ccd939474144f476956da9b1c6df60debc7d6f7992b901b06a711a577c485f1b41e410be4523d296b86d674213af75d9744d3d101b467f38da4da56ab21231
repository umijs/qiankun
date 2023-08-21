import {combineWithMathJax} from '../../../../js/components/global.js';
import {VERSION} from '../../../../js/components/version.js';

import * as module1 from '../../../../js/components/loader.js';
import * as module2 from '../../../../js/components/package.js';
import * as module3 from '../../../../js/components/startup.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('startup', VERSION, 'startup');
}

combineWithMathJax({_: {
  components: {
    loader: module1,
    package: module2,
    startup: module3
  }
}});
