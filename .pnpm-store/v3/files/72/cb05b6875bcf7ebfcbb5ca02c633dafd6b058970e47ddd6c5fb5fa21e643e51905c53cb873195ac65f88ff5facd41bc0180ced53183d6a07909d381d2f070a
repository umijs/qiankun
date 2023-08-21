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
    name: 'plugin',
    description: 'inspect umi plugins',
    details: `
# List plugins
$ umi plugin list

# List plugins with key
$ umi plugin list --key
    `.trim(),

    fn({
      args
    }) {
      const command = args._[0];

      if (!command) {
        throw new Error(`
Sub command not found: umi plugin
Did you mean:
  umi plugin list
        `);
      }

      switch (command) {
        case 'list':
          list();
          break;

        default:
          throw new Error(`Unsupported sub command ${command} for umi plugin.`);
      }

      function list() {
        console.log();
        console.log(`  Plugins:`);
        console.log();
        Object.keys(api.service.plugins).forEach(pluginId => {
          const plugin = api.service.plugins[pluginId];
          const keyStr = args.key ? ` ${_utils().chalk.blue(`[key: ${[plugin.key]}]`)}` : '';
          const isPresetStr = plugin.isPreset ? ` ${_utils().chalk.green('(preset)')}` : '';
          console.log(`    - ${plugin.id}${keyStr}${isPresetStr}`);
        });
        console.log();
      }
    }

  });
};

exports.default = _default;