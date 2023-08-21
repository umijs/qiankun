const { getRefreshGlobalScope } = require('../globals');
const getRefreshGlobal = require('./getRefreshGlobal');

/**
 * Makes a runtime module to intercept module execution for React Refresh.
 * @param {import('webpack')} webpack The Webpack exports.
 * @returns {ReactRefreshRuntimeModule} The runtime module class.
 */
function makeRefreshRuntimeModule(webpack) {
  return class ReactRefreshRuntimeModule extends webpack.RuntimeModule {
    constructor() {
      // Second argument is the `stage` for this runtime module -
      // we'll use the same stage as Webpack's HMR runtime module for safety.
      super('react refresh', webpack.RuntimeModule.STAGE_BASIC);
    }

    /**
     * @returns {string} runtime code
     */
    generate() {
      const { runtimeTemplate } = this.compilation;
      const refreshGlobal = getRefreshGlobalScope(webpack.RuntimeGlobals);
      return webpack.Template.asString([
        `${webpack.RuntimeGlobals.interceptModuleExecution}.push(${runtimeTemplate.basicFunction(
          'options',
          [
            `${
              runtimeTemplate.supportsConst() ? 'const' : 'var'
            } originalFactory = options.factory;`,
            `options.factory = function (moduleObject, moduleExports, webpackRequire) {`,
            webpack.Template.indent([
              `${refreshGlobal}.setup(options.id);`,
              'try {',
              webpack.Template.indent(
                'originalFactory.call(this, moduleObject, moduleExports, webpackRequire);'
              ),
              '} finally {',
              webpack.Template.indent([
                `if (typeof Promise !== 'undefined' && moduleObject.exports instanceof Promise) {`,
                webpack.Template.indent([
                  // The exports of the module are re-assigned -
                  // this ensures anything coming after us would wait for `cleanup` to fire.
                  // This is particularly important because `cleanup` restores the refresh global,
                  // maintaining consistency for mutable variables like `moduleId`.
                  // This `.then` clause is a ponyfill of the `Promise.finally` API -
                  // it is only part of the spec after ES2018,
                  // but Webpack's top level await implementation support engines down to ES2015.
                  'options.module.exports = options.module.exports.then(',
                  webpack.Template.indent([
                    `${runtimeTemplate.basicFunction('result', [
                      `${refreshGlobal}.cleanup(options.id);`,
                      'return result;',
                    ])},`,
                    runtimeTemplate.basicFunction('reason', [
                      `${refreshGlobal}.cleanup(options.id);`,
                      'return Promise.reject(reason);',
                    ]),
                  ]),
                  `);`,
                ]),
                '} else {',
                webpack.Template.indent(`${refreshGlobal}.cleanup(options.id)`),
                '}',
              ]),
              '}',
            ]),
            `};`,
          ]
        )})`,
        '',
        getRefreshGlobal(webpack.Template, webpack.RuntimeGlobals, runtimeTemplate),
      ]);
    }
  };
}

module.exports = makeRefreshRuntimeModule;
