import MapLRU from 'map-lru'
import { Log } from './node.js'
import { adjustLevel, toNumLevel, fromNumLevel, INFO } from './utils.js'

// https://css-tricks.com/snippets/html/base64-encode-of-1x1px-transparent-gif/
const gif = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

/**
 * @param {string} url
 * @returns {object}
 */
function parseQuery (url) {
  // eslint-disable-next-line no-unused-vars
  const [path, search] = url.split('?')
  return Object.fromEntries(new URLSearchParams(search))
}

class Loggers {
  constructor (opts) {
    const { maxSize = 100 } = opts || {}

    this.LogCls = opts?.Log || Log
    this.cache = new MapLRU(maxSize)
  }

  get (name) {
    let log = this.cache.get(name)
    if (!log) {
      log = new this.LogCls(name)
      this.cache.set(name, log)
    }
    return log
  }
}

/**
 * @param {string|object} str
 * @returns {object}
 */
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
 * @typedef {{
 *  maxSize?: number
 *  logAll?: boolean
 *  levelNumbers?: boolean
 *  Log?: typeof Log
 * }} MwLogOption
 * - [maxSize=100] max number of different name loggers
 * - [logAll=false] log everything even strings
 * - [levelNumbers=false] log levels as numbers
 * - [Log=Log] allows overwrite of Log class
 */

/**
 * connect middleware which logs browser based logs on server side;
 * sends a transparent gif as response
 * @param {MwLogOption} [options]
 * @return {function} connect middleware
 */
export function browserLogs (options) {
  const opts = {
    maxSize: 100,
    logAll: false,
    levelNumbers: false,
    ...(options || {})
  }

  const LogCls = opts?.Log || Log
  const log = opts.logAll ? new LogCls('debug-level:browser') : undefined
  const loggers = new Loggers(opts)

  return function _browserLogs (req, res) {
    const query = req.query ? req.query : parseQuery(req.url)

    res.setHeader('Cache-Control', 'no-store, no-cache')
    res.write(gif)
    res.end()

    const str = query.log
    if (!str) return

    const obj = parseJson(str)
    if (obj) {
      const { name: _name, level: _level, ...other } = obj
      const adjLevel = adjustLevel(String(fromNumLevel(_level)), INFO)
      const level = opts.levelNumbers ? toNumLevel(adjLevel) : adjLevel
      const name = String(_name).slice(0, 50)
      if (name) {
        const l = loggers.get(name)
        if (l.enabled[adjLevel]) {
          if (req.ip) other.ip = req.ip
          l._log(level, other)
        }
      }
    } else {
      log && log.log(str)
    }
  }
}
