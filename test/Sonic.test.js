import assert from 'assert'
import fs from 'fs'
import { Log } from '../src/index.js'
import { Sonic } from '../src/Sonic.js'

const defaultOpts = Log.options()

const reset = () => {
  Log.options(defaultOpts)
  Log.reset()
}

describe('Sonic', function () {
  before(reset)
  after(reset)

  it('issue#23 shall reuse same sonic stream', function () {
    for (let i = 0; i < 50; i++) {
      const l = new Log(`log:${i}`, {
        level: 'INFO',
        sonic: true,
        sonicFlushMs: 10
      })
      l.info('hello')
    }
  })

  it('shall throw if no stream is setup', function () {
    assert.throws(() => {
      new Sonic() // eslint-disable-line no-new
    }, /TypeError: Cannot destructure property/)
  })

  it('shall write to stdout', function () {
    const stream = new Sonic(process.stdout)
    stream.write('stdout\n')
    stream.flush()
  })

  it('shall write to filestream', function () {
    const fsStream = fs.createWriteStream('/dev/null')
    const stream = new Sonic(fsStream)
    stream.write('to /dev/null\n')
    stream.flush()
  })

  it('shall write to filestream using path', function () {
    const fsStream = '/dev/null'
    const stream = new Sonic(fsStream)
    stream.write('to /dev/null\n')
    stream.flush()
  })

  it('shall throw if destroyed', function () {
    assert.throws(() => {
      const stream = new Sonic(process.stdout)
      stream.destroy()
      stream.write('stdout\n')
    }, /Error: SonicBoom destroyed/)
  })

  it('broken pipe', async function () {
    const sleep = (ms = 1) => new Promise((resolve) => setTimeout(() => resolve(), ms))

    const fsStream = fs.createWriteStream('/dev/null')
    const stream = new Sonic(fsStream)
    stream.write('to /dev/null\n')
    await sleep()
    const err = new Error('broken')
    err.code = 'EPIPE'
    stream.stream.emit('error', err)
    await sleep()
    stream.write('to /dev/null\n')
    await sleep()
    stream.stream.emit('error', new Error('again'))
  })
})
