const Log = require('../..')
const logger = Log.logger()

function factory () {
  return function (req, res, next) {
    if (/^\/logger/.test(req.url)) {
      req.ip = req.ip || req.connection.remoteAddress
      logger(req, res)
    } else {
      next()
    }
  }
}

module.exports = factory
