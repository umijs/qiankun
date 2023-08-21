import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/html/HtmlConfiguration.js';
import * as module2 from '../../../../../../../js/input/tex/html/HtmlMethods.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/html', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      html: {
        HtmlConfiguration: module1,
        HtmlMethods: module2
      }
    }
  }
}});
