const log = require('..')('test')

log.debug({object: 1})              // logs an object at level DEBUG
log.info('%s world', 'hello')       // logs a formatted string at level INFO
log.warn('huh %o', {ghost: 'rider'})  // logs a formatted object at level WARN
log.error(new Error('boom'))        // logs an Error at level ERROR
