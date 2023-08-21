var exported = require("chokidar");

Object.keys(exported).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  // if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === exported[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return exported[key];
    }
  });
});
