/* eslint no-console: 0 no-multi-spaces: 0 */

const assert = require('assert')
const sinon = require('sinon')
const {inspect} = require('util')

const Log = require('..')
const fixtures = require('./fixtures/browser.js')
const {testcases: _testcases} = require('./fixtures/testcases.js')

const testcases = _testcases.concat([
  { name: 'custom color %c%o', args: [ 'custom color %c%o', 'color: red', {} ] }
])

const isBrowser = typeof window !== 'undefined'

let bdescribe = describe

if (!isBrowser) {
  bdescribe = () => {}
}

const WRITE = false

bdescribe('#Log', function () {
  // this.timeout(1000000)

  it('should instantiate without new', function () {
    const log = Log('test')
    assert(log instanceof Log)
  })

  describe('options', function () {
    after(() => {
      Log.reset()
    })

    it('should get default options', function () {
      const res = Log.options()
      assert.deepEqual(res, { colors: true, url: undefined })
    })

    it('should set options', function () {
      Log.options({level: 'error', colors: false, url: 'http://localhost:3000/log', namespaces: 'foo*,bar'})
      const res = Log.options()
      assert.deepEqual(res, {
        level: 'error',
        namespaces: 'foo*,bar',
        url: 'http://localhost:3000/log',
        colors: false
      })
    })

    it('should save options', function () {
      Log.options({level: 'ERROR', url: undefined, colors: true, namespaces: 'foo*,bar'})
      Log.save()
      const store = window.localStorage
      const res = Object.keys(store)
        .filter((env) => /^DEBUG/.test(env))
        .reduce((obj, key) => {
          obj[key] = store[key]
          return obj
        }, {})
      assert.deepEqual(res, {
        DEBUG: 'foo*,bar',
        DEBUG_LEVEL: 'ERROR',
        DEBUG_COLORS: 'true',
        DEBUG_URL: 'undefined'
      })
    })
  })

  describe('levels', function () {
    const tests = [
      [undefined, {fatal: 1, error: 1, warn: 1, info: 1, debug: 1}],
      ['DEBUG',   {fatal: 1, error: 1, warn: 1, info: 1, debug: 1}],
      ['INFO',    {fatal: 1, error: 1, warn: 1, info: 1}],
      ['WARN',    {fatal: 1, error: 1, warn: 1}],
      ['ERROR',   {fatal: 1, error: 1}],
      ['FATAL',   {fatal: 1}],
      ['OFF',     {}]
    ]
    tests.forEach(([level, expects]) => {
      it('shall display logs for level ' + level, function () {
        Log.options({level, namespaces: 'test:*'})
        const log = new Log('test:' + (level || 'undefined').toLowerCase())
        const res = {
          log: log.log('test') ? 1 : undefined,
          debug: log.debug('test') ? 1 : undefined,
          info: log.info('test') ? 1 : undefined,
          warn: log.warn('test') ? 1 : undefined,
          error: log.error('test') ? 1 : undefined,
          fatal: log.fatal('test') ? 1 : undefined
        }
        const exp = {
          log: 1,
          debug: expects.debug,
          info: expects.info,
          warn: expects.warn,
          error: expects.error,
          fatal: expects.fatal
        }
        assert.deepEqual(res, exp)
      })
    })

    describe('levels wo namespace', function () {
      const tests = [
        [undefined, {}],
        ['DEBUG',   {fatal: 1, error: 1, warn: 1, info: 1, debug: 1}],
        ['INFO',    {fatal: 1, error: 1, warn: 1, info: 1}],
        ['WARN',    {fatal: 1, error: 1, warn: 1}],
        ['ERROR',   {fatal: 1, error: 1}],
        ['FATAL',   {fatal: 1}],
        ['OFF',     {}]
      ]
      tests.forEach(([level, expects]) => {
        it('shall display logs for level ' + level, function () {
          Log.options({level, namespaces: undefined})
          const log = new Log('test:' + (level || 'undefined').toLowerCase())
          const res = {
            debug: log.debug('test') ? 1 : undefined,
            info: log.info('test') ? 1 : undefined,
            warn: log.warn('test') ? 1 : undefined,
            error: log.error('test') ? 1 : undefined,
            fatal: log.fatal('test') ? 1 : undefined
          }
          const exp = {
            debug: expects.debug,
            info: expects.info,
            warn: expects.warn,
            error: expects.error,
            fatal: expects.fatal
          }
          assert.deepEqual(res, exp)
        })
      })
    })
  })

  describe('namespaced levels', function () {
    const tests = [
      // level,   nsLevel,   expects
      [undefined, undefined, {fatal: 1, error: 1, warn: 1, info: 1, debug: 1}],
      [undefined, 'DEBUG',   {fatal: 1, error: 1, warn: 1, info: 1, debug: 1}],
      [undefined, 'INFO',    {fatal: 1, error: 1, warn: 1, info: 1}],
      [undefined, 'WARN',    {fatal: 1, error: 1, warn: 1}],
      [undefined, 'ERROR',   {fatal: 1, error: 1}],
      [undefined, 'FATAL',   {fatal: 1}],
      [undefined, 'OFF',     {}],
      ['ERROR',   undefined, {fatal: 1, error: 1}],
      ['ERROR',   'DEBUG',   {fatal: 1, error: 1, warn: 1, info: 1, debug: 1}],
      ['ERROR',   'INFO',    {fatal: 1, error: 1, warn: 1, info: 1}],
      ['ERROR',   'WARN',    {fatal: 1, error: 1, warn: 1}],
      ['ERROR',   'ERROR',   {fatal: 1, error: 1}],
      ['FATAL',   'FATAL',   {fatal: 1}],
      ['ERROR',   'OFF',     {}]
    ]
    tests.forEach(([level, nsLevel, expects]) => {
      it(`shall display logs for level ${level} using namespaced-level ${nsLevel}`, function () {
        Log.options({
          level,
          namespaces: `other,${nsLevel ? nsLevel + ':' : ''}test,log*`
        })
        const log = new Log('test')
        const res = {
          debug: log.debug('test') ? 1 : undefined,
          info: log.info('test') ? 1 : undefined,
          warn: log.warn('test') ? 1 : undefined,
          error: log.error('test') ? 1 : undefined,
          fatal: log.fatal('test') ? 1 : undefined
        }
        const exp = {
          debug: expects.debug,
          info: expects.info,
          warn: expects.warn,
          error: expects.error,
          fatal: expects.fatal
        }
        assert.deepEqual(res, exp)
      })
    })
  })

  describe('enabled', function () {
    const tests = [
      ['DEBUG', {fatal: true,  error: true,  warn: true,  info: true,  debug: true}],
      ['INFO',  {fatal: true,  error: true,  warn: true,  info: true,  debug: false}],
      ['WARN',  {fatal: true,  error: true,  warn: true,  info: false, debug: false}],
      ['ERROR', {fatal: true,  error: true,  warn: false, info: false, debug: false}],
      ['FATAL', {fatal: true,  error: false, warn: false, info: false, debug: false}],
      ['OFF',   {fatal: false, error: false, warn: false, info: false, debug: false}]
    ]
    tests.forEach(([level, exp]) => {
      it('shall check if enabled for level ' + level, function () {
        Log.options({level, json: false, colors: true, namespaces: 'test*'})
        const log = new Log('test:' + level.toLowerCase())
        const res = {
          debug: log.enabled.debug,
          info: log.enabled.info,
          warn: log.enabled.warn,
          error: log.enabled.error,
          fatal: log.enabled.fatal
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
        /// read options from storage
        window.localStorage.debug_level = 'error'
        window.localStorage.debug_colors = 'false'
        window.localStorage.debug = 'test*'
        log = new Log('test')
      })

      after(() => {
        clock.restore()
        if (WRITE) console.log(inspect(exp))
        Object.keys(window.localStorage).forEach((i) => window.localStorage.removeItem(i))
      })

      testcases.forEach(({name, args}, idx) => {
        it(name, function () {
          const res = log.error(...args)
          clock.tick(1)
          if (WRITE) exp.push(res)
          else assert.deepEqual(res, f[idx], '[' + idx + '] ' + res + ' !== ' + f[idx])
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
      })

      after(() => {
        clock.restore()
        if (WRITE) console.log(inspect(exp, {depth: Infinity}))
      })

      testcases.forEach(({name, args}, idx) => {
        it(name, function () {
          const res = log.error(...args)
          clock.tick(1)
          if (WRITE) exp.push(res)
          else assert.deepEqual(res, f[idx], '[' + idx + '] ' + res + ' !== ' + f[idx])
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

  describe('namespaces', function () {
    describe('namespace *', function () {
      const tests = [
        [undefined, {fatal: 1, error: 1, warn: 1, info: 1, debug: 1}],
        ['DEBUG',   {fatal: 1, error: 1, warn: 1, info: 1, debug: 1}],
        ['INFO',    {fatal: 1, error: 1, warn: 1, info: 1}],
        ['WARN',    {fatal: 1, error: 1, warn: 1}],
        ['ERROR',   {fatal: 1, error: 1}],
        ['FATAL',   {fatal: 1}],
        ['OFF',     {}]
      ]
      tests.forEach(([level, expects]) => {
        it(`shall ${level === 'OFF' ? 'never' : 'always'} log for level ${level}`, function () {
          Log.options({level, namespaces: 'aaa', json: false, colors: true})
          const log = new Log('*')
          const res = {
            debug: log.debug('test') ? 1 : undefined,
            info: log.info('test') ? 1 : undefined,
            warn: log.warn('test') ? 1 : undefined,
            error: log.error('test') ? 1 : undefined,
            fatal: log.fatal('test') ? 1 : undefined
          }
          const exp = {
            debug: expects.debug,
            info: expects.info,
            warn: expects.warn,
            error: expects.error,
            fatal: expects.fatal
          }
          assert.deepEqual(res, exp)
        })
      })
    })

    describe('skip', function () {
      it('should skip "one"', function () {
        Log.options({level: undefined, namespaces: '-one,two'})
        const log1 = new Log('one')
        const log2 = new Log('two')
        assert(!/one/.test(log1.error('one')))
        assert(/two/.test(log2.error('two')))
      })
    })
  })

  describe('custom formatter', function () {
    let log

    before(() => {
      Log.options({level: 'ERROR', namespaces: undefined})
      log = new Log('custom:format', {colors: false, formatters: {h: (n) => n.toString(16)}})
    })

    it('should display result hex formatted', function () {
      const res = log.error('hex(%h)', 3333)
      assert.equal(res[0], 'ERROR custom:format hex(d05) +0ms')
    })
  })
})
