import './lib/svg.js';

import {combineDefaults} from '../../../../js/components/global.js';
import {SVG} from '../../../../js/output/svg.js';

if (MathJax.loader) {
  combineDefaults(MathJax.config.loader, 'output/svg', {
    checkReady() {
      return MathJax.loader.load("output/svg/fonts/tex");
    }
  });
}

if (MathJax.startup) {
  MathJax.startup.registerConstructor('svg', SVG);
  MathJax.startup.useOutput('svg');
}
