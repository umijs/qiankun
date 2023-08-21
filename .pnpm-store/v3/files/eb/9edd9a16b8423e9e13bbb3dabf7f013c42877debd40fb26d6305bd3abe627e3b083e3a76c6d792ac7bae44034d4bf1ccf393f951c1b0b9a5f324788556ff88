const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
  'output/chtml/fonts/tex',           // the package to build
  '../../../../../../js',             // location of the MathJax js library
  [                                   // packages to link to
    'components/src/core/lib',
    'components/src/output/chtml/lib',
    'components/src/startup/lib'
  ],
  __dirname                           // our directory
);
