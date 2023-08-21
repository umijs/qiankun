import {combineWithMathJax} from '../../../../../../../js/components/global.js';
import {VERSION} from '../../../../../../../js/components/version.js';

import * as module1 from '../../../../../../../js/input/tex/physics/PhysicsConfiguration.js';
import * as module2 from '../../../../../../../js/input/tex/physics/PhysicsItems.js';
import * as module3 from '../../../../../../../js/input/tex/physics/PhysicsMethods.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('[tex]/physics', VERSION, 'tex-extension');
}

combineWithMathJax({_: {
  input: {
    tex: {
      physics: {
        PhysicsConfiguration: module1,
        PhysicsItems: module2,
        PhysicsMethods: module3
      }
    }
  }
}});
