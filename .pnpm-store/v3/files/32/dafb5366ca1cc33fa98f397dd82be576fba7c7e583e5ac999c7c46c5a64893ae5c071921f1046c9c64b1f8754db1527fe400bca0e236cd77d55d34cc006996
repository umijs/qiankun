/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-08-15 11:37
 */
import processTpl, { genLinkReplaceSymbol, genScriptReplaceSymbol } from './process-tpl';
import { defaultGetPublicPath, evalCode, getGlobalProp, getInlineCode, noteGlobalProps, readResAsString, requestIdleCallback } from './utils';
var styleCache = {};
var scriptCache = {};
var embedHTMLCache = {};

if (!window.fetch) {
  throw new Error('[import-html-entry] Here is no "fetch" on the window env, you need to polyfill it');
}

var defaultFetch = window.fetch.bind(window);

function defaultGetTemplate(tpl) {
  return tpl;
}
/**
 * convert external css link to inline style for performance optimization
 * @param template
 * @param styles
 * @param opts
 * @return embedHTML
 */


function getEmbedHTML(template, styles) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _opts$fetch = opts.fetch,
      fetch = _opts$fetch === void 0 ? defaultFetch : _opts$fetch;
  var embedHTML = template;
  return _getExternalStyleSheets(styles, fetch).then(function (styleSheets) {
    embedHTML = styles.reduce(function (html, styleSrc, i) {
      html = html.replace(genLinkReplaceSymbol(styleSrc), "<style>/* ".concat(styleSrc, " */").concat(styleSheets[i], "</style>"));
      return html;
    }, embedHTML);
    return embedHTML;
  });
}

var isInlineCode = function isInlineCode(code) {
  return code.startsWith('<');
};

function getExecutableScript(scriptSrc, scriptText, proxy, strictGlobal) {
  var sourceUrl = isInlineCode(scriptSrc) ? '' : "//# sourceURL=".concat(scriptSrc, "\n"); // 通过这种方式获取全局 window，因为 script 也是在全局作用域下运行的，所以我们通过 window.proxy 绑定时也必须确保绑定到全局 window 上
  // 否则在嵌套场景下， window.proxy 设置的是内层应用的 window，而代码其实是在全局作用域运行的，会导致闭包里的 window.proxy 取的是最外层的微应用的 proxy

  var globalWindow = (0, eval)('window');
  globalWindow.proxy = proxy; // TODO 通过 strictGlobal 方式切换 with 闭包，待 with 方式坑趟平后再合并

  return strictGlobal ? ";(function(window, self, globalThis){with(window){;".concat(scriptText, "\n").concat(sourceUrl, "}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);") : ";(function(window, self, globalThis){;".concat(scriptText, "\n").concat(sourceUrl, "}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);");
} // for prefetch


function _getExternalStyleSheets(styles) {
  var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFetch;
  return Promise.all(styles.map(function (styleLink) {
    if (isInlineCode(styleLink)) {
      // if it is inline style
      return getInlineCode(styleLink);
    } else {
      // external styles
      return styleCache[styleLink] || (styleCache[styleLink] = fetch(styleLink).then(function (response) {
        return response.text();
      }));
    }
  }));
} // for prefetch


export { _getExternalStyleSheets as getExternalStyleSheets };

function _getExternalScripts(scripts) {
  var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFetch;
  var errorCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  var fetchScript = function fetchScript(scriptUrl) {
    return scriptCache[scriptUrl] || (scriptCache[scriptUrl] = fetch(scriptUrl).then(function (response) {
      // usually browser treats 4xx and 5xx response of script loading as an error and will fire a script error event
      // https://stackoverflow.com/questions/5625420/what-http-headers-responses-trigger-the-onerror-handler-on-a-script-tag/5625603
      if (response.status >= 400) {
        errorCallback();
        throw new Error("".concat(scriptUrl, " load failed with status ").concat(response.status));
      }

      return response.text();
    })["catch"](function (e) {
      errorCallback();
      throw e;
    }));
  };

  return Promise.all(scripts.map(function (script) {
    if (typeof script === 'string') {
      if (isInlineCode(script)) {
        // if it is inline script
        return getInlineCode(script);
      } else {
        // external script
        return fetchScript(script);
      }
    } else {
      // use idle time to load async script
      var src = script.src,
          async = script.async;

      if (async) {
        return {
          src: src,
          async: true,
          content: new Promise(function (resolve, reject) {
            return requestIdleCallback(function () {
              return fetchScript(src).then(resolve, reject);
            });
          })
        };
      }

      return fetchScript(src);
    }
  }));
}

export { _getExternalScripts as getExternalScripts };

function throwNonBlockingError(error, msg) {
  setTimeout(function () {
    console.error(msg);
    throw error;
  });
}

var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';
/**
 * FIXME to consistent with browser behavior, we should only provide callback way to invoke success and error event
 * @param entry
 * @param scripts
 * @param proxy
 * @param opts
 * @returns {Promise<unknown>}
 */

function _execScripts(entry, scripts) {
  var proxy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _opts$fetch2 = opts.fetch,
      fetch = _opts$fetch2 === void 0 ? defaultFetch : _opts$fetch2,
      _opts$strictGlobal = opts.strictGlobal,
      strictGlobal = _opts$strictGlobal === void 0 ? false : _opts$strictGlobal,
      success = opts.success,
      _opts$error = opts.error,
      error = _opts$error === void 0 ? function () {} : _opts$error,
      _opts$beforeExec = opts.beforeExec,
      beforeExec = _opts$beforeExec === void 0 ? function () {} : _opts$beforeExec,
      _opts$afterExec = opts.afterExec,
      afterExec = _opts$afterExec === void 0 ? function () {} : _opts$afterExec;
  return _getExternalScripts(scripts, fetch, error).then(function (scriptsText) {
    var geval = function geval(scriptSrc, inlineScript) {
      var rawCode = beforeExec(inlineScript, scriptSrc) || inlineScript;
      var code = getExecutableScript(scriptSrc, rawCode, proxy, strictGlobal);
      evalCode(scriptSrc, code);
      afterExec(inlineScript, scriptSrc);
    };

    function exec(scriptSrc, inlineScript, resolve) {
      var markName = "Evaluating script ".concat(scriptSrc);
      var measureName = "Evaluating Time Consuming: ".concat(scriptSrc);

      if (process.env.NODE_ENV === 'development' && supportsUserTiming) {
        performance.mark(markName);
      }

      if (scriptSrc === entry) {
        noteGlobalProps(strictGlobal ? proxy : window);

        try {
          // bind window.proxy to change `this` reference in script
          geval(scriptSrc, inlineScript);
          var exports = proxy[getGlobalProp(strictGlobal ? proxy : window)] || {};
          resolve(exports);
        } catch (e) {
          // entry error must be thrown to make the promise settled
          console.error("[import-html-entry]: error occurs while executing entry script ".concat(scriptSrc));
          throw e;
        }
      } else {
        if (typeof inlineScript === 'string') {
          try {
            // bind window.proxy to change `this` reference in script
            geval(scriptSrc, inlineScript);
          } catch (e) {
            // consistent with browser behavior, any independent script evaluation error should not block the others
            throwNonBlockingError(e, "[import-html-entry]: error occurs while executing normal script ".concat(scriptSrc));
          }
        } else {
          // external script marked with async
          inlineScript.async && (inlineScript === null || inlineScript === void 0 ? void 0 : inlineScript.content.then(function (downloadedScriptText) {
            return geval(inlineScript.src, downloadedScriptText);
          })["catch"](function (e) {
            throwNonBlockingError(e, "[import-html-entry]: error occurs while executing async script ".concat(inlineScript.src));
          }));
        }
      }

      if (process.env.NODE_ENV === 'development' && supportsUserTiming) {
        performance.measure(measureName, markName);
        performance.clearMarks(markName);
        performance.clearMeasures(measureName);
      }
    }

    function schedule(i, resolvePromise) {
      if (i < scripts.length) {
        var scriptSrc = scripts[i];
        var inlineScript = scriptsText[i];
        exec(scriptSrc, inlineScript, resolvePromise); // resolve the promise while the last script executed and entry not provided

        if (!entry && i === scripts.length - 1) {
          resolvePromise();
        } else {
          schedule(i + 1, resolvePromise);
        }
      }
    }

    return new Promise(function (resolve) {
      return schedule(0, success || resolve);
    });
  });
}

export { _execScripts as execScripts };
export default function importHTML(url) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fetch = defaultFetch;
  var autoDecodeResponse = false;
  var getPublicPath = defaultGetPublicPath;
  var getTemplate = defaultGetTemplate;
  var postProcessTemplate = opts.postProcessTemplate; // compatible with the legacy importHTML api

  if (typeof opts === 'function') {
    fetch = opts;
  } else {
    // fetch option is availble
    if (opts.fetch) {
      // fetch is a funciton
      if (typeof opts.fetch === 'function') {
        fetch = opts.fetch;
      } else {
        // configuration
        fetch = opts.fetch.fn || defaultFetch;
        autoDecodeResponse = !!opts.fetch.autoDecodeResponse;
      }
    }

    getPublicPath = opts.getPublicPath || opts.getDomain || defaultGetPublicPath;
    getTemplate = opts.getTemplate || defaultGetTemplate;
  }

  return embedHTMLCache[url] || (embedHTMLCache[url] = fetch(url).then(function (response) {
    return readResAsString(response, autoDecodeResponse);
  }).then(function (html) {
    var assetPublicPath = getPublicPath(url);

    var _processTpl = processTpl(getTemplate(html), assetPublicPath, postProcessTemplate),
        template = _processTpl.template,
        scripts = _processTpl.scripts,
        entry = _processTpl.entry,
        styles = _processTpl.styles;

    return getEmbedHTML(template, styles, {
      fetch: fetch
    }).then(function (embedHTML) {
      return {
        template: embedHTML,
        assetPublicPath: assetPublicPath,
        getExternalScripts: function getExternalScripts() {
          return _getExternalScripts(scripts, fetch);
        },
        getExternalStyleSheets: function getExternalStyleSheets() {
          return _getExternalStyleSheets(styles, fetch);
        },
        execScripts: function execScripts(proxy, strictGlobal) {
          var execScriptsHooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

          if (!scripts.length) {
            return Promise.resolve();
          }

          return _execScripts(entry, scripts, proxy, {
            fetch: fetch,
            strictGlobal: strictGlobal,
            beforeExec: execScriptsHooks.beforeExec,
            afterExec: execScriptsHooks.afterExec
          });
        }
      };
    });
  }));
}
export function importEntry(entry) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _opts$fetch3 = opts.fetch,
      fetch = _opts$fetch3 === void 0 ? defaultFetch : _opts$fetch3,
      _opts$getTemplate = opts.getTemplate,
      getTemplate = _opts$getTemplate === void 0 ? defaultGetTemplate : _opts$getTemplate,
      postProcessTemplate = opts.postProcessTemplate;
  var getPublicPath = opts.getPublicPath || opts.getDomain || defaultGetPublicPath;

  if (!entry) {
    throw new SyntaxError('entry should not be empty!');
  } // html entry


  if (typeof entry === 'string') {
    return importHTML(entry, {
      fetch: fetch,
      getPublicPath: getPublicPath,
      getTemplate: getTemplate,
      postProcessTemplate: postProcessTemplate
    });
  } // config entry


  if (Array.isArray(entry.scripts) || Array.isArray(entry.styles)) {
    var _entry$scripts = entry.scripts,
        scripts = _entry$scripts === void 0 ? [] : _entry$scripts,
        _entry$styles = entry.styles,
        styles = _entry$styles === void 0 ? [] : _entry$styles,
        _entry$html = entry.html,
        html = _entry$html === void 0 ? '' : _entry$html;

    var getHTMLWithStylePlaceholder = function getHTMLWithStylePlaceholder(tpl) {
      return styles.reduceRight(function (html, styleSrc) {
        return "".concat(genLinkReplaceSymbol(styleSrc)).concat(html);
      }, tpl);
    };

    var getHTMLWithScriptPlaceholder = function getHTMLWithScriptPlaceholder(tpl) {
      return scripts.reduce(function (html, scriptSrc) {
        return "".concat(html).concat(genScriptReplaceSymbol(scriptSrc));
      }, tpl);
    };

    return getEmbedHTML(getTemplate(getHTMLWithScriptPlaceholder(getHTMLWithStylePlaceholder(html))), styles, {
      fetch: fetch
    }).then(function (embedHTML) {
      return {
        template: embedHTML,
        assetPublicPath: getPublicPath(entry),
        getExternalScripts: function getExternalScripts() {
          return _getExternalScripts(scripts, fetch);
        },
        getExternalStyleSheets: function getExternalStyleSheets() {
          return _getExternalStyleSheets(styles, fetch);
        },
        execScripts: function execScripts(proxy, strictGlobal) {
          var execScriptsHooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

          if (!scripts.length) {
            return Promise.resolve();
          }

          return _execScripts(scripts[scripts.length - 1], scripts, proxy, {
            fetch: fetch,
            strictGlobal: strictGlobal,
            beforeExec: execScriptsHooks.beforeExec,
            afterExec: execScriptsHooks.afterExec
          });
        }
      };
    });
  } else {
    throw new SyntaxError('entry scripts or styles should be array!');
  }
}