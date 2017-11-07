/* eslint no-console:0 */
/* global describe, it, after */

const assert = require('assert')
const {inspect} = require('util')

const Format = require('../src/Format.js')
const fixtures = require('./fixtures/Format.js')
const {testcases} = require('./fixtures/testcases.js')

const WRITE = false

describe('#Format', function () {
  describe('format', function () {
    const fixture = fixtures
    const format = new Format()
    let exp = []

    after(() => {
      if (WRITE) console.log(inspect(exp, {depth: Infinity}))
    })

    testcases.forEach(({name, args}, idx) => {
      it(name, function () {
        const res = format.format(...args)
        if (WRITE) exp.push(res)
        else assert.deepEqual(res, fixture[idx])
      })
    })
  })
})
