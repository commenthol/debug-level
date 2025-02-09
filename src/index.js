/** @typedef {import('./utils.js').Level} Level */
/** @typedef {import('./node.js').LogOptions & {Log: typeof Log}} LogOptions */
/** @typedef {import('./node.js').LogOptionWrapConsole} LogOptionWrapConsole */
/** @typedef {import('./node.js').LogOptionHandleExitEvents} LogOptionHandleExitEvents */
/** @typedef {import('./ProcLog.js').ProcLogOptions} ProcLogOptions */
/** @typedef {import('./ecs/LogEcs.js').LogOptionsEcs} LogOptionsEcs */
/** @typedef {import('./browserLogs.js').MwLogOption} MwLogOption */
/** @typedef {import('./httpLogs.js').LogOptionsHttpLog} LogOptionsHttpLog */
/** @typedef {import('./httpLogs.js').IncomingMessageWithId} IncomingMessageWithId */

import { Log } from './node.js'
import { LogEcs } from './ecs/LogEcs.js'
import { logger } from './logger.js'
import { browserLogs } from './browserLogs.js'
import { httpLogs } from './httpLogs.js'
import { ProcLog, initProcLog, EVENT_PROC_LOG } from './ProcLog.js'

export default Log

export {
  Log,
  LogEcs,
  logger,
  ProcLog,
  initProcLog,
  EVENT_PROC_LOG,
  browserLogs,
  httpLogs
}
