const assert = require('assert')
const {
  errSerializer,
  reqSerializer,
  resSerializer
} = require('../src/serializers/index.js')

describe('serializers', function () {
  describe('errSerializer', function () {
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
      method: 'GET',
      url: '/path',
      query: {
        test: 1
      },
      headers: {
        'user-agent': 'my-ua/1.0.0'
      },
      socket: {
        remoteAddress: '127.0.0.1',
        remotePort: 3333
      },
      body: 'mybody'
    }

    it('shall serialize a request', function () {
      const res = reqSerializer(req)
      assert.deepStrictEqual(res, {
        method: 'GET',
        url: '/path',
        query: {
          test: 1
        },
        headers: {
          'user-agent': 'my-ua/1.0.0'
        },
        remoteAddress: '127.0.0.1',
        remotePort: 3333
      })
    })

    it('shall not serialize a request of type string', function () {
      const res = reqSerializer('string')
      assert.strictEqual(res, undefined)
    })

    it('shall serialize a request with originalUrl', function () {
      const _req = { ...req, originalUrl: '/mount/test/path' }
      const res = reqSerializer(_req)
      assert.deepStrictEqual(res, {
        method: 'GET',
        url: '/mount/test/path',
        query: {
          test: 1
        },
        headers: {
          'user-agent': 'my-ua/1.0.0'
        },
        remoteAddress: '127.0.0.1',
        remotePort: 3333
      })
    })
  })

  describe('resSerializer', function () {
    const res = {
      statusCode: 500,
      _headers: {
        'user-agent': 'my-server/1.0.0'
      },
      getHeaders: () => res._headers,
      body: { foo: 'bar' }
    }

    it('shall serialize a response', function () {
      const r = resSerializer(res)
      assert.deepStrictEqual(r, {
        statusCode: 500,
        headers: {
          'user-agent': 'my-server/1.0.0'
        }
      })
    })

    it('shall not serialize a response of type string', function () {
      const res = resSerializer('string')
      assert.strictEqual(res, undefined)
    })
  })
})
