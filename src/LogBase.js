const Format = require('./Format.js')
const { toNumLevel, adjustLevel, LEVELS, LOG, INFO, FATAL } = require('./utils.js')
const Namespaces = require('./Namespaces.js')

const noop = () => {}

const time = {
  epoch: () => Date.now(),
  unix: () => Date.now() / 1000 | 0,
  iso: () => new Date().toISOString()
}

/**
 * @typedef {object} opts
 * @property {string} [namespaces]
 * @property {string} [level]
 * @property {boolean} [levelNumbers]
 * @property {'epoch'|'unix'|'iso'} [timestamp]
 * @property {object} [serializers]
 *
 * @typedef {import('./Format.js').FormatOption} FormatOption
 * @typedef {FormatOption & opts} LogBaseOptions
 */

class LogBase {
  /**
   * @param {string} name
   * @param {LogBaseOptions} opts
   */
  constructor (name, opts = {}) {
    this.name = name
    this.opts = opts
    this._enabled = {}
    this.formatter = new Format(opts)

    /** @type {{ [x: string]: (arg0: any) => any; } | null} */
    this.serializers = Object.entries(this.opts.serializers || {})
      .reduce((o, [key, val]) => {
        if (typeof val === 'function') {
          o = o || {}
          o[key] = val
        }
        return o
      }, null)

    this._timeF = time[opts.timestamp]
    this._time = this._timeF ? this._timeF : noop

    this.enable()
  }

  /** @param {string} [namespaces] */
  enable (namespaces = this.opts.namespaces) {
    const namespace = new Namespaces(namespaces)
    this._enabled = {} // reset
    const level = namespace.isEnabled(this.name, this.opts.level)
    const active = level
      ? LEVELS[adjustLevel(level, INFO)]
      : []
    LEVELS.TRACE.forEach(level => {
      const nlevel = this.opts.levelNumbers ? toNumLevel(level) : level
      const llevel = level.toLowerCase()
      if (active.includes(level)) {
        this._enabled[level] = true
        this[llevel] = level === FATAL
          ? (fmt, ...args) => {
              const str = this._log(nlevel, fmt, args)
              this.flush && this.flush()
              return str
            }
          : (fmt, ...args) => this._log(nlevel, fmt, args)
      } else {
        this[llevel] = noop
      }
    })
    const nLOG = this.opts.levelNumbers ? toNumLevel(LOG) : LOG
    this.log = (fmt, ...args) => this._log(nLOG, fmt, args)
  }

  get enabled () {
    return this._enabled._cache || (
      this._enabled._cache = LEVELS.TRACE.reduce((o, level) => {
        o[level] = o[level.toLowerCase()] = !!this._enabled[level]
        return o
      }, {})
    )
  }

  diff () {
    const curr = Date.now()
    const prev = this._prev || curr
    this._prev = curr
    return curr - prev
  }

  /**
   * @return {object} json object
   */
  _formatJson (level, fmt, args = []) {
    const other = {}
    const msg = this.formatter.format(fmt, args, other) || undefined

    const o = {
      level,
      time: this._time(),
      name: this.name,
      msg,
      pid: this.pid,
      hostname: this.hostname,
      diff: this.diff(),
      ...other
    }

    return o
  }

  _applySerializers (obj) {
    const o = {}
    for (const key in obj) {
      const value = obj[key]
      if (Object.prototype.hasOwnProperty.call(obj, key) && value !== undefined) {
        if (this.serializers && this.serializers[key]) {
          o[key] = this.serializers[key](value)
        } else {
          o[key] = value
        }
      }
    }
    return o
  }

  /* c8 ignore next */
  _serverinfo () { }

  /* c8 ignore next 3 */
  _log (/* level, args */) {
    throw new Error('needs implementation')
  }
}

module.exports = LogBase
