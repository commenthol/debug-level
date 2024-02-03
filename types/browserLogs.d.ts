/**
 * @typedef {{
 *  maxSize?: number
 *  logAll?: boolean
 *  levelNumbers?: boolean
 *  Log?: typeof Log
 * }} MwLogOption
 * - [maxSize=100] max number of different name loggers
 * - [logAll=false] log everything even strings
 * - [levelNumbers=false] log levels as numbers
 * - [Log=Log] allows overwrite of Log class
 */
/**
 * connect middleware which logs browser based logs on server side;
 * sends a transparent gif as response
 * @param {MwLogOption} [options]
 * @return {function} connect middleware
 */
export function browserLogs(options?: MwLogOption | undefined): Function;
/**
 * - [maxSize=100] max number of different name loggers
 * - [logAll=false] log everything even strings
 * - [levelNumbers=false] log levels as numbers
 * - [Log=Log] allows overwrite of Log class
 */
export type MwLogOption = {
    maxSize?: number;
    logAll?: boolean;
    levelNumbers?: boolean;
    Log?: typeof Log;
};
import { Log } from './node.js';
