/** @typedef {import('../serializers/index.js').Serializer} Serializer */
/** @typedef {import('../node.js').LogOptions & {serializers: Record<string, Serializer>}} LogOptionsEcs */
/** @typedef {import('../node.js').LogOptionWrapConsole} LogOptionWrapConsole */
/**
 * Elastic Common Schema (ECS) compatible logger;
 * See [field reference](https://www.elastic.co/guide/en/ecs/current/ecs-field-reference.html)
 *
 * Default serializers apply to `err` (error), `req` (request) and `res`
 * (response) keys in objects
 */
export class LogEcs extends Log {
    /**
     * @param {string} [name]
     * @param {LogOptionsEcs & LogOptionWrapConsole} [opts]
     * @returns {() => void} unwrap function
     */
    static wrapConsole(name?: string, opts?: LogOptionsEcs & LogOptionWrapConsole): () => void;
    /**
     * @param {LogOptionsEcs} [opts]
     * @returns {() => void} unwrap function
     */
    static wrapDebug(opts?: LogOptionsEcs): () => void;
    /**
     * @param {string} name logger namespace
     * @param {LogOptionsEcs} [opts]
     */
    constructor(name: string, opts?: LogOptionsEcs);
    serializers: any;
    _extraName: string;
    toJson: (obj: any, serializers: any) => string;
    _applySerializers(obj: any): {
        extra: any;
    };
    _toJson(obj: any, serializers: any): string;
}
export namespace LogEcs {
    export { ecsSerializers as serializers };
}
export type Serializer = import("../serializers/index.js").Serializer;
export type LogOptionsEcs = import("../node.js").LogOptions & {
    serializers: Record<string, Serializer>;
};
export type LogOptionWrapConsole = import("../node.js").LogOptionWrapConsole;
import { Log } from '../node.js';
import { ecsSerializers } from './serializers.js';
