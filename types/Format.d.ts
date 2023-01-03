/**
 * @typedef {object} FormatOption
 * @property {number} [spaces] number of spaces to use for formatting
 */
export class Format {
    /**
     * @param {FormatOption} opts
     */
    constructor(opts?: FormatOption);
    opts: {
        opts: FormatOption;
    };
    set spaces(arg: any);
    get spaces(): any;
    _formatOpts(): void;
    formatOpts: {
        stringify: (o: any) => string;
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
