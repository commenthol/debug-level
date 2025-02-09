import assert from 'node:assert'
import { LogEcs } from '../src/index.js'
import { ProcLog, initProcLog, EVENT_PROC_LOG } from '../src/ProcLog.js'

describe('ProcLog', function () {
  beforeEach(function () {
    initProcLog()
  })

  it('should log via process.emit', function () {
    const { lines } = myInitProcLog()
    const log = new ProcLog('test:1')
    log.log('a log line')
    assert.deepEqual(lines, ['LOG', 'test:1', 'a log line', []])
  })

  it('should log deep object', function () {
    const { lines } = myInitProcLog()
    const log = new ProcLog('test:2')
    log.log({ a: { nested: 'object' } })
    assert.deepEqual(lines, [
      'LOG',
      'test:2',
      {
        a: {
          nested: 'object'
        }
      },
      []
    ])
  })

  it('should log deep object with format', function () {
    const { lines } = myInitProcLog()
    const log = new ProcLog('test:2')
    log.info('%j', { a: { nested: 'object' } })
    assert.deepEqual(lines, [
      'INFO',
      'test:2',
      '%j',
      [
        {
          a: {
            nested: 'object'
          }
        }
      ]
    ])
  })

  it('should use the Ecs logger', function () {
    initProcLog({ Log: LogEcs, json: true, colors: false })
    const { lines } = myInitProcLog()
    const log = new ProcLog('test:3')
    log.warn('%j', { a: { nested: 'object' } })
    assert.deepEqual(lines, [
      'WARN',
      'test:3',
      '%j',
      [
        {
          a: {
            nested: 'object'
          }
        }
      ]
    ])
  })

  it('should not use number level or serializers', function () {
    initProcLog({
      levelNumbers: true,
      serializers: {
        err: (err) => {
          return err?.message
        }
      }
    })
    const { lines } = myInitProcLog()
    const log = new ProcLog('test:4')
    log.error({ err: { name: 'Error', message: 'error' } })
    assert.deepEqual(lines, [
      'ERROR',
      'test:4',
      {
        err: {
          message: 'error',
          name: 'Error'
        }
      },
      []
    ])
  })
})

const myInitProcLog = () => {
  let lines = []
  const reset = () => {
    lines = []
  }
  process.on(EVENT_PROC_LOG, (...args) => {
    lines.push(...args)
  })
  return { lines, reset }
}
