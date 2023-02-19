export class Sonic {
    constructor(stream: any, opts?: {});
    _timer: any;
    _timeout: any;
    stream: SonicBoom;
    write(data: any): boolean;
    flush(): void;
    destroy(): void;
}
import SonicBoom from "sonic-boom";
