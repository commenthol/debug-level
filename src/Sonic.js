const SonicBoom = require('sonic-boom')

const noop = () => {}

class Sonic {
  constructor (stream, opts = {}) {
    const { minLength = 4096, timeout = 1000 } = opts
    this._timer = undefined
    this._timeout = timeout

    const { fd, path } = typeof stream === 'string'
      ? { path: stream }
      : stream

    this.stream = new SonicBoom({ fd, dest: path, minLength, sync: true })
    this.stream.on('error', filterBrokenPipe.bind(null, this.stream))

    process.on('exit', () => {
      this.flush()
    })
  }

  write (data) {
    this.stream.write(data)

    if (!this._timer) {
      this._timer = setTimeout(() => {
        this.flush()
        this._timer = undefined
      }, this._timeout)
    }

    return true
  }

  flush () {
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

module.exports = Sonic
