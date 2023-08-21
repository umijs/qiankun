const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
  'a11y/assistive-mml',               // the package to build
  '../../../../js',                   // location of the MathJax js library
  [                                   // packages to link to
    'components/src/input/mml/lib',
    'components/src/core/lib'
  ],
  __dirname                           // our directory
);
