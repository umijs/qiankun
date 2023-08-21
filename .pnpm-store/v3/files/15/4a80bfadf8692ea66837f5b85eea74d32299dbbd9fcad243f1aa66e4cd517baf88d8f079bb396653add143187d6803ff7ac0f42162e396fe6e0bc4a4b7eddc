import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/require/RequireConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/require', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      require: {
        RequireConfiguration: module1
      }
    }
  }
}});
