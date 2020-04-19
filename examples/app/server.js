const fs = require('fs')
const { resolve } = require('path')
const http = require('http')
const Log = require('../..')

if (!process.env.DEBUG_LEVEL) process.env.DEBUG_LEVEL = 'DEBUG'

const log = new Log('server')
const logger = Log.logger()
const port = 3000

http.createServer((req, res) => {
  log.info(req.url)
  if (/^\/debug-level/.test(req.url)) {
    req.ip = req.ip || req.connection.remoteAddress
    logger(req, res)
  } else {
    if (req.url === '/') {
      req.url = '/index.html'
    }
    const url = resolve(__dirname, '.' + req.url)
    fs.stat(url, (err) => {
      if (err) {
        res.end()
      } else {
        fs.createReadStream(url).pipe(res)
      }
    })
  }
}).listen(port, () => {
  console.log(`\n  browse to http://localhost:${port}\n\n`)
})
