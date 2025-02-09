import { LogBase } from './LogBase.js'
import { Log } from './node.js'
import { inspectOpts, inspectNamespaces, INFO } from './utils.js'

/** @typedef {import('./utils.js').Level} Level */
/** @typedef {import('./node.js').LogOptions} LogOptions */
/** @typedef {LogOptions & {Log: typeof Log}} LogOptionsWithCustomLog */
/**
 * @typedef {object} ProcLogOptions
 * @property {Level} [level] log level
 * @property {string} [namespaces] namespaces for logging
 */

export const EVENT_NAME = 'log-level'

const defaultOptions = {
  level: INFO,
  namespaces: undefined
}

/**
 * Decouple logging via process event 'log'. This allows to use a different
 * logger framework than 'debug-level'. In such cases you'd need to adapt your
 * framework of choice for logging. Check `initProcLog()` for inspiration.
 *
 * Emits the following process event:
 * ```
 * process.emit('log', level, name, fmt, args)
 * ```
 * where
 * - `level` is TRACE, DEBUG, INFO, WARN, ERROR, FATAL, LOG
 * - `name` is namespace of the logger
 * - `fmt` is optional formatter, e.g. `%s`
 * - `args` is an array of arguments passed to the logger
 *
 * @example
 * ```js
 * import { ProcLog, initProcLog } from 'debug-level'
 *
 * // initialize process event logging with 'debug-level'
 * // define here serializer, stream options, etc.
 * initProcLog({ serializers: {...}, Log: LogEcs })
 *
 * // add a logger with a namespace
 * // use options only for defining the logLevel (or leave undefined to control
 * // via env-vars)
 * const log = new ProcLog('app:namespace')
 * // add some logging
 * log.info('show some logging')
 * ```
 */
export class ProcLog extends LogBase {
  /**
   * creates a new logger
   * @param {string} name - namespace of Logger
   * @param {ProcLogOptions} [opts] - see Log.options
   */
  constructor(name, opts) {
    const _opts = {
      ...defaultOptions,
      ...inspectOpts(process.env),
      ...inspectNamespaces(process.env),
      ...opts,
      // disallow numbers in event
      levelNumbers: false,
      // don't use serializers, define them in the initProcLog options
      serializers: {}
    }
    super(name, _opts)
  }

  _log(level, fmt, args) {
    // @ts-expect-error
    process.emit(EVENT_NAME, level, this.name, fmt, args)
  }
}

/**
 * logging via process event 'log'
 * @param {LogOptionsWithCustomLog} [options]
 */
export function initProcLog(options) {
  const LogCls = options?.Log || Log
  const logger = {}
  const getLogger = (namespace) =>
    logger[namespace] || (logger[namespace] = new LogCls(namespace, options))

  // prevent multiple log-lines from adding more than one listener
  process.removeAllListeners(EVENT_NAME)
  // listen on event
  process.on(EVENT_NAME, (level, namespace, fmt, args) => {
    const log = getLogger(namespace)
    log[level.toLowerCase()]?.(fmt, ...args)
  })
}
