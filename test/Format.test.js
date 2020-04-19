/* eslint no-console:0 */
/* global describe, it, after */

const assert = require('assert')
const { inspect } = require('util')

const Format = require('../src/Format.js')
const fixtures = require('./fixtures/Format.js')
const { testcases } = require('./fixtures/testcases.js')

const WRITE = false

describe('#Format', function () {
  describe('format', function () {
    const fixture = fixtures
    const format = new Format()
    const exp = []

    after(() => {
      if (WRITE) console.log(inspect(exp, { depth: Infinity }))
    })

    testcases.forEach(({ name, args }, idx) => {
      it(name, function () {
        const res = format.format(...args)
        if (WRITE) exp.push(res)
        else assert.deepEqual(res, fixture[idx])
      })
    })

    it('should use error name and message if stack is missing', function () {
      const err = new TypeError('untyped')
      delete err.stack
      const res = format.format(err)
      assert.deepEqual(res, ['"TypeError untyped"'])
    })

    it('should set noQuotes option', function () {
      format.noQuotes = false
      assert.deepEqual(format.format('quotes %o', 'test'), ['quotes "test"'])
      format.noQuotes = true
      assert.deepEqual(format.format('noQuotes %o', 'test'), ['noQuotes test'])
    })

    it('should get noQuotes option', function () {
      format.noQuotes = true
      assert.equal(format.noQuotes, true)
      format.noQuotes = false
      assert.equal(format.noQuotes, false)
    })

    it('should set spaces option', function () {
      format.spaces = 2
      assert.deepEqual(format.format('%j', { a: { b: { c: 'd' } } }), ['{\n  "a": {\n    "b": {\n      "c": "d"\n    }\n  }\n}'])
    })

    it('should get spaces option', function () {
      assert.equal(format.spaces, 2)
    })

    it('should ignore formatter which is not a function', function () {
      const format = new Format({ formatters: { x: 'no-function' } })
      assert.deepEqual(format.format('%x', 'cant format'), ['%x', 'cant format'])
    })
  })
})
