import { Log } from '../../src/browser.js'

window.localStorage.setItem('DEBUG_URL', '/debug-level')
window.localStorage.setItem('DEBUG', '*')
window.localStorage.setItem('DEBUG_LEVEL', 'TRACE')

const log = new Log('myApp')

const ORD = ['th', 'st', 'nd', 'rd']
const ordinals = (num) =>
  num + (num > 10 && num < 14 ? 'th' : ORD[num % 10] || ORD[0])
const LEVEL = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
const levels = () => LEVEL[(Math.random() * LEVEL.length) | 0]
let count = 1

setInterval(() => {
  const level = levels().toLowerCase()
  log[level]('my %s logline at %s', ordinals(count++), new Date().toString())
}, 500)
