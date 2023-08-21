var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// ../../node_modules/url/util.js
var require_util = __commonJS({
  "../../node_modules/url/util.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      isString: function(arg) {
        return typeof arg === "string";
      },
      isObject: function(arg) {
        return typeof arg === "object" && arg !== null;
      },
      isNull: function(arg) {
        return arg === null;
      },
      isNullOrUndefined: function(arg) {
        return arg == null;
      }
    };
  }
});

// ../../node_modules/url/node_modules/querystring/decode.js
var require_decode = __commonJS({
  "../../node_modules/url/node_modules/querystring/decode.js"(exports2, module2) {
    "use strict";
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    module2.exports = function(qs, sep, eq, options) {
      sep = sep || "&";
      eq = eq || "=";
      var obj = {};
      if (typeof qs !== "string" || qs.length === 0) {
        return obj;
      }
      var regexp = /\+/g;
      qs = qs.split(sep);
      var maxKeys = 1e3;
      if (options && typeof options.maxKeys === "number") {
        maxKeys = options.maxKeys;
      }
      var len = qs.length;
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }
      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq), kstr, vstr, k, v;
        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = "";
        }
        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);
        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (Array.isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }
      return obj;
    };
  }
});

// ../../node_modules/url/node_modules/querystring/encode.js
var require_encode = __commonJS({
  "../../node_modules/url/node_modules/querystring/encode.js"(exports2, module2) {
    "use strict";
    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case "string":
          return v;
        case "boolean":
          return v ? "true" : "false";
        case "number":
          return isFinite(v) ? v : "";
        default:
          return "";
      }
    };
    module2.exports = function(obj, sep, eq, name) {
      sep = sep || "&";
      eq = eq || "=";
      if (obj === null) {
        obj = void 0;
      }
      if (typeof obj === "object") {
        return Object.keys(obj).map(function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);
      }
      if (!name)
        return "";
      return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
    };
  }
});

// ../../node_modules/url/node_modules/querystring/index.js
var require_querystring = __commonJS({
  "../../node_modules/url/node_modules/querystring/index.js"(exports2) {
    "use strict";
    exports2.decode = exports2.parse = require_decode();
    exports2.encode = exports2.stringify = require_encode();
  }
});

// ../../node_modules/url/url.js
var require_url = __commonJS({
  "../../node_modules/url/url.js"(exports2) {
    "use strict";
    var punycode = require("punycode");
    var util = require_util();
    exports2.parse = urlParse;
    exports2.resolve = urlResolve;
    exports2.resolveObject = urlResolveObject;
    exports2.format = urlFormat;
    exports2.Url = Url;
    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }
    var protocolPattern = /^([a-z0-9.+-]+:)/i;
    var portPattern = /:[0-9]*$/;
    var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
    var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
    var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
    var autoEscape = ["'"].concat(unwise);
    var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
    var hostEndingChars = ["/", "?", "#"];
    var hostnameMaxLen = 255;
    var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
    var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
    var unsafeProtocol = {
      "javascript": true,
      "javascript:": true
    };
    var hostlessProtocol = {
      "javascript": true,
      "javascript:": true
    };
    var slashedProtocol = {
      "http": true,
      "https": true,
      "ftp": true,
      "gopher": true,
      "file": true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    var querystring = require_querystring();
    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && util.isObject(url) && url instanceof Url)
        return url;
      var u = new Url();
      u.parse(url, parseQueryString, slashesDenoteHost);
      return u;
    }
    Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
      if (!util.isString(url)) {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
      }
      var queryIndex = url.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url.indexOf("#") ? "?" : "#", uSplit = url.split(splitter), slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, "/");
      url = uSplit.join(splitter);
      var rest = url;
      rest = rest.trim();
      if (!slashesDenoteHost && url.split("#").length === 1) {
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.path = rest;
          this.href = rest;
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
            if (parseQueryString) {
              this.query = querystring.parse(this.search.substr(1));
            } else {
              this.query = this.search.substr(1);
            }
          } else if (parseQueryString) {
            this.search = "";
            this.query = {};
          }
          return this;
        }
      }
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
        var hostEnd = -1;
        for (var i = 0; i < hostEndingChars.length; i++) {
          var hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        var auth, atSign;
        if (hostEnd === -1) {
          atSign = rest.lastIndexOf("@");
        } else {
          atSign = rest.lastIndexOf("@", hostEnd);
        }
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }
        hostEnd = -1;
        for (var i = 0; i < nonHostChars.length; i++) {
          var hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        if (hostEnd === -1)
          hostEnd = rest.length;
        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        this.parseHost();
        this.hostname = this.hostname || "";
        var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part)
              continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = "";
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  newpart += "x";
                } else {
                  newpart += part[j];
                }
              }
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = "/" + notHost.join(".") + rest;
                }
                this.hostname = validParts.join(".");
                break;
              }
            }
          }
        }
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = "";
        } else {
          this.hostname = this.hostname.toLowerCase();
        }
        if (!ipv6Hostname) {
          this.hostname = punycode.toASCII(this.hostname);
        }
        var p = this.port ? ":" + this.port : "";
        var h = this.hostname || "";
        this.host = h + p;
        this.href += this.host;
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== "/") {
            rest = "/" + rest;
          }
        }
      }
      if (!unsafeProtocol[lowerProto]) {
        for (var i = 0, l = autoEscape.length; i < l; i++) {
          var ae = autoEscape[i];
          if (rest.indexOf(ae) === -1)
            continue;
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }
      var hash = rest.indexOf("#");
      if (hash !== -1) {
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf("?");
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        this.search = "";
        this.query = {};
      }
      if (rest)
        this.pathname = rest;
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = "/";
      }
      if (this.pathname || this.search) {
        var p = this.pathname || "";
        var s = this.search || "";
        this.path = p + s;
      }
      this.href = this.format();
      return this;
    };
    function urlFormat(obj) {
      if (util.isString(obj))
        obj = urlParse(obj);
      if (!(obj instanceof Url))
        return Url.prototype.format.call(obj);
      return obj.format();
    }
    Url.prototype.format = function() {
      var auth = this.auth || "";
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ":");
        auth += "@";
      }
      var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = false, query = "";
      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
        if (this.port) {
          host += ":" + this.port;
        }
      }
      if (this.query && util.isObject(this.query) && Object.keys(this.query).length) {
        query = querystring.stringify(this.query);
      }
      var search = this.search || query && "?" + query || "";
      if (protocol && protocol.substr(-1) !== ":")
        protocol += ":";
      if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = "//" + (host || "");
        if (pathname && pathname.charAt(0) !== "/")
          pathname = "/" + pathname;
      } else if (!host) {
        host = "";
      }
      if (hash && hash.charAt(0) !== "#")
        hash = "#" + hash;
      if (search && search.charAt(0) !== "?")
        search = "?" + search;
      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace("#", "%23");
      return protocol + host + pathname + search + hash;
    };
    function urlResolve(source, relative) {
      return urlParse(source, false, true).resolve(relative);
    }
    Url.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };
    function urlResolveObject(source, relative) {
      if (!source)
        return relative;
      return urlParse(source, false, true).resolveObject(relative);
    }
    Url.prototype.resolveObject = function(relative) {
      if (util.isString(relative)) {
        var rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
      }
      var result = new Url();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }
      result.hash = relative.hash;
      if (relative.href === "") {
        result.href = result.format();
        return result;
      }
      if (relative.slashes && !relative.protocol) {
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== "protocol")
            result[rkey] = relative[rkey];
        }
        if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
          result.path = result.pathname = "/";
        }
        result.href = result.format();
        return result;
      }
      if (relative.protocol && relative.protocol !== result.protocol) {
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v = 0; v < keys.length; v++) {
            var k = keys[v];
            result[k] = relative[k];
          }
          result.href = result.format();
          return result;
        }
        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || "").split("/");
          while (relPath.length && !(relative.host = relPath.shift()))
            ;
          if (!relative.host)
            relative.host = "";
          if (!relative.hostname)
            relative.hostname = "";
          if (relPath[0] !== "")
            relPath.unshift("");
          if (relPath.length < 2)
            relPath.unshift("");
          result.pathname = relPath.join("/");
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || "";
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        if (result.pathname || result.search) {
          var p = result.pathname || "";
          var s = result.search || "";
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }
      var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
      if (psychotic) {
        result.hostname = "";
        result.port = null;
        if (result.host) {
          if (srcPath[0] === "")
            srcPath[0] = result.host;
          else
            srcPath.unshift(result.host);
        }
        result.host = "";
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === "")
              relPath[0] = relative.host;
            else
              relPath.unshift(relative.host);
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
      }
      if (isRelAbs) {
        result.host = relative.host || relative.host === "" ? relative.host : result.host;
        result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
      } else if (relPath.length) {
        if (!srcPath)
          srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (!util.isNullOrUndefined(relative.search)) {
        if (psychotic) {
          result.hostname = result.host = srcPath.shift();
          var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
          result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
        }
        result.href = result.format();
        return result;
      }
      if (!srcPath.length) {
        result.pathname = null;
        if (result.search) {
          result.path = "/" + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
      var up = 0;
      for (var i = srcPath.length; i >= 0; i--) {
        last = srcPath[i];
        if (last === ".") {
          srcPath.splice(i, 1);
        } else if (last === "..") {
          srcPath.splice(i, 1);
          up++;
        } else if (up) {
          srcPath.splice(i, 1);
          up--;
        }
      }
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift("..");
        }
      }
      if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
        srcPath.unshift("");
      }
      if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
        srcPath.push("");
      }
      var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
      if (psychotic) {
        result.hostname = result.host = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
        var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }
      mustEndAbs = mustEndAbs || result.host && srcPath.length;
      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift("");
      }
      if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
      } else {
        result.pathname = srcPath.join("/");
      }
      if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };
    Url.prototype.parseHost = function() {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ":") {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host)
        this.hostname = host;
    };
  }
});

// node_modules/strict-uri-encode/index.js
var require_strict_uri_encode = __commonJS({
  "node_modules/strict-uri-encode/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
      });
    };
  }
});

// ../../node_modules/object-assign/index.js
var require_object_assign = __commonJS({
  "../../node_modules/object-assign/index.js"(exports2, module2) {
    "use strict";
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
          return test2[n];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    module2.exports = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }
      return to;
    };
  }
});

// node_modules/query-string/index.js
var require_query_string = __commonJS({
  "node_modules/query-string/index.js"(exports2) {
    "use strict";
    var strictUriEncode = require_strict_uri_encode();
    var objectAssign = require_object_assign();
    function encoderForArrayFormat(opts) {
      switch (opts.arrayFormat) {
        case "index":
          return function(key, value, index) {
            return value === null ? [
              encode(key, opts),
              "[",
              index,
              "]"
            ].join("") : [
              encode(key, opts),
              "[",
              encode(index, opts),
              "]=",
              encode(value, opts)
            ].join("");
          };
        case "bracket":
          return function(key, value) {
            return value === null ? encode(key, opts) : [
              encode(key, opts),
              "[]=",
              encode(value, opts)
            ].join("");
          };
        default:
          return function(key, value) {
            return value === null ? encode(key, opts) : [
              encode(key, opts),
              "=",
              encode(value, opts)
            ].join("");
          };
      }
    }
    function parserForArrayFormat(opts) {
      var result;
      switch (opts.arrayFormat) {
        case "index":
          return function(key, value, accumulator) {
            result = /\[(\d*)\]$/.exec(key);
            key = key.replace(/\[\d*\]$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = {};
            }
            accumulator[key][result[1]] = value;
          };
        case "bracket":
          return function(key, value, accumulator) {
            result = /(\[\])$/.exec(key);
            key = key.replace(/\[\]$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            } else if (accumulator[key] === void 0) {
              accumulator[key] = [value];
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
        default:
          return function(key, value, accumulator) {
            if (accumulator[key] === void 0) {
              accumulator[key] = value;
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
      }
    }
    function encode(value, opts) {
      if (opts.encode) {
        return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
      }
      return value;
    }
    function keysSorter(input) {
      if (Array.isArray(input)) {
        return input.sort();
      } else if (typeof input === "object") {
        return keysSorter(Object.keys(input)).sort(function(a, b) {
          return Number(a) - Number(b);
        }).map(function(key) {
          return input[key];
        });
      }
      return input;
    }
    exports2.extract = function(str) {
      return str.split("?")[1] || "";
    };
    exports2.parse = function(str, opts) {
      opts = objectAssign({ arrayFormat: "none" }, opts);
      var formatter = parserForArrayFormat(opts);
      var ret = Object.create(null);
      if (typeof str !== "string") {
        return ret;
      }
      str = str.trim().replace(/^(\?|#|&)/, "");
      if (!str) {
        return ret;
      }
      str.split("&").forEach(function(param) {
        var parts = param.replace(/\+/g, " ").split("=");
        var key = parts.shift();
        var val = parts.length > 0 ? parts.join("=") : void 0;
        val = val === void 0 ? null : decodeURIComponent(val);
        formatter(decodeURIComponent(key), val, ret);
      });
      return Object.keys(ret).sort().reduce(function(result, key) {
        var val = ret[key];
        if (Boolean(val) && typeof val === "object" && !Array.isArray(val)) {
          result[key] = keysSorter(val);
        } else {
          result[key] = val;
        }
        return result;
      }, Object.create(null));
    };
    exports2.stringify = function(obj, opts) {
      var defaults = {
        encode: true,
        strict: true,
        arrayFormat: "none"
      };
      opts = objectAssign(defaults, opts);
      var formatter = encoderForArrayFormat(opts);
      return obj ? Object.keys(obj).sort().map(function(key) {
        var val = obj[key];
        if (val === void 0) {
          return "";
        }
        if (val === null) {
          return encode(key, opts);
        }
        if (Array.isArray(val)) {
          var result = [];
          val.slice().forEach(function(val2) {
            if (val2 === void 0) {
              return;
            }
            result.push(formatter(key, val2, result.length));
          });
          return result.join("&");
        }
        return encode(key, opts) + "=" + encode(val, opts);
      }).filter(function(x) {
        return x.length > 0;
      }).join("&") : "";
    };
  }
});

// ../../node_modules/prepend-http/index.js
var require_prepend_http = __commonJS({
  "../../node_modules/prepend-http/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function(url) {
      if (typeof url !== "string") {
        throw new TypeError("Expected a string, got " + typeof url);
      }
      url = url.trim();
      if (/^\.*\/|^(?!localhost)\w+:/.test(url)) {
        return url;
      }
      return url.replace(/^(?!(?:\w+:)?\/\/)/, "http://");
    };
  }
});

// ../../node_modules/is-plain-obj/index.js
var require_is_plain_obj = __commonJS({
  "../../node_modules/is-plain-obj/index.js"(exports2, module2) {
    "use strict";
    var toString = Object.prototype.toString;
    module2.exports = function(x) {
      var prototype;
      return toString.call(x) === "[object Object]" && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
    };
  }
});

// node_modules/sort-keys/index.js
var require_sort_keys = __commonJS({
  "node_modules/sort-keys/index.js"(exports2, module2) {
    "use strict";
    var isPlainObj = require_is_plain_obj();
    module2.exports = function(obj, opts) {
      if (!isPlainObj(obj)) {
        throw new TypeError("Expected a plain object");
      }
      opts = opts || {};
      if (typeof opts === "function") {
        opts = { compare: opts };
      }
      var deep = opts.deep;
      var seenInput = [];
      var seenOutput = [];
      var sortKeys = function(x) {
        var seenIndex = seenInput.indexOf(x);
        if (seenIndex !== -1) {
          return seenOutput[seenIndex];
        }
        var ret = {};
        var keys = Object.keys(x).sort(opts.compare);
        seenInput.push(x);
        seenOutput.push(ret);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var val = x[key];
          ret[key] = deep && isPlainObj(val) ? sortKeys(val) : val;
        }
        return ret;
      };
      return sortKeys(obj);
    };
  }
});

// node_modules/normalize-url/index.js
var require_normalize_url = __commonJS({
  "node_modules/normalize-url/index.js"(exports2, module2) {
    "use strict";
    var url = require_url();
    var punycode = require("punycode");
    var queryString = require_query_string();
    var prependHttp = require_prepend_http();
    var sortKeys = require_sort_keys();
    var objectAssign = require_object_assign();
    var DEFAULT_PORTS = {
      "http:": 80,
      "https:": 443,
      "ftp:": 21
    };
    var slashedProtocol = {
      "http": true,
      "https": true,
      "ftp": true,
      "gopher": true,
      "file": true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    function testParameter(name, filters) {
      return filters.some(function(filter) {
        return filter instanceof RegExp ? filter.test(name) : filter === name;
      });
    }
    module2.exports = function(str, opts) {
      opts = objectAssign({
        normalizeProtocol: true,
        normalizeHttps: false,
        stripFragment: true,
        stripWWW: true,
        removeQueryParameters: [/^utm_\w+/i],
        removeTrailingSlash: true,
        removeDirectoryIndex: false
      }, opts);
      if (typeof str !== "string") {
        throw new TypeError("Expected a string");
      }
      var hasRelativeProtocol = str.indexOf("//") === 0;
      str = prependHttp(str.trim()).replace(/^\/\//, "http://");
      var urlObj = url.parse(str);
      if (opts.normalizeHttps && urlObj.protocol === "https:") {
        urlObj.protocol = "http:";
      }
      if (!urlObj.hostname && !urlObj.pathname) {
        throw new Error("Invalid URL");
      }
      delete urlObj.host;
      delete urlObj.query;
      if (opts.stripFragment) {
        delete urlObj.hash;
      }
      var port = DEFAULT_PORTS[urlObj.protocol];
      if (Number(urlObj.port) === port) {
        delete urlObj.port;
      }
      if (urlObj.pathname) {
        urlObj.pathname = urlObj.pathname.replace(/\/{2,}/g, "/");
      }
      if (urlObj.pathname) {
        urlObj.pathname = decodeURI(urlObj.pathname);
      }
      if (opts.removeDirectoryIndex === true) {
        opts.removeDirectoryIndex = [/^index\.[a-z]+$/];
      }
      if (Array.isArray(opts.removeDirectoryIndex) && opts.removeDirectoryIndex.length) {
        var pathComponents = urlObj.pathname.split("/");
        var lastComponent = pathComponents[pathComponents.length - 1];
        if (testParameter(lastComponent, opts.removeDirectoryIndex)) {
          pathComponents = pathComponents.slice(0, pathComponents.length - 1);
          urlObj.pathname = pathComponents.slice(1).join("/") + "/";
        }
      }
      if (slashedProtocol[urlObj.protocol]) {
        var domain = urlObj.protocol + "//" + urlObj.hostname;
        var relative = url.resolve(domain, urlObj.pathname);
        urlObj.pathname = relative.replace(domain, "");
      }
      if (urlObj.hostname) {
        urlObj.hostname = punycode.toUnicode(urlObj.hostname).toLowerCase();
        urlObj.hostname = urlObj.hostname.replace(/\.$/, "");
        if (opts.stripWWW) {
          urlObj.hostname = urlObj.hostname.replace(/^www\./, "");
        }
      }
      if (urlObj.search === "?") {
        delete urlObj.search;
      }
      var queryParameters = queryString.parse(urlObj.search);
      if (Array.isArray(opts.removeQueryParameters)) {
        for (var key in queryParameters) {
          if (testParameter(key, opts.removeQueryParameters)) {
            delete queryParameters[key];
          }
        }
      }
      urlObj.search = queryString.stringify(sortKeys(queryParameters));
      urlObj.search = decodeURIComponent(urlObj.search);
      str = url.format(urlObj);
      if (opts.removeTrailingSlash || urlObj.pathname === "/") {
        str = str.replace(/\/$/, "");
      }
      if (hasRelativeProtocol && !opts.normalizeProtocol) {
        str = str.replace(/^http:\/\//, "//");
      }
      return str;
    };
  }
});

// src/webpack/plugins/mini-css-extract-plugin/src/hmr/hotModuleReplacement.js
var normalizeUrl = require_normalize_url();
var srcByModuleId = Object.create(null);
var noDocument = typeof document === "undefined";
var forEach = Array.prototype.forEach;
function debounce(fn, time) {
  let timeout = 0;
  return function() {
    const self = this;
    const args = arguments;
    const functionCall = function functionCall2() {
      return fn.apply(self, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}
function noop() {
}
function getCurrentScriptUrl(moduleId) {
  let src = srcByModuleId[moduleId];
  if (!src) {
    if (document.currentScript) {
      src = document.currentScript.src;
    } else {
      const scripts = document.getElementsByTagName("script");
      const lastScriptTag = scripts[scripts.length - 1];
      if (lastScriptTag) {
        src = lastScriptTag.src;
      }
    }
    srcByModuleId[moduleId] = src;
  }
  return function(fileMap) {
    if (!src) {
      return null;
    }
    const splitResult = src.split(/([^\\/]+)\.js$/);
    const filename = splitResult && splitResult[1];
    if (!filename) {
      return [src.replace(".js", ".css")];
    }
    if (!fileMap) {
      return [src.replace(".js", ".css")];
    }
    return fileMap.split(",").map(function(mapRule) {
      const reg = new RegExp("${filename}\\.js$", "g");
      return normalizeUrl(src.replace(reg, mapRule.replace(/{fileName}/g, filename) + ".css"), { stripWWW: false });
    });
  };
}
function updateCss(el, url) {
  if (!url) {
    if (!el.href) {
      return;
    }
    url = el.href.split("?")[0];
  }
  if (!isUrlRequest(url)) {
    return;
  }
  if (el.isLoaded === false) {
    return;
  }
  if (!url || !(url.indexOf(".css") > -1)) {
    return;
  }
  el.visited = true;
  const newEl = el.cloneNode();
  newEl.isLoaded = false;
  newEl.addEventListener("load", function() {
    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });
  newEl.addEventListener("error", function() {
    newEl.isLoaded = true;
    el.parentNode.removeChild(el);
  });
  newEl.href = url + "?" + Date.now();
  if (el.nextSibling) {
    el.parentNode.insertBefore(newEl, el.nextSibling);
  } else {
    el.parentNode.appendChild(newEl);
  }
}
function getReloadUrl(href, src) {
  let ret;
  href = normalizeUrl(href, { stripWWW: false });
  src.some(function(url) {
    if (href.indexOf(src) > -1) {
      ret = url;
    }
  });
  return ret;
}
function reloadStyle(src) {
  const elements = document.querySelectorAll("link");
  let loaded = false;
  forEach.call(elements, function(el) {
    if (!el.href) {
      return;
    }
    const url = getReloadUrl(el.href, src);
    if (!isUrlRequest(url)) {
      return;
    }
    if (el.visited === true) {
      return;
    }
    if (url) {
      updateCss(el, url);
      loaded = true;
    }
  });
  return loaded;
}
function reloadAll() {
  const elements = document.querySelectorAll("link");
  forEach.call(elements, function(el) {
    if (el.visited === true) {
      return;
    }
    updateCss(el);
  });
}
function isUrlRequest(url) {
  if (!/^https?:/i.test(url)) {
    return false;
  }
  return true;
}
module.exports = function(moduleId, options) {
  if (noDocument) {
    console.log("no window.document found, will not HMR CSS");
    return noop;
  }
  const getScriptSrc = getCurrentScriptUrl(moduleId);
  function update() {
    const src = getScriptSrc(options.filename);
    const reloaded = reloadStyle(src);
    if (options.locals) {
      console.log("[HMR] Detected local css modules. Reload all css");
      reloadAll();
      return;
    }
    if (reloaded && !options.reloadAll) {
      console.log("[HMR] css reload %s", src.join(" "));
    } else {
      console.log("[HMR] Reload all css");
      reloadAll();
    }
  }
  return debounce(update, 50);
};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
