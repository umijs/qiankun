const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
  'input/tex',                        // the package to build
  '../../../../js',                   // location of the MathJax js library
  [                                   // packages to link to
    'components/src/startup/lib',
    'components/src/core/lib'
  ],
  __dirname                           // our directory
);
