import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/upgreek/UpgreekConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/upgreek', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      upgreek: {
        UpgreekConfiguration: module1
      }
    }
  }
}});
