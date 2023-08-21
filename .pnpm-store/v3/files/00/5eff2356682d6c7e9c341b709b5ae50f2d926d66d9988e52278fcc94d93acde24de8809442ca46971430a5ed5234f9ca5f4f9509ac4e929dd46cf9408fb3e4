const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
  'input/tex/extensions/mhchem',      // the package to build
  '../../../../../../js',             // location of the MathJax js library
  [                                   // packages to link to
    'components/src/input/tex/extensions/ams/lib',
    'components/src/input/tex-base/lib',
    'components/src/core/lib'
  ],
  __dirname                           // our directory
);
