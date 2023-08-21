import './lib/complexity.js';

import {combineDefaults} from '../../../../js/components/global.js';
import {ComplexityHandler} from '../../../../js/a11y/complexity.js';

if (MathJax.startup) {
  MathJax.startup.extendHandler(handler => ComplexityHandler(handler));
  combineDefaults(MathJax.config, 'options', MathJax.config['a11y/complexity'] || {});
}
