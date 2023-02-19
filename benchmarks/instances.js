process.env.DEBUG = '*'

const fs = require('fs')
const debugF = require('debug')
const bunyanF = require('bunyan')
const pinoF = require('pino')
const { Log: DebugLevel } = require('..')

function setup (stream) {
  if (!stream) {
    stream = fs.createWriteStream('/dev/null')
  }
  const { fd, path } = stream
  const level = 'debug'
  const name = 'name'

  const bunyan = bunyanF.createLogger({
    name,
    streams: [{
      level,
      stream
    }]
  })

  const debug = debugF(name)
  debug.inspectOpts.depth = Infinity
  if (path) {
    debug.log = function (s) { stream.write(s) }
  }

  const pino = pinoF({ name, level }, stream)
  const pinoAsync = pinoF({ name, level }, pinoF.destination({ dest: path, fd, sync: true, minLength: 4096 }))

  DebugLevel.options({ json: true, colors: false, namespaces: '*' })
  const debugLevel = new DebugLevel(name, { level, stream, sonic: false, serverinfo: true, timestamp: 'epoch' })
  const debugLevelAsync = new DebugLevel(name, { level, stream, sonic: true, serverinfo: true, timestamp: 'epoch' })

  return {
    bunyan,
    debug,
    pino,
    pinoAsync,
    debugLevel,
    debugLevelAsync
  }
}

module.exports = setup
