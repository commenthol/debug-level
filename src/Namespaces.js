/**
* @license MIT
* @copyright debug contributors, <commenthol@gmail.com>
* @see https://github.com/visionmedia/debug
*/

const LEVELS_REGEX = /^(DEBUG|INFO|WARN|ERROR|FATAL|OFF):/i

module.exports = Namespaces

function Namespaces (namespaces) {
  this.enable(namespaces)
}

Namespaces.prototype = {
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
  },

  disable () {
    /* istanbul ignore next */
    this.enable('')
  },

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
  },

  /**
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
