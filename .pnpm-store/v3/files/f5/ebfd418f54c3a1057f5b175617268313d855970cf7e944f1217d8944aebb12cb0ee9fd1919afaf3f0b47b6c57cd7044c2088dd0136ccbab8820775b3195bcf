'use strict'

const dedent = require('dedent')
const cosmiconfig = require('cosmiconfig')
const stringifyObject = require('stringify-object')
const printErrors = require('./printErrors')
const runAll = require('./runAll')
const validateConfig = require('./validateConfig')

const debugLog = require('debug')('lint-staged')

const errConfigNotFound = new Error('Config could not be found')

function resolveConfig(configPath) {
  try {
    return require.resolve(configPath)
  } catch (ignore) {
    return configPath
  }
}

function loadConfig(configPath) {
  const explorer = cosmiconfig('lint-staged', {
    searchPlaces: [
      'package.json',
      '.lintstagedrc',
      '.lintstagedrc.json',
      '.lintstagedrc.yaml',
      '.lintstagedrc.yml',
      '.lintstagedrc.js',
      'lint-staged.config.js'
    ]
  })

  return configPath ? explorer.load(resolveConfig(configPath)) : explorer.search()
}

/**
 * @typedef {(...any) => void} LogFunction
 * @typedef {{ error: LogFunction, log: LogFunction, warn: LogFunction }} Logger
 *
 * Root lint-staged function that is called from `bin/lint-staged`.
 *
 * @param {object} options
 * @param {string} [options.configPath] - Path to configuration file
 * @param {object}  [options.config] - Object with configuration for programmatic API
 * @param {boolean} [options.relative] - Pass relative filepaths to tasks
 * @param {boolean} [options.shell] - Skip parsing of tasks for better shell support
 * @param {boolean} [options.quiet] - Disable lint-staged’s own console output
 * @param {boolean} [options.debug] - Enable debug mode
 * @param {Logger} [logger]
 *
 * @returns {Promise<boolean>} Promise of whether the linting passed or failed
 */
module.exports = function lintStaged(
  { configPath, config, relative = false, shell = false, quiet = false, debug = false } = {},
  logger = console
) {
  debugLog('Loading config using `cosmiconfig`')

  return (config ? Promise.resolve({ config, filepath: '(input)' }) : loadConfig(configPath))
    .then(result => {
      if (result == null) throw errConfigNotFound

      debugLog('Successfully loaded config from `%s`:\n%O', result.filepath, result.config)
      // result.config is the parsed configuration object
      // result.filepath is the path to the config file that was found
      const config = validateConfig(result.config)
      if (debug) {
        // Log using logger to be able to test through `consolemock`.
        logger.log('Running lint-staged with the following config:')
        logger.log(stringifyObject(config, { indent: '  ' }))
      } else {
        // We might not be in debug mode but `DEBUG=lint-staged*` could have
        // been set.
        debugLog('lint-staged config:\n%O', config)
      }

      return runAll({ config, relative, shell, quiet, debug }, logger)
        .then(() => {
          debugLog('tasks were executed successfully!')
          return Promise.resolve(true)
        })
        .catch(error => {
          printErrors(error, logger)
          return Promise.resolve(false)
        })
    })
    .catch(err => {
      if (err === errConfigNotFound) {
        logger.error(`${err.message}.`)
      } else {
        // It was probably a parsing error
        logger.error(dedent`
          Could not parse lint-staged config.

          ${err}
        `)
      }
      logger.error() // empty line
      // Print helpful message for all errors
      logger.error(dedent`
        Please make sure you have created it correctly.
        See https://github.com/okonet/lint-staged#configuration.
      `)

      return Promise.reject(err)
    })
}
