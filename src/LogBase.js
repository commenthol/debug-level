const Format = require('./Format')
const {adjustLevel, LEVELS, ERROR, WARN, INFO, DEBUG} = require('./utils')
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
  _serverinfo () {},

  /**
  * @return {object} json object
  */
  _formatJson (level, _args) {
    let args = _args.slice() // work on copy
    const {opts} = this
    const o = {
      level,
      name: this.name
    }

    // remove object only formats
    if (/^\s*%[oOj]\s*$/.test(args[0])) {
      args.shift()
    }
    // format a string based message
    if (['undefined', 'number', 'boolean'].indexOf(typeof args[0]) !== -1) {
      o.msg = args.shift()
    } else if (typeof args[0] === 'string') {
      args = this.formatter.format(...args)
      o.msg = args.shift()
    }
    // check for error
    if (args[0] instanceof Error) {
      const err = args.shift()
      o.err = {
        name: err.name,
        message: err.message,
        stack: err.stack
      }
      // append other keys
      Object.keys(err).forEach((key) => {
        o[key] = err[key]
      })
    }
    if (typeof args[0] === 'object') {
      o.body = args.shift()
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

    return o
  },

  _diff () {
    const curr = Date.now()
    const prev = this.prev || curr
    this.diff = curr - prev
    this.prev = curr
  },

  _log (/* level, args */) {
    throw new Error('needs implementation')
  },

  enable (namespaces) {
    namespaces = namespaces || this.opts.namespaces
    const namespace = new Namespaces(namespaces)
    this._enabled = {} // reset
    if ((!namespaces && this.opts.level) || namespace.isEnabled(this.name)) {
      LEVELS[adjustLevel(this.opts.level, DEBUG)]
        .forEach((level) => this._enabled[level] = true)
    }
  },

  enabled (level) {
    level = adjustLevel(level, ERROR)
    return !!this._enabled[level]
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
  }
}

module.exports = LogBase
