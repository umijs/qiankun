import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/tagformat/TagFormatConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/tagformat', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      tagformat: {
        TagFormatConfiguration: module1
      }
    }
  }
}});
