const os = require('os')
const ms = require('ms')
const chalk = require('chalk')

const { inspectOpts, saveOpts, inspectNamespaces, selectColor, levelColors } = require('./utils')
const LogBase = require('./LogBase')

const env = process.env.NODE_ENV || 'development'
const isDevEnv = /^dev/.test(env) // anything which starts with dev is seen as development env

/**
 * global log options
 */
const options = {
  level: undefined,
  namespaces: undefined,
  json: !isDevEnv, // log in json format
  serverinfo: !isDevEnv, // append server information
  hideDate: isDevEnv, // do not hide date from output
  colors: isDevEnv, // apply colors
  stream: process.stderr, // output stream
  spaces: null, // pretty print JSON
  splitLine: isDevEnv
}

/**
 * creates a new logger
 * @constructor
 * @param {String} name - namespace of Logger
 */
function Log (name, opts) {
  if (!(this instanceof Log)) return new Log(name, opts)
  Object.assign(options,
    inspectOpts(process.env),
    inspectNamespaces(process.env)
  )
  LogBase.call(this, name, Object.assign({}, options, opts))
  const colorFn = (n) => chalk.hex(n)
  this.color = selectColor(name, colorFn)
  this.levColors = levelColors(colorFn)
  if (!this.opts.json) {
    this._log = this._logOneLine
  }
}
Object.setPrototypeOf(Log.prototype, LogBase.prototype)

Object.assign(Log.prototype, {
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
  },

  /**
   * format object to json
   * @private
   */
  _log (level, args) {
    this._diff()
    const o = this._formatJson(level, args)
    let str = this.formatter.format(o)[0]
    /* istanbul ignore next */ // can't cover with test as underlying tty is unknown
    if (this.opts.colors) { // this is slow...
      str = str
        .replace(/"level":\s?"([^"]+)"/, (m, level) => this._color(m, this.levColors[level], true))
        .replace(/"name":\s?"[^"]+"/, (m) => this._color(m, this.color, true))
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

    const prefix = '  ' + this._color(level, this.levColors[level], true) + ' ' +
      this._color(this.name, this.color, true)

    const str = [
      prefix,
      this.opts.hideDate ? '' : new Date().toISOString(),
      !this.opts.splitLine ? msg.replace(/[\r\n]/g, '\\n') : msg.split(/\\n|\n/).join('\n' + prefix + ' '),
      this._color('+' + ms(this.diff), this.color),
      this.opts.serverinfo ? os.hostname() + ' ' + process.pid : undefined
    ].filter(f => f).join(' ')

    return str
  },

  /**
   * Add colors, style to string
   * @private
   */
  _color (str, color, isBold) {
    return !this.opts.colors
      ? str
      : isBold
        ? color.bold(str)
        : color(str)
  },

  /**
   * append server info to json object - used by `_formatJson`
   * @private
   */
  _serverinfo (o) {
    // istanbul ignore else
    if (this.opts.serverinfo) {
      Object.assign(o, { hostname: os.hostname(), pid: process.pid })
    }
  }
})

/**
* Apply (and get) global options
* @param {object} [opts] - changed options
* @return {object} global options
*/
Log.options = function (opts) {
  if (!opts) return Object.assign({}, options)
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

Log.isDevEnv = isDevEnv

module.exports = Log
