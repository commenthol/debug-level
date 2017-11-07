/**
* @license MIT
* @copyright debug contributors
* @see https://github.com/visionmedia/debug
*/

module.exports = Namespaces

function Namespaces (namespaces) {
  this.enable(namespaces)
}

Namespaces.prototype = {
  enable (namespaces) {
    this.skips = []
    this.names = []

    const split = (typeof namespaces === 'string'
      ? namespaces
      : ''
    ).split(/[\s,]+/)

    for (let _namespace of split) {
      if (!_namespace) continue // ignore empty strings
      const namespace = _namespace.replace(/\*/g, '.*?')
      if (namespace[0] === '-') {
        this.skips.push(new RegExp('^' + namespace.substr(1) + '$'))
      } else {
        this.names.push(new RegExp('^' + namespace + '$'))
      }
    }
  },

  disable () {
    this.enable('')
  },

  isEnabled (name) {
    if (name[name.length - 1] === '*') {
      return true
    }
    for (let _skip of this.skips) {
      if (_skip.test(name)) {
        return false
      }
    }
    for (let _name of this.names) {
      if (_name.test(name)) {
        return true
      }
    }
    return false
  }
}
