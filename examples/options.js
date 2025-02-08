import fs from 'fs'
import Log from '../src/index.js'

// log into file instead of process.stderr
const stream = fs.createWriteStream('./my.log')

// The options will be set for all Loggers...
Log.options({
  level: 'DEBUG',
  json: true,
  serverinfo: true,
  timestamp: 'iso',
  colors: false,
  stream
})
const log = new Log('*')

log.debug({ object: 1 }) // ...
log.debug(
  'a %s, a number %d, an %o and %j',
  'string',
  1.2,
  { object: 1 },
  { json: true }
)
log.debug({ object: 1 }, { json: true })
const err = new Error('bam')
err.status = 500
log.debug(err, { object: 1 })
