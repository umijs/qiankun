import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/amscd/AmsCdConfiguration.js';
import * as module2 from '../../../../../../../js/input/tex/amscd/AmsCdMethods.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/amscd', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      amscd: {
        AmsCdConfiguration: module1,
        AmsCdMethods: module2
      }
    }
  }
}});
