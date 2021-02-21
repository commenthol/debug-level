/* eslint no-console: 0 no-multi-spaces: 0 */

const assert = require('assert')
const { adjustLevel, inspectOpts, inspectNamespaces, random } = require('../src/utils.js')

describe('#utils', function () {
  it('adjustLevel() should use default', function () {
    const res = adjustLevel(undefined, 'DEBUG')
    assert.strictEqual(res, 'DEBUG')
  })

  it('inspectOpts() should read opts', function () {
    const opts = {
      DEBUG_URL: '/url',
      DEBUG_STREAM: 'do-not-pass',
      DEBUG_formatters: 'do-not-pass',
      DEBUG: 'namespace1,*',
      debug_level: 'INFO',
      debug_json: 1,
      debug_colors: 'on',
      debug_null: 'null',
      DEBUG_HIDE_DATE: 'false'
    }
    const exp = {
      null: null,
      json: 1,
      url: '/url',
      level: 'INFO',
      colors: true,
      hideDate: false
    }
    const res = inspectOpts(opts)
    assert.deepStrictEqual(res, exp)
  })

  it('inspectOpts() should omit wrong level', function () {
    const opts = {
      debug_level: 'NOT-DEFINED'
    }
    const exp = {}
    const res = inspectOpts(opts)
    assert.deepStrictEqual(res, exp)
  })

  it('inspectNamespaces() should return undefined', function () {
    const res = inspectNamespaces({})
    assert.strictEqual(res, undefined)
  })

  it('inspectNamespaces() should return', function () {
    const res = inspectNamespaces({ debug: '*' })
    assert.strictEqual(res.namespaces, '*')
  })

  it('random() should return random hex string', function () {
    const res = random()
    assert.ok(typeof res === 'string')
  })
})
