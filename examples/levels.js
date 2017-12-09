const debugF = require('debug')
const Log = require('..')
const log = new Log('test')

log.debug({object: 1}) // logs an object at level DEBUG
log.info('%s world', 'hello') // logs a formatted string at level INFO
log.warn('huh %o', {ghost: 'rider'}) // logs a formatted object at level WARN
log.error(new Error('boom')) // logs an Error at level ERROR
log.fatal('fatal test') // logs an Error at level FATAL
log.log('always logs') // always logs regardless of set level

const logA = new Log('log:A')

logA.debug({object: 1})
logA.info('%s world', 'hello')
logA.warn('huh %o', {ghost: 'rider'})
logA.error(new Error('baam'))
logA.fatal('fatal A')

const logB = new Log('log:B')

logB.debug({object: 1})
logB.info('%s world', 'hello')
logB.warn('huh %o', {ghost: 'rider'})
logB.error(new Error('bbbm'))
logB.fatal('fatal B')

const debug = debugF('using-debug')

debug('using %s', 'debug')

const debugA = debugF('using-debug:A')

debugA('using %s', 'debug - feature A')
