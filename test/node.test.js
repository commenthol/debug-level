/* eslint no-console:0 */
/* global describe, it, before, after */

const assert = require('assert')
const sinon = require('sinon')
const {inspect} = require('util')

const Log = require('../src/node.js')
const fixtures = require('./fixtures/node.js')
const {testcases} = require('./fixtures/testcases.js')

const WRITE = false

describe('#Log', function () {
  it('should instantiate without new', function () {
    const log = Log('test')
    assert(log instanceof Log)
  })

  describe('levels', function () {
    const tests = [
      ['DEBUG', {error: 1, warn: 1, info: 1, debug: 1}],
      ['INFO',  {error: 1, warn: 1, info: 1}],
      ['WARN',  {error: 1, warn: 1}],
      ['ERROR', {error: 1}],
      ['OFF',   {}],
    ]
    tests.forEach(([level, expects]) => {
      it('shall display logs for level ' + level, function () {
        Log.options({level, json: false, colors: true, namespaces: 'test*'})
        const log = new Log('test::' + level)
        const res = {
          debug: log.debug('test') ? 1 : undefined,
          info:  log.info('test')  ? 1 : undefined,
          warn:  log.warn('test')  ? 1 : undefined,
          error: log.error('test') ? 1 : undefined
        }
        const exp = {
          debug: expects.debug,
          info:  expects.info,
          warn:  expects.warn,
          error: expects.error
        }
        assert.deepEqual(res, exp)
      })
    })
  })

  describe('formats', function () {
    describe('debug like', function () {
      const f = fixtures.debug
      let log
      let clock
      let exp = []

      before(() => {
        clock = sinon.useFakeTimers()
        Log.options({level: 'error', json: false, colors: false, namespaces: 'test*'})
        log = new Log('test', {hideDate: false})
      })

      after(() => {
        clock.restore()
        if (WRITE) console.log(inspect(exp))
      })

      testcases.forEach(({name, args}, idx) => {
        it(name, function () {
          const res = log.error(...args)
          clock.tick(1)
          if (WRITE) exp.push(res)
          else assert.equal(res, f[idx])
        })
      })
    })

    describe('json', function () {
      const f = fixtures.json
      let log
      let clock
      let exp = []

      before(() => {
        clock = sinon.useFakeTimers()
        Log.options({level: 'error', json: true, colors: false, serverinfo: false, namespaces: 'test*'})
        log = new Log('test', {hideDate: false})
      })

      after(() => {
        clock.restore()
        if (WRITE) console.log(inspect(exp))
      })

      testcases.forEach(({name, args}, idx) => {
        it(name, function () {
          const res = log.error(...args)
          clock.tick(1)
          if (WRITE) exp.push(res)
          else assert.equal(res, f[idx])
        })
      })
    })
  })

  describe('custom formatter', function () {
    let log

    before(() => {
      Log.options({namespaces: '*', json: false, colors: false, hideDate: true})
      log = new Log('custom:format', {formatters: {h: (n) => n.toString(16)}})
    })

    it('should display result hex formatted', function () {
      const res = log.error('hex(%h)', 3333)
      assert.equal(res, 'ERROR custom:format hex(d05) +0ms\n')
    })
  })
})
