const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
  'input/mml/extensions/mml3',        // the package to build
  '../../../../../../js',             // location of the MathJax js library
  [                                   // packages to link to
    'components/src/input/mml/lib',
    'components/src/core/lib'
  ],
  __dirname                           // our directory
);
