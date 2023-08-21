import {combineWithMathJax} from '../../../../../js/components/global.js';
import {VERSION} from '../../../../../js/components/version.js';

import * as module1 from '../../../../../js/adaptors/liteAdaptor.js';
import * as module2 from '../../../../../js/adaptors/lite/Document.js';
import * as module3 from '../../../../../js/adaptors/lite/Element.js';
import * as module4 from '../../../../../js/adaptors/lite/List.js';
import * as module5 from '../../../../../js/adaptors/lite/Parser.js';
import * as module6 from '../../../../../js/adaptors/lite/Text.js';
import * as module7 from '../../../../../js/adaptors/lite/Window.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('adaptors/liteDOM', VERSION, 'adaptors');
}

combineWithMathJax({_: {
  adaptors: {
    liteAdaptor: module1,
    lite: {
      Document: module2,
      Element: module3,
      List: module4,
      Parser: module5,
      Text: module6,
      Window: module7
    }
  }
}});
