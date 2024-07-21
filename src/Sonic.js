import SonicBoom from 'sonic-boom'

/**
 * @typedef {object} SonicOptions
 * @property {number} [minLength=4096] min output buffer length
 * @property {number} [timeout=1000] flush timeout in ms
 */

const noop = () => {}

/**
 * @param {NodeJS.WriteStream} stream
 * @returns {{fd: number, path: string }}
 */
const streamDescriptor = (stream) => {
  // @ts-expect-error
  const { fd, path } = typeof stream === 'string' ? { path: stream } : stream
  return { fd, path }
}

export class Sonic {
  /**
   * @param {NodeJS.WriteStream} stream
   * @param {SonicOptions} opts
   */
  constructor (stream, opts = {}) {
    const { minLength = 4096, timeout = 1000 } = opts
    this._timer = undefined
    this._timeout = timeout

    const { fd, path } = streamDescriptor(stream)

    /** @type {import('sonic-boom').SonicBoom} */
    // @ts-expect-error
    this.stream = new SonicBoom({ fd, dest: path, minLength, sync: true })
    this.stream.on('error', filterBrokenPipe.bind(null, this.stream))

    process.on('exit', () => {
      this.flush()
    })
  }

  /**
   * @param {string} data
   * @returns {boolean}
   */
  write (data) {
    const isWritten = this.stream.write(data)

    if (!this._timer) {
      this._timer = setTimeout(() => {
        this.flush()
        this._timer = undefined
      }, this._timeout)
    }

    return isWritten
  }

  flush () {
    // @ts-expect-error
    if (!this.stream.destroyed) {
      this.stream.flushSync()
    }
  }

  destroy () {
    this.stream.destroy()
  }
}

function filterBrokenPipe (stream, err) {
  if (err.code === 'EPIPE') {
    // If we get EPIPE, we should stop logging here
    // however we have no control to the consumer of
    // SonicBoom, so we just overwrite the write method
    stream.write = noop
    stream.end = noop
    stream.flushSync = noop
    stream.destroy = noop
    return
  }
  stream.removeListener('error', filterBrokenPipe)
}

/**
 * maintains sonic streams by stream and options
 */
export class SonicStreams extends Map {
  /**
   * @param {Record<string,any>} opts
   * @returns {string}
   */
  static hash (opts) {
    return (
      'sonic!' +
      Object.keys(opts || {})
        .sort()
        .map((key) => `${key}:${opts[key]}`)
        .join('!')
    )
  }

  /**
   * @param {NodeJS.WriteStream} stream
   * @param {SonicOptions} [opts]
   * @returns {Sonic}
   */
  use (stream, opts = {}) {
    const streamHash = SonicStreams.hash(streamDescriptor(stream))
    const optsHash = SonicStreams.hash(opts)
    let streamRecord = this.get(streamHash)
    if (streamRecord) {
      const sonic = streamRecord.get(optsHash)
      if (sonic) {
        return sonic
      }
    }
    streamRecord =
      streamRecord ||
      (() => {
        const map = new Map()
        this.set(streamHash, map)
        return map
      })()
    const newSonic = new Sonic(stream, opts)
    streamRecord.set(optsHash, newSonic)
    return newSonic
  }
}

export const sonicStreams = new SonicStreams()
