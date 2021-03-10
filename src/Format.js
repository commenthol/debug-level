const format = require('./quick-format.js')
const fastStringify = require('fast-safe-stringify')

module.exports = Format

/**
 * @param {object} [opts]
 * @param {number} [opts.spaces] - JSON.stringify spaces
 */
function Format (opts = {}) {
  Object.assign(this, { opts })
  this._formatOpts()
}

Format.prototype = {
  get spaces () {
    return this.opts.spaces
  },
  set spaces (spaces) {
    this.opts.spaces = spaces
    this._formatOpts()
  },

  _formatOpts () {
    this.formatOpts = { stringify: (o) => fastStringify(o, null, this.opts.spaces) }
  },

  stringify (...args) {
    return fastStringify(...args)
  },

  /**
   * formats arguments like `util.format`
   * @param {...Any} arguments list - args[0] may contain "%" formatters
   * @return {Array} first is formatted message, other args may follow
   */
  format (fmt, args, obj) {
    return format(fmt, args, this.formatOpts, obj)
  }
}
