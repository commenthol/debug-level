/* global navigator window document Image chrome */

import { Queue } from 'asyncc'
import { inspectOpts, saveOpts, inspectNamespaces, selectColor, levelColors, random } from './utils'
import ms from 'ms'
import LogBase from './LogBase'

const COLOR_RESET = 'color:inherit'

/**
 * global log options
 */
const options = {
  level: undefined,
  namespaces: undefined,
  colors: true, // apply coloring to browser console
  url: undefined // [optional] url to report errors
}

/**
 * get storage
 * @private
 */
const storage = () => {
  try {
    return typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined'
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
  const userAgent = typeof navigator !== 'undefined' && navigator.userAgent
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  const isElectron = typeof window !== 'undefined' &&
    (tmp = window.process) && (tmp.type === 'renderer')
  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  const isReactNative = typeof document !== 'undefined' &&
    (tmp = document.documentElement) && (tmp = tmp.style) && tmp.WebkitAppearance
  // is firebug? http://stackoverflow.com/a/398120/376773
  const isFireBug = typeof window !== 'undefined' &&
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
 * @constructor
 * @param {String} name - namespace of Logger
 */
function Log (name, opts) {
  if (!(this instanceof Log)) return new Log(name, opts)
  const _storage = storage()
  Object.assign(options,
    inspectOpts(_storage),
    inspectNamespaces(_storage)
  )
  options.colors = options.colors === false ? false : supportsColors()

  LogBase.call(this, name, Object.assign({}, options, opts))
  const colorFn = (c) => `color:${c}`
  this.color = selectColor(name, colorFn)
  this.levColors = levelColors(colorFn)
  this.queue = new Queue(this._sendLog.bind(this), 3)
}
Object.setPrototypeOf(Log.prototype, LogBase.prototype)

Object.assign(Log.prototype, {
  /**
   * render arguments to console.log
   * @public
   * @param {Array} args - console.log arguments
   * @param {String} level - level of log line (might be used for custom Logger which uses different streams per level)
   * @return {String}
   */
  render (args) {
    console.log(...args) // eslint-disable-line no-console
    return args
  },

  /**
   * send log to server
   * @param {Array} args - log arguments
   * @param {String} level - log level
   */
  send (args, level) {
    const o = this._formatJson(level, args)
    o.userAgent = navigator.userAgent
    const str = this.formatter.format(o)[0]
    this.queue.push(str)
  },

  /**
   * format log arguments
   * @private
   */
  _log (level, args) {
    this._diff()

    const _args = this._formatArgs(level, args)
    const res = this.render(_args, level)

    if (this.opts.url) {
      this.send(args, level)
    }

    return res
  },

  /**
   * format arguments for console.log
   * @private
   * @return {Array} args for console.log
   */
  _formatArgs (level, _args) {
    const args = _args.slice() // work on copy
    const color = this.color

    if (typeof args[0] !== 'string') {
      args.unshift('%O')
    }

    args[0] = [
      this._color(level),
      this._color(this.name),
      args[0],
      this._color('+' + ms(this.diff))
    ].join(' ')

    if (this.opts.colors) {
      args.splice(1, 0, color + ';font-weight:bold', COLOR_RESET)
      args.splice(1, 0, this.levColors[level], COLOR_RESET)
    }
    let idx = 0
    let lastC
    // apply custom formatters
    args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
      if (match === '%%') return match
      idx++

      switch (format) {
        case 's':
        case 'd':
        case 'i':
        case 'f':
        case 'o':
        case 'O':
          break
        case 'c':
          lastC = idx
          break
        default: {
          const formatter = this.formatter.formatters[format]
          if (typeof formatter === 'function') {
            const val = args[idx]
            match = formatter(val)
            args.splice(idx, 1) // remove `args[idx]` as being inlined
            idx--
          }
        }
      }
      return match
    })

    if (this.opts.colors) {
      args.splice(lastC - 1, 0, color, COLOR_RESET)
    }

    return args
  },

  /**
   * transfer log to server via zero pixel image request
   */
  _sendLog (str, cb) {
    const img = new Image()
    const done = () => cb()
    img.onload = done
    img.onerror = done
    img.onabort = done
    img.src = this.opts.url + '/0.gif?id=' + random(6) + '&log=' + encodeURIComponent(str)
  },

  /**
   * Add colors, style to string
   * @private
   */
  _color (str) {
    return this.opts.colors
      ? `%c${str}%c`
      : str
  }
})

/**
 * Apply (and get) global options
 * @param {object} [opts] - changed options
 * @return {object} global options
 */
Log.options = function (opts) {
  if (!opts) return Object.assign({}, options)
  Object.assign(options, opts, {
    colors: opts.colors === false ? false : supportsColors()
  })
  return options
}

/**
 * save options in `localStorage`
 */
Log.save = function () {
  const _storage = storage()
  Log.reset()
  saveOpts(_storage, options)
}

/**
 * reset saved options
 */
Log.reset = function () {
  const _storage = storage()

  Object.keys(_storage).forEach((key) => {
    if (/^(DEBUG|DEBUG_.*)$/.test(key)) {
      _storage.removeItem(key)
    }
  })
}

module.exports = Log
