import { adjustLevel, LOG, TRACE, DEBUG, INFO, WARN, ERROR } from './utils.js'

const LEVELS = [LOG, TRACE, DEBUG, INFO, WARN, ERROR]

let wrapped = null

const unwrap = () => {
  if (wrapped) {
    LEVELS.forEach(level => {
      console[level] = wrapped[level]
    })
    wrapped = null
  }
}

/**
 * wrap console logging functions like
 * console.log, console.info, console.warn, console.error
 * @return unwrap function
 */
export function wrapConsole (log, { level4log = 'LOG' } = {}) {
  if (wrapped) return unwrap
  wrapped = {}

  const _level4log = adjustLevel(level4log, 'LOG').toLowerCase()

  const render = level => (...args) => {
    log[level](...args)
  }

  LEVELS.map(l => l.toLowerCase()).forEach(level => {
    wrapped[level] = console[level]
    const renderLevel = level === 'log'
      ? _level4log
      : level
    console[level] = render(renderLevel)
  })

  return unwrap
}
