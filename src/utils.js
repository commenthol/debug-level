/**
* @license MIT
* @copyright debug contributors, <commenthol@gmail.com>
*/

const [DEBUG, INFO, WARN, ERROR, OFF] = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF']

const LEVELS = {
  DEBUG: [ERROR, WARN, INFO, DEBUG],
  INFO: [ERROR, WARN, INFO],
  WARN: [ERROR, WARN],
  ERROR: [ERROR],
  OFF: [OFF]
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
    } else {
      opts[prop] = val
    }

    return opts
  }, {})

const saveOpts = (obj, options) => {
  Object.keys(options).forEach((prop) => {
    if (prop === 'stream' || prop === 'formatters') return // do not safe stream option
    let key = 'DEBUG_' + prop.replace(/([A-Z])/g, (_, prop) => '_' + prop.toLowerCase)
    if (prop === 'namespaces') key = 'DEBUG'
    key = key.toUpperCase()
    obj[key] = options[prop]
  })
}

const selectColors = (namespace, fn) => {
  let hash = 0
  fn = fn || function (n) { return n }

  for (let i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }

  const colors = {}
  Object.keys(COLORS).forEach((level) => {
    const pos = Math.abs(hash) % COLORS[level].length
    colors[level] = fn(COLORS[level][pos])
  })

  return colors
}

const inspectNamespaces = (obj) => {
  const namespaces = obj.DEBUG || obj.debug
  if (namespaces) return {namespaces}
}

const COLORS = {
  DEBUG: [
    '#0000FF', '#0033FF', '#0066FF', '#3333FF', '#3300FF',
    '#0000CC', '#0033CC', '#0066CC', '#3333CC', '#3300CC',
    '#000099', '#003399', '#333399', '#330099', '#000066',
    '#6600FF', '#6600CC'
  ],
  INFO: [
    '#00FF00', '#00FF33', '#00FF66', '#00FF99', '#00FFFF',
    '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC',
    '#009900', '#009933', '#009966', '#009999', '#006600',
    '#006633', '#006666'
  ],
  WARN: [
    '#FFFF00', '#FFFF33', '#FFFF66', '#FFFF99', '#FFCC00',
    '#FFCC33', '#FFCC66', '#FFCC99', '#FF9900', '#FF9933',
    '#FF9966', '#FF6600', '#FF6633', '#FF3300', '#CC6600',
    '#CC6633', '#CC6600'
  ],
  ERROR: [
    '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#990099',
    '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#CC0000',
    '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#990000',
    '#990033', '#990066'
  ]
}

const random = (len) => Math.random().toString(16).toLowerCase().substr(2, len)

module.exports = {
  DEBUG, INFO, WARN, ERROR, OFF,
  LEVELS,
  adjustLevel,
  inspectOpts,
  saveOpts,
  inspectNamespaces,
  selectColors,
  random
}
