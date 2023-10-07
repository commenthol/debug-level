/**
 * request serializer
 *
 * removes cookie values and authorization headers
 * @param {object} [req]
 * @returns {object}
 */
export function reqSerializer (req) {
  if (typeof req !== 'object' || !req) return

  const { authorization, cookie, ...headers } = req.headers || {}

  const logReq = {
    id: typeof req.id === 'function' ? req.id() : req.id,
    method: req.method,
    url: req.originalUrl || req.url,
    remoteAddress: req.socket?.remoteAddress,
    remotePort: req.socket?.remotePort
  }
  if (Object.keys(headers).length) {
    logReq.headers = headers
  }

  return logReq
}

/**
 * request serializer
 *
 * masks cookie values and authorization headers
 * @param {object} [req]
 * @returns {object}
 */
export function reqMaskSerializer (req) {
  const logReq = reqSerializer(req)

  if (!logReq) return

  const { authorization, cookie } = req.headers || {}
  if (!authorization || !cookie) {
    return logReq
  }

  logReq.headers = logReq.headers || {}

  if (authorization) {
    logReq.headers.authorization = authorization.slice(0, 8) + '***'
  }
  if (cookie) {
    logReq.headers.cookie = maskCookieVal(cookie)
  }

  return logReq
}

/**
 * @param {string} cookie
 * @returns {string}
 */
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
