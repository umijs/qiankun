'use strict'

const chalk = require('chalk')
const dedent = require('dedent')
const execa = require('execa')
const symbols = require('log-symbols')
const stringArgv = require('string-argv')

const debug = require('debug')('lint-staged:task')

/**
 * Execute the given linter cmd using execa and
 * return the promise.
 *
 * @param {string} cmd
 * @param {Array<string>} args
 * @param {Object} execaOptions
 * @return {Promise} child_process
 */
const execLinter = (cmd, args, execaOptions) => {
  debug('cmd:', cmd)
  if (args) debug('args:', args)
  debug('execaOptions:', execaOptions)

  return args ? execa(cmd, args, execaOptions) : execa(cmd, execaOptions)
}

const successMsg = linter => `${symbols.success} ${linter} passed!`

/**
 * Create and returns an error instance with a given message.
 * If we set the message on the error instance, it gets logged multiple times(see #142).
 * So we set the actual error message in a private field and extract it later,
 * log only once.
 *
 * @param {string} message
 * @returns {Error}
 */
function throwError(message) {
  const err = new Error()
  err.privateMsg = `\n\n\n${message}`
  return err
}

/**
 * Create a failure message dependding on process result.
 *
 * @param {string} linter
 * @param {Object} result
 * @param {string} result.stdout
 * @param {string} result.stderr
 * @param {boolean} result.failed
 * @param {boolean} result.killed
 * @param {string} result.signal
 * @param {Object} context (see https://github.com/SamVerschueren/listr#context)
 * @returns {Error}
 */
function makeErr(linter, result, context = {}) {
  // Indicate that some linter will fail so we don't update the index with formatting changes
  context.hasErrors = true // eslint-disable-line no-param-reassign
  const { stdout, stderr, killed, signal } = result
  if (killed || (signal && signal !== '')) {
    return throwError(
      `${symbols.warning} ${chalk.yellow(`${linter} was terminated with ${signal}`)}`
    )
  }
  return throwError(dedent`${symbols.error} ${chalk.redBright(
    `${linter} found some errors. Please fix them and try committing again.`
  )}
  ${stdout}
  ${stderr}
  `)
}

/**
 * Returns the task function for the linter. It handles chunking for file paths
 * if the OS is Windows.
 *
 * @param {Object} options
 * @param {string} options.command — Linter task
 * @param {String} options.gitDir - Current git repo path
 * @param {Boolean} options.isFn - Whether the linter task is a function
 * @param {Array<string>} options.pathsToLint — Filepaths to run the linter task against
 * @param {Boolean} [options.relative] — Whether the filepaths should be relative
 * @param {Boolean} [options.shell] — Whether to skip parsing linter task for better shell support
 * @returns {function(): Promise<Array<string>>}
 */
module.exports = function resolveTaskFn({ command, files, gitDir, isFn, relative, shell = false }) {
  const execaOptions = { preferLocal: true, reject: false, shell }

  if (relative) {
    execaOptions.cwd = process.cwd()
  } else if (/^git(\.exe)?/i.test(command) && gitDir !== process.cwd()) {
    // Only use gitDir as CWD if we are using the git binary
    // e.g `npm` should run tasks in the actual CWD
    execaOptions.cwd = gitDir
  }

  let cmd
  let args

  if (shell) {
    execaOptions.shell = true
    // If `shell`, passed command shouldn't be parsed
    // If `linter` is a function, command already includes `files`.
    cmd = isFn ? command : `${command} ${files.join(' ')}`
  } else {
    const [parsedCmd, ...parsedArgs] = stringArgv.parseArgsStringToArgv(command)
    cmd = parsedCmd
    args = isFn ? parsedArgs : parsedArgs.concat(files)
  }

  return ctx =>
    execLinter(cmd, args, execaOptions).then(result => {
      if (result.failed || result.killed || result.signal != null) {
        throw makeErr(command, result, ctx)
      }

      return successMsg(command)
    })
}
