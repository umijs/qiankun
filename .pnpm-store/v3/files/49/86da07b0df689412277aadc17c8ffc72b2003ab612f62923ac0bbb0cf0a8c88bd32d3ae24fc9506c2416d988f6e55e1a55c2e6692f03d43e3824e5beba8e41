exports.__esModule = true;
exports.isWebpack5 = false;
exports.default = undefined;

function assignWithGetter(source, webpack) {
  Object.keys(webpack).forEach(key => {
    Object.defineProperty(source, key, {
      get() { return webpack[key]; }
    });
  });
}

let initializedWebpack5 = false;
let initializedWebpack4 = false;
let initFns = [];
let inited = false;
exports.init = function (useWebpack5) {
  // allow init once
  if (inited) return;
  inited = true;

  if (useWebpack5) {
    Object.assign(exports, require('./5/bundle5')());
    // Object.assign(exports, require('./5/bundle5')().webpack);
    assignWithGetter(exports, require('./5/bundle5')().webpack);
    exports.isWebpack5 = true;
    exports.default = require('./5/bundle5')().webpack;
    if (!initializedWebpack5) for (const cb of initFns) cb();
    initializedWebpack5 = true;
  } else {
    Object.assign(exports, require('./4/bundle4')());
    // Object.assign(exports, require('./4/bundle4')().webpack);
    assignWithGetter(exports, require('./4/bundle4')().webpack);
    exports.isWebpack5 = false;
    exports.default = require('./4/bundle4')().webpack;
    if (!initializedWebpack4) for (const cb of initFns) cb();
    initializedWebpack4 = true;
  }
}

exports.onWebpackInit = function (cb) {
  if (initializedWebpack5 || initializedWebpack4) cb();
  initFns.push(cb);
}
