const { parse: urlParse } = require('url')
const { parse: qsParse } = require('querystring')
const MapLRU = require('map-lru').default
const Log = require('./node')
const { adjustLevel, DEBUG } = require('./utils')

// https://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

class Loggers {
  constructor (maxSize = 100) {
    this.cache = new MapLRU(maxSize)
  }

  get (name) {
    let log = this.cache.get(name)
    if (!log) {
      log = new Log(name)
      this.cache.set(name, log)
    }
    return log
  }
}

// custom logger to use formatter and stream
function CustomLog () {
  Log.call(this, '---')
}
Object.setPrototypeOf(CustomLog.prototype, Log.prototype)
CustomLog.prototype.log = function (obj) {
  const str = this.formatter.format(obj)
  this.render(str)
}

module.exports = middleware

/**
 * connect middleware which logs browser based logs on server side
 * sends a transparent gif as response
 * @param {Object} [opts]
 * @param {Object} [opts.maxSize=100] - max number of different name loggers
 * @param {Object} [opts.logAll=false] - log everything even strings
 * @return {function} connect middleware
 */
function middleware (opts) {
  opts = Object.assign({ maxSize: 100, logAll: false }, opts)
  const log = opts.logAll ? new CustomLog() : undefined
  const loggers = new Loggers(opts.maxSize)

  return function (req, res) {
    let query = req.query
    if (!req.query) {
      query = qsParse(urlParse(req.url).query)
    }
    res.setHeader('Cache-Control', 'no-store, no-cache')
    res.write(gif)
    res.end()

    const str = query.log
    if (!str) return

    if (/^{.*?}\s*$/.test(str)) { // check if `str` looks like JSON
      try {
        const obj = JSON.parse(str)
        const level = adjustLevel(String(obj.level), DEBUG)
        const name = String(obj.name).substr(0, 50)
        if (obj.name && name) {
          const l = loggers.get(name)
          if (l.enabled[level]) {
            if (req.ip) obj.ip = req.ip
            delete obj.name
            delete obj.level
            l._log(level, [obj])
          }
          return
        }
      } catch (e) {}
    }

    log && log.log(str)
  }
}
