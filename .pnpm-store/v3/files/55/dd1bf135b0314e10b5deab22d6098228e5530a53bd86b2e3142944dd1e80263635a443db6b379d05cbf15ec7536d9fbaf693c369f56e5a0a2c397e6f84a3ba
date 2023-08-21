"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = api => {
  api.registerCommand({
    name: 'config',
    description: 'umi config cli',
    details: `
# List configs
$ umi config list

# List the specific config
$ umi config list --name history
    `.trim(),

    fn({
      args
    }) {
      const command = args._[0];

      switch (command) {
        case 'list':
          list();
          break;

        default:
          throw new Error(`Unsupported sub command ${command} for umi config.`);
      }

      function list() {
        const getValue = value => {
          if (typeof value !== 'function') {
            return value;
          }

          return _utils().chalk.yellow('The value data type does not support the view');
        };

        const print = key => {
          console.log(` - ${_utils().chalk.blue(`[key: ${key}]`)}`, getValue(api.config[key]));
          console.log();
        };

        console.log();
        console.log(`  Configs:`);
        console.log();

        if (args.name) {
          if (!api.config[args.name]) {
            // current key not existed
            throw new Error(`key ${args.name} not found`);
          }

          print(args.name);
        } else {
          // list all
          Object.keys(api.config).forEach(key => {
            print(key);
          });
        }

        console.log();
      }
    }

  });
};

exports.default = _default;