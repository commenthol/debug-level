/**
 * @typedef {(val: any, escFields: object) => void} EcsSerializer
 * @typedef {import('../node.js').LogOptions & {serializers: Record<string, EcsSerializer>}} LogOptions
 */
/**
 * Elastic Common Schema (ECS) compatible logger;
 * See [field reference](https://www.elastic.co/guide/en/ecs/current/ecs-field-reference.html)
 */
export class LogEcs extends Log {
    /**
     * @param {string} name logger namespace
     * @param {LogOptions} opts
     */
    constructor(name: string, opts: LogOptions);
    serializers: any;
    toJson: typeof toJson;
    _applySerializers(obj: any): {
        extra: {};
    };
}
export namespace LogEcs {
    export { ecsSerializers as serializers };
}
export type EcsSerializer = (val: any, escFields: object) => void;
export type LogOptions = import('../node.js').LogOptions & {
    serializers: Record<string, EcsSerializer>;
};
import { Log } from "../node.js";
declare function toJson(obj: any, serializers: any): string;
import { ecsSerializers } from "./serializers.js";
export {};
