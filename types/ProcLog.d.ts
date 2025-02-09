/**
 * logging via process event 'log'
 * @param {LogOptionsWithCustomLog} [options]
 */
export function initProcLog(options?: LogOptionsWithCustomLog): void;
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
     * @param {String} name - namespace of Logger
     * @param {LogOptions} [opts] - see Log.options
     */
    constructor(name: string, opts?: LogOptions);
}
export type LogOptions = import("./node.js").LogOptions;
export type LogOptionsWithCustomLog = LogOptions & {
    Log: typeof Log;
};
import { LogBase } from './LogBase.js';
import { Log } from './node.js';
