export namespace ecsSerializers {
    export { ecsError as err };
    export { ecsReq as req };
    export { ecsRes as res };
}
export type Serializer = import("../serializers/index.js").Serializer;
/**
 * @type {Serializer}
 * @param {object|Error|undefined} err
 * @param {object} ecsObj
 * @returns {object}
 */
declare const ecsError: Serializer;
/**
 * @type {Serializer}
 * @param {object} req Request object
 * @param {object} ecsObj
 */
declare const ecsReq: Serializer;
/**
 * @type {Serializer}
 * @param {object} res Response object
 * @param {object} ecsObj
 */
declare const ecsRes: Serializer;
export {};
