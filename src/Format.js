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
    /**
     * @param {any} any
     * @returns {string}
     */
    // @ts-expect-error
    const stringify = (any) => fastStringify(any, null, this.opts.spaces)
    this.formatOpts = {
      stringify,
      spaces: this.opts.spaces
    }
  }

  /**
   * @param  {...any} args
   * @returns {string}
   */
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
