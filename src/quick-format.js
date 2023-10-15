/**
 * @credits quick-format-unescaped
 * @license The MIT License (MIT)
 * @copyright Copyright (c) 2016-2019 David Mark Clements
 */

function tryStringify (value, replacer, spaces) {
  try { return JSON.stringify(value, replacer, spaces) } catch (e) { return '"[Circular]"' }
}

export function format (f, args, opts, obj = {}) {
  const stringify = opts?.stringify || tryStringify
  const spaces = opts?.spaces
  const argLen = args.length
  let a = 0
  let str = ''
  const type = typeof f

  const procObj = (val) => {
    if (Array.isArray(val)) {
      Object.assign(obj, { arr: val })
    } else if (val instanceof Error) {
    // } else if (val.stack && val.message && val.name) {
      if (!str) str = val.message
      Object.assign(obj, { err: val })
    } else {
      const { name, level, ...other } = val
      Object.assign(obj, other)
    }
  }

  if (type === 'function') {
    str = toFunctionSting(f.name)
  } else if (type === 'object' && f !== null) {
    str = f.msg || ''
    procObj(f)
  } else if (type !== 'string') {
    str = String(f)
  } else if (type === 'string') {
    if (argLen === 0) return f

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
              str += toFunctionSting(args[a].name)
              lastPos = i + 2
              i++
              break
            }
            str += stringify(args[a], null, spaces)
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

    if (lastPos === -1) {
      str = f
    } else if (lastPos < flen) {
      str += f.slice(lastPos)
    }
  }

  for (a; a < argLen; a++) {
    const val = args[a]
    const type = typeof val
    if (type === 'function') {
      str += ' ' + toFunctionSting(val.name)
    } else if (type === 'object' && val !== null) {
      procObj(val)
    } else {
      str += ' ' + String(val)
    }
  }

  return str
}

const toFunctionSting = (name) => (name || '<anonymous>') + '()'
