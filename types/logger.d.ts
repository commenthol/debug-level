/**
 * @typedef {import('./node.js').LogOptions & {Log: typeof Log}} LogOptions
 */
/**
 * @param {string} namespace
 * @param {LogOptions} [opts]
 */
export function logger(namespace: string, opts?: LogOptions | undefined): any;
export type LogOptions = import('./node.js').LogOptions & {
    Log: typeof Log;
};
import { Log } from "./node.js";
