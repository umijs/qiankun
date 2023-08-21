import './lib/tex.js';

import {combineDefaults} from '../../../../../../js/components/global.js';
import {Package} from '../../../../../../js/components/package.js';
import {selectOptionsFromKeys} from '../../../../../../js/util/Options.js';
import {TeXFont} from '../../../../../../js/output/chtml/fonts/tex.js';

if (MathJax.startup) {
  combineDefaults(MathJax.config, 'chtml', {
    fontURL: Package.resolvePath('output/chtml/fonts/woff-v2', false)
  });
  const options = selectOptionsFromKeys(MathJax.config.chtml || {}, TeXFont.OPTIONS);
  combineDefaults(MathJax.config, 'chtml', {font: new TeXFont(options)});
}
