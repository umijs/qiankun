'use strict'

const execGit = require('./execGit')
const normalize = require('normalize-path')

module.exports = async function resolveGitDir(options = {}) {
  try {
    // git cli uses GIT_DIR to fast track its response however it might be set to a different path
    // depending on where the caller initiated this from, hence clear GIT_DIR
    delete process.env.GIT_DIR
    const gitDir = await execGit(['rev-parse', '--show-toplevel'], options)
    return normalize(gitDir)
  } catch (error) {
    return null
  }
}
