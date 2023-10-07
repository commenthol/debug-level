const circ = Symbol('circ')

/**
 * serializer for errors
 * @param {object} [err]
 * @returns {object}
 */
export function errSerializer (err) {
  if (!(err instanceof Error)) {
    return err
  }

  const o = {
    msg: err.message,
    name: Object.prototype.toString.call(err.constructor) === '[object Function]'
      ? err.constructor.name
      : err.name,
    stack: err.stack
  }
  err[circ] = undefined

  for (const [key, val] of Object.entries(err)) {
    if (o[key] === undefined) {
      if (val instanceof Error) {
        if (!Object.prototype.hasOwnProperty.call(val, circ)) {
          o[key] = errSerializer(val)
        }
      } else {
        o[key] = val
      }
    }
  }

  return o
}
