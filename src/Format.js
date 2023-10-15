import fastStringify from 'fast-safe-stringify'
import { format as quickFormat } from './quick-format.js'

/**
 * @typedef {object} FormatOption
 * @property {number} [spaces] number of spaces to use for formatting
 */

export class Format {
  /**
   * @param {FormatOption} [opts]
   */
  constructor (opts) {
    const { spaces } = opts || {}
    this.opts = { spaces }
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
    this.formatOpts = {
      // @ts-expect-error
      stringify: (o) => fastStringify(o, null, this.opts.spaces),
      spaces: this.opts.spaces
    }
  }

  stringify (...args) {
    // @ts-expect-error
    return fastStringify(...args)
  }

  /**
   * formats arguments like `util.format`
   * @param {any} fmt may contain "%" formatters
   * @param {any} args arguments list
   * @param {any} obj
   * @return {Array} first is formatted message, other args may follow
   */
  format (fmt, args, obj) {
    return quickFormat(fmt, args, this.formatOpts, obj)
  }
}
