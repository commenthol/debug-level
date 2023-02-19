export class Namespaces {
    constructor(namespaces: any);
    skips: any[];
    names: any[];
    /**
     * @param {string} namespaces
     */
    enable(namespaces: string): void;
    disable(): void;
    /**
     * @param {string} name
     */
    isEnabled(name: string, level: any): any;
    /**
     * @param {string} _namespace
     * @private
     */
    private _namespaceNLevel;
}
