const fs = require('fs')
const Log = require('..')

// log into file instead of process.stderr
const stream = fs.createWriteStream('./my.log')

// The options will be set for all Loggers...
Log.options({
  level: 'ERROR',
  json: true,
  serverinfo: true,
  hideDate: false,
  colors: false,
  stream
})
const log = new Log('*')

log.debug({object: 1}) // ...
