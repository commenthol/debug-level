const Log = require('..')
Log.options({level: 'debug'})
const log = new Log('test', {formatters: {
  h: (n) => `x${n.toString(16).toUpperCase()}`
}})

log.debug('%h', 255) // logs 255 as hex 'xFF'
