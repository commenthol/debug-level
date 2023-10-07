/**
 * @license MIT
 * @copyright debug contributors, <commenthol@gmail.com>
 */

/** @typedef {'LOG'|'FATAL'|'ERROR'|'WARN'|'INFO'|'DEBUG'|'TRACE'|'OFF'} Level */

/** @type {Level} */
export const LOG = 'LOG'
/** @type {Level} */
export const FATAL = 'FATAL'
/** @type {Level} */
export const ERROR = 'ERROR'
/** @type {Level} */
export const WARN = 'WARN'
/** @type {Level} */
export const INFO = 'INFO'
/** @type {Level} */
export const DEBUG = 'DEBUG'
/** @type {Level} */
export const TRACE = 'TRACE'
/** @type {Level} */
export const OFF = 'OFF'

export const LEVELS = {
  TRACE: [FATAL, ERROR, WARN, INFO, DEBUG, TRACE],
  DEBUG: [FATAL, ERROR, WARN, INFO, DEBUG],
  INFO: [FATAL, ERROR, WARN, INFO],
  WARN: [FATAL, ERROR, WARN],
  ERROR: [FATAL, ERROR],
  FATAL: [FATAL],
  OFF: [OFF]
}

export const COLORS = [
  '#6600FF', '#3333FF', '#3333CC', '#0066FF',
  '#0066CC', '#0066FF',
  '#006633', '#006666', '#006600',
  '#00CC00', '#00CC33', '#00CC66', '#00CC99',
  '#009900', '#009933', '#009966', '#009999',
  '#00CCFF', '#00CCCC',
  '#FF9900', '#FF9933', '#FF6600', '#FF6633',
  '#FF0000', '#FF0033', '#FF3300', '#FF3300', '#FF3333',
  '#CC0000', '#CC0033', '#CC0066', '#FF0066', '#FF3366',
  '#FF00FF', '#FF33FF', '#CC00CC', '#990099'
]

export const LEVEL_COLORS = {
  LOG: '#999999',
  TRACE: '#00CCFF',
  DEBUG: '#0066CC',
  INFO: '#009900',
  WARN: '#FF9900',
  ERROR: '#CC0000',
  FATAL: '#CC00CC'
}

export const NUM_LEVELS = {
  [TRACE]: 10,
  [DEBUG]: 20,
  [INFO]: 30,
  [LOG]: 30,
  [WARN]: 40,
  [ERROR]: 50,
  [FATAL]: 60
}

export const adjustLevel = (level, _default) => {
  level = (level || '').toUpperCase()
  return LEVELS[level] ? level : _default
}

/**
 * @param {Level} level
 * @returns {number}
 */
export const toNumLevel = (level) => NUM_LEVELS[level] || NUM_LEVELS.DEBUG

/**
 * @param {number} level
 */
export const fromNumLevel = (level) => {
  if (typeof level === 'number') {
    for (const slevel in NUM_LEVELS) {
      const threshold = NUM_LEVELS[slevel]
      if (level <= threshold) {
        return slevel
      }
    }
    return FATAL
  }
  return level
}

/**
 * @copyright debug contributors
 * @see https://github.com/visionmedia/debug
 */
export const inspectOpts = (obj) => Object.keys(obj)
  .filter((key) => /^debug_/i.test(key))
  .reduce((opts, key) => {
    // camel-case
    const prop = key
      .substring(6)
      .toLowerCase()
      .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() })

    // coerce string value into JS value
    let val = obj[key]
    if (/^(yes|on|true|enabled)$/i.test(val)) val = true
    else if (/^(no|off|false|disabled)$/i.test(val)) val = false
    else if (val === 'null') val = null
    else val = Number(val)

    if (prop === 'stream' || prop === 'formatters') {
      // do nothing
    } else if (prop === 'level') {
      val = adjustLevel(obj[key])
      if (val) opts[prop] = val
    } else if (prop === 'url' || prop === 'timestamp') {
      opts[prop] = obj[key]
    } else {
      opts[prop] = val
    }

    return opts
  }, {})

export const saveOpts = (obj, options) => {
  Object.keys(options).forEach((prop) => {
    if (['stream', 'serializers', 'toJson'].includes(prop)) return // do not safe stream option
    let key = 'DEBUG_' + prop.replace(/([A-Z])/g, (_, prop) => '_' + prop.toLowerCase())
    if (prop === 'namespaces') key = 'DEBUG'
    key = key.toUpperCase()
    obj[key] = options[prop]
  })
}

export const selectColor = (namespace, fn) => {
  let hash = 0

  for (const i in namespace) {
    hash = ((hash << 5) - hash) + namespace.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }

  const pos = Math.abs(hash) % COLORS.length
  const color = fn(COLORS[pos])
  return color
}

export const levelColors = (fn) => {
  const colors = Object.keys(LEVEL_COLORS)
    .reduce((colors, level) => {
      colors[level] = fn(LEVEL_COLORS[level])
      return colors
    }, {})
  return colors
}

export const inspectNamespaces = (obj) => {
  const namespaces = obj.DEBUG || obj.debug
  if (namespaces) return { namespaces }
}

export const random = (len) => Math.random().toString(16).toLowerCase().slice(2, len)
