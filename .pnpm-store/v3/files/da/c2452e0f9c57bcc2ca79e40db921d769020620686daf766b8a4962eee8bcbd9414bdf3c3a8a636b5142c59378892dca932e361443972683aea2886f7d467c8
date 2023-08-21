import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/configmacros/ConfigMacrosConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/configmacros', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      configmacros: {
        ConfigMacrosConfiguration: module1
      }
    }
  }
}});
