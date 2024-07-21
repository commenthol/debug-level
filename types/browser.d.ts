/**
 * creates a new logger for the browser
 */
export class Log extends LogBase {
    /**
     * Apply (and get) global options
     * @param {LogOptionsBrowser} [opts] changed options
     * @return {object} global options
     */
    static options(opts?: LogOptionsBrowser | undefined): object;
    /**
     * save options in `localStorage`
     */
    static save(): void;
    /**
     * reset saved options
     */
    static reset(): void;
    /**
     * @typedef {object} ExtLogOptionWrapConsole
     * @property {Level} [level4log='LOG']
     *
     * @typedef {LogOptionsBrowser & ExtLogOptionWrapConsole} LogOptionWrapConsole
     */
    /**
     * wrap console logging functions like
     * console.log, console.info, console.warn, console.error
     * @param {string} [name='console']
     * @param {LogOptionWrapConsole} [opts]
     * @return {function} unwrap function
     */
    static wrapConsole(name?: string | undefined, opts?: (import("./Format.js").FormatOption & import("./LogBase.js").ExtLogBaseOptions & ExtLogOptionsBrowser & {
        level4log?: import("./utils.js").Level | undefined;
    }) | undefined): Function;
    /**
     * @param {string} name namespace of Logger
     * @param {LogOptionsBrowser} opts
     */
    constructor(name: string, opts: LogOptionsBrowser);
    opts: {
        /**
         * number of spaces to use for formatting
         */
        spaces?: number | undefined;
        /**
         * log level
         */
        level: import("./LogBase.js").Level;
        /**
         * namespaces for logging
         */
        namespaces: string | undefined;
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
        colors: boolean;
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
         * url to report errors
         */
        url: undefined;
    };
    color: any;
    levColors: {};
    queue: any;
    /**
     * render arguments to console.log
     * @public
     * @param {any[]} args console.log arguments
     * @param {Level} level level of log line (might be used for custom Logger which uses different streams per level)
     * @return {any[]}
     */
    public render(args: any[], level: Level): any[];
    /**
     * send log to server
     * @param {Level|object} level log level
     * @param {string} [fmt] formatter
     * @param {any[]} [args] log arguments
     */
    send(level: Level | object, fmt?: string | undefined, args?: any[] | undefined): void;
    /**
     * format log arguments
     * @protected
     */
    protected _log(level: any, fmt: any, args: any): any[];
    /**
     * format arguments for console.log
     * @private
     * @param {object} param0
     * @return {Array} args for console.log
     */
    private _format;
    /**
     * transfer log to server via zero pixel image request
     * @param {string} str
     * @param {Function} [cb]
     */
    _sendLog(str: string, cb?: Function | undefined): void;
    /**
     * Add colors, style to string
     * @private
     */
    private _color;
}
export namespace Log {
    namespace serializers {
        export { errSerializer as err };
    }
}
export default Log;
export type Level = import("./utils.js").Level;
export type LogBaseOptions = import("./LogBase.js").LogBaseOptions;
export type ExtLogOptionsBrowser = {
    /**
     * url to report errors
     */
    url?: string | undefined;
};
export type LogOptionsBrowser = LogBaseOptions & ExtLogOptionsBrowser;
import { LogBase } from './LogBase.js';
import { errSerializer } from './serializers/err.js';
