const Format = require('./Format')
const { adjustLevel, LEVELS, LOG, DEBUG, INFO, WARN, ERROR, FATAL } = require('./utils')
const Namespaces = require('./Namespaces')

function LogBase (name, opts) {
  Object.assign(this, {
    name,
    opts,
    _enabled: {},
    formatter: new Format(opts)
  })
  this.enable()
}

LogBase.prototype = {
  enable (namespaces) {
    namespaces = namespaces || this.opts.namespaces
    const namespace = new Namespaces(namespaces)
    this._enabled = {} // reset
    const level = namespace.isEnabled(this.name, this.opts.level)
    if (level) {
      LEVELS[adjustLevel(level, DEBUG)].forEach((level) => {
        this._enabled[level] = true
      })
    }
  },

  get enabled () {
    return this._enabled._cache || (
      this._enabled._cache = LEVELS[DEBUG].reduce((o, level) => {
        o[level] = o[level.toLowerCase()] = !!this._enabled[level]
        return o
      }, {})
    )
  },

  log (...args) { // always log
    return this._log(LOG, args)
  },

  debug (...args) {
    if (!this._enabled.DEBUG) return
    return this._log(DEBUG, args)
  },

  info (...args) {
    if (!this._enabled.INFO) return
    return this._log(INFO, args)
  },

  warn (...args) {
    if (!this._enabled.WARN) return
    return this._log(WARN, args)
  },

  error (...args) {
    if (!this._enabled.ERROR) return
    return this._log(ERROR, args)
  },

  fatal (...args) {
    if (!this._enabled.FATAL) return
    return this._log(FATAL, args)
  },

  _serverinfo () {},

  /**
   * @return {object} json object
   */
  _formatJson (level, _args) {
    let args = _args.slice() // work on copy
    const { opts } = this
    const o = {
      level,
      name: this.name,
      msg: undefined
    }

    let loop = true

    while (loop && args.length) {
      // remove object only formats
      if (/^\s*%[oOj]\s*$/.test(args[0])) {
        args.shift()
      }

      switch (typeof args[0]) {
        case 'string':
          loop = false
          args = this.formatter.format(...args)
          o.msg = args.shift()
          break
        case 'object':
          if (args[0] instanceof Error) {
            const err = args.shift()
            o.err = {
              name: err.name,
              stack: err.stack
            }
            o.msg = err.message
            // append other keys
            Object.keys(err).forEach((key) => {
              o.err[key] = err[key]
            })
          } else {
            const obj = args.shift()
            if (Array.isArray(obj)) {
              o.arr = obj
            } else {
              Object.assign(o, obj)
            }
          }
          break
        default:
          loop = false
          o.msg = args.shift()
          break
      }
    }

    // any other arguments are added to `.args`
    if (args.length) {
      o.args = args
    }
    // we put serverinfo and date at the end of the object
    // for not viewing the same info e.g. if in tty
    if (opts.serverinfo) this._serverinfo(o)
    if (!opts.hideDate) o.time = new Date().toISOString()
    // diff info is not in humanized form
    o.diff = this.diff
    // ensure core fields
    o.level = level
    o.name = this.name

    return o
  },

  _diff () {
    const curr = Date.now()
    const prev = this.prev || curr
    this.diff = curr - prev
    this.prev = curr
  },

  _log (/* level, args */) {
    /* istanbul ignore next */
    throw new Error('needs implementation')
  }
}

module.exports = LogBase
