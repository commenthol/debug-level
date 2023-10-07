import { Log, stringify } from '../node.js'
import { ecsSerializers } from './serializers.js'

/**
 * @typedef {(val: any, escFields: object) => void} EcsSerializer
 * @typedef {import('../node.js').LogOptions & {serializers: Record<string, EcsSerializer>}} LogOptions
 */

/**
 * Elastic Common Schema (ECS) compatible logger;
 * See [field reference](https://www.elastic.co/guide/en/ecs/current/ecs-field-reference.html)
 */
export class LogEcs extends Log {
  /**
   * @param {string} name logger namespace
   * @param {LogOptions} opts
   */
  constructor (name, opts) {
    const { serializers, ..._opts } = opts || {}
    super(name, {
      ..._opts,
      timestamp: 'iso'
    })
    this.serializers = { ...ecsSerializers, ...serializers }
    this.toJson = toJson
  }

  /* c8 ignore next 18 */
  _applySerializers (obj) {
    const ecsObj = {}
    for (const key in obj) {
      const value = obj[key]
      if (
        Object.prototype.hasOwnProperty.call(obj, key) &&
        value !== undefined
      ) {
        if (this.serializers && this.serializers[key]) {
          this.serializers[key](value, ecsObj)
        } else {
          ecsObj.extra = ecsObj.extra || {}
          ecsObj.extra[key] = value
        }
      }
    }
    return ecsObj
  }
}

LogEcs.serializers = ecsSerializers

function toJson (obj, serializers) {
  const { level, time, name, msg, pid, hostname, diff, ...other } = obj

  const ecsObj = {
    log: {
      level,
      logger: name,
      diff_ms: diff
    },
    message: msg,
    '@timestamp': time,
    process: pid ? { pid } : undefined,
    host: hostname ? { hostname } : undefined
  }

  for (const key in other) {
    const value = other[key]
    if (
      value === undefined ||
      !Object.prototype.hasOwnProperty.call(other, key)
    ) {
      continue
    }
    if (serializers[key]) {
      serializers[key](value, ecsObj)
    } else {
      // add all other unknown fields to extra
      ecsObj.extra = ecsObj.extra || {}
      ecsObj.extra[key] = normToString(value)
    }
  }

  return stringify(ecsObj)
}

/**
 * elastic is picky on indexing types; for this all entries in e.g. extra are
 * set to string to avoid any type collisions
 * @param {any} val
 * @returns {string}
 */
const normToString = (val) => {
  switch (typeof val) {
    case 'string':
      return val
    case 'number':
      return String(val)
    default:
      return stringify(val)
  }
}
