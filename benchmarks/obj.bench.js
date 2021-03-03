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

const obj = { msg: 'the message', string: 'string', number: 42, bool: true }

const run = bench([
  function benchDebug (done) {
    debug(obj)
    process.nextTick(done)
  },
  function benchBunyan (done) {
    bunyan.debug(obj)
    process.nextTick(done)
  },
  function benchPino (done) {
    pino.debug(obj)
    process.nextTick(done)
  },
  function benchDebugLevel (done) {
    debugLevel.debug(obj)
    process.nextTick(done)
  },
  function benchPinoAsync (done) {
    pinoAsync.debug(obj)
    process.nextTick(done)
  },
  function benchDebugLevelAsync (done) {
    debugLevelAsync.debug(obj)
    process.nextTick(done)
  }
], max)

const final = () => {
  pinoAsync.flush()
  debugLevelAsync.flush()
}

run((final))
