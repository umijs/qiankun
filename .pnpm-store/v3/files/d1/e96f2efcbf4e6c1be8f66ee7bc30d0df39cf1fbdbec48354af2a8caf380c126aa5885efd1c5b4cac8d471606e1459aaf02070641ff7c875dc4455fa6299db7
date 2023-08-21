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

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDescriptions(commands) {
  return Object.keys(commands).filter(name => typeof commands[name] !== 'string').map(name => {
    return getDescription(commands[name]);
  });
}

function getDescription(command) {
  return `    ${_utils().chalk.green(_utils().lodash.padEnd(command.name, 10))}${command.description || ''}`;
}

function padLeft(str) {
  return str.split('\n').map(line => `    ${line}`).join('\n');
}

var _default = api => {
  api.registerCommand({
    name: 'help',
    description: 'show command helps',

    fn({
      args
    }) {
      const commandName = args._[0];

      if (commandName) {
        const command = api.service.commands[commandName];
        (0, _assert().default)(command, `Command ${commandName} not found.`);
        console.log(`
  Usage: umi ${commandName} [options]

  Options:

  Details:

${command.details ? padLeft(command.details.trim()) : ''}
        `);
      } else {
        console.log(`
  Usage: umi <command> [options]

  Commands:

${getDescriptions(api.service.commands).join('\n')}

  Run \`${_utils().chalk.bold('umi help <command>')}\` for more information of specific commands.
  Visit ${_utils().chalk.bold('https://umijs.org/')} to learn more about Umi.
      `);
      }
    }

  });
};

exports.default = _default;