const os = require('os')
const ms = require('ms')
const chalk = require('chalk')

const {inspectOpts, saveOpts, inspectNamespaces, selectColors} = require('./utils')
const LogBase = require('./LogBase')

const env = process.env.NODE_ENV || 'development'
const isDevEnv = env === 'development'

/**
* global log options
*/
const options = {
  json: isDevEnv ? false : true, // log in json format
  serverinfo: isDevEnv ? false : true, // append server information
  hideDate: isDevEnv ? true : false, // do not hide date from output
  colors: isDevEnv ? true : false, // apply colors
  stream: process.stderr, // output stream
  spaces: null // pretty print JSON
}

/**
* creates a new logger
* @constructor
* @param {String} name - namespace of Logger
*/
function Log(name, opts) {
  if (!(this instanceof Log)) return new Log(name)
  Object.assign(options,
    inspectOpts(process.env),
    inspectNamespaces(process.env)
  )
  LogBase.call(this, name, Object.assign({}, options, opts))
  this.colors = selectColors(name, (n) => chalk.hex(n))
  if (!this.opts.json) {
    this._log = this._logOneLine
  }
}
Object.setPrototypeOf(Log.prototype, LogBase.prototype)

Object.assign(Log.prototype, {
  /**
  * format object to json
  * @private
  */
  _log(level, args) {
    this._diff()
    let str = this.formatter.format(this._formatJson(level, args))[0]
    if (this.opts.colors) {
      str = str.replace(/("level":"[^"]+")/, (_, m) => this._color(m, level, true))
    }
    return this.render(str, level)
  },

  /**
  * debug like output if `this.opts.json === false`
  * @private
  */
  _logOneLine (level, args) {
    this._diff()
    const str = this._formatArgs(level, args)
    return this.render(str, level)
  },

  /**
  * format arguments to debug like string
  * @private
  * @param {String} level
  * @param {Array} args - formatter arguments - first arg should contain "%" formatter directives
  * @return {String} formatted String
  */
  _formatArgs (level, _args) {
    this.formatter.noQuotes = true
    const args = this.formatter.format(..._args)
    let msg = args.shift()
    // if there are still unformatted args push through formatter and append to msg
    if (args.length) {
      msg += ' ' + args.map((arg) => this.formatter.format('%O', arg)).join(' ')
    }
    this.formatter.noQuotes = false

    const prefix = this._color(level + ' ' + this.name, level, true)

    let str = [
      prefix,
      this.opts.hideDate ? '' : new Date().toISOString(),
      !isDevEnv ? msg : msg.split('\\n').join('\n' + prefix + ' '),
      this._color('+' + ms(this.diff), level)
    ].filter(f => f).join(' ')

    return str
  },

  /**
  * Add colors, style to string
  * @private
  */
  _color (str, level, isBold) {
    return !this.opts.colors
      ? str
      : isBold
        ? this.colors[level].bold(str)
        : this.colors[level](str)
  },

  /**
  * append server info to json object - used by `_formatJson`
  * @private
  */
  _serverinfo (o) {
    if (this.opts.serverinfo) {
      Object.assign(o, {hostname: os.hostname(), pid: process.pid})
    }
  },

  /**
  * render string to output stream
  * @public
  * @param {String} str - string to render
  * @param {String} level - level of log line (might be used for custom Logger which uses different streams per level)
  * @return {String}
  */
  render (str) {
    str += '\n'
    this.opts.stream.write(str)
    return str
  }
})

/**
* Apply (and get) global options
* @param {object} [opts] - changed options
* @return {object} global options
*/
Log.options = function (opts) {
  Object.assign(options, opts)
  return options
}

/**
* save options in `process.env`
*/
Log.save = function () {
  Log.reset()
  saveOpts(process.env, options)
}

/**
* reset saved options
*/
Log.reset = function () {
  Object.keys(process.env).forEach((key) => {
    if (/^(DEBUG|DEBUG_.*)$/.test(key)) {
      delete process.env[key]
    }
  })
}

module.exports = Log
