/**
 * @typedef {(val: any, escFields: object) => void} EcsSerializer
 * @typedef {import('../node.js').LogOptions & {serializers: Record<string, EcsSerializer>}} LogOptionsEcs
 */
/**
 * Elastic Common Schema (ECS) compatible logger;
 * See [field reference](https://www.elastic.co/guide/en/ecs/current/ecs-field-reference.html)
 */
export class LogEcs extends Log {
    /**
     * @param {string} name logger namespace
     * @param {LogOptionsEcs} opts
     */
    constructor(name: string, opts: LogOptionsEcs);
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
export type EcsSerializer = (val: any, escFields: object) => void;
export type LogOptionsEcs = import("../node.js").LogOptions & {
    serializers: Record<string, EcsSerializer>;
};
import { Log } from '../node.js';
import { ecsSerializers } from './serializers.js';
