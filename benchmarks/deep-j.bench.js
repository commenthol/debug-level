const bench = require('fastbench')

const max = JSON.parse(process.env.MAX || 10000)
const stream = max === 1 ? process.stderr : undefined

const { bunyan, debug, pino, pinoAsync, debugLevel, debugLevelAsync } =
  require('./instances.js')(stream)

const deep = require('../package.json')
deep.deep = Object.assign({}, JSON.parse(JSON.stringify(deep)))
deep.deep.deep = Object.assign({}, JSON.parse(JSON.stringify(deep)))

const run = bench(
  [
    function benchDebug(done) {
      debug('deep %j', deep)
      process.nextTick(done)
    },
    function benchBunyan(done) {
      bunyan.debug('deep %j', deep)
      process.nextTick(done)
    },
    function benchPino(done) {
      pino.debug('deep %j', deep)
      process.nextTick(done)
    },
    function benchDebugLevel(done) {
      debugLevel.debug('deep %j', deep)
      process.nextTick(done)
    },
    function benchPinoAsync(done) {
      pinoAsync.debug('deep %j', deep)
      process.nextTick(done)
    },
    function benchDebugLevelAsync(done) {
      debugLevelAsync.debug('deep %j', deep)
      process.nextTick(done)
    }
  ],
  max
)

const final = () => {
  pinoAsync.flush()
  debugLevelAsync.flush()
}

run(final)
