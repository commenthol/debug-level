export default Log;
export type Level = import("./utils.js").Level;
export type LogOptions = import("./node.js").LogOptions & {
    Log: typeof Log;
};
export type LogOptionWrapConsole = import("./node.js").LogOptionWrapConsole;
export type LogOptionHandleExitEvents = import("./node.js").LogOptionHandleExitEvents;
export type LogOptionsEcs = import("./ecs/LogEcs.js").LogOptionsEcs;
export type MwLogOption = import("./browserLogs.js").MwLogOption;
export type LogOptionsHttpLog = import("./httpLogs.js").LogOptionsHttpLog;
export type IncomingMessageWithId = import("./httpLogs.js").IncomingMessageWithId;
import { Log } from './node.js';
import { LogEcs } from './ecs/LogEcs.js';
import { logger } from './logger.js';
import { browserLogs } from './browserLogs.js';
import { httpLogs } from './httpLogs.js';
export { Log, LogEcs, logger, browserLogs, httpLogs };
