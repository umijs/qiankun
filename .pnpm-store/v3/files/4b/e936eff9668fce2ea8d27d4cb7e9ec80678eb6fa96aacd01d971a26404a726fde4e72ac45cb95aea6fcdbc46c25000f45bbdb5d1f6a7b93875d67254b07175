import {combineDefaults} from '../../../../js/components/global.js';
import {Package} from '../../../../js/components/package.js';

// This sets up the correct link to the mathmaps files.
if (MathJax.startup) {

  let path = Package.resolvePath('[sre]', false);

  if (typeof window !== 'undefined') {
    window.SREfeature = {json: path};
  } else {
    // In Node get the absolute path to the mathmaps directory.
    try {
      path = MathJax.config.loader.require.resolve(
        path + '/base.json').replace(/\/base\.json$/, '');
    } catch(_err) { }
    global.SREfeature = {json: path};
  }
}
