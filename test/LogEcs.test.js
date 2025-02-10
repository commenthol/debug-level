import assert from 'assert'
import os from 'os'
import sinon from 'sinon'
import debug from 'debug'
import { startTimeKey } from '../src/serializers/res.js'
import { LogEcs, ecsSerializers } from '../src/ecs/index.js'
import { httpLogs, logger } from '../src/index.js'

import { inspect } from 'util'
import { testcases } from './fixtures/testcases.js'
import fixtures from './fixtures/logEcs.js'

const { err: ecsError, req: ecsReq, res: ecsRes } = ecsSerializers

const WRITE = false

describe('LogEcs', function () {
  describe('ecsSerializers', function () {
    describe('ecsError', function () {
      it('shall ignore non errors', function () {
        const ecsFields = {}
        const inp = { name: 'Error' }
        ecsError(inp, ecsFields)
        assert.deepStrictEqual(ecsFields, {})
      })
      it('shall serialize an error', function () {
        const ecsFields = {}
        const err = new TypeError('boom')
        err.code = 'oneFinger'
        ecsError(err, ecsFields)
        assert.ok(/at Context.<anonymous>/.test(ecsFields.error.stack_trace))
        ecsFields.error.stack_trace = '#'
        assert.deepStrictEqual(ecsFields, {
          error: {
            type: 'TypeError',
            message: 'boom',
            stack_trace: '#'
          }
        })
      })

      it('shall serialize an error like object', function () {
        const ecsFields = {}
        const err = { name: 'TypeError', message: 'boom' }
        err.code = 'oneFinger'
        ecsError(err, ecsFields)
        assert.equal(ecsFields.error.stack_trace, undefined)
        ecsFields.error.stack_trace = '#'
        assert.deepStrictEqual(ecsFields, {
          error: {
            type: 'Object',
            message: 'boom',
            stack_trace: '#'
          }
        })
      })
    })

    describe('ecsReq', function () {
      const req = {
        id: 'f90a5d9e-52e6-482e-a6ab-d1c5da1fe9c6',
        method: 'GET',
        url: '/path?test=1',
        headers: {
          host: 'foo.bar:8080',
          'user-agent': 'my-ua/1.0.0',
          authorization: 'Basic foo:bar',
          cookie: 'session=foobar; name=foo'
        },
        socket: {
          remoteAddress: '127.0.0.1',
          remotePort: 3333
        },
        body: 'mybody'
      }

      it('shall serialize a request', function () {
        const ecsFields = {}
        ecsReq(req, ecsFields)
        assert.deepStrictEqual(ecsFields, {
          client: {
            ip: '127.0.0.1',
            port: 3333
          },
          url: {
            path: '/path',
            query: 'test=1',
            domain: 'foo.bar',
            port: 8080
          },
          http: {
            request: {
              id: 'f90a5d9e-52e6-482e-a6ab-d1c5da1fe9c6',
              method: 'GET',
              version: undefined,
              headers: {
                host: 'foo.bar:8080'
              }
            }
          },
          user_agent: {
            original: 'my-ua/1.0.0'
          }
        })
      })

      it('shall not serialize a request of type string', function () {
        const ecsFields = {}
        ecsReq('string', ecsFields)
        assert.deepStrictEqual(ecsFields, {})
      })

      it('shall serialize a request with originalUrl', function () {
        // eslint-disable-next-line no-unused-vars
        const { host, ...headers } = req.headers
        const _req = {
          ...req,
          originalUrl: '/mount/test/path?test=1',
          httpVersion: '2.0',
          headers
        }

        const ecsFields = {}
        ecsReq(_req, ecsFields)
        assert.deepStrictEqual(ecsFields, {
          client: {
            ip: '127.0.0.1',
            port: 3333
          },
          url: {
            path: '/mount/test/path',
            query: 'test=1'
          },
          http: {
            request: {
              id: 'f90a5d9e-52e6-482e-a6ab-d1c5da1fe9c6',
              method: 'GET',
              version: '2.0',
              headers: {}
            }
          },
          user_agent: {
            original: 'my-ua/1.0.0'
          }
        })
      })

      it('shall serialize a request without headers', function () {
        const _req = {
          ...req,
          originalUrl: '/mount/test/path?test=1',
          httpVersion: '2.0',
          headers: null
        }

        const ecsFields = {}
        ecsReq(_req, ecsFields)
        assert.deepStrictEqual(ecsFields, {
          client: {
            ip: '127.0.0.1',
            port: 3333
          },
          url: {
            path: '/mount/test/path',
            query: 'test=1'
          },
          http: {
            request: {
              id: 'f90a5d9e-52e6-482e-a6ab-d1c5da1fe9c6',
              method: 'GET',
              version: '2.0',
              headers: {}
            }
          },
          user_agent: {
            original: undefined
          }
        })
      })
    })

    describe('ecsRes', function () {
      before(function () {
        this.clock = sinon.useFakeTimers()
      })
      after(function () {
        this.clock.restore()
      })

      const res = {
        statusCode: 500,
        _headers: {
          'user-agent': 'my-server/1.0.0',
          'set-cookie': [
            'foo=bar; Max-Age=10; SameSite=Strict',
            'session=foobar'
          ],
          'proxy-authenticate': 'foobar'
        },
        getHeaders: () => res._headers,
        body: { foo: 'bar' }
      }

      it('shall serialize a response', function () {
        res[startTimeKey] = Date.now() - 3
        const ecsFields = {}
        ecsRes(res, ecsFields)

        assert.deepStrictEqual(ecsFields, {
          http: {
            response: {
              latency: 3,
              status_code: 500,
              mime_type: undefined,
              headers: {
                'user-agent': 'my-server/1.0.0'
              }
            }
          }
        })
      })

      it('shall not serialize a response of type string', function () {
        const ecsFields = {}
        ecsRes('string', ecsFields)
        assert.deepStrictEqual(ecsFields, {})
      })
    })
  })

  describe('formats', function () {
    describe('debug like', function () {
      const f = fixtures.debug
      let log
      let clock
      const exp = []

      before(() => {
        clock = sinon.useFakeTimers()
        LogEcs.options({
          level: 'error',
          json: false,
          colors: false,
          namespaces: 'test*'
        })
        log = new LogEcs('test', { timestamp: 'iso' })
      })

      after(() => {
        clock.restore()
        if (WRITE) console.log(inspect(exp))
        LogEcs.reset()
      })

      testcases.forEach(({ name, args }, idx) => {
        it(name, function () {
          const res = log.error(...args)
          clock.tick(1)
          if (WRITE) exp.push(res)
          else assert.strictEqual(res, f[idx], res + ' !== ' + f[idx])
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
        LogEcs.options({
          level: 'error',
          namespaces: 'test*',
          json: true,
          colors: false,
          serverinfo: false
        })
        log = new LogEcs('test', { timestamp: 'epoch' })
      })

      after(() => {
        clock.restore()
        if (WRITE) console.log(inspect(exp))
      })

      it('should NOT remove object only formatters', function () {
        const log = new LogEcs('*')
        const res = log.error('%j ', { a: { b: 'c' } })
        assert.strictEqual(
          res,
          '{"log":{"level":"ERROR","logger":"*","diff_ms":0},"message":"{\\"a\\":{\\"b\\":\\"c\\"}} ","@timestamp":"1970-01-01T00:00:00.000Z"}'
        )
      })

      it('should log serverinfo and pid', function () {
        const log = new LogEcs('*', {
          level: undefined,
          serverinfo: true,
          json: true
        })
        const res = log.error('test')
        assert(
          res.indexOf('"hostname":"' + os.hostname()) !== -1,
          'missing hostname'
        )
        assert(res.indexOf('"pid":' + process.pid) !== -1, 'missing pid')
      })

      it('should not overwrite level', function () {
        const err = new Error('Baam')
        err.level = 'TEST_LEVEL'
        err.name = 'TEST_NAME'
        err.stack = err.stack.substring(0, 20)
        const log = new LogEcs('all')
        const res = log.log(err)
        assert.strictEqual(
          res,
          '{"log":{"level":"LOG","logger":"all","diff_ms":0},"message":"Baam","@timestamp":"1970-01-01T00:00:00.000Z","error":{"type":"Error","message":"Baam","stack_trace":"TEST_NAME: Baam\\n    "}}'
        )
      })

      it('should stringify large string', function () {
        const largeString = new Array(150).fill('1').join('')
        const res = log.error({ largeString })
        assert.strictEqual(
          res,
          '{"log":{"level":"ERROR","logger":"test","diff_ms":0},"@timestamp":"1970-01-01T00:00:00.000Z","extra":{"test":{"largeString":"111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"}}}'
        )
      })

      it('should log infinite number as null and remove function', function () {
        const res = log.error({ number: Infinity, fn: () => {} })
        assert.strictEqual(
          res,
          '{"log":{"level":"ERROR","logger":"test","diff_ms":0},"@timestamp":"1970-01-01T00:00:00.000Z","extra":{"test":{"number":null}}}'
        )
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
    })
  })

  describe('overwrite Log', function () {
    let clock
    before(function () {
      clock = sinon.useFakeTimers()
    })
    after(function () {
      clock.restore()
    })

    it('httpLogs: shall log http request', function (done) {
      const req = {
        id: 'abc',
        url: '/path/folder?query=1',
        headers: {
          host: 'ser.ver',
          'user-agent': 'my/1.0.0'
        }
      }

      const res = {
        statusCode: 500,
        on: (ev, fn) => {
          onFn = fn
        },
        removeListener: () => {},
        getHeaders: () => ({
          'x-powered-by': 'server'
        })
      }

      let onFn

      httpLogs('http', {
        Log: LogEcs,
        namespaces: '*',
        sonic: false,
        colors: false,
        json: true
      })(req, res, (err) => {
        const out = onFn(err)
        assert.equal(
          out,
          '{"log":{"level":"ERROR","logger":"http","diff_ms":0},"@timestamp":"1970-01-01T00:00:00.000Z","url":{"path":"/path/folder","query":"query=1","domain":"ser.ver"},"http":{"response":{"status_code":500,"headers":{"x-powered-by":"server"}}}}'
        )
        done()
      })
    })

    it('logger', function () {
      const _logger = logger('logger', {
        Log: LogEcs,
        namespaces: '*',
        sonic: false,
        colors: false,
        json: true
      })

      const out = _logger.log('a test')
      assert.equal(
        out,
        '{"log":{"level":"LOG","logger":"logger","diff_ms":0},"message":"a test","@timestamp":"1970-01-01T00:00:00.000Z"}'
      )
    })
  })

  describe('wrap console', function () {
    let unwrap
    before(function () {
      unwrap = LogEcs.wrapConsole('test', {
        level: 'trace',
        namespaces: 'test'
      })
    })
    after(function () {
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
      const unwrap1 = LogEcs.wrapConsole('test1')
      const unwrap2 = LogEcs.wrapConsole('test2')
      assert.strictEqual(unwrap1, unwrap)
      assert.strictEqual(unwrap2, unwrap)
    })
  })

  describe('wrap debug', function () {
    let unwrap
    before(function () {
      const options = { level: 'debug', namespaces: '*' }
      unwrap = LogEcs.wrapDebug(options)
    })
    after(function () {
      unwrap()
    })

    it('shall wrap debug', function () {
      const log = debug('namespace')
      log.enabled = '*'
      log('hello %s', 'log')
    })
  })
})
