const os = require('os')
const ms = require('ms')
const chalk = require('chalk')
const fastStringify = require('fast-safe-stringify')
const flatstr = require('flatstr')

const { fromNumLevel, inspectOpts, saveOpts, inspectNamespaces, selectColor, levelColors, INFO } = require('./utils.js')
const LogBase = require('./LogBase.js')
const wrapConsole = require('./wrapConsole.js')
const wrapDebug = require('./wrapDebug.js')
const Sonic = require('./Sonic.js')
const errSerializer = require('./serializers/err.js')

const env = process.env.NODE_ENV || 'development'
const isDevEnv = /^dev/.test(env) // anything which starts with dev is seen as development env

const EXIT_EVENTS = ['unhandledRejection', 'uncaughtException']

/**
 * global log options
 */
const options = {
  level: INFO,
  namespaces: undefined,
  levelNumbers: false,
  json: !isDevEnv, // log in json format
  colors: isDevEnv, // apply colors
  timestamp: !isDevEnv && 'iso', // time format: either `epoch`, `unix`, `iso`
  serverinfo: !isDevEnv, // append server information
  stream: process.stderr, // output stream
  sonic: !isDevEnv, // use Sonic as stream writer
  sonicLength: 4096, // buffer length for Sonic
  sonicFlushMs: 1000, // min. timeout before write
  spaces: null, // pretty print JSON
  splitLine: isDevEnv, // split lines for pretty debug like output
  serializers: { err: errSerializer }
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
  const serializers = Object.assign({}, options.serializers, opts && opts.serializers)
  LogBase.call(this, name, Object.assign({}, options, opts, { serializers }))

  const colorFn = (n) => chalk.hex(n)
  this.color = selectColor(name, colorFn)
  this.levColors = levelColors(colorFn)

  this.stream = this.opts.sonic
    ? new Sonic(this.opts.stream, { minLength: this.opts.sonicLength, timeout: this.opts.sonicFlushMs })
    : this.opts.stream

  if (!this.opts.json) {
    this._log = this._logDebugLike
  } else if (this.opts.colors) {
    this._log = this._logJsonColor
  }

  if (this.opts.serverinfo) {
    this.hostname = os.hostname()
    this.pid = process.pid
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
    this.stream.write(flatstr(str + '\n'))
    return str
  },

  flush () {
    this.stream.flush && this.stream.flush()
  },

  /**
   * format object to json
   * @private
   */
  _log (level, fmt, args) {
    const o = this._formatJson(level, fmt, args)
    const str = toJson(o, this.serializers)
    return this.render(str, level)
  },

  /**
   * format object to json
   * @private
   */
  _logJsonColor (level, fmt, args) {
    const o = this._formatJson(level, fmt, args)
    let str = toJson(o, this.serializers)
    /* c8 ignore next 4 */ // can't cover with tests as underlying tty is unknown
    str = str
      .replace(/"level":\s?"([^"]+)"/, (m, level) => this._color(m, this.levColors[level], true))
      .replace(/"level":\s?(\d+)/, (m, level) => this._color(m, this.levColors[fromNumLevel(Number(level))], true))
      .replace(/"name":\s?"[^"]+"/, (m) => this._color(m, this.color, true))
    return this.render(str, level)
  },

  /**
   * debug like output if `this.opts.json === false`
   * @private
   */
  _logDebugLike (_level, fmt, args) {
    const o = this._formatJson(_level, fmt, args)
    const { level, time, name, msg, pid, hostname, diff, ...other } = o

    const prefix = '  ' +
      this._color(level, this.levColors[level], true) + ' ' +
      this._color(this.name, this.color, true)

    const strOther = Object.keys(other).length
      ? stringify(this._applySerializers(other), this.opts.splitLine && 2)
      : ''

    const str = (this.opts.splitLine)
      ? [
          prefix,
          time,
          msg,
          strOther,
          this._color('+' + ms(diff), this.color),
          hostname,
          pid
        ].filter(s => s).join(' ').split(/\\n|\n/).join('\n' + prefix + ' ')
      : [
          prefix,
          time,
          replaceLf(msg),
          strOther,
          this._color('+' + ms(diff), this.color),
          hostname,
          pid
        ].filter(s => s).join(' ')
    return this.render(str, level)
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

/**
 * wrap console logging functions like
 * console.log, console.info, console.warn, console.error
 * @param {string} [name='console']
 * @param {object} opts - see Log.options
 * @param {string} [opts.level4log='log'] - log level for console.log
 * @return {function} unwrap function
 */
Log.wrapConsole = function (name = 'console', opts) {
  const log = new Log(name, opts)
  return wrapConsole(log, opts)
}

/**
 * log exit events like 'unhandledRejection', 'uncaughtException'
 * and then let the process die
 * @param {string} [name='exit']
 * @param {object} opts - see Log.options
 * @param {boolean} [opts.code=1] - set exit code; code=0 will prevent triggering exit
 * @param {boolean} [opts.gracefulExit=false] - uses process.exitCode to avoid forceful exit with process.exit()
 */
Log.handleExitEvents = function handleExitEvents (name = 'exit', opts = {}) {
  const { code = 1, gracefulExit, ..._opts } = opts
  const log = new Log(name, _opts)
  EXIT_EVENTS.forEach(ev => {
    process.on(ev, (err) => {
      log.fatal(err)
      /* c8 ignore next 7 */
      if (code) {
        if (gracefulExit) {
          process.exitCode = code // let die...
        } else {
          setTimeout(() => process.exit(code), 5)
        }
      }
    })
  })
}

Log.wrapDebug = () => wrapDebug(Log)

Log.Sonic = Sonic

module.exports = Log

/**
 * @credits pino/lib/tools.js
 * magically escape strings for json
 * relying on their charCodeAt
 * everything below 32 needs JSON.stringify()
 * 34 and 92 happens all the time, so we
 * have a fast case for them
 */
function asString (str) {
  let result = ''
  let last = 0
  let found = false
  let point = 255
  const l = str.length
  if (l > 100) {
    return JSON.stringify(str)
  }
  for (let i = 0; i < l && point >= 32; i++) {
    point = str.charCodeAt(i)
    if (point === 34 || point === 92) {
      result += str.slice(last, i) + '\\'
      last = i
      found = true
    }
  }
  if (!found) {
    result = str
  } else {
    result += str.slice(last)
  }
  return point < 32 ? JSON.stringify(str) : '"' + result + '"'
}

function toJson (obj, serializers, spaces) {
  let s = '{'
  let comma = ''
  for (const key in obj) {
    let value = obj[key]
    if (Object.prototype.hasOwnProperty.call(obj, key) && value !== undefined) {
      if (serializers && serializers[key]) {
        value = serializers[key](value)
      }
      switch (typeof value) {
        case 'function':
          continue
        case 'number':
          if (!Number.isFinite(value)) {
            continue
          }
          break
        case 'boolean':
          break
        case 'string':
          value = asString(value)
          break
        default:
          value = stringify(value, spaces)
          break
      }
      s += comma + asString(key) + ':' + value
      comma = ','
    }
  }
  return s + '}'
}

function stringify (any, spaces) {
  try {
    return JSON.stringify(any, null, spaces)
  } catch (e) {
    return fastStringify(any, null, spaces)
  }
}

function replaceLf (str = '') {
  return str.replace(/[\r\n]/g, '\\n')
}
