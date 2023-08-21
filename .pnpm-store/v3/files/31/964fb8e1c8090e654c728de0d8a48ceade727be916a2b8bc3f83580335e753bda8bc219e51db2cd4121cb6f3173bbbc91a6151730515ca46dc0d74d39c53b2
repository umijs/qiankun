import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/gensymb/GensymbConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/gensymb', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      gensymb: {
        GensymbConfiguration: module1
      }
    }
  }
}});
