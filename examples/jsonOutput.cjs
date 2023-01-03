const { Log } = require('..')
Log.options({ level: 'DEBUG', json: true, serverinfo: true, spaces: 2 })

const log = new Log('package')

// ----
// use formatters (NOT RECOMMENDED for objects, errors)
log.debug('a %s, a number %d, an %o and %j', 'string', 1.2, { object: 1 }, { NOT: 'RECOMMENDED' })
/* > {
  "level": "DEBUG",
  "name": "package",
  "msg": "a string, a number 1.2, an {\n  \"object\": 1\n} and {\n  \"NOT\": "RECOMMENDED"\n}",
  "hostname": "server",
  "pid": 3804,
  "diff": 0
} */

// ----
// objects get merged/ assigned - string overwrites msg
log.debug({ object: 1 }, { json: true }, [1, 2, 3], '%s #%d', 'message', 1)
/* > {
  "level": "DEBUG",
  "name": "package",
  "msg": "message #1",
  "object": 1,
  "json": true,
  "arr": [1, 2, 3],
  "hostname": "server",
  "pid": 3804,
  "diff": 0
} */

// ----
const err = new Error('baam')
err.status = 500

// error - string overwrites msg
log.error(err, { object: 1 }, 'A very bad Error')
/* > {
  "level": "ERROR",
  "name": "package",
  "msg": "A very bad Error",
  "err": {
    "name": "Error",
    "stack": "Error: baam\n    ...\n    at bootstrap_node.js:608:3",
    "status": 500
  },
  "object": 1,
  "hostname": "server",
  "pid": 3804,
  "diff": 20
} */

// ----
// only last arr remains in log
log.debug([1, 2, 3], [4, 5, 6])
/* > {
  "level": "DEBUG",
  "name": "package",
  "arr": [4, 5, 6],
  "hostname": "server",
  "pid": 3804,
  "diff": 3
} */

// additional arguments get added as `args`
log.info('formatter %s', 'message1', 'message2', 'message3')
/* > {
  "level": "INFO",
  "name": "package",
  "msg": "formatter message1",
  "args": ["message2", "message3"],
  "hostname": "server",
  "pid": 3804,
  "diff": 0
} */

// ----
// using toJSON custom serializers
function reqToJSON () {
  const { ip, method, url, headers } = this
  const userAgent = headers ? headers['user-agent'] : undefined
  return { ip, method, url, userAgent }
}

const req = { // a client request
  method: 'GET',
  url: '/path',
  ip: '10.10.10.10',
  headers: { 'user-agent': 'debug-level/1.0' },
  socket: {} // ....
}
req.toJSON = reqToJSON

function resToJSON () {
  const { statusCode } = this
  return { statusCode }
}

const res = { // a server response
  statusCode: 403,
  socket: {} // ....
}
res.toJSON = resToJSON

log.warn({ req, res })
/* > {
  "level": "WARN",
  "name": "package",
  "req": {
    "ip": "10.10.10.10",
    "method": "GET",
    "url": "/path",
    "userAgent": "debug-level/1.0"
  },
  "res": {
    "statusCode": 403
  },
  "hostname": "server",
  "pid": 3804,
  "diff": 1
} */
