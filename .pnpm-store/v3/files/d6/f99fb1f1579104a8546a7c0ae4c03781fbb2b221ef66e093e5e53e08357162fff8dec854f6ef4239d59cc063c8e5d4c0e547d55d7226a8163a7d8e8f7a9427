"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = start;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _child_process() {
  const data = require("child_process");

  _child_process = function _child_process() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const usedPorts = [];
let CURRENT_PORT;

function start({
  scriptPath
}) {
  const execArgv = process.execArgv.slice(0);
  const inspectArgvIndex = execArgv.findIndex(argv => argv.includes('--inspect-brk'));

  if (inspectArgvIndex > -1) {
    const inspectArgv = execArgv[inspectArgvIndex];
    execArgv.splice(inspectArgvIndex, 1, inspectArgv.replace(/--inspect-brk=(.*)/, (match, s1) => {
      let port;

      try {
        port = parseInt(s1) + 1;
      } catch (e) {
        port = 9230; // node default inspect port plus 1.
      }

      if (usedPorts.includes(port)) {
        port += 1;
      }

      usedPorts.push(port);
      return `--inspect-brk=${port}`;
    }));
  } // set port to env when current port has value


  if (CURRENT_PORT) {
    // @ts-ignore
    process.env.PORT = CURRENT_PORT;
  }

  const child = (0, _child_process().fork)(scriptPath, process.argv.slice(2), {
    execArgv
  });
  child.on('message', data => {
    var _process$send, _process;

    const type = data && data.type || null;

    if (type === 'RESTART') {
      child.kill();
      start({
        scriptPath
      });
    } else if (type === 'UPDATE_PORT') {
      // set current used port
      CURRENT_PORT = data.port;
    }

    (_process$send = (_process = process).send) === null || _process$send === void 0 ? void 0 : _process$send.call(_process, data);
  });
  return child;
}