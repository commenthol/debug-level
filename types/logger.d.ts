/**
 * @typedef {import('./index.js').LogOptions} LogOptions
 */
/**
 * @param {string} namespace
 * @param {LogOptions} [opts]
 */
export function logger(namespace: string, opts?: LogOptions): any;
export type LogOptions = import("./index.js").LogOptions;
