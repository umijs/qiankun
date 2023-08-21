import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/enclose/EncloseConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/enclose', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      enclose: {
        EncloseConfiguration: module1
      }
    }
  }
}});
