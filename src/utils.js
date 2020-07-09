/**
 * @license MIT
 * @copyright debug contributors, <commenthol@gmail.com>
 */

const [LOG, DEBUG, INFO, WARN, ERROR, FATAL, OFF] = ['LOG', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF']

const LEVELS = {
  DEBUG: [FATAL, ERROR, WARN, INFO, DEBUG],
  INFO: [FATAL, ERROR, WARN, INFO],
  WARN: [FATAL, ERROR, WARN],
  ERROR: [FATAL, ERROR],
  FATAL: [FATAL],
  OFF: [OFF]
}

const COLORS = [
  '#0000FF', '#0033FF', '#0066FF', '#3333FF', '#3300FF',
  '#0000CC', '#0033CC', '#0066CC', '#3333CC', '#3300CC',
  '#000099', '#003399', '#333399', '#330099', '#000066',
  '#00FF00', '#00FF33', '#00FF66', '#00FF99', '#006633',
  '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#006666',
  '#009900', '#009933', '#009966', '#009999', '#006600',
  '#00FFFF', '#00CCFF', '#00FFCC', '#00CCCC', '#33CCCC',
  '#FFFF00', '#FFFF33', '#FFCC33', '#FFCC66',
  '#FF9900', '#FF9933', '#FF6600', '#FF6633',
  '#FF0000', '#FF0033', '#FF3300', '#FF3300', '#FF3333',
  '#CC0000', '#CC0033', '#CC0066', '#FF0066', '#FF3366',
  '#FF00FF', '#FF33FF', '#CC00CC', '#990099', '#660066'
]

const LEVEL_COLORS = {
  LOG: '#999999',
  DEBUG: '#0000CC',
  INFO: '#00CC00',
  WARN: '#CCCC00',
  ERROR: '#CC0000',
  FATAL: '#CC00CC'
}

const adjustLevel = (level, _default) => {
  level = (level || '').toUpperCase()
  return LEVELS[level] ? level : _default
}

/**
 * @copyright debug contributors
 * @see https://github.com/visionmedia/debug
 */
const inspectOpts = (obj) => Object.keys(obj)
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
    } else if (prop === 'url') {
      opts[prop] = obj[key]
    } else {
      opts[prop] = val
    }

    return opts
  }, {})

const saveOpts = (obj, options) => {
  Object.keys(options).forEach((prop) => {
    if (prop === 'stream' || prop === 'formatters') return // do not safe stream option
    let key = 'DEBUG_' + prop.replace(/([A-Z])/g, (_, prop) => '_' + prop.toLowerCase())
    if (prop === 'namespaces') key = 'DEBUG'
    key = key.toUpperCase()
    obj[key] = options[prop]
  })
}

const selectColor = (namespace, fn) => {
  let hash = 0

  for (const i in namespace) {
    hash = ((hash << 5) - hash) + namespace.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }

  const pos = Math.abs(hash) % COLORS.length
  const color = fn(COLORS[pos])
  return color
}

const levelColors = (fn) => {
  const colors = Object.keys(LEVEL_COLORS)
    .reduce((colors, level) => {
      colors[level] = fn(LEVEL_COLORS[level])
      return colors
    }, {})
  return colors
}

const inspectNamespaces = (obj) => {
  const namespaces = obj.DEBUG || obj.debug
  if (namespaces) return { namespaces }
}

const random = (len) => Math.random().toString(16).toLowerCase().substr(2, len)

module.exports = {
  LOG,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
  OFF,
  LEVELS,
  adjustLevel,
  inspectOpts,
  saveOpts,
  inspectNamespaces,
  selectColor,
  levelColors,
  random
}
