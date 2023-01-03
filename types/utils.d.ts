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
    const TRACE: ("FATAL" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE")[];
    const DEBUG: ("FATAL" | "ERROR" | "WARN" | "INFO" | "DEBUG")[];
    const INFO: ("FATAL" | "ERROR" | "WARN" | "INFO")[];
    const WARN: ("FATAL" | "ERROR" | "WARN")[];
    const ERROR: ("FATAL" | "ERROR")[];
    const FATAL: "FATAL"[];
    const OFF: "OFF"[];
}
export const COLORS: string[];
export namespace LEVEL_COLORS {
    export const LOG: string;
    const TRACE_1: string;
    export { TRACE_1 as TRACE };
    const DEBUG_1: string;
    export { DEBUG_1 as DEBUG };
    const INFO_1: string;
    export { INFO_1 as INFO };
    const WARN_1: string;
    export { WARN_1 as WARN };
    const ERROR_1: string;
    export { ERROR_1 as ERROR };
    const FATAL_1: string;
    export { FATAL_1 as FATAL };
}
export namespace NUM_LEVELS {
    const TRACE_2: number;
    export { TRACE_2 as TRACE };
    const DEBUG_2: number;
    export { DEBUG_2 as DEBUG };
    const INFO_2: number;
    export { INFO_2 as INFO };
    const LOG_1: number;
    export { LOG_1 as LOG };
    const WARN_2: number;
    export { WARN_2 as WARN };
    const ERROR_2: number;
    export { ERROR_2 as ERROR };
    const FATAL_2: number;
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
export type Level = 'LOG' | 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'OFF';
