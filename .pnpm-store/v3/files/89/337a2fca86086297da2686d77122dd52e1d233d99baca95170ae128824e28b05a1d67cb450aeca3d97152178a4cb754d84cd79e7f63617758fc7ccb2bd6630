'use strict'

const debug = require('debug')('lint-staged:git')
const execa = require('execa')

module.exports = async function execGit(cmd, options = {}) {
  debug('Running git command', cmd)
  const { stdout } = await execa('git', [].concat(cmd), {
    ...options,
    cwd: options.cwd || process.cwd()
  })
  return stdout
}
