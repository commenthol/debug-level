/* global navigator window document Image chrome */

import { Queue } from 'asyncc'
import ms from 'ms'
import {
  inspectOpts,
  saveOpts,
  inspectNamespaces,
  selectColor,
  levelColors,
  random,
  WARN
} from './utils.js'
import { LogBase } from './LogBase.js'
import { wrapConsole } from './wrapConsole.js'
import { errSerializer } from './serializers/err.js'

/**
 * @typedef {import('./utils.js').Level} Level
 * @typedef {import('./LogBase.js').LogBaseOptions} LogBaseOptions
 *
 * @typedef {object} ExtLogOptionsBrowser
 * @property {string} [url] url to report errors
 *
 * @typedef {LogBaseOptions & ExtLogOptionsBrowser} LogOptionsBrowser
 */

const COLOR_RESET = 'color:inherit'

/**
 * global log options
 */
const options = {
  level: WARN,
  namespaces: undefined,
  colors: true, // apply coloring to browser console
  url: undefined // [optional]
}

/**
 * get storage
 * @private
 */
const storage = () => {
  try {
    // @ts-expect-error
    return typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined'
      // @ts-expect-error
      ? chrome.storage.local
      : window.localStorage
  } catch (err) {
    // istanbul ignore next
    return {}
  }
}

/**
 * check if console colors are supported
 * @copyright debug contributors
 * @see https://github.com/visionmedia/debug
 * @private
 */
const supportsColors = () => {
  let tmp
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  const isElectron = typeof window !== 'undefined' &&
    // @ts-expect-error
    (tmp = window.process) && (tmp.type === 'renderer')
  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  const isReactNative = typeof document !== 'undefined' &&
    // @ts-expect-error
    (tmp = document.documentElement) && (tmp = tmp.style) && tmp.WebkitAppearance
  // is firebug? http://stackoverflow.com/a/398120/376773
  const isFireBug = typeof window !== 'undefined' &&
    // @ts-expect-error
    (tmp = window.console) && (tmp.firebug || (tmp.exception && tmp.table))

  if (isElectron) {
    // istanbul ignore next
    return true
  }

  // Internet Explorer and Edge do not support colors.
  if (/(edge|trident)\/(\d+)/i.exec(userAgent)) {
    // istanbul ignore next
    return false
  }

  return !!(isReactNative || isFireBug ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (/firefox\/(\d+)/i.exec(userAgent) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (/applewebkit\/(\d+)/i.exec(userAgent))
  )
}

/**
 * creates a new logger for the browser
 */
export class Log extends LogBase {
  /**
   * @param {string} name namespace of Logger
   * @param {LogOptionsBrowser} opts
   */
  constructor (name, opts) {
    const _storage = storage()

    Object.assign(options,
      inspectOpts(_storage),
      inspectNamespaces(_storage)
    )

    options.colors = options.colors === false ? false : supportsColors()

    const serializers = Object.assign({}, options.serializers, opts?.serializers)

    const _opts = Object.assign({}, options, opts, { serializers })
    super(name, _opts)
    // noop for TS
    this.opts = { ..._opts, ...this.opts }

    const colorFn = (c) => `color:${c}`
    this.color = selectColor(name, colorFn)
    this.levColors = levelColors(colorFn)
    this.queue = new Queue(this._sendLog.bind(this), 3)
  }

  /**
   * Apply (and get) global options
   * @param {LogOptionsBrowser} [opts] changed options
   * @return {object} global options
   */
  static options (opts) {
    if (!opts) { return Object.assign({}, options) }
    Object.assign(options, opts, {
      colors: opts.colors === false ? false : supportsColors()
    })
    return options
  }

  /**
   * save options in `localStorage`
   */
  static save () {
    const _storage = storage()
    Log.reset()
    saveOpts(_storage, options)
  }

  /**
   * reset saved options
   */
  static reset () {
    const _storage = storage()

    Object.keys(_storage).forEach((key) => {
      if (/^(DEBUG|DEBUG_.*)$/i.test(key)) {
        _storage.removeItem(key)
      }
    })
  }

  /**
   * @typedef {object} ExtLogOptionWrapConsole
   * @property {Level} [level4log='LOG']
   *
   * @typedef {LogOptionsBrowser & ExtLogOptionWrapConsole} LogOptionWrapConsole
   */
  /**
   * wrap console logging functions like
   * console.log, console.info, console.warn, console.error
   * @param {string} [name='console']
   * @param {LogOptionWrapConsole} [opts]
   * @return {function} unwrap function
   */
  static wrapConsole (name = 'console', opts = {}) {
    const log = new Log(name, opts)
    return wrapConsole(log, opts)
  }

  /**
   * render arguments to console.log
   * @public
   * @param {any[]} args console.log arguments
   * @param {Level} level level of log line (might be used for custom Logger which uses different streams per level)
   * @return {any[]}
   */
  render (args, level) {
    console.log(...args) // eslint-disable-line no-console
    return args
  }

  /**
   * send log to server
   * @param {Level|object} level log level
   * @param {string} [fmt] formatter
   * @param {any[]} [args] log arguments
   */
  send (level, fmt, args) {
    let obj
    if (typeof level === 'object') {
      obj = level
    } else {
      const uns = this._formatJson(level, fmt, args)
      obj = this._applySerializers(uns)
    }
    obj.userAgent = navigator.userAgent
    const str = this.formatter.stringify(obj)
    this.queue.push(str)
  }

  /**
   * format log arguments
   * @protected
   */
  _log (level, fmt, args) {
    const uns = this._formatJson(level, fmt, args)
    const obj = this._applySerializers(uns)
    const _args = this._format(obj)
    const res = this.render(_args, level)

    if (this.opts.url) {
      this.send(obj)
    }

    return res
  }

  /**
   * format arguments for console.log
   * @private
   * @param {object} param0
   * @return {Array} args for console.log
   */
  _format ({ level, name, time, msg = '', diff, ...other }) {
    const color = this.color
    const args = []
    const hasOther = Object.keys(other).length

    args[0] = [
      this._color(level),
      this._color(name),
      msg,
      hasOther ? '%O' : undefined,
      this._color('+' + ms(diff))
    ].filter(s => s !== undefined).join(' ')
    if (hasOther) args.push(other)

    if (this.opts.colors) {
      args.splice(1, 0, color + ';font-weight:bold', COLOR_RESET)
      args.splice(1, 0, this.levColors[level], COLOR_RESET)
    }

    if (this.opts.colors) {
      let idx = 0
      let lastC = 0
      args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
        idx++
        if (format === 'c') {
          lastC = idx
        }
        return match
      })
      args.splice(lastC - 1, 0, color, COLOR_RESET)
    }

    return args
  }

  /**
   * transfer log to server via zero pixel image request
   * @param {string} str
   * @param {Function} [cb]
   */
  _sendLog (str, cb) {
    const img = new Image()
    const done = () => { cb && cb() }
    img.onload = done
    img.onerror = done
    img.onabort = done
    img.src = this.opts.url + '?id=' + random(6) + '&log=' + encodeURIComponent(str)
  }

  /**
   * Add colors, style to string
   * @private
   */
  _color (str) {
    return this.opts.colors
      ? `%c${str}%c`
      : str
  }
}

Log.serializers = { err: errSerializer }

export default Log
