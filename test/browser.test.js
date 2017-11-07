/* eslint no-console:0 */
/* global describe, it, before, after, localStorage */

const assert = require('assert')
const sinon = require('sinon')
const {inspect} = require('util')

const _Log = require('../src/browser.js')
const fixtures = require('./fixtures/browser.js')
const {testcases: testcases_} = require('./fixtures/testcases.js')

const testcases = testcases_.concat([
  { name: 'custom color %c%o', args: [ 'custom color %c%o', 'color: red', {}] }
])

const isBrowser = typeof window !== 'undefined'

let bdescribe = describe

if (!isBrowser) {
  bdescribe = () => {}
}

const WRITE = false

function Log (name) {
  _Log.call(this, name)
}
Object.setPrototypeOf(Log.prototype, _Log.prototype)
Log.prototype.render = function (args) {
  console.log(...args)
  return args
}
Log.options = _Log.options

bdescribe('#Log', function () {
  it('should instantiate without new', function () {
    const log = _Log('test')
    assert(log instanceof _Log)
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
        Log.options({level, namespaces: 'test*'})
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
      const f = fixtures.browser
      let log
      let clock
      let exp = []

      before(() => {
        clock = sinon.useFakeTimers()
        // Log.options({level: 'error', colors: false, namespaces: 'test*'})
        // localStorage.DEBUG_LEVEL = 'error'
        // localStorage.DEBUG_COLORS = 'false'
        // localStorage.DEBUG = 'test*'
        localStorage.debug_level = 'error'
        localStorage.debug_colors = 'false'
        localStorage.debug = 'test*'
        log = new Log('test')
      })

      after(() => {
        clock.restore()
        if (WRITE) console.log(inspect(exp))
        Object.keys(localStorage).forEach((i) => localStorage.removeItem(i))
      })

      testcases.forEach(({name, args}, idx) => {
        it(name, function () {
          const res = log.error(...args)
          clock.tick(1)
          if (WRITE) exp.push(res)
          else assert.deepEqual(res, f[idx])
        })
      })
    })

    describe('debug like with colors', function () {
      const f = fixtures.colors
      let log
      let clock
      let exp = []

      before(() => {
        clock = sinon.useFakeTimers()
        Log.options({level: 'error', namespaces: 'test*'})
        log = new Log('test')
        // log.opts.colors = true // fake colors options
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
          else assert.deepEqual(res, f[idx], idx)
        })
      })
    })

    describe('send log', function () {
      let log
      let clock
      let exp = []

      before(() => {
        clock = sinon.useFakeTimers()
        Log.options({level: 'error', namespaces: 'test*', url: '/logger'})
        log = new Log('test')
      })

      after((done) => {
        clock.restore()
        if (WRITE) console.log(inspect(exp))
        setTimeout(() => {
          done()
        }, 1000) // need timeout such that chrome finished loading the imgs
      })

      testcases.forEach(({name, args}) => {
        it(name, function (done) {
          log.error(...args)
          clock.tick(1)
          done()
        })
      })
    })
  })
})
