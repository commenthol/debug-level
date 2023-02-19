const { browserLogs } = require('../..')
const loggerMw = browserLogs()

function factory () {
  return function (req, res, next) {
    if (/^\/logger/.test(req.url)) {
      req.ip = req.ip || req.connection.remoteAddress
      loggerMw(req, res)
    } else {
      next()
    }
  }
}

module.exports = factory
