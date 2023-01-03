const fs = require('fs')
const { join } = require('path')
const http = require('http')
const { Log, browserLogs } = require('../..')

if (!process.env.DEBUG_LEVEL) process.env.DEBUG_LEVEL = 'DEBUG'

const log = new Log('server')
const logMw = browserLogs()
const port = 3000

function serveStatic (req, res) {
  const url = join(__dirname, '.', req.url)
  fs.stat(url, (err) => {
    if (err) {
      res.end()
    } else {
      fs.createReadStream(url).pipe(res)
    }
  })
}

http.createServer((req, res) => {
  log.info(req.url)

  if (/^\/debug-level/.test(req.url)) {
    req.ip = req.ip || req.socket.remoteAddress
    logMw(req, res)
  } else {
    if (req.url === '/') {
      req.url = '/index.html'
    }
    serveStatic(req, res)
  }
}).listen(port, () => {
  console.log(`\n  browse to http://localhost:${port}\n\n`)
})
