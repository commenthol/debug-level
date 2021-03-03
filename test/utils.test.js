/* eslint no-console: 0 no-multi-spaces: 0 */

const assert = require('assert')
const { adjustLevel, toNumLevel, fromNumLevel, inspectOpts, inspectNamespaces, random, LEVELS, LOG } = require('../src/utils.js')

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

  describe('numbered levels', function () {
    it('shall convert to numbered levels', function () {
      const res = LEVELS.TRACE.concat(LOG, '##').map(l => toNumLevel(l))
      assert.deepStrictEqual(res, [60, 50, 40, 30, 20, 10, 30, 20])
    })

    it('shall convert back to readable levels', function () {
      const res = [101, 60, 51, 50, 40, 30, 20, 10, 0].map(l => fromNumLevel(l))
      assert.deepStrictEqual(res, ['FATAL', 'FATAL', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE', 'TRACE'])
    })
  })
})
