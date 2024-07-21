/**
 * @license MIT
 * @copyright debug contributors, <commenthol@gmail.com>
 */
/** @typedef {'LOG'|'FATAL'|'ERROR'|'WARN'|'INFO'|'DEBUG'|'TRACE'|'OFF'} Level */
/** @type {Level} */
export const LOG: Level;
/** @type {Level} */
export const FATAL: Level;
/** @type {Level} */
export const ERROR: Level;
/** @type {Level} */
export const WARN: Level;
/** @type {Level} */
export const INFO: Level;
/** @type {Level} */
export const DEBUG: Level;
/** @type {Level} */
export const TRACE: Level;
/** @type {Level} */
export const OFF: Level;
export namespace LEVELS {
    let TRACE: ("FATAL" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE")[];
    let DEBUG: ("FATAL" | "ERROR" | "WARN" | "INFO" | "DEBUG")[];
    let INFO: ("FATAL" | "ERROR" | "WARN" | "INFO")[];
    let WARN: ("FATAL" | "ERROR" | "WARN")[];
    let ERROR: ("FATAL" | "ERROR")[];
    let FATAL: "FATAL"[];
    let OFF: "OFF"[];
}
export const COLORS: string[];
export namespace LEVEL_COLORS {
    export let LOG: string;
    let TRACE_1: string;
    export { TRACE_1 as TRACE };
    let DEBUG_1: string;
    export { DEBUG_1 as DEBUG };
    let INFO_1: string;
    export { INFO_1 as INFO };
    let WARN_1: string;
    export { WARN_1 as WARN };
    let ERROR_1: string;
    export { ERROR_1 as ERROR };
    let FATAL_1: string;
    export { FATAL_1 as FATAL };
}
export namespace NUM_LEVELS {
    let TRACE_2: number;
    export { TRACE_2 as TRACE };
    let DEBUG_2: number;
    export { DEBUG_2 as DEBUG };
    let INFO_2: number;
    export { INFO_2 as INFO };
    let LOG_1: number;
    export { LOG_1 as LOG };
    let WARN_2: number;
    export { WARN_2 as WARN };
    let ERROR_2: number;
    export { ERROR_2 as ERROR };
    let FATAL_2: number;
    export { FATAL_2 as FATAL };
}
export function adjustLevel(level: any, _default: any): any;
export function toNumLevel(level: Level): number;
export function fromNumLevel(level: number): string;
export function inspectOpts(obj: any): {};
export function saveOpts(obj: any, options: any): void;
export function selectColor(namespace: any, fn: any): any;
export function levelColors(fn: any): {};
export function inspectNamespaces(obj: any): {
    namespaces: any;
} | undefined;
export function random(len: any): string;
export type Level = "LOG" | "FATAL" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE" | "OFF";
