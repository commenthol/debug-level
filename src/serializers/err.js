const circ = Symbol('circ')

function errSerializer (val) {
  if (!(val instanceof Error)) {
    return val
  }

  const o = {
    msg: val.message,
    name: Object.prototype.toString.call(val.constructor) === '[object Function]'
      ? val.constructor.name
      : val.name,
    stack: val.stack
  }
  val[circ] = undefined

  Object.entries(val).forEach(([key, val]) => {
    if (o[key] === undefined) {
      if (val instanceof Error) {
        if (!Object.prototype.hasOwnProperty.call(val, circ)) {
          o[key] = errSerializer(val)
        }
      } else {
        o[key] = val
      }
    }
  })

  return o
}

module.exports = errSerializer
