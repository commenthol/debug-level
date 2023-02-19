import http from 'node:http'
import assert from 'node:assert'
import { httpLogs } from '../src/index.js'

describe('#httpLogs', function () {
  it('log request with level=info', function () {
    const app = (req, res) => {
      httpLogs()(req, res, () => {})
      res.end()
    }
    return request(app, '/').then(res => {
      assert.equal(res.statusCode, 200)
    })
  })

  it('log request with level=warn', function () {
    const app = (req, res) => {
      httpLogs()(req, res, () => {})
      res.statusCode = 400
      res.end()
    }
    return request(app, '/400').then(res => {
      assert.equal(res.statusCode, 400)
    })
  })

  it('log request with level=error', function () {
    const app = (req, res) => {
      httpLogs()(req, res, () => {})
      res.statusCode = 500
      res.end()
    }
    return request(app, '/500').then(res => {
      assert.equal(res.statusCode, 500)
    })
  })

  it('log request when aborted', function (done) {
    const app = (req, res) => {
      httpLogs()(req, res, () => {})
      res.writeHead(200)
      res.write(Array(10000).fill('...').join(''))
    }
    request(app, '/abort').then(res => {
      res.on('data', () => {
        res.destroy()
        done()
      })
    })
  })

  it('log with custom req.id', function (done) {
    const customGenerateRequestId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    const mw = httpLogs('my-module:http', { customGenerateRequestId })
    const app = (req, res) => {
      mw(req, res, () => {})
      res.end()
    }
    request(app, '/abort').then(() => {
      done()
    })
  })
})

function request (app, path) {
  return new Promise((resolve) => {
    const server = http.createServer(app).listen(() => {
      const { port } = server.address()
      const req = http.request({
        method: 'GET',
        hostname: 'localhost',
        port,
        path
      }, (res) => {
        resolve(res)
        server.close()
      })
      req.end()
    })
  })
}
