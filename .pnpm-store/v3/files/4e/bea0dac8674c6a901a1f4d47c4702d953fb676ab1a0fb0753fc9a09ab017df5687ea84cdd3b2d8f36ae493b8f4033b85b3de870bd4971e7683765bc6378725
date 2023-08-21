const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
  'a11y/explorer',                    // the package to build
  '../../../../js',                   // location of the MathJax js library
  [                                   // packages to link to
    'components/src/ui/menu/lib',
    'components/src/a11y/semantic-enrich/lib',
    'components/src/a11y/sre/lib',
    'components/src/input/mml/lib',
    'components/src/core/lib'
  ],
  __dirname                           // our directory
);
