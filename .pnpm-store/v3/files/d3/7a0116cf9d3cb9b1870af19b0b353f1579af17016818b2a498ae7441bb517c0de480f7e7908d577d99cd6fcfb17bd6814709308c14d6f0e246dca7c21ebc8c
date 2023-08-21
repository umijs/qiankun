import {combineWithMathJax} from '../../../../../js/components/global.js';
import {VERSION} from '../../../../../js/components/version.js';

import * as module1 from '../../../../../js/input/asciimath.js';
import * as module2 from '../../../../../js/input/asciimath/FindAsciiMath.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('input/asciimath', VERSION, 'input');
}

combineWithMathJax({_: {
  input: {
    asciimath_ts: module1,
    asciimath: {
      FindAsciiMath: module2
    }
  }
}});
