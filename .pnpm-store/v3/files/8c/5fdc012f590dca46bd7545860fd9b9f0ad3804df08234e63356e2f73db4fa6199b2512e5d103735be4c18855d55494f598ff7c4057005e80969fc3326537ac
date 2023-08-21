import './lib/all-packages.js';

import {AllPackages} from '../../../../../../js/input/tex/AllPackages.js';
import '../../../../../../js/input/tex/autoload/AutoloadConfiguration.js';
import '../../../../../../js/input/tex/require/RequireConfiguration.js';
import {registerTeX} from '../../register.js';

if (MathJax.loader) {
  MathJax.loader.preLoad('[tex]/autoload', '[tex]/require');
}

registerTeX(['require', ...AllPackages], false);
