const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
  'a11y/complexity',                  // the package to build
  '../../../../js',                   // location of the MathJax js library
  [                                   // packages to link to
    'components/src/a11y/semantic-enrich/lib',
    'components/src/input/mml/lib',
    'components/src/core/lib'
  ],
  __dirname                           // our directory
);
