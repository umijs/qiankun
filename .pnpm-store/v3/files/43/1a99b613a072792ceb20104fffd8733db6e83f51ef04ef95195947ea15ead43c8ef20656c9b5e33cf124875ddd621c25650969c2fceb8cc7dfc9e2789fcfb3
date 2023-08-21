import './lib/semantic-enrich.js';

import {combineDefaults} from '../../../../js/components/global.js';
import Sre from '../../../../js/a11y/sre.js';
import {EnrichHandler} from '../../../../js/a11y/semantic-enrich.js';
import {MathML} from '../../../../js/input/mathml.js';

if (MathJax.loader) {
  combineDefaults(MathJax.config.loader, 'a11y/semantic-enrich', {checkReady: () => Sre.sreReady()});
}

if (MathJax.startup) {
  MathJax.startup.extendHandler(handler => EnrichHandler(handler, new MathML()));
}
