import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/autoload/AutoloadConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/autoload', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      autoload: {
        AutoloadConfiguration: module1
      }
    }
  }
}});
