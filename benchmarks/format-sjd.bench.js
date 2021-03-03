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

const run = bench([
  function benchDebug (done) {
    debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })
    process.nextTick(done)
  },
  function benchBunyan (done) {
    bunyan.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })
    process.nextTick(done)
  },
  function benchPino (done) {
    pino.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })
    process.nextTick(done)
  },
  function benchDebugLevel (done) {
    debugLevel.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })
    process.nextTick(done)
  },
  function benchPinoAsync (done) {
    pinoAsync.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })
    process.nextTick(done)
  },
  function benchDebugLevelAsync (done) {
    debugLevelAsync.debug('hello %s %j %d', 'world', { obj: true }, 4, { another: 'obj' })
    process.nextTick(done)
  }
], max)

const final = () => {
  pinoAsync.flush()
  debugLevelAsync.flush()
}

run((final))
