import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/AllPackages.js';
import * as module2 from '../../../../../../../js/input/tex/autoload/AutoloadConfiguration.js';
import * as module3 from '../../../../../../../js/input/tex/require/RequireConfiguration.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/all-packages', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      AllPackages: module1,
      autoload: {
        AutoloadConfiguration: module2
      },
      require: {
        RequireConfiguration: module3
      }
    }
  }
}});
