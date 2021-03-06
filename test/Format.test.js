/* eslint no-console:0 */

const assert = require('assert')

const Format = require('../src/Format.js')
const fixtures = require('./fixtures/Format.js')
const { testcases } = require('./fixtures/testcases.js')
const ua = require('./helpers/ua.js')

const inspect = (o) => console.log('%j', o)

const WRITE = false

describe('#Format', function () {
  describe('format', function () {
    const fixture = fixtures.format
    const format = new Format()
    const exp = []

    after(() => {
      if (WRITE) inspect(exp)
    })

    testcases.forEach(({ name, args }, idx) => {
      it(idx + ' ' + name, function () {
        const [fmt, ...fmtArgs] = args
        const res = format.format(fmt, fmtArgs)
        const fixt = (fixtures[ua] && fixtures[ua][idx]) || fixture[idx]
        if (WRITE) exp.push(res)
        assert.deepStrictEqual(res, fixt)
      })
    })

    it('should set spaces option', function () {
      format.spaces = 2
      assert.deepStrictEqual(
        format.format('%j', [{ a: { b: { c: 'd' } } }]),
        '{\n  "a": {\n    "b": {\n      "c": "d"\n    }\n  }\n}'
      )
    })

    it('should get spaces option', function () {
      assert.strictEqual(format.spaces, 2)
    })

    it('should expose stringify', function () {
      const res = format.stringify({ test: 1 })
      assert.strictEqual(res, '{"test":1}')
    })
  })
})
