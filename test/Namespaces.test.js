const assert = require('assert')
const Namespaces = require('../src/Namespaces.js')

describe('Namespaces', function () {
  it('should log ns test in DEBUG and all the rest with ERROR', function () {
    const namespaces = 'DEBUG:test,ERROR:*'
    const namespace = new Namespaces(namespaces)
    assert.strictEqual(namespace.isEnabled('test', undefined), 'DEBUG')
    assert.strictEqual(namespace.isEnabled('any', undefined), 'ERROR')
  })

  it('should log ns test in DEBUG and all the rest with ERROR if reversed in order', function () {
    const namespaces = 'ERROR:*,DEBUG:test'
    const namespace = new Namespaces(namespaces)
    assert.strictEqual(namespace.isEnabled('test', undefined), 'DEBUG')
    assert.strictEqual(namespace.isEnabled('any', undefined), 'ERROR')
  })

  it('should ignore enabled for unappropriate namespace', function () {
    const namespaces = 'DEBUG:test'
    const namespace = new Namespaces(namespaces)
    assert.strictEqual(namespace.isEnabled('any', 'FATAL'), undefined)
  })
})
