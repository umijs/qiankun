import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/textmacros/TextMacrosConfiguration.js';
import * as module2 from '../../../../../../../js/input/tex/textmacros/TextMacrosMethods.js';
import * as module3 from '../../../../../../../js/input/tex/textmacros/TextParser.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/textmacros', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      textmacros: {
        TextMacrosConfiguration: module1,
        TextMacrosMethods: module2,
        TextParser: module3
      }
    }
  }
}});
