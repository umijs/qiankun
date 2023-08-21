import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/mhchem/MhchemConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/mhchem', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      mhchem: {
        MhchemConfiguration: module1
      }
    }
  }
}});
