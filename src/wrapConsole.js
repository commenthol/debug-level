const { adjustLevel, LOG, DEBUG, INFO, WARN, ERROR } = require('./utils.js')

const LEVELS = [LOG, DEBUG, INFO, WARN, ERROR]

/**
 * wrap console logging functions like
 * console.log, console.info, console.warn, console.error
 * @return {function} unwrap function
 */
function wrapConsole (log, { level4log = 'LOG' } = {}) {
  const _level4log = adjustLevel(level4log, 'LOG').toLowerCase()

  const render = level => (...args) => {
    log[level](...args)
  }

  const wrapped = {}

  LEVELS.map(l => l.toLowerCase()).forEach(level => {
    wrapped[level] = console[level]
    const renderLevel = level === 'log'
      ? _level4log
      : level
    console[level] = render(renderLevel)
  })

  // unwrap
  return () => LEVELS.forEach(level => {
    console[level] = wrapped[level]
  })
}

module.exports = wrapConsole
