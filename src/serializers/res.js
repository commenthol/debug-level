export const startTimeKey = Symbol('startTime')

const SET_COOKIE = 'set-cookie'

/**
 * response serializer
 * masks cookie values
 * @param {object} [val]
 * @returns {object}
 */
export function resSerializer (val) {
  if (typeof val !== 'object' || !val) return

  const _res = {}
  _res.headers = val.getHeaders ? val.getHeaders() : val._headers
  _res.statusCode = val.statusCode
  if (_res.headers?.[SET_COOKIE]) {
    _res.headers[SET_COOKIE] = [].concat(_res.headers[SET_COOKIE]).map(maskCookieVal)
  }

  if (val[startTimeKey]) {
    _res.ms = Date.now() - val[startTimeKey]
  }

  return _res
}

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
