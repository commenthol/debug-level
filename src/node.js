import os from 'os'
import ms from 'ms'
import chalk from 'chalk'
import fastStringify from 'fast-safe-stringify'
import flatstr from 'flatstr'

import {
  fromNumLevel,
  inspectOpts,
  saveOpts,
  inspectNamespaces,
  selectColor,
  levelColors,
  INFO
} from './utils.js'
import { LogBase } from './LogBase.js'
import { wrapConsole } from './wrapConsole.js'
import { wrapDebug } from './wrapDebug.js'
import { Sonic, sonicStreams } from './Sonic.js'
import { errSerializer } from './serializers/index.js'
import { Format } from './Format.js'

const env = process.env.NODE_ENV || 'development'
const isDevEnv = /^dev/.test(env) // anything which starts with dev is seen as development env

const EXIT_EVENTS = ['unhandledRejection', 'uncaughtException']

/** @typedef {import('./LogBase.js').LogBaseOptions} LogBaseOptions */
/** @typedef {import('./utils.js').Level} Level */
/**
 * @typedef {object} ExtLogOptions
 * @property {boolean} [serverinfo] log serverinfo like hostname and pid
 * @property {NodeJS.WriteStream} [stream=process.stderr] stream writer
 * @property {boolean} [sonic] use sonic (default for production use)
 * @property {number} [sonicLength=4096] buffer length for Sonic
 * @property {number} [sonicFlushMs=1000] min. timeout before flush of Sonic buffer in ms
 */
/**
 * @typedef {LogBaseOptions & ExtLogOptions} LogOptions
 */
/**
 * @typedef {object} ExtLogOptionWrapConsole
 * @property {Level} [level4log='LOG']
 */
/**
 * @typedef {LogOptions & ExtLogOptionWrapConsole} LogOptionWrapConsole
 */
/**
 * @typedef {object} ExtLogOptionHandleExitEvents
 * @param {boolean} [code=1] set exit code; code=0 will prevent triggering exit
 * @param {boolean} [gracefulExit=false] uses process.exitCode to avoid forceful exit with process.exit()
 */
/**
 * @typedef {LogOptions & ExtLogOptionHandleExitEvents} LogOptionHandleExitEvents
 */

/**
 * global log options
 * @type {LogOptions}
 */
const options = {
  level: INFO,
  namespaces: undefined,
  levelNumbers: false,
  json: !isDevEnv, // log in json format
  colors: isDevEnv, // apply colors
  timestamp: !isDevEnv ? 'iso' : undefined, // time format: either `epoch`, `unix`, `iso`
  serverinfo: !isDevEnv, // append server information
  stream: process.stderr, // output stream
  sonic: !isDevEnv, // use Sonic as stream writer
  sonicLength: 4096, // buffer length for Sonic
  sonicFlushMs: 1000, // min. timeout before write
  spaces: undefined, // pretty print JSON
  splitLine: isDevEnv, // split lines for pretty debug like output
  serializers: { err: errSerializer } // serializers definition
}

export class Log extends LogBase {
  /**
   * creates a new logger
   * @param {String} name - namespace of Logger
   * @param {LogOptions} [opts] - see Log.options
   */
  constructor (name, opts) {
    Object.assign(
      options,
      inspectOpts(process.env),
      inspectNamespaces(process.env)
    )
    const serializers = Object.assign(
      {},
      options.serializers,
      opts ? opts.serializers : {}
    )
    const _opts = Object.assign({}, options, opts, { serializers })
    super(name, _opts)

    const colorFn = (n) => chalk.hex(n)
    this.color = selectColor(name, colorFn)
    this.levColors = levelColors(colorFn)
    // noop for TS
    this.opts = {
      stream: process.stderr,
      ..._opts,
      ...this.opts
    }
    this.toJson = toJson

    this.stream = this.opts.sonic
      ? sonicStreams.use(this.opts.stream, {
        minLength: this.opts.sonicLength,
        timeout: this.opts.sonicFlushMs
      })
      : this.opts.stream || process.stderr

    if (!this.opts.json) {
      this.opts.spaces = this.opts.spaces ?? 2
      this.formatter = new Format(this.opts)
      this._log = this._logDebugLike
    } else if (this.opts.colors) {
      this._log = this._logJsonColor
    }

    if (this.opts.serverinfo) {
      this.hostname = os.hostname()
      this.pid = process.pid
    }
  }

  /**
   * Apply (and get) global options
   * @param {object} [opts] changed options
   * @return {object} global options
   */
  static options (opts) {
    if (!opts) {
      return { ...options }
    }
    return Object.assign(options, opts)
  }

  /**
   * save options in `process.env`
   */
  static save () {
    Log.reset()
    saveOpts(process.env, options)
  }

  /**
   * reset saved options
   */
  static reset () {
    Object.keys(process.env).forEach((key) => {
      if (/^(DEBUG|DEBUG_.*)$/.test(key)) {
        delete process.env[key]
      }
    })
  }

  /**
   * wrap console logging functions like
   * console.log, console.info, console.warn, console.error
   * @param {string} [name='console']
   * @param {LogOptionWrapConsole} [opts] options
   * @return {function} unwrap function
   */
  static wrapConsole (name = 'console', opts) {
    const log = new Log(name, opts)
    return wrapConsole(log, opts)
  }

  /**
   * log exit events like 'unhandledRejection', 'uncaughtException'
   * and then let the process die
   * @param {string} [name='exit']
   * @param {LogOptionHandleExitEvents} [opts] options
   */
  static handleExitEvents (name = 'exit', opts = {}) {
    const { code = 1, gracefulExit, ..._opts } = opts
    const log = new Log(name, _opts)
    EXIT_EVENTS.forEach((ev) => {
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

  static wrapDebug () {
    return wrapDebug(Log)
  }

  /**
   * render string to output stream
   * @public
   * @param {String} str string to render
   * @param {String} level level of log line (might be used for custom Logger which uses different streams per level)
   * @return {String}
   */
  render (str, level) {
    this.stream.write(flatstr(str + '\n'))
    return str
  }

  flush () {
    // @ts-expect-error
    this.stream.flush && this.stream.flush()
  }

  /**
   * format object to json
   * @protected
   */
  _log (level, fmt, args) {
    const o = this._formatJson(level, fmt, args)
    const str = this.toJson(o, this.serializers)
    return this.render(str, level)
  }

  /**
   * format object to json
   * @private
   */
  _logJsonColor (level, fmt, args) {
    const o = this._formatJson(level, fmt, args)
    let str = this.toJson(o, this.serializers)
    /* c8 ignore next 4 */ // can't cover with tests as underlying tty is unknown
    str = str
      .replace(/"level":\s?"([^"]+)"/, (m, level) =>
        this._color(m, this.levColors[level], true)
      )
      .replace(/"level":\s?(\d+)/, (m, level) =>
        this._color(m, this.levColors[fromNumLevel(Number(level))], true)
      )
      .replace(/"name":\s?"[^"]+"/, (m) => this._color(m, this.color, true))
    return this.render(str, level)
  }

  /**
   * debug like output if `this.opts.json === false`
   * @private
   */
  _logDebugLike (_level, fmt, args) {
    const o = this._formatJson(_level, fmt, args)
    const { level, time, name, msg, pid, hostname, diff, ...other } = o

    const prefix =
      '  ' +
      this._color(level, this.levColors[level], true) +
      ' ' +
      this._color(this.name, this.color, true)

    const strOther = Object.keys(other).length
      ? stringify(
        this._applySerializers(other),
        this.opts.splitLine ? this.opts.spaces ?? 2 : undefined
      )
      : ''

    const str = this.opts.splitLine
      ? [
          prefix,
          time,
          msg,
          strOther,
          this._color('+' + ms(diff), this.color),
          hostname,
          pid
        ]
          .filter((s) => s)
          .join(' ')
          .split(/\\n|\n/)
          .join('\n' + prefix + ' ')
      : [
          prefix,
          time,
          replaceLf(msg),
          strOther,
          this._color('+' + ms(diff), this.color),
          hostname,
          pid
        ]
          .filter((s) => s)
          .join(' ')
    return this.render(str, level)
  }

  /**
   * Add colors, style to string
   * @private
   */
  _color (str, color, isBold) {
    return !this.opts.colors ? str : isBold ? color.bold(str) : color(str)
  }
}

Log.isDevEnv = isDevEnv
Log.Sonic = Sonic
Log.serializers = {
  err: errSerializer
}

/**
 * @credits pino/lib/tools.js
 *
 * magically escape strings for json relying on charCodeAt;
 * everything below 32 needs JSON.stringify() 34 and 92 happens all the time, so
 * we have a fast case for them
 *
 * @param {string} str
 * @returns {string}
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

/**
 * @param {object} obj
 * @param {object} serializers
 * @param {number} [spaces]
 * @returns {string}
 */
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

/**
 * @param {any} any
 * @param {number} [spaces]
 * @returns {string}
 */
export function stringify (any, spaces) {
  try {
    return JSON.stringify(any, null, spaces)
  } catch (e) {
    // @ts-expect-error
    return fastStringify(any, null, spaces)
  }
}

/**
 * @param {string} str
 * @returns {string}
 */
function replaceLf (str = '') {
  return str.replace(/[\r\n]/g, '\\n')
}
