const Format = require('./Format.js')
const { toNumLevel, adjustLevel, LEVELS, LOG, INFO, FATAL } = require('./utils.js')
const Namespaces = require('./Namespaces.js')

const noop = () => {}

const time = {
  epoch: () => Date.now(),
  unix: () => Date.now() / 1000 | 0,
  iso: () => new Date().toISOString()
}

function LogBase (name, opts) {
  Object.assign(this, {
    name,
    opts,
    _enabled: {},
    formatter: new Format(opts)
  })

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

LogBase.prototype = {
  enable (namespaces) {
    namespaces = namespaces || this.opts.namespaces
    const namespace = new Namespaces(namespaces)
    this._enabled = {} // reset
    const level = namespace.isEnabled(this.name, this.opts.level)
    const active = level
      ? LEVELS[adjustLevel(level, INFO)]
      : []
    LEVELS.TRACE.forEach(level => { // loop over all levels
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
  },

  get enabled () {
    return this._enabled._cache || (
      this._enabled._cache = LEVELS.TRACE.reduce((o, level) => {
        o[level] = o[level.toLowerCase()] = !!this._enabled[level]
        return o
      }, {})
    )
  },

  diff () {
    const curr = Date.now()
    const prev = this._prev || curr
    this._prev = curr
    return curr - prev
  },

  /**
   * @return {object} json object
   */
  _formatJson (level, fmt, args = []) {
    const isObject = typeof fmt === 'object'

    const o = {
      level,
      time: this._time(),
      name: this.name,
      msg: isObject ? undefined : this.formatter.formatJson(fmt, args),
      pid: this.pid,
      hostname: this.hostname,
      diff: this.diff()
    }

    if (isObject) {
      let arg = fmt
      do {
        const type = typeof arg
        if (arg instanceof Error) {
          o.err = {
            name: arg.name,
            stack: arg.stack
          }
          o.msg = arg.message
          // append other keys
          Object.keys(arg).forEach((key) => {
            if (key === 'level') return
            o.err[key] = arg[key]
          })
        } else if (arg && type === 'object') {
          if (Array.isArray(arg)) {
            o.arr = arg
          } else {
            const { name, level, ...rest } = arg
            Object.assign(o, rest)
          }
        } else {
          o.msg = arg
          break
        }
        arg = args.shift()
      } while (args.length)
    }

    return o
  },

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
  },

  /* c8 ignore next */
  _serverinfo () {},

  /* c8 ignore next 3 */
  _log (/* level, args */) {
    throw new Error('needs implementation')
  }
}

module.exports = LogBase
