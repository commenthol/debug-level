import http from 'http'
import { logger } from '../src/index.js'

const logA = logger('client:A')
const logB = logger('client:B')

function client (log, path) {
  function request () {
    http.get({ host: 'localhost', port: '3000', path })
      .on('response', (res) => {
        const status = res.statusCode
        res.on('data', (chunk) => {
          if (status >= 400) {
            log.error('%s %s', status, chunk.toString())
          } else {
            log.info('%s %s', status, chunk.toString())
          }
        })
      })
    setTimeout(request, Math.random() * 1000)
  }
  request()
}

client(logA, '/kitty')
client(logB, '/world')
