export default Log;
import { Log } from "./node.js";
import { LogEcs } from "./ecs/LogEcs.js";
import { logger } from "./logger.js";
import { browserLogs } from "./browserLogs.js";
import { httpLogs } from "./httpLogs.js";
export { Log, LogEcs, logger, browserLogs, httpLogs };
