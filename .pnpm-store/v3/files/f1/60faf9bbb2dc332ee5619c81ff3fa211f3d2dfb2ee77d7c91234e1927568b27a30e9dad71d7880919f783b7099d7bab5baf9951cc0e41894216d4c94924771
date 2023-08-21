const webpack = require("webpack");
const PACKAGE = require('../../../webpack.common.js');

module.exports = PACKAGE(
  'output/svg',                       // the package to build
  '../../../../js',                   // location of the MathJax js library
  ['components/src/core/lib'],        // packages to link to
  __dirname                           // our directory
);

module.exports.plugins.push(
  new webpack.NormalModuleReplacementPlugin(
    /\/fonts\/tex\.js$/,
    function (resource) {
      resource.request = '../../components/src/output/svg/nofont.js';
    }
  )
);
