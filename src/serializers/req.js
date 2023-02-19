/**
 * request serializer
 * masks cookie values and authorization headers
 * @param {object} [val]
 * @returns {object}
 */
export function reqSerializer (val) {
  if (typeof val !== 'object' || !val) return

  const _req = {}
  _req.id = typeof val.id === 'function' ? val.id() : val.id
  _req.method = val.method
  _req.url = val.originalUrl || val.url
  _req.remoteAddress = val.socket?.remoteAddress
  _req.remotePort = val.socket?.remotePort
  _req.headers = Object.assign({}, val.headers)

  if (_req.headers?.authorization) {
    _req.headers.authorization = '***'
  }
  if (_req.headers?.cookie) {
    _req.headers.cookie = maskCookieVal(_req.headers.cookie)
  }

  return _req
}

function maskCookieVal (cookie) {
  let masked = ''
  const len = cookie.length
  let mask = false
  for (let i = 0; i < len; i++) {
    const char = cookie[i]
    switch (char) {
      case '=':
        mask = true
        masked += '=***'
        break
      case ';':
        mask = false
        break
    }
    if (!mask) {
      masked += char
    }
  }
  return masked
}
