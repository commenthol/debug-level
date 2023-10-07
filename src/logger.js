import { Log } from './node.js'

const loggers = {}

/**
 * @typedef {import('./node.js').LogOptions & {Log: typeof Log}} LogOptions
 */

/**
 * @param {string} namespace
 * @param {LogOptions} [opts]
 */
export function logger (namespace, opts) {
  const { Log: optsLog, ..._opts } = opts || {}
  const LogCls = optsLog || Log

  let log = loggers[namespace]
  if (!log) {
    log = loggers[namespace] = new LogCls(namespace, _opts)
  }
  return log
}
