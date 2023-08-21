import './lib/core.js';

import {HTMLHandler} from '../../../js/handlers/html/HTMLHandler.js';
import {browserAdaptor} from '../../../js/adaptors/browserAdaptor.js';

if (MathJax.startup) {
  MathJax.startup.registerConstructor('HTMLHandler', HTMLHandler);
  MathJax.startup.registerConstructor('browserAdaptor', browserAdaptor);
  MathJax.startup.useHandler('HTMLHandler');
  MathJax.startup.useAdaptor('browserAdaptor');
}
if (MathJax.loader) {
  MathJax._.mathjax.mathjax.asyncLoad = (name => MathJax.loader.load(name));
}
