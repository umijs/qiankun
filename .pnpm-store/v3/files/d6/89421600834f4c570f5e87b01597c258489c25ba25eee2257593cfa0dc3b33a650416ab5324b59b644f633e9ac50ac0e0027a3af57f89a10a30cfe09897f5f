const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
  'input/tex/extensions/require',     // the package to build
  '../../../../../../js',             // location of the MathJax js library
  [                                   // packages to link to
    'components/src/input/tex-base/lib',
    'components/src/core/lib',
    'components/src/startup/lib'
  ],
  __dirname                           // our directory
);
