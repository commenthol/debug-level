/**
 * logging via process event 'log'
 * @param {LogOptionsWithCustomLog} [options]
 */
export function initProcLog(options?: LogOptionsWithCustomLog): void;
/** @typedef {import('./utils.js').Level} Level */
/** @typedef {import('./node.js').LogOptions} LogOptions */
/** @typedef {import('./node.js').LogOptionWrapConsole} LogOptionWrapConsole */
/** @typedef {LogOptions & {Log: typeof Log}} LogOptionsWithCustomLog */
/**
 * @typedef {object} ProcLogOptions
 * @property {Level} [level] log level
 * @property {string} [namespaces] namespaces for logging
 */
export const EVENT_PROC_LOG: "log-level";
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
     * @param {string} [name]
     * @param {ProcLogOptions & LogOptionWrapConsole} [opts]
     * @returns {() => void} unwrap functions
     */
    static wrapConsole(name?: string, opts?: ProcLogOptions & LogOptionWrapConsole): () => void;
    /**
     * @param {ProcLogOptions} [opts]
     * @returns {() => void} unwrap functions
     */
    static wrapDebug(opts?: ProcLogOptions): () => void;
    /**
     * creates a new logger
     * @param {string} name - namespace of Logger
     * @param {ProcLogOptions} [opts] - see Log.options
     */
    constructor(name: string, opts?: ProcLogOptions);
}
export type Level = import("./utils.js").Level;
export type LogOptions = import("./node.js").LogOptions;
export type LogOptionWrapConsole = import("./node.js").LogOptionWrapConsole;
export type LogOptionsWithCustomLog = LogOptions & {
    Log: typeof Log;
};
export type ProcLogOptions = {
    /**
     * log level
     */
    level?: import("./utils.js").Level | undefined;
    /**
     * namespaces for logging
     */
    namespaces?: string | undefined;
};
import { LogBase } from './LogBase.js';
import { Log } from './node.js';
