// @ts-check

const format = require('./quick-format.js')
const fastStringify = require('fast-safe-stringify')

/**
 * @typedef {object} FormatOption
 * @property {number} [spaces] - number of spaces to use for formatting
 */

class Format {
  /** @param {FormatOption} opts */
  constructor (opts = {}) {
    this.opts = { opts }
    this._formatOpts()
  }

  get spaces () {
    return this.opts.spaces
  }

  set spaces (spaces) {
    this.opts.spaces = spaces
    this._formatOpts()
  }

  _formatOpts () {
    this.formatOpts = { stringify: (o) => fastStringify(o, null, this.opts.spaces) }
  }

  stringify (...args) {
    return fastStringify(...args)
  }

  /**
   * formats arguments like `util.format`
   * @param {...any} arguments list - args[0] may contain "%" formatters
   * @return {Array} first is formatted message, other args may follow
   */
  format (fmt, args, obj) {
    return format(fmt, args, this.formatOpts, obj)
  }
}

module.exports = Format
