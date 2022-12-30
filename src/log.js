const Log = require('./node.js')

const loggers = {}

/** @param {string} namespace */
function log (namespace) {
  let log = loggers[namespace]
  if (!log) {
    log = loggers[namespace] = new Log(namespace)
  }
  return log
}

module.exports = log
