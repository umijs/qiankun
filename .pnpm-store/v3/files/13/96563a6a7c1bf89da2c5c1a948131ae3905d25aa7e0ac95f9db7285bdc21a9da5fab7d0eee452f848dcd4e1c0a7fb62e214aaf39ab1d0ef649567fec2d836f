const { getRefreshGlobalScope } = require('../globals');

/**
 * @typedef {Object} RuntimeTemplate
 * @property {function(string, string[]): string} basicFunction
 * @property {function(): boolean} supportsConst
 * @property {function(string, string=): string} returningFunction
 */

/**
 * Generates the refresh global runtime template.
 * @param {import('webpack').Template} Template The template helpers.
 * @param {Record<string, string>} [RuntimeGlobals] The runtime globals.
 * @param {RuntimeTemplate} [RuntimeTemplate] The runtime template helpers.
 * @returns {string} The refresh global runtime template.
 */
function getRefreshGlobal(
  Template,
  RuntimeGlobals = {},
  RuntimeTemplate = {
    basicFunction(args, body) {
      return `function(${args}) {\n${Template.indent(body)}\n}`;
    },
    supportsConst() {
      return false;
    },
    returningFunction(returnValue, args = '') {
      return `function(${args}) { return ${returnValue}; }`;
    },
  }
) {
  const declaration = RuntimeTemplate.supportsConst() ? 'const' : 'var';
  const refreshGlobal = getRefreshGlobalScope(RuntimeGlobals);
  return Template.asString([
    `${refreshGlobal} = {`,
    Template.indent([
      // Initialise the global with stubs.
      // This is to ensure unwanted calls to these functions would not error out.
      // If the module is processed by our loader,
      // they will be mutated in place during module initialisation by the `setup` function below.
      `register: ${RuntimeTemplate.returningFunction('undefined')},`,
      `signature: ${RuntimeTemplate.returningFunction(
        RuntimeTemplate.returningFunction('type', 'type')
      )},`,
      `setup: ${RuntimeTemplate.basicFunction('currentModuleId', [
        // Store all previous values for fields on `refreshGlobal` -
        // this allows proper restoration in the `cleanup` phase.
        `${declaration} prevModuleId = ${refreshGlobal}.moduleId;`,
        `${declaration} prevRuntime = ${refreshGlobal}.runtime;`,
        `${declaration} prevRegister = ${refreshGlobal}.register;`,
        `${declaration} prevSignature = ${refreshGlobal}.signature;`,
        `${declaration} prevCleanup = ${refreshGlobal}.cleanup;`,
        '',
        `${refreshGlobal}.moduleId = currentModuleId;`,
        '',
        // Initialise the runtime with stubs.
        // If the module is processed by our loader,
        // they will be mutated in place during module initialisation.
        `${refreshGlobal}.runtime = {`,
        Template.indent([
          `createSignatureFunctionForTransform: ${RuntimeTemplate.returningFunction(
            RuntimeTemplate.returningFunction('type', 'type')
          )},`,
          `register: ${RuntimeTemplate.returningFunction('undefined')}`,
        ]),
        '};',
        '',
        `${refreshGlobal}.register = ${RuntimeTemplate.basicFunction('type, id', [
          `${declaration} typeId = currentModuleId + " " + id;`,
          `${refreshGlobal}.runtime.register(type, typeId);`,
        ])}`,
        '',
        `${refreshGlobal}.signature = ${refreshGlobal}.runtime.createSignatureFunctionForTransform;`,
        '',
        `${refreshGlobal}.cleanup = ${RuntimeTemplate.basicFunction('cleanupModuleId', [
          // Only cleanup if the module IDs match.
          // In rare cases, it might get called in another module's `cleanup` phase.
          'if (currentModuleId === cleanupModuleId) {',
          Template.indent([
            `${refreshGlobal}.moduleId = prevModuleId;`,
            `${refreshGlobal}.runtime = prevRuntime;`,
            `${refreshGlobal}.register = prevRegister;`,
            `${refreshGlobal}.signature = prevSignature;`,
            `${refreshGlobal}.cleanup = prevCleanup;`,
          ]),
          '}',
        ])}`,
      ])}`,
    ]),
    '};',
  ]);
}

module.exports = getRefreshGlobal;
