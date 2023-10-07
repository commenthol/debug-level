import { Log } from './node.js'

const loggers = {}

/**
 * @param {string} namespace
 * @param {import('./node.js').LogOptions & {Log: Log}} [opts]
 */
export function logger (namespace, opts) {
  const { Log: optsLog, ..._opts } = opts || {}
  const LogCls = optsLog || Log

  let log = loggers[namespace]
  if (!log) {
    // @ts-expect-error
    log = loggers[namespace] = new LogCls(namespace, _opts)
  }
  return log
}
