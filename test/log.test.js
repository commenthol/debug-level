const {log} = require('../src')

describe('#Log.log', function () {
  it('should use global Log instance', function () {
    log('test').debug('hi world')
    log('test').debug('hi world again')
  })
})
