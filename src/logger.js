import { Log } from './node.js'

const loggers = {}

/**
 * @param {string} namespace
 * @param {import('./node.js').LogOptions} [opts]
 */
export function logger (namespace, opts) {
  let log = loggers[namespace]
  if (!log) {
    log = loggers[namespace] = new Log(namespace, opts)
  }
  return log
}
