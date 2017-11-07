const Log = require('..')
const http = require('http')
const name = 'An App'

const log = new Log('server')

const codes = [200, 200, 200, 404, 500]
const randomStatus = () => codes[Math.random() * codes.length | 0]

// fake app
log.info('booting %o', name)

http.createServer(function(req, res){
  log.debug('%s %s', req.method, req.url)
  const str = req.url.replace(/[/]/g, '')
  res.statusCode = randomStatus()
  res.end(`hello ${str}`)
  if (res.statusCode >= 400) {
    // log.error('%s %s %s', res.statusCode, req.method, req.url)
    log.error(new Error([res.statusCode, req.method, req.url].join(' ')))
  }
}).listen(3000, function(){
  log.info('listening')
})

require('./client')
