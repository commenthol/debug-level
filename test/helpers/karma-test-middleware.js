const middleware = require('../../src/middleware')()

function factory () {
  return function (req, res, next) {
    if (/^\/logger/.test(req.url)) {
      req.ip = req.ip || req.connection.remoteAddress
      middleware(req, res)
    } else {
      next()
    }
  }
}

module.exports = factory
