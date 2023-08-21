const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
  'a11y/semantic-enrich',             // the package to build
  '../../../../js',                   // location of the MathJax js library
  [                                   // packages to link to
    'components/src/input/mml/lib',
    'components/src/core/lib',
    'components/src/a11y/sre/lib'
  ],
  __dirname                           // our directory
);
