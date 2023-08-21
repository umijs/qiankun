import {combineWithMathJax} from '../../../../../js/components/global.js';
import {VERSION} from '../../../../../js/components/version.js';

import * as module1 from '../../../../../js/a11y/explorer.js';
import * as module2 from '../../../../../js/a11y/explorer/Explorer.js';
import * as module3 from '../../../../../js/a11y/explorer/KeyExplorer.js';
import * as module4 from '../../../../../js/a11y/explorer/MouseExplorer.js';
import * as module5 from '../../../../../js/a11y/explorer/Region.js';
import * as module6 from '../../../../../js/a11y/explorer/TreeExplorer.js';

if (MathJax.loader) {
  MathJax.loader.checkVersion('a11y/explorer', VERSION, 'a11y');
}

combineWithMathJax({_: {
  a11y: {
    explorer_ts: module1,
    explorer: {
      Explorer: module2,
      KeyExplorer: module3,
      MouseExplorer: module4,
      Region: module5,
      TreeExplorer: module6
    }
  }
}});
