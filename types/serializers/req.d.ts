/**
 * request serializer
 *
 * removes cookie values and authorization headers
 * @param {object} [req]
 * @returns {object}
 */
export function reqSerializer(req?: object): object;
/**
 * request serializer
 *
 * masks cookie values and authorization headers
 * @param {object} [req]
 * @returns {object}
 */
export function reqMaskSerializer(req?: object): object;
