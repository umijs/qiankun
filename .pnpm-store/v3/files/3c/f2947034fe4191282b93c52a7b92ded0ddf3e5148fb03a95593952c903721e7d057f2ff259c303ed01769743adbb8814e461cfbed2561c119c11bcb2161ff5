import './lib/chtml.js';

import {combineDefaults} from '../../../../js/components/global.js';
import {CHTML} from '../../../../js/output/chtml.js';

if (MathJax.loader) {
  combineDefaults(MathJax.config.loader, 'output/chtml', {
    checkReady() {
      return MathJax.loader.load("output/chtml/fonts/tex");
    }
  });
}

if (MathJax.startup) {
  MathJax.startup.registerConstructor('chtml', CHTML);
  MathJax.startup.useOutput('chtml');
}
