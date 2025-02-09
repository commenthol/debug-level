const bench = require('fastbench')

const max = JSON.parse(process.env.MAX || 10000)
const stream = max === 1 ? process.stderr : undefined

const {
  // bunyan,
  // debug,
  pino,
  // pinoAsync,
  debugLevel
  // debugLevelAsync
} = require('./instances.js')(stream)

// const clean = o => JSON.parse(JSON.stringify(o))

// const obj = require('../package.json')
// obj.deep = clean(obj)

const obj = { string: 'lala', foo: 42, is: true }
const f = () => ['hello %j', obj]
// const f = () => ([obj])

const run = bench(
  [
    function benchPino(done) {
      // debugger
      pino.debug(...f())
      process.nextTick(done)
    },
    function benchDebugLevel(done) {
      // debugger
      debugLevel.debug(...f())
      process.nextTick(done)
    }
    // function benchPinoAsync (done) {
    //   pinoAsync.debug(deep)
    //   process.nextTick(done)
    // },
    // function benchDebugLevelAsync (done) {
    //   debugLevelAsync.debug(deep)
    //   process.nextTick(done)
    // }
  ],
  max
)

run(run)
