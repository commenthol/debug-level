/* eslint no-console: 0 no-multi-spaces: 0 */

import assert from 'assert'
import os from 'os'
import sinon from 'sinon'
import debug from 'debug'
import { inspect } from 'util'

import Log from '../src/index.js'
import fixtures from './fixtures/node.js'
import { testcases } from './fixtures/testcases.js'

const WRITE = false

const defaultOpts = Log.options()

const reset = () => {
  Log.options(defaultOpts)
  Log.reset()
}

const cidescribe = process.env.npm_lifecycle_event === 'test:ci' ? () => {} : describe

describe('#Log node', function () {
  describe('options', function () {
    after(reset)

    it('should get default options', function () {
      const { stream, serializers, ...res } = Log.options()
      assert.deepStrictEqual(res, {
        level: 'INFO',
        namespaces: undefined,
        levelNumbers: false,
        json: false,
        serverinfo: false,
        timestamp: undefined,
        sonic: false,
        sonicLength: 4096,
        sonicFlushMs: 1000,
        colors: true,
        spaces: undefined,
        splitLine: true
      })
    })

    it('should set options', function () {
      Log.options({ level: 'error', json: true, colors: false, namespaces: 'foo*,bar' })
      const { stream, serializers, ...res } = Log.options()
      assert.deepStrictEqual(res, {
        level: 'error',
        namespaces: 'foo*,bar',
        levelNumbers: false,
        json: true,
        serverinfo: false,
        timestamp: undefined,
        sonic: false,
        sonicLength: 4096,
        sonicFlushMs: 1000,
        colors: false,
        spaces: undefined,
        splitLine: true
      })
    })

    it('should save options', function () {
      Log.options({ level: 'ERROR', json: true, colors: false, namespaces: 'foo*,bar' })
      Log.save()
      const res = Object.keys(process.env)
        .filter((env) => /^DEBUG/.test(env))
        .reduce((obj, key) => {
          obj[key] = process.env[key]
          return obj
        }, {})
      assert.deepStrictEqual(res, {
        DEBUG: 'foo*,bar',
        DEBUG_LEVEL: 'ERROR',
        DEBUG_LEVEL_NUMBERS: 'false',
        DEBUG_COLORS: 'false',
        DEBUG_JSON: 'true',
        DEBUG_SERVERINFO: 'false',
        DEBUG_TIMESTAMP: 'undefined',
        DEBUG_SONIC: 'false',
        DEBUG_SONIC_LENGTH: '4096',
        DEBUG_SONIC_FLUSH_MS: '1000',
        DEBUG_SPACES: 'undefined',
        DEBUG_SPLIT_LINE: 'true'
      })
    })
  })

  describe('time', function () {
    let clock
    beforeEach(function () {
      clock = sinon.useFakeTimers(new Date(86000))
    })
    afterEach(function () {
      clock.restore()
    })
    it('should log no time', function () {
      const log = new Log('test', { timestamp: false, colors: false, namespaces: '*' })
      const res = log.log('a log line')
      assert.strictEqual(res, '  LOG test a log line +0ms')
    })

    it('should log in iso time', function () {
      const log = new Log('test', { timestamp: 'iso', colors: false, namespaces: '*' })
      const res = log.log('a log line')
      assert.strictEqual(res, '  LOG test 1970-01-01T00:01:26.000Z a log line +0ms')
    })

    it('should log in epoch time', function () {
      const log = new Log('test', { timestamp: 'epoch', colors: false, namespaces: '*' })
      const res = log.log('a log line')
      assert.strictEqual(res, '  LOG test 86000 a log line +0ms')
    })

    it('should log in unix time', function () {
      const log = new Log('test', { timestamp: 'unix', colors: false, namespaces: '*' })
      const res = log.log('a log line')
      assert.strictEqual(res, '  LOG test 86 a log line +0ms')
    })
  })

  describe('levels', function () {
    after(reset)

    const tests = [
      [undefined, { fatal: 1, error: 1, warn: 1, info: 1, debug: 1 }],
      ['TRACE',   { fatal: 1, error: 1, warn: 1, info: 1, debug: 1, trace: 1 }],
      ['DEBUG',   { fatal: 1, error: 1, warn: 1, info: 1, debug: 1 }],
      ['INFO',    { fatal: 1, error: 1, warn: 1, info: 1 }],
      ['WARN',    { fatal: 1, error: 1, warn: 1 }],
      ['ERROR',   { fatal: 1, error: 1 }],
      ['FATAL',   { fatal: 1 }],
      ['OFF',     {}]
    ]
    tests.forEach(([level, expects]) => {
      it('shall display logs for level ' + level, function () {
        Log.options({ level, namespaces: 'test:*', json: false, colors: true })
        const log = new Log('test:' + (level || 'undefined').toLowerCase())
        const res = {
          log: log.log('test') ? 1 : undefined,
          trace: log.trace('test') ? 1 : undefined,
          debug: log.debug('test') ? 1 : undefined,
          info: log.info('test') ? 1 : undefined,
          warn: log.warn('test') ? 1 : undefined,
          error: log.error('test') ? 1 : undefined,
          fatal: log.fatal('test') ? 1 : undefined
        }
        const exp = {
          log: 1,
          trace: expects.trace,
          debug: expects.debug,
          info: expects.info,
          warn: expects.warn,
          error: expects.error,
          fatal: expects.fatal
        }
        assert.deepStrictEqual(res, exp)
      })
    })

    describe('levels wo namespace', function () {
      after(reset)

      const tests = [
        [undefined, {}],
        ['TRACE',   { fatal: 1, error: 1, warn: 1, info: 1, debug: 1, trace: 1 }],
        ['DEBUG',   { fatal: 1, error: 1, warn: 1, info: 1, debug: 1 }],
        ['INFO',    { fatal: 1, error: 1, warn: 1, info: 1 }],
        ['WARN',    { fatal: 1, error: 1, warn: 1 }],
        ['ERROR',   { fatal: 1, error: 1 }],
        ['FATAL',   { fatal: 1 }],
        ['OFF',     {}]
      ]
      tests.forEach(([level, expects]) => {
        it('shall display logs for level ' + level, function () {
          Log.options({ level, namespaces: undefined, json: false, colors: true })
          const log = new Log('test:' + (level || 'undefined').toLowerCase())
          const res = {
            trace: log.trace('test') ? 1 : undefined,
            debug: log.debug('test') ? 1 : undefined,
            info: log.info('test') ? 1 : undefined,
            warn: log.warn('test') ? 1 : undefined,
            error: log.error('test') ? 1 : undefined,
            fatal: log.fatal('test') ? 1 : undefined
          }
          const exp = {
            trace: expects.trace,
            debug: expects.debug,
            info: expects.info,
            warn: expects.warn,
            error: expects.error,
            fatal: expects.fatal
          }
          assert.deepStrictEqual(res, exp)
        })
      })
    })

    describe('numbered levels', function () {
      const tests = [
        ['log', '{"level":30,"name":"test","msg":"test","diff":0}'],
        ['trace', '{"level":10,"name":"test","msg":"test","diff":0}'],
        ['debug', '{"level":20,"name":"test","msg":"test","diff":0}'],
        ['info', '{"level":30,"name":"test","msg":"test","diff":0}'],
        ['warn', '{"level":40,"name":"test","msg":"test","diff":0}'],
        ['error', '{"level":50,"name":"test","msg":"test","diff":0}'],
        ['fatal', '{"level":60,"name":"test","msg":"test","diff":0}']
      ]

      tests.forEach(([level, exp]) => {
        it('shall write levels as numbers for ' + level, function () {
          const log = new Log('test', { levelNumbers: true, level: 'trace', json: true, colors: false })
          const res = log[level]('test')
          assert.strictEqual(res, exp)
        })
      })
    })
  })

  describe('namespaced levels', function () {
    after(reset)

    const tests = [
      // level,   nsLevel,   expects
      [undefined, undefined, { fatal: 1, error: 1, warn: 1, info: 1, debug: 1 }],
      [undefined, 'TRACE',   { fatal: 1, error: 1, warn: 1, info: 1, debug: 1, trace: 1 }],
      [undefined, 'DEBUG',   { fatal: 1, error: 1, warn: 1, info: 1, debug: 1 }],
      [undefined, 'INFO',    { fatal: 1, error: 1, warn: 1, info: 1 }],
      [undefined, 'WARN',    { fatal: 1, error: 1, warn: 1 }],
      [undefined, 'ERROR',   { fatal: 1, error: 1 }],
      [undefined, 'FATAL',   { fatal: 1 }],
      [undefined, 'OFF',     {}],
      ['ERROR',   undefined, { fatal: 1, error: 1 }],
      ['ERROR',   'TRACE',   { fatal: 1, error: 1, warn: 1, info: 1, debug: 1, trace: 1 }],
      ['ERROR',   'DEBUG',   { fatal: 1, error: 1, warn: 1, info: 1, debug: 1 }],
      ['ERROR',   'INFO',    { fatal: 1, error: 1, warn: 1, info: 1 }],
      ['ERROR',   'WARN',    { fatal: 1, error: 1, warn: 1 }],
      ['ERROR',   'ERROR',   { fatal: 1, error: 1 }],
      ['FATAL',   'FATAL',   { fatal: 1 }],
      ['ERROR',   'OFF',     {}]
    ]
    tests.forEach(([level, nsLevel, expects]) => {
      it(`shall display logs for level ${level} using namespaced-level ${nsLevel}`, function () {
        Log.options({
          level,
          namespaces: `other,${nsLevel ? nsLevel + ':' : ''}test,log*`,
          json: false,
          colors: true,
          stream: process.stdout
        })
        const log = new Log('test')
        const res = {
          trace: log.trace('test') ? 1 : undefined,
          debug: log.debug('test') ? 1 : undefined,
          info: log.info('test') ? 1 : undefined,
          warn: log.warn('test') ? 1 : undefined,
          error: log.error('test') ? 1 : undefined,
          fatal: log.fatal('test') ? 1 : undefined
        }
        const exp = {
          trace: expects.trace,
          debug: expects.debug,
          info: expects.info,
          warn: expects.warn,
          error: expects.error,
          fatal: expects.fatal
        }
        assert.deepStrictEqual(res, exp)
      })
    })
  })

  describe('enabled', function () {
    after(reset)

    const tests = [
      ['TRACE', { fatal: true,  error: true,  warn: true,  info: true,  debug: true, trace: true }],
      ['DEBUG', { fatal: true,  error: true,  warn: true,  info: true,  debug: true, trace: false }],
      ['INFO',  { fatal: true,  error: true,  warn: true,  info: true,  debug: false, trace: false }],
      ['WARN',  { fatal: true,  error: true,  warn: true,  info: false, debug: false, trace: false }],
      ['ERROR', { fatal: true,  error: true,  warn: false, info: false, debug: false, trace: false }],
      ['FATAL', { fatal: true,  error: false, warn: false, info: false, debug: false, trace: false }],
      ['OFF',   { fatal: false, error: false, warn: false, info: false, debug: false, trace: false }]
    ]
    tests.forEach(([level, exp]) => {
      it('shall check if enabled for level ' + level, function () {
        Log.options({ level, json: false, colors: true, namespaces: 'test*' })
        const log = new Log('test:' + level.toLowerCase())
        const res = {
          trace: log.enabled.trace,
          debug: log.enabled.debug,
          info: log.enabled.info,
          warn: log.enabled.warn,
          error: log.enabled.error,
          fatal: log.enabled.fatal
        }
        assert.deepStrictEqual(res, exp)
      })
    })
  })

  describe('formats', function () {
    after(reset)

    describe('debug like', function () {
      const f = fixtures.debug
      let log
      let clock
      const exp = []

      before(() => {
        clock = sinon.useFakeTimers()
        Log.options({ level: 'error', json: false, colors: false, namespaces: 'test*' })
        log = new Log('test', { timestamp: 'iso' })
      })

      after(() => {
        clock.restore()
        if (WRITE) console.log(inspect(exp))
        Log.reset()
      })

      testcases.forEach(({ name, args }, idx) => {
        it(name, function () {
          const res = log.error(...args)
          clock.tick(1)
          if (WRITE) exp.push(res)
          else assert.strictEqual(res, f[idx], res + ' !== ' + f[idx])
        })
      })

      it('should log serverinfo and pid', function () {
        const log = new Log('*', { level: undefined, serverinfo: true })
        const res = log.error('test')
        assert(res.indexOf(os.hostname()) !== -1)
        assert(res.indexOf(process.pid) !== -1)
      })

      it('should log over multiple lines', function () {
        const log = new Log('test:multiple', { level: 'DEBUG' })
        const msg = '1 test\n2 test\n3 test'
        const res = log.error(msg)
        assert.strictEqual(res, '  ERROR test:multiple 1 test\n  ERROR test:multiple 2 test\n  ERROR test:multiple 3 test +0ms')
      })

      it('should not log over multiple lines', function () {
        const log = new Log('test:multiple', { json: false, splitLine: false, level: 'DEBUG', time: false })
        const msg = '1 test\n2 test\n3 test'
        const res = log.error(msg)
        assert.strictEqual(res, '  ERROR test:multiple 1 test\\n2 test\\n3 test +0ms')
      })
    })

    describe('json with colors', function () {
      let log
      let clock

      before(() => {
        clock = sinon.useFakeTimers()
        Log.options({ level: 'error', namespaces: 'test*', json: true, colors: true, serverinfo: false })
        log = new Log('test', { timestamp: 'epoch' })
      })

      after(() => {
        clock.restore()
      })

      testcases.forEach(({ name, args }, idx) => {
        it(name, function () {
          const res = log.error(...args)
          clock.tick(1)
          assert.ok(res.indexOf('\u001b[1m"level":') !== -1)
          assert.ok(res.indexOf('\u001b[1m"name":') !== -1)
        })
      })
    })

    describe('json', function () {
      const f = fixtures.json
      let log
      let clock
      const exp = []

      before(() => {
        clock = sinon.useFakeTimers()
        Log.options({ level: 'error', namespaces: 'test*', json: true, colors: false, serverinfo: false })
        log = new Log('test', { timestamp: 'epoch' })
      })

      after(() => {
        clock.restore()
        if (WRITE) console.log(inspect(exp))
      })

      testcases.forEach(({ name, args }, idx) => {
        it(name, function () {
          const res = log.error(...args)
          clock.tick(1)
          // console.log('%s', JSON.stringify(res))
          if (WRITE) exp.push(res)
          else assert.strictEqual(res, f[idx], res + ' !== ' + f[idx])
        })
      })

      it('should NOT remove object only formatters', function () {
        const log = new Log('*')
        const res = log.error('%j ', { a: { b: 'c' } })
        assert.strictEqual(res, '{"level":"ERROR","name":"*","msg":"{\\"a\\":{\\"b\\":\\"c\\"}} ","diff":0}')
      })

      it('should log serverinfo and pid', function () {
        const log = new Log('*', { level: undefined, serverinfo: true, json: true })
        const res = log.error('test')
        assert(res.indexOf('"hostname":"' + os.hostname()) !== -1, 'missing hostname')
        assert(res.indexOf('"pid":' + process.pid) !== -1, 'missing pid')
      })

      it('should not overwrite level', function () {
        const err = new Error('Baam')
        err.level = 'TEST_LEVEL'
        err.name = 'TEST_NAME'
        err.stack = err.stack.substring(0, 20)
        const log = new Log('all')
        const res = log.log(err)
        assert.strictEqual(res, '{"level":"LOG","name":"all","msg":"Baam","diff":0,"err":{"msg":"Baam","name":"Error","stack":"TEST_NAME: Baam\\n    ","level":"TEST_LEVEL"}}')
      })

      it('should stringify large string', function () {
        const largeString = new Array(150).fill('1').join('')
        const res = log.error({ largeString })
        assert.strictEqual(res, '{"level":"ERROR","time":30,"name":"test","diff":1,"largeString":"111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"}')
      })

      it('should remove infinite number and function', function () {
        const res = log.error({ number: Infinity, fn: () => {} })
        assert.strictEqual(res, '{"level":"ERROR","time":30,"name":"test","diff":0}')
      })
    })
  })

  describe('namespaces', function () {
    after(reset)

    describe('namespace *', function () {
      const tests = [
        [undefined, { fatal: 1, error: 1, warn: 1, info: 1, debug: 1 }],
        ['TRACE',   { fatal: 1, error: 1, warn: 1, info: 1, debug: 1, trace: 1 }],
        ['DEBUG',   { fatal: 1, error: 1, warn: 1, info: 1, debug: 1 }],
        ['INFO',    { fatal: 1, error: 1, warn: 1, info: 1 }],
        ['WARN',    { fatal: 1, error: 1, warn: 1 }],
        ['ERROR',   { fatal: 1, error: 1 }],
        ['FATAL',   { fatal: 1 }],
        ['OFF',     {}]
      ]
      tests.forEach(([level, expects]) => {
        it('shall always log for level ' + level, function () {
          Log.options({ level, namespaces: 'aaa', json: false, colors: true })
          const log = new Log('*')
          const res = {
            trace: log.trace('test') ? 1 : undefined,
            debug: log.debug('test') ? 1 : undefined,
            info: log.info('test') ? 1 : undefined,
            warn: log.warn('test') ? 1 : undefined,
            error: log.error('test') ? 1 : undefined,
            fatal: log.fatal('test') ? 1 : undefined
          }
          const exp = {
            trace: expects.trace,
            debug: expects.debug,
            info: expects.info,
            warn: expects.warn,
            error: expects.error,
            fatal: expects.fatal
          }
          assert.deepStrictEqual(res, exp)
        })
      })
    })

    describe('skip', function () {
      it('should skip "one"', function () {
        Log.options({ level: undefined, namespaces: '-one,two' })
        const log1 = new Log('one')
        const log2 = new Log('two')
        assert(!/one/.test(log1.error('one')))
        assert(/two/.test(log2.error('two')))
      })
    })
  })

  describe('serializers', function () {
    it('shall log with defaut err serializer', function () {
      const log = new Log('serialize', { json: true, colors: false })
      const err = new Error('baamm')
      err.stack = 'Error: baam\n    at Context.<anonymous>'
      const res = log.error({ msg: 'boom', err })
      assert.strictEqual(res, '{"level":"ERROR","name":"serialize","msg":"boom","diff":0,"err":{"msg":"baamm","name":"Error","stack":"Error: baam\\n    at Context.<anonymous>"}}')
    })

    it('shall log with custom serializer', function () {
      const my = function (val) {
        if (typeof val !== 'object') return
        const { foo } = val
        return foo
      }
      const log = new Log('serialize', { json: true, colors: false, serializers: { my } })
      const err = new Error('baamm')
      err.stack = 'Error: baam\n    at Context.<anonymous>'
      const res = log.error({ msg: 'boom', my: { foo: 'bar', level: 42 }, err })
      assert.strictEqual(res, '{"level":"ERROR","name":"serialize","msg":"boom","diff":0,"my":"bar","err":{"msg":"baamm","name":"Error","stack":"Error: baam\\n    at Context.<anonymous>"}}')
    })
  })

  describe('sonic', function () {
    after(reset)

    it('shall write and flush', function () {
      const log = new Log('all', { level: 'debug', sonic: true })
      log.error('write to sonic')
      log.flush()
    })
  })

  describe('wrap console', function () {
    let unwrap
    before(function () {
      Log.options({ level: 'trace', namespaces: 'test', json: true, colors: true })
      unwrap = Log.wrapConsole('test')
    })
    after(function () {
      reset()
      unwrap()
    })

    it('shall wrap console.log', function () {
      console.log('log %s', 'log')
      console.trace('trace')
      console.debug({ debug: true })
      console.info('log %j', { info: 1 })
      console.warn('warn')
      console.error(new Error('Baam'))
    })

    it('shall not wrap console twice', function () {
      const unwrap1 = Log.wrapConsole('test1')
      const unwrap2 = Log.wrapConsole('test2')
      assert.strictEqual(unwrap1, unwrap)
      assert.strictEqual(unwrap2, unwrap)
    })
  })

  describe('wrap debug', function () {
    let unwrap
    before(function () {
      Log.options({ level: 'debug', namespaces: '*', json: true, colors: true })
      unwrap = Log.wrapDebug()
    })
    after(function () {
      reset()
      unwrap()
    })

    it('shall wrap debug', function () {
      const log = debug('namespace')
      log.enabled = '*'
      log('hello %s', 'log')
    })
  })

  cidescribe('handle exit events', function () {
    before(function () {
      Log.options({ level: 'FATAL' })
      Log.handleExitEvents('exit', { code: 0 })
    })
    after(reset)

    it('shall log unrejected promise', function () {
      Promise.resolve().then(() => {
        JSON.prase(null)
      })
    })
  })
})
