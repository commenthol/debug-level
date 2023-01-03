import debug from 'debug'

let wrapped = null

const unwrap = () => {
  if (wrapped) {
    Object.keys(wrapped).forEach(key => {
      debug[key] = wrapped[key]
    })
    wrapped = null
  }
}

export function wrapDebug (Log) {
  if (wrapped) return unwrap
  class Loggers {
    constructor () {
      this.cache = {}
    }

    get (namespace) {
      let logger = this.cache[namespace]
      if (!logger) {
        logger = this.cache[namespace] = new Log(namespace)
      }
      return logger
    }
  }

  const loggers = new Loggers()

  wrapped = {
    log: debug.log,
    useColors: debug.useColors
  }

  debug.useColors = () => false
  debug.log = (fmt, ...args) => {
    // eslint-disable-next-line no-unused-vars
    const [time, namespace, ...rest] = fmt.split(' ')
    const _fmt = rest.join(' ')
    // console.log(time, namespace, rest, args)
    const log = loggers.get(namespace)
    log.debug(_fmt, ...args)
  }

  return unwrap
}
