import { Format } from './Format.js'
import { toNumLevel, adjustLevel, LEVELS, LOG, INFO, FATAL } from './utils.js'
import { Namespaces } from './Namespaces.js'

const noop = (...args) => {}

/** @typedef {'epoch'|'unix'|'iso'} Timestamp */

const time = {
  epoch: () => Date.now(),
  unix: () => Date.now() / 1000 | 0,
  iso: () => new Date().toISOString()
}

/**
 * @typedef {import('./utils.js').Level} Level
 *
 * @typedef {object} ExtLogBaseOptions
 * @property {Level} [level] log level
 * @property {string} [namespaces] namespaces for logging
 * @property {boolean} [levelNumbers] use number instead of log level name
 * @property {boolean} [json] log as nd-json
 * @property {boolean} [colors] log with colors
 * @property {Timestamp} [timestamp] log with timestamp; if undefined then no timestamp is logged
 * @property {number} [spaces] number of spaces for pretty print JSON
 * @property {boolean} [splitLine] split lines for pretty "debug" like output (not recommended for prod use)
 * @property {object} [serializers] serializers to be applied on object properties
 *
 * @typedef {import('./Format.js').FormatOption} FormatOption
 * @typedef {FormatOption & ExtLogBaseOptions} LogBaseOptions
 */

export class LogBase {
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
      .reduce((/** @type {object} */ curr, [key, val]) => {
        if (typeof val === 'function') {
          curr = curr || {}
          curr[key] = val
        }
        return curr
      }, null)

    this._timeF = time[opts.timestamp]
    this._time = this._timeF ? this._timeF : noop

    // log level function for TS
    /** always logs */
    this.log = noop
    /** log with level FATAL */
    this.fatal = noop
    /** log with level ERROR */
    this.error = noop
    /** log with level WARN */
    this.warn = noop
    /** log with level INFO */
    this.info = noop
    /** log with level DEBUG */
    this.debug = noop
    /** log with level TRACE */
    this.trace = noop

    // other definitions for TS
    /** @type {number|undefined} */
    this.pid = undefined
    /** @type {string|undefined} */
    this.hostname = undefined

    this.enable()
  }

  /**
   * @param {string} [namespaces]
   */
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
              // @ts-expect-error
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

  /**
   * @protected
   */
  /* c8 ignore next 3 */
  _log (nlevel, fmt, args) {
    throw new Error('needs implementation')
  }
}
