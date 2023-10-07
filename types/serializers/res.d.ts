/**
 * response serializer
 *
 * removes set-cookie and proxy-authenticate headers
 * @param {object} [res]
 * @returns {object}
 */
export function resSerializer(res?: object): object;
/**
 * response serializer
 *
 * masks set-cookie and proxy-authenticate response headers
 * @param {object} [res]
 * @returns {object}
 */
export function resMaskSerializer(res?: object): object;
export const startTimeKey: unique symbol;
