export const startTimeKey = Symbol('startTime')

const SET_COOKIE = 'set-cookie'
const PROXY_AUTHENTICATE = 'proxy-authenticate'

/**
 * response serializer
 *
 * removes set-cookie and proxy-authenticate headers
 * @param {object} [res]
 * @returns {object}
 */
export function resSerializer (res) {
  if (typeof res !== 'object' || !res) return

  const {
    [SET_COOKIE]: _1,
    [PROXY_AUTHENTICATE]: _2,
    ...headers
  } = res.getHeaders() || {}

  const logRes = {
    statusCode: res.statusCode
  }
  if (Object.keys(headers).length) {
    logRes.headers = headers
  }
  if (res[startTimeKey]) {
    logRes.ms = Date.now() - res[startTimeKey]
  }

  return logRes
}

/**
 * response serializer
 *
 * masks set-cookie and proxy-authenticate response headers
 * @param {object} [res]
 * @returns {object}
 */
export function resMaskSerializer (res) {
  const logRes = resSerializer(res)

  if (!logRes) return

  const { [SET_COOKIE]: setCookie, [PROXY_AUTHENTICATE]: proxyAuthenticate } =
    res.getHeaders ? res.getHeaders() : res._headers || {}

  if (!setCookie || !proxyAuthenticate) {
    return logRes
  }

  logRes.headers = logRes.headers || {}

  if (proxyAuthenticate) {
    logRes.headers[PROXY_AUTHENTICATE] = '***'
  }
  if (setCookie) {
    logRes.headers[SET_COOKIE] = [].concat(setCookie).map(maskCookieVal)
  }

  return logRes
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
        masked += '=***'
        mask = true
        break
      case ';':
        masked += cookie.slice(i)
        return masked
    }
    if (!mask) {
      masked += char
    }
  }
  return masked
}
