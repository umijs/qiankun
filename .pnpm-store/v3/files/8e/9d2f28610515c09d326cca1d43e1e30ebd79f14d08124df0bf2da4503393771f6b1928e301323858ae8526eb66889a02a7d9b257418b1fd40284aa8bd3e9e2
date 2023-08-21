import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/noerrors/NoErrorsConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/noerrors', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      noerrors: {
        NoErrorsConfiguration: module1
      }
    }
  }
}});
