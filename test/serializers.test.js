import assert from 'assert'
import sinon from 'sinon'
import {
  errSerializer,
  reqSerializer,
  reqMaskSerializer,
  resSerializer,
  resMaskSerializer,
  startTimeKey
} from '../src/serializers/index.js'

describe('serializers', function () {
  describe('errSerializer', function () {
    it('shall ignore non errors', function () {
      const inp = { name: 'Error' }
      const res = errSerializer(inp)
      assert.deepStrictEqual(res, inp)
    })
    it('shall serialize an error', function () {
      const err = new TypeError('boom')
      err.code = 'oneFinger'
      const res = errSerializer(err)
      assert.ok(/at Context.<anonymous>/.test(res.stack))
      res.stack = '#'
      assert.deepStrictEqual(res, {
        msg: 'boom',
        name: 'TypeError',
        stack: '#',
        code: 'oneFinger'
      })
    })

    it('shall serialize an error with original err', function () {
      const err = new TypeError('boom')
      err.originalErr = new Error('baam')
      const res = errSerializer(err)
      res.stack = '#'
      res.originalErr.stack = '##'

      assert.deepStrictEqual(res, {
        msg: 'boom',
        name: 'TypeError',
        stack: '#',
        originalErr: {
          msg: 'baam',
          name: 'Error',
          stack: '##'
        }
      })
    })
  })

  describe('reqSerializer', function () {
    const req = {
      id: 'f90a5d9e-52e6-482e-a6ab-d1c5da1fe9c6',
      method: 'GET',
      url: '/path?test=1',
      headers: {
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
      const result = reqSerializer(req)
      assert.deepStrictEqual(result, {
        id: 'f90a5d9e-52e6-482e-a6ab-d1c5da1fe9c6',
        method: 'GET',
        url: '/path?test=1',
        headers: {
          'user-agent': 'my-ua/1.0.0'
        },
        remoteAddress: '127.0.0.1',
        remotePort: 3333
      })
    })

    it('shall not serialize a request of type string', function () {
      const result = reqSerializer('string')
      assert.strictEqual(result, undefined)
    })

    it('shall serialize a request with originalUrl', function () {
      const _req = { ...req, originalUrl: '/mount/test/path?test=1' }
      const result = reqSerializer(_req)
      assert.deepStrictEqual(result, {
        id: 'f90a5d9e-52e6-482e-a6ab-d1c5da1fe9c6',
        method: 'GET',
        url: '/mount/test/path?test=1',
        headers: {
          'user-agent': 'my-ua/1.0.0'
        },
        remoteAddress: '127.0.0.1',
        remotePort: 3333
      })
    })
  })

  describe('reqMaskSerializer', function () {
    const req = {
      id: 'f90a5d9e-52e6-482e-a6ab-d1c5da1fe9c6',
      method: 'GET',
      url: '/path?test=1',
      headers: {
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
      const result = reqMaskSerializer(req)
      assert.deepStrictEqual(result, {
        id: 'f90a5d9e-52e6-482e-a6ab-d1c5da1fe9c6',
        method: 'GET',
        url: '/path?test=1',
        headers: {
          'user-agent': 'my-ua/1.0.0',
          authorization: 'Basic fo***',
          cookie: 'session=***; name=***'
        },
        remoteAddress: '127.0.0.1',
        remotePort: 3333
      })
    })

    it('shall not serialize a request of type string', function () {
      const result = reqMaskSerializer('string')
      assert.strictEqual(result, undefined)
    })

    it('shall serialize a request with originalUrl', function () {
      const _req = { ...req, originalUrl: '/mount/test/path?test=1' }
      const result = reqMaskSerializer(_req)
      assert.deepStrictEqual(result, {
        id: 'f90a5d9e-52e6-482e-a6ab-d1c5da1fe9c6',
        method: 'GET',
        url: '/mount/test/path?test=1',
        headers: {
          'user-agent': 'my-ua/1.0.0',
          authorization: 'Basic fo***',
          cookie: 'session=***; name=***'
        },
        remoteAddress: '127.0.0.1',
        remotePort: 3333
      })
    })
  })

  describe('resSerializer', function () {
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
      const result = resSerializer(res)
      assert.deepStrictEqual(result, {
        ms: 3,
        statusCode: 500,
        headers: {
          'user-agent': 'my-server/1.0.0'
        }
      })
    })

    it('shall not serialize a response of type string', function () {
      const result = resSerializer('string')
      assert.strictEqual(result, undefined)
    })
  })

  describe('resMaskSerializer', function () {
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
      const result = resMaskSerializer(res)
      assert.deepStrictEqual(result, {
        ms: 3,
        statusCode: 500,
        headers: {
          'user-agent': 'my-server/1.0.0',
          'proxy-authenticate': '***',
          'set-cookie': ['foo=***; Max-Age=10; SameSite=Strict', 'session=***']
        }
      })
    })

    it('shall not serialize a response of type string', function () {
      const result = resMaskSerializer('string')
      assert.strictEqual(result, undefined)
    })
  })
})
