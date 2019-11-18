const fs = require('fs');
const path = require('path');
const webpackHotDevClient = path.resolve('node_modules', 'react-dev-utils/webpackHotDevClient.js');
const rewriteSockPort = port => {
  return new Promise((res, rej) => {
    fs.readFile(webpackHotDevClient, 'utf8', (err, data) => {
      if (err) {
        return rej(err);
      }

      let result = data;

      result = result.replace('window.location.port', port);
      fs.writeFile(webpackHotDevClient, result, 'utf8', err => {
        if (err) rej(err);

        res(true);
      });
    });
  });
};
module.exports = rewriteSockPort;
