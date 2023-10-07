/**
 * @param {string} namespace
 * @param {import('./node.js').LogOptions & {Log: Log}} [opts]
 */
export function logger(namespace: string, opts?: (import("./Format.js").FormatOption & import("./LogBase.js").ExtLogBaseOptions & import("./node.js").ExtLogOptions & {
    Log: Log;
}) | undefined): any;
