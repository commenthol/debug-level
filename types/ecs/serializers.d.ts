export namespace ecsSerializers {
    export { ecsError as err };
    export { ecsReq as req };
    export { ecsRes as res };
}
declare function ecsError(err: any, ecsObj: any): void;
declare function ecsReq(req: any, ecsObj: any): void;
declare function ecsRes(res: any, ecsObj: any): void;
export {};
