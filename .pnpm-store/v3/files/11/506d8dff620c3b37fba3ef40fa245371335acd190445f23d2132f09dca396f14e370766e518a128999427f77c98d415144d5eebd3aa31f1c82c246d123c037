import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/unicode/UnicodeConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/unicode', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      unicode: {
        UnicodeConfiguration: module1
      }
    }
  }
}});
