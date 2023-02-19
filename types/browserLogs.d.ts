/**
 * @typedef {object} MwLogOption
 * @property {number} [maxSize=100] max number of different name loggers
 * @property {boolean} [logAll=false] log everything even strings
 * @property {boolean} [levelNumbers] log levels as numbers
 */
/**
 * connect middleware which logs browser based logs on server side;
 * sends a transparent gif as response
 * @param {MwLogOption} [opts]
 * @return {function} connect middleware
 */
export function browserLogs(opts?: MwLogOption | undefined): Function;
export type MwLogOption = {
    /**
     * max number of different name loggers
     */
    maxSize?: number | undefined;
    /**
     * log everything even strings
     */
    logAll?: boolean | undefined;
    /**
     * log levels as numbers
     */
    levelNumbers?: boolean | undefined;
};
