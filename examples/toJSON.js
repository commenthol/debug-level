const Log = require('..')
const log = new Log('*')

function reqToJSON () {
  const {ip, method, url} = this
  return {ip, method, url}
}

// assume a request obj
const req = {
  method: 'GET',
  url: '/path',
  ip: '10.10.10.10',
  headers: {'User-Agent': 'Custom/2.0'},
  other: {}
}
req.toJSON = reqToJSON

log.debug({req: req})
// > DEBUG * {"req":{"ip":"10.10.10.10","method":"GET","url":"/path"}} +0ms
