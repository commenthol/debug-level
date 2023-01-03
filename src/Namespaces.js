/**
 * @license MIT
 * @copyright debug contributors, <commenthol@gmail.com>
 * @see https://github.com/visionmedia/debug
 */

import { TRACE, DEBUG, INFO, WARN, ERROR, FATAL, OFF } from './utils.js'

const LEVELS = [TRACE, DEBUG, INFO, WARN, ERROR, FATAL, OFF]
const LEVELS_REGEX = RegExp(`^(${LEVELS.join('|')}):`, 'i')

export class Namespaces {
  constructor (namespaces) {
    this.skips = []
    this.names = []
    this.enable(namespaces)
  }

  /**
   * @param {string} namespaces
   */
  enable (namespaces) {
    this.skips = []
    this.names = []

    const splited = (typeof namespaces === 'string'
      ? namespaces
      : ''
    ).split(/[\s,]+/)

    for (const _namespace of splited) {
      if (!_namespace) continue // ignore empty strings
      const { namespace, level } = this._namespaceNLevel(_namespace)
      if (namespace[0] === '-') {
        this.skips.push({ re: new RegExp('^' + namespace.substr(1) + '$') })
      } else {
        this.names.push({ re: new RegExp('^' + namespace + '$'), level })
      }
    }

    // sort names by levels
    this.names = this.names.sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level))
  }

  /* c8 ignore next 3 */
  disable () {
    this.enable('')
  }

  /**
   * @param {string} name
   */
  isEnabled (name, level) {
    if (name === '*') {
      return level || 'DEBUG'
    }
    if (!this.names.length) {
      return level
    }

    for (const _skip of this.skips) {
      if (_skip.re.test(name)) {
        return
      }
    }
    for (const _name of this.names) {
      if (_name.re.test(name)) {
        return _name.level || level || 'DEBUG'
      }
    }
  }

  /**
   * @param {string} _namespace
   * @private
   */
  _namespaceNLevel (_namespace) {
    const level = (LEVELS_REGEX.exec(_namespace) || [])[1]
    const namespace = _namespace
      .replace(LEVELS_REGEX, '')
      .replace(/\*/g, '.*?')
    return { namespace, level }
  }
}
