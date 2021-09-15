const { parse: urlParse } = require('url')
const { parse: qsParse } = require('querystring')
const MapLRU = require('map-lru')
const Log = require('./node.js')
const { adjustLevel, toNumLevel, fromNumLevel, INFO } = require('./utils.js')

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

module.exports = middleware

function parseJson (str) {
  if (typeof str === 'object') {
    return str
  }
  try {
    if (str[0] === '{') {
      return JSON.parse(str)
    }
  } catch (e) {}
}

/**
 * connect middleware which logs browser based logs on server side
 * sends a transparent gif as response
 * @param {Object} [opts]
 * @param {number} [opts.maxSize=100] - max number of different name loggers
 * @param {boolean} [opts.logAll=false] - log everything even strings
 * @param {boolean} [opts.levelNumbers] - log levels as numbers
 * @return {function} connect middleware
 */
function middleware (opts) {
  opts = Object.assign({ maxSize: 100, logAll: false }, opts)
  const log = opts.logAll ? new Log('debug-level:mw') : undefined
  const loggers = new Loggers(opts.maxSize)

  return function (req, res) {
    const query = req.query
      ? req.query
      : qsParse(urlParse(req.url).query)

    res.setHeader('Cache-Control', 'no-store, no-cache')
    res.write(gif)
    res.end()

    const str = query.log
    if (!str) return

    const obj = parseJson(str)
    if (obj) {
      const level = adjustLevel(String(fromNumLevel(obj.level)), INFO)
      const nlevel = opts.levelNumbers ? toNumLevel(level) : level
      const name = String(obj.name).substr(0, 50)
      if (obj.name && name) {
        const l = loggers.get(name)
        if (l.enabled[level]) {
          if (req.ip) obj.ip = req.ip
          delete obj.name
          delete obj.level
          l._log(nlevel, obj)
        }
      }
    } else {
      log && log.log(str)
    }
  }
}
