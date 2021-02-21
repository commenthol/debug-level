/* eslint no-console:0 */

const assert = require('assert')

const Format = require('../src/Format.js')
const fixtures = require('./fixtures/Format.js')
const { testcases } = require('./fixtures/testcases.js')

// const inspect = (o) => console.log(require('util').inspect(o, {depth: Infinity}))
const inspect = () => {}

const WRITE = false

describe('#Format', function () {
  describe('format', function () {
    const fixture = fixtures
    const format = new Format()
    const exp = []

    after(() => {
      if (WRITE) inspect(exp)
    })

    testcases.forEach(({ name, args }, idx) => {
      it(name, function () {
        const res = format.format(...args)
        if (WRITE) exp.push(res)
        else assert.deepStrictEqual(res, fixture[idx])
      })
    })

    it('should use error name and message if stack is missing', function () {
      const err = new TypeError('untyped')
      const res = format.format(err)
      assert.strictEqual(res[0].substring(0, 19), '"TypeError: untyped')
    })

    it('should set noQuotes option', function () {
      format.noQuotes = false
      assert.deepStrictEqual(format.format('quotes %o', 'test'), ['quotes "test"'])
      format.noQuotes = true
      assert.deepStrictEqual(format.format('noQuotes %o', 'test'), ['noQuotes test'])
    })

    it('should get noQuotes option', function () {
      format.noQuotes = true
      assert.strictEqual(format.noQuotes, true)
      format.noQuotes = false
      assert.strictEqual(format.noQuotes, false)
    })

    it('should set spaces option', function () {
      format.spaces = 2
      assert.deepStrictEqual(format.format('%j', { a: { b: { c: 'd' } } }), ['{\n  "a": {\n    "b": {\n      "c": "d"\n    }\n  }\n}'])
    })

    it('should get spaces option', function () {
      assert.strictEqual(format.spaces, 2)
    })

    it('should ignore formatter which is not a function', function () {
      const format = new Format({ formatters: { x: 'no-function' } })
      assert.deepStrictEqual(format.format('%x', 'cant format'), ['%x', 'cant format'])
    })
  })
})
