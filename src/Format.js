const stringify = require('json-stringify-safe')

const replacer = (key, value) => {
  if (value instanceof Error) {
    return value.stack || value.name + ' ' + value.message
  }
  return value
}

const jFormatter = (obj, spaces) => {
  return stringify(obj, replacer, spaces)
}

const formatters = {
  s: (arg) => String(arg),
  d: (arg) => Number(arg),
  i: (arg) => parseInt(arg, 10),
  f: (arg) => parseFloat(arg),
  j: jFormatter,
  o: jFormatter,
  O: jFormatter
}

module.exports = Format

/**
 * @param {object} [opts]
 * @param {boolean} [opts.noQuotes] - remove quotes from object keys
 * @param {number} [opts.spaces] - JSON.stringify spaces
 * @param {object} [opts.formatters] - custom formatters (if needed)
 */
function Format (opts = {}) {
  Object.assign(this, {
    opts,
    formatters: Object.assign(formatters, opts.formatters)
  })
}

Format.prototype = {
  get noQuotes () {
    return this.opts.noQuotes
  },
  set noQuotes (val) {
    this.opts.noQuotes = !!val
  },

  get spaces () {
    return this.opts.spaces
  },
  set spaces (spaces) {
    this.opts.spaces = spaces
  },

  /**
   * formats arguments like `util.format`
   * @param {...Any} arguments list - args[0] may contain "%" formatters
   * @return {Array} first is formatted message, other args may follow
   */
  format (...args) {
    switch (typeof args[0]) {
      case 'string':
        break
      case 'number':
        args.unshift('%d')
        break
      case 'boolean':
        args.unshift('%s')
        break
      default:
        args.unshift('%O')
    }

    // apply all `formatters`
    let idx = 0
    args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
      // don't increase the array index on escaped %
      if (match === '%%') return match
      idx++
      const formatter = this.formatters[format]
      if (typeof formatter === 'function') {
        const val = args[idx]
        match = formatter(val, this.opts.spaces)
        if (this.opts.noQuotes && typeof match === 'string') {
          match = match.replace(/^"/, '').replace(/"$/m, '')
        }
        args.splice(idx, 1) // remove `args[idx]` as being inlined
        idx--
      }
      return match
    })

    // return all remaining arguments - args[0] should be of type string, if there were formatters inside
    return args
  }
}
