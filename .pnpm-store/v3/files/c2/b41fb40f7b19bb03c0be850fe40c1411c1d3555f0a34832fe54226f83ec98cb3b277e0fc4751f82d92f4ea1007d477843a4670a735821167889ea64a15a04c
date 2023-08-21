const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
  'input/tex/extensions/cases',             // the package to build
  '../../../../../../js',                   // location of the compiled js files
  [                                         // packages to link to (relative to Mathjax components)
    'components/src/input/tex-base/lib',
    'components/src/input/tex/extensions/ams/lib',
    'components/src/input/tex/extensions/empheq/lib',
    'components/src/core/lib'
  ],
  __dirname                                 // our directory
);

