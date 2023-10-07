const { Log } = require('../lib/node.cjs')

describe('commonjs', function () {
  it('shall log', function () {
    const log = new Log('test')
    log.error('log with cjs')
  })
})
