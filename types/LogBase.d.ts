/**
 * @typedef {import('./utils.js').Level} Level
 */
/**
 * @typedef {object} ExtLogBaseOptions
 * @property {Level} [level] log level
 * @property {string} [namespaces] namespaces for logging
 * @property {boolean} [levelNumbers] use number instead of log level name
 * @property {boolean} [json] log as nd-json
 * @property {boolean} [colors] log with colors
 * @property {Timestamp} [timestamp] log with timestamp; if undefined then no timestamp is logged
 * @property {number} [spaces] number of spaces for pretty print JSON
 * @property {boolean} [splitLine] split lines for pretty "debug" like output (not recommended for prod use)
 * @property {object} [serializers] serializers to be applied on object properties
 */
/**
 * @typedef {import('./Format.js').FormatOption} FormatOption
 * @typedef {FormatOption & ExtLogBaseOptions} LogBaseOptions
 */
export class LogBase {
    /**
     * @param {string} name
     * @param {LogBaseOptions} opts
     */
    constructor(name: string, opts?: LogBaseOptions);
    name: string;
    opts: LogBaseOptions;
    _enabled: {};
    formatter: Format;
    /** @type {{ [x: string]: (arg0: any) => any; } | null} */
    serializers: {
        [x: string]: (arg0: any) => any;
    } | null;
    _timeF: any;
    _time: any;
    /** always logs */
    log: (..._args: any[]) => void;
    /** log with level FATAL */
    fatal: (..._args: any[]) => void;
    /** log with level ERROR */
    error: (..._args: any[]) => void;
    /** log with level WARN */
    warn: (..._args: any[]) => void;
    /** log with level INFO */
    info: (..._args: any[]) => void;
    /** log with level DEBUG */
    debug: (..._args: any[]) => void;
    /** log with level TRACE */
    trace: (..._args: any[]) => void;
    /** @type {number|undefined} */
    pid: number | undefined;
    /** @type {string|undefined} */
    hostname: string | undefined;
    /**
     * @param {string} [namespaces]
     */
    enable(namespaces?: string): void;
    get enabled(): any;
    diff(): number;
    _prev: number | undefined;
    /**
     * @return {object} json object
     */
    _formatJson(level: any, fmt: any, args?: any[]): object;
    _applySerializers(obj: any): {};
    _serverinfo(): void;
    /**
     * @protected
     */
    protected _log(_nlevel: any, _fmt: any, _args: any): void;
}
export type Timestamp = "epoch" | "unix" | "iso";
export type Level = import("./utils.js").Level;
export type ExtLogBaseOptions = {
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
    timestamp?: Timestamp | undefined;
    /**
     * number of spaces for pretty print JSON
     */
    spaces?: number | undefined;
    /**
     * split lines for pretty "debug" like output (not recommended for prod use)
     */
    splitLine?: boolean | undefined;
    /**
     * serializers to be applied on object properties
     */
    serializers?: object;
};
export type FormatOption = import("./Format.js").FormatOption;
export type LogBaseOptions = FormatOption & ExtLogBaseOptions;
import { Format } from './Format.js';
