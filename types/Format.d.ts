/**
 * @typedef {object} FormatOption
 * @property {number} [spaces] number of spaces to use for formatting
 */
export class Format {
    /**
     * @param {FormatOption} [opts]
     */
    constructor(opts?: FormatOption | undefined);
    opts: {
        spaces: number | undefined;
    };
    set spaces(arg: number | undefined);
    get spaces(): number | undefined;
    _formatOpts(): void;
    formatOpts: {
        stringify: (o: any) => string;
        spaces: number | undefined;
    } | undefined;
    stringify(...args: any[]): string;
    /**
     * formats arguments like `util.format`
     * @param {any} fmt may contain "%" formatters
     * @param {any} args arguments list
     * @param {any} obj
     * @return {Array} first is formatted message, other args may follow
     */
    format(fmt: any, args: any, obj: any): any[];
}
export type FormatOption = {
    /**
     * number of spaces to use for formatting
     */
    spaces?: number | undefined;
};
