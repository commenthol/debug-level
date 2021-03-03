/**
 * @credits quick-format-unescaped
 * @license The MIT License (MIT)
 * @copyright Copyright (c) 2016-2019 David Mark Clements
 */

function tryStringify (o) {
  try { return JSON.stringify(o) } catch (e) { return '"[Circular]"' }
}

module.exports = format

function format (f, args, opts) {
  const ss = (opts && opts.stringify) || tryStringify
  const offset = 1
  if (typeof f === 'object' && f !== null) {
    const len = args.length + offset
    if (len === 1) return f
    const objects = new Array(len)
    objects[0] = ss(f)
    for (let index = 1; index < len; index++) {
      objects[index] = ss(args[index])
    }
    return objects.join(' ')
  }
  if (typeof f !== 'string') {
    return f
  }
  const argLen = args.length
  if (argLen === 0) return f

  let str = ''
  let a = 1 - offset
  let lastPos = -1
  const flen = (f && f.length) || 0
  for (let i = 0; i < flen;) {
    if (f.charCodeAt(i) === 37 && i + 1 < flen) {
      lastPos = lastPos > -1 ? lastPos : 0
      switch (f.charCodeAt(i + 1)) {
        case 100: // 'd'
        case 102: // 'f'
          if (a >= argLen) { break }
          if (lastPos < i) { str += f.slice(lastPos, i) }
          if (args[a] == null) break
          str += Number(args[a])
          lastPos = i = i + 2
          break
        case 105: // 'i'
          if (a >= argLen) { break }
          if (lastPos < i) { str += f.slice(lastPos, i) }
          if (args[a] == null) break
          str += Math.floor(Number(args[a]))
          lastPos = i = i + 2
          break
        case 79: // 'O'
        case 111: // 'o'
        case 106: { // 'j'
          if (a >= argLen) { break }
          if (lastPos < i) { str += f.slice(lastPos, i) }
          if (args[a] === undefined) break
          const type = typeof args[a]
          if (type === 'string') {
            str += '\'' + args[a] + '\''
            lastPos = i + 2
            i++
            break
          }
          if (type === 'function') {
            str += args[a].name || '<anonymous>'
            lastPos = i + 2
            i++
            break
          }
          str += ss(args[a])
          lastPos = i + 2
          i++
          break
        }
        case 115: // 's'
          if (a >= argLen) { break }
          if (lastPos < i) { str += f.slice(lastPos, i) }
          str += String(args[a])
          lastPos = i + 2
          i++
          break
        case 37: // '%'
          if (lastPos < i) { str += f.slice(lastPos, i) }
          str += '%'
          lastPos = i + 2
          i++
          a-- // stay on same argument
          break
      }
      ++a
    }
    ++i
  }
  if (lastPos === -1) { return f } else if (lastPos < flen) {
    str += f.slice(lastPos)
  }

  return str
}
