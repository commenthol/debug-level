const Log = require('../src')

const fakeRes = () => ({
  write: () => {},
  setHeader: () => {},
  end: () => {}
})

describe('#middleware', function () {
  let mw
  const opts = Object.assign({}, Log.options())
  before(() => {
    Log.options({level: 'DEBUG'})
    mw = Log.logger({maxSize: 3, logAll: false})
  })
  after(() => {
    Log.options(opts)
  })

  it('should pass empty req', function () {
    const url = '/'
    mw({url}, fakeRes())
  })

  it('should not log query without param "log"', function () {
    const url = '/?test=1'
    mw({url}, fakeRes())
  })

  it('should not log without field "name"', function () {
    const url = '/?log=' + escape('{"test": 1}')
    mw({url}, fakeRes())
  })

  it('should not log with malformed name', function () {
    const url = '/?log=' + encodeURI('{"name":"##"}')
    mw({url}, fakeRes())
  })

  it('should not log with malformed json', function () {
    const url = '/?log={name:bad}'
    mw({url}, fakeRes())
  })

  it('should log with field "name"', function () {
    const url = '/?log=' + escape('{"name":"##"}')
    mw({url}, fakeRes())
  })

  it('should log with field "name" at level "ERROR"', function () {
    const url = '/?log=' + escape('{"name":"##","level":"ERROR"}')
    mw({url}, fakeRes())
  })

  it('should log with field "name" and "ip"', function () {
    const url = '/?log=' + escape('{"name":"##"}')
    const ip = '10.10.10.10'
    mw({url, ip}, fakeRes())
  })

  it('should log with parsed query', function () {
    const url = '/?log=' + escape('{"name":"##"}')
    const ip = '10.10.10.10'
    const query = {log: {name: '##'}}
    mw({url, ip, query}, fakeRes())
  })

  it('should log all', function () {
    const mw = Log.logger({maxSize: 3, logAll: true})
    const url = '/?log={name:bad}'
    mw({url}, fakeRes())
  })

  // need to be at very last
  it('should not log at level ERROR', function () {
    Log.options({level: 'ERROR'})
    const url = '/?log=' + escape('{"name":"test"}')
    mw({url}, fakeRes())
  })
})
