"use strict";

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function ErrorOverlay() {
  const data = _interopRequireWildcard(require("react-error-overlay"));

  ErrorOverlay = function ErrorOverlay() {
    return data;
  };

  return data;
}

function _sockjsClient() {
  const data = _interopRequireDefault(require("sockjs-client"));

  _sockjsClient = function _sockjsClient() {
    return data;
  };

  return data;
}

function _stripAnsi() {
  const data = _interopRequireDefault(require("strip-ansi"));

  _stripAnsi = function _stripAnsi() {
    return data;
  };

  return data;
}

function _url() {
  const data = _interopRequireDefault(require("url"));

  _url = function _url() {
    return data;
  };

  return data;
}

var _formatWebpackMessages = _interopRequireDefault(require("./formatWebpackMessages"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
let hadRuntimeError = false;
ErrorOverlay().startReportingRuntimeErrors({
  onError: function onError() {
    hadRuntimeError = true;
  }
});
let isFirstCompilation = true;
let mostRecentCompilationHash = null;
let hasCompileErrors = false;

function handleHashChange(hash) {
  mostRecentCompilationHash = hash;
}

function handleSuccess(data) {
  if (data && data.reload) {
    window.location.reload();
    return;
  }

  const isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;

  if (isHotUpdate) {
    tryApplyUpdates(() => {
      ErrorOverlay().dismissBuildError();
    });
  }
}

function handleWarnings(warnings) {
  var isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;
  hasCompileErrors = false;

  function printWarnings() {
    const formatted = (0, _formatWebpackMessages.default)({
      warnings,
      errors: []
    });
    formatted.warnings.forEach(warning => {
      console.warn((0, _stripAnsi().default)(warning));
    });
  }

  if (isHotUpdate) {
    tryApplyUpdates(() => {
      printWarnings();
      ErrorOverlay().dismissBuildError();
    });
  } else {
    printWarnings();
  }
}

function handleErrors(errors) {
  isFirstCompilation = false;
  hasCompileErrors = true;
  const formatted = (0, _formatWebpackMessages.default)({
    errors,
    warnings: []
  });
  ErrorOverlay().reportBuildError(formatted.errors[0]);
  formatted.errors.forEach(error => {
    console.error((0, _stripAnsi().default)(error));
  });
}

let tryApplyUpdates = null; // function tryApplyUpdates(onHotUpdateSuccess?: Function) {
//   // @ts-ignore
//   if (!module.hot) {
//     window.location.reload();
//     return;
//   }
//
//   function isUpdateAvailable() {
//     // @ts-ignore
//     return mostRecentCompilationHash !== __webpack_hash__;
//   }
//
//   // TODO: is update available?
//   // @ts-ignore
//   if (!isUpdateAvailable() || module.hot.status() !== 'idle') {
//     return;
//   }
//
//   function handleApplyUpdates(err: Error | null, updatedModules: any) {
//     if (err || !updatedModules || hadRuntimeError) {
//       window.location.reload();
//       return;
//     }
//
//     onHotUpdateSuccess?.();
//
//     if (isUpdateAvailable()) {
//       // While we were updating, there was a new update! Do it again.
//       tryApplyUpdates();
//     }
//   }
//
//   // @ts-ignore
//   module.hot.check(true).then(
//     function (updatedModules: any) {
//       handleApplyUpdates(null, updatedModules);
//     },
//     function (err: Error) {
//       handleApplyUpdates(err, null);
//     },
//   );
// }

const showPending = () => {
  const el = document.createElement('div');
  el.style.position = 'absolute';
  el.style.left = '0px';
  el.style.top = '0px';
  el.style.width = '100%';
  el.style.background = '#fff1b8';
  el.style.zIndex = '2147483647000000';
  el.style.color = '#613400';
  el.style.textAlign = 'center';
  el.style.fontSize = '18px';
  el.style.fontFamily = 'Consolas, Menlo, Courier, monospace';
  el.style.padding = '8px 0';
  el.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
  el.innerHTML = 'Disconnected from the devServer, trying to reconnect...';
  document.body.appendChild(el);
  return el;
};

let sock;
let retries = 0;
let pending;

function stripLastSlash(url) {
  if (url.slice(-1) === '/') {
    return url.slice(0, -1);
  } else {
    return url;
  }
}

function getSocketHost() {
  var _document$body, _document$body$queryS;

  if (process.env.SOCKET_SERVER) {
    return stripLastSlash(process.env.SOCKET_SERVER);
  }

  let host, protocol;
  const scripts = ((_document$body = document.body) === null || _document$body === void 0 ? void 0 : (_document$body$queryS = _document$body.querySelectorAll) === null || _document$body$queryS === void 0 ? void 0 : _document$body$queryS.call(_document$body, 'script')) || [];
  const dataFromSrc = scripts[scripts.length - 1] ? scripts[scripts.length - 1].getAttribute('src') : '';

  if (dataFromSrc && dataFromSrc.includes('umi.js')) {
    const urlParsed = _url().default.parse(dataFromSrc);

    host = urlParsed.host;
    protocol = urlParsed.protocol;
  } else {
    // 某些场景可能没有 umi.js，比如微前端的场景
    host = location.host;
    protocol = location.protocol;
  }

  return host && protocol ? _url().default.format({
    host,
    protocol
  }) : '';
}

function initSocket() {
  const host = getSocketHost();
  sock = new (_sockjsClient().default)(`${host}/dev-server`);

  sock.onopen = () => {
    var _pending, _pending$parentElemen;

    retries = 0;
    (_pending = pending) === null || _pending === void 0 ? void 0 : (_pending$parentElemen = _pending.parentElement) === null || _pending$parentElemen === void 0 ? void 0 : _pending$parentElemen.removeChild(pending);
  };

  sock.onmessage = e => {
    const message = JSON.parse(e.data);

    switch (message.type) {
      case 'hash':
        handleHashChange(message.data);
        break;

      case 'still-ok':
      case 'ok':
        handleSuccess(message.data);
        break;

      case 'warnings':
        handleWarnings(message.data);
        break;

      case 'errors':
        handleErrors(message.data);
        break;

      default:
        break;
    }
  };

  sock.onclose = e => {
    if (retries === 0) {
      var _console;

      if (typeof ((_console = console) === null || _console === void 0 ? void 0 : _console.info) === 'function') {
        console.info('The development server has disconnected.\nRefresh the page if necessary.');
      }
    } // @ts-ignore


    sock = null;

    if (!pending) {
      pending = showPending();
    }

    if (retries <= 10) {
      const retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
      retries += 1;
      setTimeout(() => {
        initSocket();
      }, retryInMs);
    }
  };
} // TODO: improve this
// @ts-ignore


window.g_initWebpackHotDevClient = function (opts) {
  tryApplyUpdates = opts.tryApplyUpdates;
  initSocket();
}; // @ts-ignore


window.g_getMostRecentCompilationHash = () => {
  return mostRecentCompilationHash;
}; // @ts-ignore


window.g_getHadRuntimeError = () => {
  return hadRuntimeError;
};