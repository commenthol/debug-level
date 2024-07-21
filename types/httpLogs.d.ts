/**
 * @typedef {import('node:http').IncomingMessage} IncomingMessage
 * @typedef {import('node:http').ServerResponse} ServerResponse
 * @typedef {import('./node.js').LogOptions} LogOptions
 */ /**
* @typedef {object} ExtIncomingMessageId
* @property {string} [id] request Id
*/ /**
* @typedef {IncomingMessage & ExtIncomingMessageId} IncomingMessageWithId
*/ /**
* @typedef {object} ExtLogOptionsHttpLog
* @property {() => string} [customGenerateRequestId]
*/ /**
* @typedef {LogOptions & ExtLogOptionsHttpLog & {Log: typeof Log}} LogOptionsHttpLog
*/
/**
 * @param {string} [namespace='debug-level:http']
 * @param {LogOptionsHttpLog} [opts]
 * @returns {(req: IncomingMessageWithId, res: ServerResponse, next: Function) => void} connect middleware
 */
export function httpLogs(namespace?: string | undefined, opts?: LogOptionsHttpLog | undefined): (req: IncomingMessageWithId, res: ServerResponse, next: Function) => void;
export type IncomingMessage = import("node:http").IncomingMessage;
export type ServerResponse = import("node:http").ServerResponse;
export type LogOptions = import("./node.js").LogOptions;
export type ExtIncomingMessageId = {
    /**
     * request Id
     */
    id?: string | undefined;
};
export type IncomingMessageWithId = IncomingMessage & ExtIncomingMessageId;
export type ExtLogOptionsHttpLog = {
    customGenerateRequestId?: (() => string) | undefined;
};
export type LogOptionsHttpLog = LogOptions & ExtLogOptionsHttpLog & {
    Log: typeof Log;
};
import { Log } from './node.js';
