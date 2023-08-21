const PACKAGE = require('../../webpack.common.js');

const package = PACKAGE(
  'node-main',                        // the package to build
  '../../../js',                      // location of the MathJax js library
  [],                                 // packages to link to
  __dirname                           // our directory
);

// make node-main.js exports available to caller
package.output.library = {
  name: 'init',
  type: 'commonjs',
  export: 'init'
};

module.exports = package;
