const PACKAGE = require('../../../../../webpack.common.js');

module.exports = PACKAGE(
  'input/tex/extensions/textcomp',    // the package to build
  '../../../../../../js',             // location of the MathJax js library
  [                                   // packages to link to
    'components/src/input/tex/extensions/textmacros/lib',
    'components/src/input/tex-base/lib',
    'components/src/core/lib'
  ],
  __dirname                           // our directory
);
