import http from 'http'
import { Log, httpLogs } from '../src/index.js'

const name = 'An App'

const logHttpMw = httpLogs()
const log = new Log('server')

const codes = [200, 200, 200, 404, 500]
const randomStatus = () => codes[Math.random() * codes.length | 0]

// fake app
log.info('booting %o', name)

http.createServer(function (req, res) {
  log.debug('%s %s', req.method, req.url)

  logHttpMw(req, res, () => {})

  const str = req.url.replace(/[/]/g, '')
  res.statusCode = randomStatus()
  // res.setHeader('Set-Cookie', ['foo=bar', 'session=foobar'])
  res.setHeader('Set-Cookie', 'session=foobar')
  res.end(`hello ${str}`)
}).listen(3000, function () {
  log.info('listening')
})

import('./client.js')
