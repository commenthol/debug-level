import { logger } from '../src/index.js'

describe('#Log.log', function () {
  it('should use global Log instance', function () {
    logger('test').debug('hi world')
    logger('test').debug('hi world again')
  })
})
