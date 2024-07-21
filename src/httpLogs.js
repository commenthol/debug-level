import { Log } from './node.js'
import {
  errSerializer,
  reqSerializer,
  resSerializer,
  startTimeKey
} from './serializers/index.js'

const serializers = {
  err: errSerializer,
  req: reqSerializer,
  res: resSerializer
}

/**
 * @typedef {import('node:http').IncomingMessage} IncomingMessage
 * @typedef {import('node:http').ServerResponse} ServerResponse
 * @typedef {import('./node.js').LogOptions} LogOptions
 *//**
 * @typedef {object} ExtIncomingMessageId
 * @property {string} [id] request Id
 *//**
 * @typedef {IncomingMessage & ExtIncomingMessageId} IncomingMessageWithId
 *//**
 * @typedef {object} ExtLogOptionsHttpLog
 * @property {() => string} [customGenerateRequestId]
 *//**
 * @typedef {LogOptions & ExtLogOptionsHttpLog & {Log: typeof Log}} LogOptionsHttpLog
 */

/**
 * @param {string} [namespace='debug-level:http']
 * @param {LogOptionsHttpLog} [opts]
 * @returns {(req: IncomingMessageWithId, res: ServerResponse, next: Function) => void} connect middleware
 */
export function httpLogs (namespace, opts) {
  const options = {
    Log,
    ...opts
  }
  options.serializers = {
    ...serializers,
    ...(options.Log.serializers || {}),
    ...(options.serializers || {})
  }

  const log = new options.Log(namespace || 'debug-level:http', options)
  const generateId = options.customGenerateRequestId || generateRequestId

  return function _httpLogs (req, res, next) {
    if (!req.id) {
      req.id = generateId()
    }
    res[startTimeKey] = res[startTimeKey] || Date.now()

    const handleComplete = (err) => {
      res.removeListener('finish', handleComplete)
      res.removeListener('close', handleComplete)
      res.removeListener('error', handleComplete)

      const statusCode = res.statusCode
      const level =
        statusCode < 400 ? 'info' : statusCode < 500 ? 'warn' : 'error'

      return log[level]({ req, res, err })
    }

    res.on('finish', handleComplete)
    res.on('close', handleComplete)
    res.on('error', handleComplete)

    next()
  }
}

const maxCount = (1 << 30) - 1
let count = 0
const generateRequestId = () => String((count = (count + 1) & maxCount))
