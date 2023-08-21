'use strict'

// istanbul ignore next
// Work-around for duplicated error logs, see #142
const errMsg = err => (err.privateMsg != null ? err.privateMsg : err.message)

module.exports = function printErrors(errorInstance, logger) {
  if (Array.isArray(errorInstance.errors)) {
    errorInstance.errors.forEach(lintError => {
      logger.error(errMsg(lintError))
    })
  } else {
    logger.error(errMsg(errorInstance))
  }
}
