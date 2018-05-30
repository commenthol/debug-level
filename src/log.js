const Log = require('./node')

const loggers = {}

function log (namespace) {
  let log = loggers[namespace]
  if (!log) loggers[namespace] = log = new Log(namespace)
  return log
}

module.exports = log
