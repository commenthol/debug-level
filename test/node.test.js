/* eslint no-console: 0 no-multi-spaces: 0 */

const assert = require('assert')
const os = require('os')
const sinon = require('sinon')
const {inspect} = require('util')

const Log = require('..')
const fixtures = require('./fixtures/node.js')
const {testcases} = require('./fixtures/testcases.js')

const WRITE = false

describe('#Log', function () {
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
      assert.deepEqual(res, {
        json: false,
        serverinfo: false,
        hideDate: true,
        colors: true,
        spaces: null,
        stream: process.stderr
      })
    })

    it('should set options', function () {
      Log.options({level: 'error', json: true, colors: false, namespaces: 'foo*,bar'})
      const res = Log.options()
      assert.deepEqual(res, {
        level: 'error',
        namespaces: 'foo*,bar',
        json: true,
        serverinfo: false,
        hideDate: true,
        colors: false,
        spaces: null,
        stream: process.stderr
      })
    })

    it('should save options', function () {
      Log.options({level: 'ERROR', json: true, colors: false, namespaces: 'foo*,bar'})
      Log.save()
      const res = Object.keys(process.env)
        .filter((env) => /^DEBUG/.test(env))
        .reduce((obj, key) => {
          obj[key] = process.env[key]
          return obj
        }, {})
      assert.deepEqual(res, {
        DEBUG: 'foo*,bar',
        DEBUG_LEVEL: 'ERROR',
        DEBUG_COLORS: 'false',
        DEBUG_JSON: 'true',
        DEBUG_SERVERINFO: 'false',
        DEBUG_HIDE_DATE: 'true',
        DEBUG_SPACES: 'null'
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
        Log.options({level, namespaces: 'test:*', json: false, colors: true})
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
          Log.options({level, namespaces: undefined, json: false, colors: true})
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
          namespaces: `other,${nsLevel ? nsLevel + ':' : ''}test,log*`,
          json: false,
          colors: true
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
        Log.reset()
      })

      testcases.forEach(({name, args}, idx) => {
        it(name, function () {
          const res = log.error(...args)
          clock.tick(1)
          if (WRITE) exp.push(res)
          else assert.equal(res, f[idx], res + ' !== ' + f[idx])
        })
      })

      it('should log serverinfo and pid', function () {
        const log = new Log('*', {level: undefined, serverinfo: true})
        const res = log.error('test')
        assert(res.indexOf(os.hostname()) !== -1)
        assert(res.indexOf(process.pid) !== -1)
      })
    })

    describe('json', function () {
      const f = fixtures.json
      let log
      let clock
      let exp = []

      before(() => {
        clock = sinon.useFakeTimers()
        Log.options({level: 'error', namespaces: 'test*', json: true, colors: false, serverinfo: false})
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
          else assert.equal(res, f[idx], res + ' !== ' + f[idx])
        })
      })

      it('should remove object only formatters', function () {
        const log = Log('*')
        const res = log.error('%j ', {a: {b: 'c'}})
        assert.equal(res, '{"level":"ERROR","name":"*","a":{"b":"c"},"diff":0}\n')
      })

      it('should log serverinfo and pid', function () {
        const log = new Log('*', {level: undefined, serverinfo: true, json: true})
        const res = log.error('test')
        assert(res.indexOf('"hostname":"' + os.hostname()) !== -1, 'missing hostname')
        assert(res.indexOf('"pid":' + process.pid) !== -1, 'missing pid')
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
        it('shall always log for level ' + level, function () {
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
      Log.options({level: 'ERROR', namespaces: undefined, json: false, colors: false, hideDate: true})
      log = new Log('custom:format', {formatters: {h: (n) => n.toString(16)}})
    })

    it('should display result hex formatted', function () {
      const res = log.error('hex(%h)', 3333)
      assert.equal(res, '  ERROR custom:format hex(d05) +0ms\n')
    })
  })
})
