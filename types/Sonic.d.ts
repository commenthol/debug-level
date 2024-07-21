export class Sonic {
    /**
     * @param {NodeJS.WriteStream} stream
     * @param {SonicOptions} opts
     */
    constructor(stream: NodeJS.WriteStream, opts?: SonicOptions);
    _timer: any;
    _timeout: number;
    /** @type {import('sonic-boom').SonicBoom} */
    stream: import("sonic-boom").SonicBoom;
    /**
     * @param {string} data
     * @returns {boolean}
     */
    write(data: string): boolean;
    flush(): void;
    destroy(): void;
}
/**
 * maintains sonic streams by stream and options
 */
export class SonicStreams extends Map<any, any> {
    /**
     * @param {Record<string,any>} opts
     * @returns {string}
     */
    static hash(opts: Record<string, any>): string;
    constructor();
    constructor(entries?: readonly (readonly [any, any])[] | null | undefined);
    constructor();
    constructor(iterable?: Iterable<readonly [any, any]> | null | undefined);
    /**
     * @param {NodeJS.WriteStream} stream
     * @param {SonicOptions} [opts]
     * @returns {Sonic}
     */
    use(stream: NodeJS.WriteStream, opts?: SonicOptions | undefined): Sonic;
}
export const sonicStreams: SonicStreams;
export type SonicOptions = {
    /**
     * min output buffer length
     */
    minLength?: number | undefined;
    /**
     * flush timeout in ms
     */
    timeout?: number | undefined;
};
