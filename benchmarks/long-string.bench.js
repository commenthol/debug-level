const bench = require('fastbench')

const max = JSON.parse(process.env.MAX || 10000)
const stream = max === 1 ? process.stderr : undefined

const {
  bunyan,
  debug,
  pino,
  pinoAsync,
  debugLevel,
  debugLevelAsync
} = require('./instances.js')(stream)

const a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_*#$%&!"\''
const random = () => a[Math.random() * a.length | 0]
const longStr = new Array(2000).fill('').map(() => random()).join('')

const run = bench([
  function benchDebug (done) {
    debug(longStr)
    process.nextTick(done)
  },
  function benchBunyan (done) {
    bunyan.debug(longStr)
    process.nextTick(done)
  },
  function benchPino (done) {
    pino.debug(longStr)
    process.nextTick(done)
  },
  function benchDebugLevel (done) {
    debugLevel.debug(longStr)
    process.nextTick(done)
  },
  function benchPinoAsync (done) {
    pinoAsync.debug(longStr)
    process.nextTick(done)
  },
  function benchDebugLevelAsync (done) {
    debugLevelAsync.debug(longStr)
    process.nextTick(done)
  }
], max)

const final = () => {
  pinoAsync.flush()
  debugLevelAsync.flush()
}

run((final))
