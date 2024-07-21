/**
 * @param {any} any
 * @param {number} [spaces]
 * @returns {string}
 */
export function stringify(any: any, spaces?: number | undefined): string;
export class Log extends LogBase {
    /**
     * Apply (and get) global options
     * @param {object} [opts] changed options
     * @return {object} global options
     */
    static options(opts?: object): object;
    /**
     * save options in `process.env`
     */
    static save(): void;
    /**
     * reset saved options
     */
    static reset(): void;
    /**
     * wrap console logging functions like
     * console.log, console.info, console.warn, console.error
     * @param {string} [name='console']
     * @param {LogOptionWrapConsole} [opts] options
     * @return {function} unwrap function
     */
    static wrapConsole(name?: string | undefined, opts?: LogOptionWrapConsole | undefined): Function;
    /**
     * log exit events like 'unhandledRejection', 'uncaughtException'
     * and then let the process die
     * @param {string} [name='exit']
     * @param {LogOptionHandleExitEvents} [opts] options
     */
    static handleExitEvents(name?: string | undefined, opts?: LogOptionHandleExitEvents): void;
    static wrapDebug(): () => void;
    /**
     * creates a new logger
     * @param {String} name - namespace of Logger
     * @param {LogOptions} [opts] - see Log.options
     */
    constructor(name: string, opts?: LogOptions | undefined);
    color: any;
    levColors: {};
    opts: {
        /**
         * number of spaces to use for formatting
         */
        spaces?: number | undefined;
        /**
         * log level
         */
        level?: import("./utils.js").Level | undefined;
        /**
         * namespaces for logging
         */
        namespaces?: string | undefined;
        /**
         * use number instead of log level name
         */
        levelNumbers?: boolean | undefined;
        /**
         * log as nd-json
         */
        json?: boolean | undefined;
        /**
         * log with colors
         */
        colors?: boolean | undefined;
        /**
         * log with timestamp; if undefined then no timestamp is logged
         */
        timestamp?: import("./LogBase.js").Timestamp | undefined;
        /**
         * split lines for pretty "debug" like output (not recommended for prod use)
         */
        splitLine?: boolean | undefined;
        /**
         * serializers to be applied on object properties
         */
        serializers: object;
        /**
         * log serverinfo like hostname and pid
         */
        serverinfo?: boolean | undefined;
        /**
         * stream writer
         */
        stream: NodeJS.WriteStream;
        /**
         * use sonic (default for production use)
         */
        sonic?: boolean | undefined;
        /**
         * buffer length for Sonic
         */
        sonicLength?: number | undefined;
        /**
         * min. timeout before flush of Sonic buffer in ms
         */
        sonicFlushMs?: number | undefined;
    };
    toJson: typeof toJson;
    stream: NodeJS.WriteStream | Sonic;
    /**
     * format object to json
     * @protected
     */
    protected _log(level: any, fmt: any, args: any): string;
    /**
     * render string to output stream
     * @public
     * @param {String} str string to render
     * @param {String} level level of log line (might be used for custom Logger which uses different streams per level)
     * @return {String}
     */
    public render(str: string, level: string): string;
    flush(): void;
    /**
     * format object to json
     * @private
     */
    private _logJsonColor;
    /**
     * debug like output if `this.opts.json === false`
     * @private
     */
    private _logDebugLike;
    /**
     * Add colors, style to string
     * @private
     */
    private _color;
}
export namespace Log {
    export { isDevEnv };
    export { Sonic };
    export namespace serializers {
        export { errSerializer as err };
    }
}
export type LogBaseOptions = import("./LogBase.js").LogBaseOptions;
export type Level = import("./utils.js").Level;
export type ExtLogOptions = {
    /**
     * log serverinfo like hostname and pid
     */
    serverinfo?: boolean | undefined;
    /**
     * stream writer
     */
    stream?: NodeJS.WriteStream | undefined;
    /**
     * use sonic (default for production use)
     */
    sonic?: boolean | undefined;
    /**
     * buffer length for Sonic
     */
    sonicLength?: number | undefined;
    /**
     * min. timeout before flush of Sonic buffer in ms
     */
    sonicFlushMs?: number | undefined;
};
export type LogOptions = LogBaseOptions & ExtLogOptions;
export type ExtLogOptionWrapConsole = {
    level4log?: import("./utils.js").Level | undefined;
};
export type LogOptionWrapConsole = LogOptions & ExtLogOptionWrapConsole;
export type ExtLogOptionHandleExitEvents = object;
export type LogOptionHandleExitEvents = LogOptions & ExtLogOptionHandleExitEvents;
import { LogBase } from './LogBase.js';
/**
 * @param {object} obj
 * @param {object} serializers
 * @param {number} [spaces]
 * @returns {string}
 */
declare function toJson(obj: object, serializers: object, spaces?: number | undefined): string;
import { Sonic } from './Sonic.js';
declare const isDevEnv: boolean;
import { errSerializer } from './serializers/index.js';
export {};
