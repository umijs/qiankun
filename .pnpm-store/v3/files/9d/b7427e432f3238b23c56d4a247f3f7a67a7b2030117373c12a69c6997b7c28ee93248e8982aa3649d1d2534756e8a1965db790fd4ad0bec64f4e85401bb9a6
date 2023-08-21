import './lib/tex.js';

import {TeXFont} from '../../../../../../js/output/svg/fonts/tex.js';
import {combineDefaults} from '../../../../../../js/components/global.js';
import {selectOptionsFromKeys} from '../../../../../../js/util/Options.js';

if (MathJax.startup) {
  const options = selectOptionsFromKeys(MathJax.config.svg || {}, TeXFont.OPTIONS);
  combineDefaults(MathJax.config, 'svg', {font: new TeXFont(options)});
}
